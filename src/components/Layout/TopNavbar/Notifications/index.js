"use client";

import { Dropdown, Spinner } from "react-bootstrap";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from 'date-fns';

// Icon mapping for notification types
const getNotificationIcon = (type) => {
  switch (type) {
    case 'sick_note':
      return { icon: 'medical_services', color: 'text-warning' };
    case 'employee':
      return { icon: 'person', color: 'text-info' };
    case 'company':
      return { icon: 'business', color: 'text-primary' };
    case 'approval':
      return { icon: 'check_circle', color: 'text-success' };
    case 'rejection':
      return { icon: 'cancel', color: 'text-danger' };
    default:
      return { icon: 'notifications', color: 'text-secondary' };
  }
};

// Format time ago
const formatTimeAgo = (dateString) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'recently';
  }
};

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications();

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

  const handleClearAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await clearAll();
  };

  const handleMarkAllRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await markAllAsRead();
  };

  return (
    <>
      <Dropdown className="dropdown notifications noti">
        <Dropdown.Toggle
          variant="secondary"
          id="dropdown-notifications"
          className="border-0 p-0 position-relative badge"
        >
          <i className="material-symbols-outlined">notifications</i>
          {unreadCount > 0 && (
            <span
              className="position-absolute translate-middle badge rounded-pill bg-danger"
              style={{
                top: '5px',
                right: '-5px',
                fontSize: '10px',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-lg p-0 border-0 p-0 dropdown-menu-end">
          <div className="d-flex justify-content-between align-items-center title">
            <span className="fw-semibold fs-15 text-secondary">
              Notifications{" "}
              <span className="fw-normal text-body fs-14">
                ({unreadCount > 0 ? unreadCount : notifications.length})
              </span>
            </span>
            <div className="d-flex gap-2">
              {unreadCount > 0 && (
                <button
                  className="p-0 m-0 bg-transparent border-0 fs-14 text-primary"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                >
                  Mark Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="p-0 m-0 bg-transparent border-0 fs-14 text-danger"
                  onClick={handleClearAll}
                  title="Clear all notifications"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="max-h-217 scrollbar">
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" variant="primary" />
                <p className="mb-0 mt-2 fs-14 text-secondary">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4">
                <i className="material-symbols-outlined text-secondary" style={{ fontSize: '48px' }}>
                  notifications_off
                </i>
                <p className="mb-0 mt-2 fs-14 text-secondary">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => {
                const { icon, color } = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`notification-menu ${!notification.is_read ? 'unseen' : ''}`}
                  >
                    <a
                      href={notification.link || '/notifications'}
                      className="dropdown-item"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className={`material-symbols-outlined ${color}`}>
                            {icon}
                          </i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <p className="mb-0" style={{
                            fontWeight: notification.is_read ? 'normal' : '600',
                            fontSize: '13px'
                          }}>
                            {notification.title}
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                            {notification.message.length > 60
                              ? notification.message.substring(0, 60) + '...'
                              : notification.message}
                          </p>
                          <span className="fs-13 text-muted">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        {!notification.is_read && (
                          <div className="flex-shrink-0 ms-2">
                            <span
                              className="bg-primary rounded-circle d-inline-block"
                              style={{ width: '8px', height: '8px' }}
                            ></span>
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                );
              })
            )}
          </div>

          <a
            href="/notifications"
            className="dropdown-item text-center text-primary d-block view-all fw-medium rounded-bottom-3"
          >
            <span>See All Notifications</span>
          </a>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Notifications;
