"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { supabase } from "@/lib/supabase";

const FullCalendarDemo = () => {
  const [sickNotes, setSickNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSickNotes = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('sick_notes')
          .select(`
            *,
            employees(
              id,
              name,
              employee_id
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sick notes:', error);
          setSickNotes([]);
          return;
        }

        if (data) {
          setSickNotes(data);
        }

        // Set up real-time subscription
        const subscription = supabase
          .channel('sick-notes-calendar-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              const { data: updatedData } = await supabase
                .from('sick_notes')
                .select(`
                  *,
                  employees(
                    id,
                    name,
                    employee_id
                  )
                `)
                .order('created_at', { ascending: false });

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
        console.error('Error fetching sick notes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSickNotes();
  }, []);

  // Convert sick notes to FullCalendar events format
  const events = useMemo(() => {
    return sickNotes
      .filter(note => note.start_date && note.end_date)
      .map((note) => {
        const employeeName = note.employees?.name || note.employees?.employee_id || 'Unknown Employee';
        const status = note.status || 'pending';
        
        // Determine color based on status
        let backgroundColor = '#ffc107'; // Default: pending (yellow/warning)
        let borderColor = '#ffc107';
        
        if (status.toLowerCase() === 'approved') {
          backgroundColor = '#28a745'; // Green
          borderColor = '#28a745';
        } else if (status.toLowerCase() === 'rejected') {
          backgroundColor = '#dc3545'; // Red
          borderColor = '#dc3545';
        }

        return {
          id: note.id,
          title: `${employeeName} - Sick Note`,
          start: note.start_date,
          end: note.end_date ? new Date(new Date(note.end_date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : note.start_date, // Add 1 day to end_date for FullCalendar
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: '#ffffff',
          extendedProps: {
            employeeName: employeeName,
            status: status,
            reason: note.reason || '',
            employeeId: note.employees?.employee_id || ''
          }
        };
      });
  }, [sickNotes]);

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4 z-0">
        <Card.Body className="p-4">
          <div className='full-calendar-box'>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView='dayGridMonth'
              events={events}
              eventDisplay='block'
              height='auto'
              fixedWeekCount={false}
              showNonCurrentDates={false}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default FullCalendarDemo;
