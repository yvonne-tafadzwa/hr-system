"use client";

import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const RecentActivities = () => {
  const { isSuperAdmin, companyId } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setIsLoading(true);

        // Build query based on user role
        let query = supabase
          .from('sick_notes')
          .select(`
            id,
            status,
            created_at,
            company_id,
            employees(
              employee_id,
              user_profiles(first_name, last_name, avatar_url)
            )
          `)
          .order('created_at', { ascending: false })
          .limit(4);

        // Filter by company_id if not super admin
        if (!isSuperAdmin && companyId) {
          query = query.eq('company_id', companyId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching recent activities:', error);
          setActivities([]);
          return;
        }

        if (data) {
          // Transform data into activities
          const transformedActivities = data.map((note) => {
            const employee = note.employees;
            const profile = Array.isArray(employee?.user_profiles) 
              ? employee.user_profiles[0] 
              : employee?.user_profiles;
            
            const employeeName = profile 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || employee?.employee_id
              : employee?.employee_id || 'Unknown';

            const activityType = note.status === 'approved' 
              ? 'approved' 
              : note.status === 'rejected' 
              ? 'rejected' 
              : 'submitted';

            return {
              id: note.id,
              employeeName,
              employeeId: employee?.employee_id || 'Unknown',
              activityType,
              status: note.status || 'pending',
              createdAt: note.created_at,
              avatar: profile?.avatar_url
            };
          });

          setActivities(transformedActivities);
        }

        // Set up real-time subscription
        const subscription = supabase
          .channel('recent-activities-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              let refreshQuery = supabase
                .from('sick_notes')
                .select(`
                  id,
                  status,
                  created_at,
                  company_id,
                  employees(
                    employee_id,
                    user_profiles(first_name, last_name, avatar_url)
                  )
                `)
                .order('created_at', { ascending: false })
                .limit(4);

              // Filter by company_id if not super admin
              if (!isSuperAdmin && companyId) {
                refreshQuery = refreshQuery.eq('company_id', companyId);
              }

              const { data: updatedData } = await refreshQuery;

              if (updatedData) {
                const transformedActivities = updatedData.map((note) => {
                  const employee = note.employees;
                  const profile = Array.isArray(employee?.user_profiles) 
                    ? employee.user_profiles[0] 
                    : employee?.user_profiles;
                  
                  const employeeName = profile 
                    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || employee?.employee_id
                    : employee?.employee_id || 'Unknown';

                  const activityType = note.status === 'approved' 
                    ? 'approved' 
                    : note.status === 'rejected' 
                    ? 'rejected' 
                    : 'submitted';

                  return {
                    id: note.id,
                    employeeName,
                    employeeId: employee?.employee_id || 'Unknown',
                    activityType,
                    status: note.status || 'pending',
                    createdAt: note.created_at,
                    avatar: profile?.avatar_url
                  };
                });

                setActivities(transformedActivities);
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching recent activities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivities();
  }, [isSuperAdmin, companyId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getActivityText = (activityType, employeeId) => {
    switch (activityType) {
      case 'approved':
        return `${employeeId} - Sick note approved`;
      case 'rejected':
        return `${employeeId} - Sick note rejected`;
      default:
        return `${employeeId} - Sick note submitted`;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success bg-opacity-10 text-success';
      case 'rejected':
        return 'bg-danger bg-opacity-10 text-danger';
      case 'pending':
      default:
        return 'bg-warning bg-opacity-10 text-warning';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'UN';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0" style={{ fontSize: '14px' }}>Recent Activities</h3>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <span className="text-muted">Loading...</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-5">
              <span className="text-muted">No activities found</span>
            </div>
          ) : (
            <div className="table-responsive" style={{ overflowX: 'hidden' }}>
              <Table className="align-middle mb-0" style={{ fontSize: '11px', backgroundColor: '#ffffff' }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ fontSize: '11px', padding: '10px 8px' }}>Activity</th>
                    <th scope="col" style={{ fontSize: '11px', padding: '10px 8px' }}>Date</th>
                    <th scope="col" style={{ fontSize: '11px', padding: '10px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} style={{ backgroundColor: '#ffffff' }}>
                      <td style={{ padding: '10px 8px', backgroundColor: '#ffffff' }}>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            {activity.avatar ? (
                              <Image
                                src={activity.avatar}
                                className="rounded-circle"
                                alt={activity.employeeName}
                                width={32}
                                height={32}
                              />
                            ) : (
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: '#f0f0f0',
                                  color: '#64748B',
                                  fontSize: '10px',
                                  fontWeight: 'medium'
                                }}
                              >
                                {getInitials(activity.employeeName)}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1 ms-2">
                            <div className="fw-medium" style={{ fontSize: '11px' }}>
                              {getActivityText(activity.activityType, activity.employeeId)}
                            </div>
                            <div className="text-muted" style={{ fontSize: '10px' }}>
                              {activity.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-body" style={{ fontSize: '11px', padding: '10px 8px', backgroundColor: '#ffffff' }}>
                        {formatDate(activity.createdAt)}
                      </td>
                      <td style={{ padding: '10px 8px', backgroundColor: '#ffffff' }}>
                        <span
                          className={`badge ${getStatusBadgeClass(activity.status)} p-1 fw-normal text-capitalize`}
                          style={{ fontSize: '10px' }}
                        >
                          {activity.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default RecentActivities;

