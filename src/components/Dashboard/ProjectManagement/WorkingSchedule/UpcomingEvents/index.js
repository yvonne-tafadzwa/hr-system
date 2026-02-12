import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const LatestSickNotes = () => {
  const [sickNotes, setSickNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestSickNotes = async () => {
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
          .order('created_at', { ascending: false })
          .limit(10);

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
          .channel('latest-sick-notes-working-schedule')
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
                .order('created_at', { ascending: false })
                .limit(10);

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
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEmployeeName = (employee) => {
    return employee?.name || employee?.employee_id || 'Unknown Employee';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-primary';
    }
  };

  if (isLoading) {
    return (
      <div className="upcoming-events position-relative">
        <div className="d-flex justify-content-between align-items-center mt-3 mt-sm-0 mb-3">
          <span className="fw-medium">Latest Sick Notes:</span>
        </div>
        <div className="text-center py-4">
          <span className="text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  if (sickNotes.length === 0) {
    return (
      <div className="upcoming-events position-relative">
        <div className="d-flex justify-content-between align-items-center mt-3 mt-sm-0 mb-3">
          <span className="fw-medium">Latest Sick Notes:</span>
        </div>
        <div className="text-center py-4">
          <span className="text-muted">No sick notes found</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="upcoming-events position-relative">
        <div className="d-flex justify-content-between align-items-center mt-3 mt-sm-0 mb-3">
          <span className="fw-medium">Latest Sick Notes:</span>
        </div>

        <div className="list-unstyled mb-0">
          {sickNotes.map((note, index) => {
            const employeeName = getEmployeeName(note.employees);
            const statusColor = getStatusColor(note.status);
            const startDate = formatDate(note.start_date);
            const endDate = formatDate(note.end_date);

            return (
              <div 
                key={note.id}
                className={`position-relative d-flex mb-3 ${index < sickNotes.length - 1 ? 'pb-3 border-bottom' : ''}`}
                style={{ borderBottomColor: '#f0f0f0' }}
              >
                <span className={`wh-11 ${statusColor} rounded-1 d-inline-block position-relative top-1 flex-shrink-0`}></span>

                <div className="ms-2">
                  <h4 className="fs-12 fw-semibold text-secondary mb-0">
                    {employeeName}
                  </h4>
                  <p className="fs-12 mb-0">
                    <span className="text-primary">{startDate}</span>
                    {endDate && endDate !== startDate && ` - ${endDate}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LatestSickNotes;
