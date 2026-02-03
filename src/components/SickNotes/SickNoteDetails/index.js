"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SickNoteDetails = ({ sickNoteId }) => {
  const router = useRouter();
  
  const [sickNote, setSickNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sickNoteId) {
      fetchSickNoteDetails();

      // Set up real-time subscription
      const subscription = supabase
        .channel(`sick-note-${sickNoteId}`)
        .on('postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'sick_notes',
            filter: `id=eq.${sickNoteId}`
          },
          () => {
            fetchSickNoteDetails();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [sickNoteId]);

  const fetchSickNoteDetails = async () => {
    try {
      setIsLoading(true);
      
      const { data: sickNoteData, error: sickNoteError } = await supabase
        .from('sick_notes')
        .select(`
          *,
          employees(
            id,
            name,
            employee_id,
            company_id,
            department,
            companies(name, company_code)
          )
        `)
        .eq('id', sickNoteId)
        .single();

      if (sickNoteError) {
        console.error('Error fetching sick note:', sickNoteError);
        setError('Failed to load sick note data');
        return;
      }

      if (sickNoteData) {
        setSickNote(sickNoteData);
      }
    } catch (err) {
      console.error('Error fetching sick note details:', err);
      setError('An error occurred while loading sick note data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!sickNote) return;

    setIsUpdating(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('sick_notes')
        .update({ status: newStatus })
        .eq('id', sickNoteId);

      if (updateError) {
        console.error('Error updating sick note:', updateError);
        setError(updateError.message || 'Failed to update sick note status');
        setIsUpdating(false);
        return;
      }

      // Refresh the data
      await fetchSickNoteDetails();
    } catch (err) {
      console.error('Error updating sick note:', err);
      setError('An error occurred while updating the sick note');
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success bg-opacity-10 text-success';
      case 'rejected':
        return 'bg-danger bg-opacity-10 text-danger';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <span className="text-muted">Loading...</span>
      </div>
    );
  }

  if (error && !sickNote) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <span className="text-danger">{error}</span>
          <br />
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/ecommerce')}
            className="mt-3"
            style={{ fontSize: '12px' }}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!sickNote) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <span className="text-muted">Sick note not found</span>
          <br />
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/ecommerce')}
            className="mt-3"
            style={{ fontSize: '12px' }}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isPending = sickNote.status?.toLowerCase() === 'pending';

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0" style={{ fontSize: '14px' }}>Sick Note Details</h3>
            <Button
              variant="secondary"
              onClick={() => router.push('/dashboard/ecommerce')}
              style={{ fontSize: '12px' }}
            >
              Back
            </Button>
          </div>

          {error && (
            <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
              {error}
            </div>
          )}

          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Employee Name</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{sickNote.employees?.name || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Employee ID</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{sickNote.employees?.employee_id || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Company</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>
                  {sickNote.employees?.companies?.name || '-'}
                  {sickNote.employees?.companies?.company_code && ` (${sickNote.employees.companies.company_code})`}
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Department</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{sickNote.employees?.department || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Start Date</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{formatDate(sickNote.start_date)}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>End Date</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{formatDate(sickNote.end_date)}</p>
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Reason</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{sickNote.reason || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Status</label>
                <p className="mb-0">
                  <span
                    className={`badge ${getStatusBadgeClass(sickNote.status)} p-1 fs-11 fw-normal text-capitalize`}
                    style={{ fontSize: '11px' }}
                  >
                    {sickNote.status || 'Pending'}
                  </span>
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Submitted Date</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{formatDate(sickNote.created_at)}</p>
              </div>
            </Col>
          </Row>

          {isPending && (
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isUpdating}
                  className="text-white"
                  style={{ fontSize: '12px' }}
                >
                  {isUpdating ? 'Updating...' : (
                    <>
                      <i className="ri-check-line me-1"></i>
                      Accept
                    </>
                  )}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                  className="text-white"
                  style={{ fontSize: '12px' }}
                >
                  {isUpdating ? 'Updating...' : (
                    <>
                      <i className="ri-close-line me-1"></i>
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default SickNoteDetails;

