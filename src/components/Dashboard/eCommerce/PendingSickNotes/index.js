"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const PendingSickNotes = () => {
  const { isSuperAdmin, companyId } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);

        // Build query based on user role
        let query = supabase
          .from('sick_notes')
          .select(`
            employee_id,
            company_id,
            employees(
              id,
              employee_id,
              is_active,
              company_id,
              user_profiles(first_name, last_name, email)
            )
          `);

        // Filter by company_id if not super admin
        if (!isSuperAdmin && companyId) {
          query = query.eq('company_id', companyId);
        }

        const { data: sickNotes, error: sickNotesError } = await query;

        if (sickNotesError) {
          console.error('Error fetching sick notes:', sickNotesError);
          console.error('Error details:', JSON.stringify(sickNotesError, null, 2));
          setLeaderboard([]);
          return;
        }

        console.log('Fetched sick notes for leaderboard:', sickNotes?.length || 0);
        if (!sickNotes || sickNotes.length === 0) {
          console.log('No sick notes found or empty array');
          setLeaderboard([]);
          return;
        }

        // Count sick notes per employee and build leaderboard
        const employeeMap = {};
        
        sickNotes.forEach(note => {
          if (!note.employee_id || !note.employees) return;
          
          const employee = note.employees;
          
          // Skip inactive employees
          if (!employee.is_active) return;
          
          // Handle user_profiles - it might be an object or array
          const profile = Array.isArray(employee.user_profiles) 
            ? employee.user_profiles[0] 
            : employee.user_profiles;
          
          // Use employee_id as the display name
          const displayName = employee.employee_id || 'Unknown';
          
          // Initialize or increment count
          if (!employeeMap[employee.id]) {
            employeeMap[employee.id] = {
              id: employee.id,
              employeeId: employee.employee_id,
              name: displayName,
              email: profile?.email || '',
              sickNoteCount: 0,
            };
          }
          
          employeeMap[employee.id].sickNoteCount++;
        });

        // Convert to array, sort, and take top 3
        const leaderboardData = Object.values(employeeMap)
          .filter(entry => entry.sickNoteCount > 0)
          .sort((a, b) => b.sickNoteCount - a.sickNoteCount)
          .slice(0, 3);

        setLeaderboard(leaderboardData);

        // Set up real-time subscriptions
        const sickNotesSubscription = supabase
          .channel('sick_notes-leaderboard-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            () => {
              fetchLeaderboard();
            }
          )
          .subscribe();

        return () => {
          sickNotesSubscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [isSuperAdmin, companyId]);

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4 stats-box h-80">
        <Card.Body className="p-4" style={{ paddingBottom: '30px' }}>
          <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
            <div>
              <h6 className="mb-0 fs-14">Sick Notes Leaderboard</h6>
              <span className="fs-10 text-muted">Top employees by sick notes</span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-3">
              <span className="text-muted">Loading...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-3">
              <span className="text-muted">No employees with sick notes found</span>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((employee, index) => (
                <div
                  key={employee.id}
                  className="d-flex justify-content-between align-items-center py-1 border-bottom"
                  style={{ borderBottom: index < leaderboard.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                >
                  <div className="d-flex align-items-center">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#f0f0f0',
                        color: index < 3 ? '#fff' : '#64748B',
                        fontSize: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <div className="fw-medium" style={{ fontSize: '10px' }}>
                        {employee.name}
                      </div>
                      {employee.email && (
                        <div className="text-muted" style={{ fontSize: '10px' }}>
                          {employee.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="fw-bold" style={{ fontSize: '14px', color: '#605DFF' }}>
                      {employee.sickNoteCount}
                    </span>
                    <div className="text-muted" style={{ fontSize: '10px' }}>
                      {employee.sickNoteCount === 1 ? 'note' : 'notes'}
                    </div>
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

export default PendingSickNotes;
