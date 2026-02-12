import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const LatestSickNotes = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, companyId } = useAuth();
  const [sickNotes, setSickNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestSickNotes = async () => {
      try {
        setIsLoading(true);

        // Build query based on user role
        let query = supabase
          .from('sick_notes')
          .select(`
            id,
            start_date,
            end_date,
            status,
            created_at,
            company_id,
            employees(
              id,
              name,
              employee_id,
              company_id,
              user_profiles(first_name, last_name)
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Filter by company_id if not super admin
        if (!isSuperAdmin && companyId) {
          query = query.eq('company_id', companyId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching latest sick notes:', error);
          setSickNotes([]);
          return;
        }

        if (data) {
          setSickNotes(data);
        }

        // Set up real-time subscription
        const subscription = supabase
          .channel('latest-sick-notes-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              let refreshQuery = supabase
                .from('sick_notes')
                .select(`
                  id,
                  start_date,
                  end_date,
                  status,
                  created_at,
                  company_id,
                  employees(
                    id,
                    name,
                    employee_id,
                    company_id,
                    user_profiles(first_name, last_name)
                  )
                `)
                .order('created_at', { ascending: false })
                .limit(5);

              if (!isSuperAdmin && companyId) {
                refreshQuery = refreshQuery.eq('company_id', companyId);
              }

              const { data: updatedData } = await refreshQuery;

              if (updatedData) {
                setSickNotes(updatedData);
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching latest sick notes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestSickNotes();
  }, [isSuperAdmin, companyId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return '';
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : null;
    
    if (end && start !== end) {
      return `${start} - ${end}`;
    }
    return start;
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'}`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'}`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'}`;
  };

  const getEmployeeName = (employee) => {
    if (!employee) return 'Unknown';
    
    // Try to get name from user_profiles
    const profile = Array.isArray(employee.user_profiles) 
      ? employee.user_profiles[0] 
      : employee.user_profiles;
    
    if (profile && (profile.first_name || profile.last_name)) {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      if (fullName) return fullName.toLowerCase();
    }
    
    // Fallback to employee name
    if (employee.name) {
      return employee.name.toLowerCase();
    }
    
    // Fallback to employee_id
    return employee.employee_id || 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#25b003'; // Green
      case 'pending':
        return '#FF9800'; // Orange
      case 'rejected':
        return '#f44336'; // Red
      default:
        return '#FF9800'; // Orange (default)
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4 z-0 h-100">
        <Card.Body className="p-4" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-1">
            <h3 className="mb-0" style={{ fontSize: '14px' }}>Latest Sick Notes:</h3>
            <Form.Select
              className="month-select form-control"
              aria-label="Default select example"
              style={{ width: 'auto', fontSize: '12px' }}
            >
              <option defaultValue="0">Select</option>
              <option defaultValue="1">Today</option>
              <option defaultValue="2">Weekly</option>
              <option defaultValue="3">Monthly</option>
              <option defaultValue="4">Yearly</option>
            </Form.Select>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <span className="text-muted">Loading...</span>
            </div>
          ) : sickNotes.length === 0 ? (
            <div className="text-center py-5">
              <span className="text-muted">No sick notes found</span>
            </div>
          ) : (
            <div className="list-unstyled mb-0">
              {sickNotes.map((note, index) => (
                <div
                  key={note.id}
                  onClick={() => navigate(`/sick-notes/details/${note.id}`)}
                  className={`d-flex align-items-start justify-content-between py-2 ${
                    index < sickNotes.length - 1 ? 'border-bottom' : ''
                  }`}
                  style={{ 
                    borderBottomColor: '#f0f0f0', 
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="d-flex align-items-start flex-grow-1">
                    <div
                      className="flex-shrink-0 rounded-circle me-3 mt-1"
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: getStatusColor(note.status),
                        minWidth: '8px'
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-medium mb-1" style={{ fontSize: '12px', color: '#333' }}>
                        {getEmployeeName(note.employees)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#605DFF' }}>
                        {formatDateRange(note.start_date, note.end_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ms-2" style={{ fontSize: '12px', color: '#6c757d' }}>
                    {formatRelativeTime(note.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default LatestSickNotes;
