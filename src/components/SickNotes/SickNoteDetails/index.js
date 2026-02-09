"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button, ProgressBar, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sickNotesService } from "@/lib/services";

const SickNoteDetails = ({ sickNoteId }) => {
  const router = useRouter();

  const [sickNote, setSickNote] = useState(null);
  const [sickDaysInfo, setSickDaysInfo] = useState(null);
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
            companies(name, company_code, max_sick_days)
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

        // Fetch sick days info for this employee
        if (sickNoteData.employees?.id && sickNoteData.employees?.company_id) {
          const { data: daysInfo } = await sickNotesService.getEmployeeSickDaysInfo(
            sickNoteData.employees.id,
            sickNoteData.employees.company_id
          );
          setSickDaysInfo(daysInfo);
        }
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
      if (newStatus === 'approved') {
        // Use service to validate and approve
        const { data, error: approveError } = await sickNotesService.approve(sickNoteId);

        if (approveError) {
          console.error('Error approving sick note:', approveError);
          setError(approveError.message || 'Failed to approve sick note');
          setIsUpdating(false);
          return;
        }
      } else {
        // For rejection, use the service
        const { error: rejectError } = await sickNotesService.reject(sickNoteId);

        if (rejectError) {
          console.error('Error rejecting sick note:', rejectError);
          setError(rejectError.message || 'Failed to reject sick note');
          setIsUpdating(false);
          return;
        }
      }

      // Refresh the data
      await fetchSickNoteDetails();
    } catch (err) {
      console.error('Error updating sick note:', err);
      setError('An error occurred while updating the sick note');
      setIsUpdating(false);
    }
  };

  // Calculate days in this sick note
  const calculateNoteDays = () => {
    if (!sickNote?.start_date || !sickNote?.end_date) return 0;
    const start = new Date(sickNote.start_date);
    const end = new Date(sickNote.end_date);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
                  disabled={isUpdating || (sickDaysInfo?.isExceeded)}
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

      {/* Sick Days Tracking Card */}
      {sickDaysInfo && sickDaysInfo.hasLimit && (
        <Card className="bg-white border-0 rounded-3 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0" style={{ fontSize: '14px' }}>
                <i className="ri-calendar-check-line me-2 text-primary"></i>
                Sick Days Tracking
              </h3>
              <span
                className={`badge ${sickDaysInfo.isExceeded ? 'bg-danger' : sickDaysInfo.remaining <= 3 ? 'bg-warning' : 'bg-success'} bg-opacity-10 ${sickDaysInfo.isExceeded ? 'text-danger' : sickDaysInfo.remaining <= 3 ? 'text-warning' : 'text-success'}`}
                style={{ fontSize: '11px', padding: '6px 10px' }}
              >
                {sickDaysInfo.isExceeded ? 'Limit Exceeded' : sickDaysInfo.remaining <= 3 ? 'Low Balance' : 'Available'}
              </span>
            </div>

            <Row className="mb-3">
              <Col md={4}>
                <div className="text-center p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <div className="fw-bold text-primary" style={{ fontSize: '24px' }}>{sickDaysInfo.daysUsed}</div>
                  <small className="text-muted">Days Used (This Year)</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <div className="fw-bold text-success" style={{ fontSize: '24px' }}>{sickDaysInfo.remaining}</div>
                  <small className="text-muted">Days Remaining</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <div className="fw-bold text-secondary" style={{ fontSize: '24px' }}>{sickDaysInfo.maxDays}</div>
                  <small className="text-muted">Max Days Per Year</small>
                </div>
              </Col>
            </Row>

            <div className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Sick Days Used</small>
                <small className="text-muted fw-medium">{sickDaysInfo.daysUsed} / {sickDaysInfo.maxDays} days</small>
              </div>
              <ProgressBar
                now={(sickDaysInfo.daysUsed / sickDaysInfo.maxDays) * 100}
                variant={sickDaysInfo.isExceeded ? 'danger' : sickDaysInfo.daysUsed / sickDaysInfo.maxDays > 0.8 ? 'warning' : 'primary'}
                style={{ height: '10px' }}
              />
            </div>

            {/* This sick note info */}
            <div className="mt-3 p-3 rounded" style={{ background: '#e7f3ff', border: '1px dashed #0d6efd' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '12px' }}>
                  <i className="ri-file-text-line me-1"></i>
                  This sick note: <strong>{calculateNoteDays()} day{calculateNoteDays() !== 1 ? 's' : ''}</strong>
                </span>
                {sickNote.status?.toLowerCase() === 'pending' && (
                  <span style={{ fontSize: '11px' }} className={sickDaysInfo.daysUsed + calculateNoteDays() > sickDaysInfo.maxDays ? 'text-danger' : 'text-success'}>
                    {sickDaysInfo.daysUsed + calculateNoteDays() > sickDaysInfo.maxDays
                      ? `⚠️ Would exceed limit by ${sickDaysInfo.daysUsed + calculateNoteDays() - sickDaysInfo.maxDays} day(s)`
                      : `✓ If approved: ${sickDaysInfo.remaining - calculateNoteDays()} days remaining`
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Warning if limit would be exceeded */}
            {sickNote.status?.toLowerCase() === 'pending' && sickDaysInfo.daysUsed + calculateNoteDays() > sickDaysInfo.maxDays && (
              <Alert variant="danger" className="mt-3 mb-0" style={{ fontSize: '12px' }}>
                <i className="ri-error-warning-line me-2"></i>
                <strong>Cannot Approve:</strong> This employee has already used {sickDaysInfo.daysUsed} of {sickDaysInfo.maxDays} sick days this year.
                Approving this {calculateNoteDays()}-day sick note would exceed the company limit.
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* No limit set message */}
      {sickDaysInfo && !sickDaysInfo.hasLimit && (
        <Card className="bg-white border-0 rounded-3 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center">
              <i className="ri-information-line me-2 text-info" style={{ fontSize: '20px' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontSize: '13px' }}>No Sick Days Limit Set</h6>
                <small className="text-muted">This company has not configured a maximum sick days limit per employee.</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default SickNoteDetails;

