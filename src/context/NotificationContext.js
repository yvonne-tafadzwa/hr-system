"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user, companyId, isSuperAdmin } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch notifications from database
    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        try {
            let query = supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            // Filter based on user role
            if (isSuperAdmin) {
                // Super admin sees all notifications or system-wide ones
                query = query.or(`user_id.eq.${user.id},user_id.is.null`);
            } else if (companyId) {
                // Company admin sees company notifications
                query = query.or(`user_id.eq.${user.id},company_id.eq.${companyId}`);
            } else {
                // Regular user sees only their notifications
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching notifications:', error);
                setNotifications([]);
            } else {
                setNotifications(data || []);
                setUnreadCount((data || []).filter(n => !n.is_read).length);
            }
        } catch (err) {
            console.error('Error in fetchNotifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user, companyId, isSuperAdmin]);

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (!error) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        if (!user) return;

        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);

            if (unreadIds.length === 0) return;

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .in('id', unreadIds);

            if (!error) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    // Clear all notifications
    const clearAll = async () => {
        if (!user) return;

        try {
            let query = supabase.from('notifications').delete();

            if (isSuperAdmin) {
                query = query.or(`user_id.eq.${user.id},user_id.is.null`);
            } else if (companyId) {
                query = query.or(`user_id.eq.${user.id},company_id.eq.${companyId}`);
            } else {
                query = query.eq('user_id', user.id);
            }

            const { error } = await query;

            if (!error) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    // Add a new notification locally (for real-time updates)
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.is_read) {
            setUnreadCount(prev => prev + 1);
        }
    };

    // Set up real-time subscription
    useEffect(() => {
        if (!user) return;

        // Initial fetch
        fetchNotifications();

        // Set up real-time subscription
        const channel = supabase
            .channel('notifications-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    console.log('New notification received:', payload);
                    const newNotification = payload.new;

                    // Check if this notification is for the current user
                    const isForUser =
                        newNotification.user_id === user.id ||
                        newNotification.user_id === null ||
                        (companyId && newNotification.company_id === companyId);

                    if (isForUser) {
                        addNotification(newNotification);

                        // Optional: Show browser notification
                        if (Notification.permission === 'granted') {
                            new Notification(newNotification.title, {
                                body: newNotification.message,
                                icon: '/favicon.ico'
                            });
                        }
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    const updatedNotification = payload.new;
                    setNotifications(prev =>
                        prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
                    );
                    // Recalculate unread count
                    setNotifications(prev => {
                        setUnreadCount(prev.filter(n => !n.is_read).length);
                        return prev;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    const deletedId = payload.old.id;
                    setNotifications(prev => prev.filter(n => n.id !== deletedId));
                }
            )
            .subscribe();

        // Request browser notification permission
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, companyId, isSuperAdmin]);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
