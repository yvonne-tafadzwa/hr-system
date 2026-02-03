"use client";

import { useState } from "react";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import Link from "next/link";
import { submitSickNoteAction } from "@/app/actions/submitSickNote";

const SubmitSickNoteForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submissionData, setSubmissionData] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.reason) {
                setError('Please fill in all required fields');
                setIsSubmitting(false);
                return;
            }

            // Validate dates
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (endDate < startDate) {
                setError('End date must be after or equal to start date');
                setIsSubmitting(false);
                return;
            }

            // Call the server action to submit sick note
            const result = await submitSickNoteAction({
                employeeId: formData.employeeId,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
            });

            if (!result.success) {
                setError(result.error || 'Failed to submit sick note. Please try again.');
                setIsSubmitting(false);
                return;
            }

            // Success - show success modal
            setSubmissionData(result.data);
            setShowSuccessModal(true);
            setIsSubmitting(false);

            // Reset form
            setFormData({
                employeeId: '',
                startDate: '',
                endDate: '',
                reason: ''
            });

        } catch (err) {
            console.error('Error submitting sick note:', err);
            setError('An unexpected error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setSubmissionData(null);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        .submit-sick-note-form input::placeholder,
        .submit-sick-note-form textarea::placeholder {
          font-size: 12px !important;
        }
      `}} />
            <div className="auth-main-content m-auto m-1230 px-3 my-5">
                <Row className="align-items-center justify-content-center">
                    <Col lg={6} md={8} sm={10}>
                        <div className="mx-auto bg-white p-4 rounded-3" style={{
                            width: '800px',
                            maxWidth: '100%',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                            borderRadius: '8px',
                            padding: '40px'
                        }}>
                            <h3 className="mb-2" style={{ fontSize: '16px' }}>Submit Sick Note</h3>
                            <p className="fw-medium mb-3" style={{ fontSize: '12px', color: '#666' }}>
                                Enter your employee ID and sick note details
                            </p>

                            {error && (
                                <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                                    {error}
                                </div>
                            )}

                            <Form onSubmit={handleSubmit} className="submit-sick-note-form">
                                <Form.Group className="mb-4">
                                    <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                                        Employee ID <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                        className="h-55 text-secondary"
                                        placeholder="e.g., EMP-001"
                                        required
                                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px', textTransform: 'uppercase' }}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                                                Start Date <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="text-secondary"
                                                required
                                                style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                                                End Date <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="text-secondary"
                                                required
                                                min={formData.startDate}
                                                style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                                        Reason <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        className="text-secondary"
                                        placeholder="Enter reason for sick note"
                                        required
                                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, paddingTop: '4px', paddingBottom: '4px' }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-medium py-2 px-3 w-100"
                                        disabled={isSubmitting}
                                        style={{ fontSize: '12px' }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : 'Submit Sick Note'}
                                    </button>
                                </Form.Group>

                                <p className="text-center mb-0" style={{ fontSize: '12px' }}>
                                    Already have an account?{' '}
                                    <Link href="/authentication/sign-in/" className="text-primary fw-medium">
                                        Sign In
                                    </Link>
                                </p>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onHide={handleCloseSuccessModal}
                centered
                backdrop="static"
            >
                <Modal.Header style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <Modal.Title style={{ fontSize: '18px' }}>
                        <span className="text-success me-2">✓</span>
                        Sick Note Submitted!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <span className="material-symbols-outlined text-success" style={{ fontSize: '48px' }}>
                                check_circle
                            </span>
                        </div>
                    </div>

                    <p className="text-center mb-3" style={{ fontSize: '14px' }}>
                        Hi <strong>{submissionData?.employeeName}</strong>, your sick note has been submitted successfully!
                    </p>

                    <div className="bg-light rounded p-3 mb-3">
                        <table style={{ width: '100%', fontSize: '12px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#666' }}>Duration:</td>
                                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
                                        {submissionData?.days} day{submissionData?.days > 1 ? 's' : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#666' }}>From:</td>
                                    <td style={{ padding: '4px 0' }}>{submissionData?.startDate && formatDate(submissionData.startDate)}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#666' }}>To:</td>
                                    <td style={{ padding: '4px 0' }}>{submissionData?.endDate && formatDate(submissionData.endDate)}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '4px 0', color: '#666' }}>Status:</td>
                                    <td style={{ padding: '4px 0' }}>
                                        {submissionData?.isAutoApproved ? (
                                            <span className="badge bg-success">Approved</span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">Pending Review</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {submissionData?.isAutoApproved ? (
                        <div className="alert alert-success mt-3 mb-0" style={{ fontSize: '12px' }}>
                            <strong>Auto-Approved:</strong> Since this is a short-term sick note (3 days or less), it has been automatically approved.
                        </div>
                    ) : (
                        <div className="alert alert-warning mt-3 mb-0" style={{ fontSize: '12px' }}>
                            <strong>Pending Review:</strong> Your sick note will be reviewed by your manager. You will be notified once it&apos;s processed.
                        </div>
                    )}

                    {submissionData?.emailSent && (
                        <p className="text-center mt-3 mb-0" style={{ fontSize: '11px', color: '#666' }}>
                            <span className="text-success me-1">✓</span>
                            A confirmation email has been sent to your registered email address.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none', justifyContent: 'center' }}>
                    <Button
                        variant="primary"
                        onClick={handleCloseSuccessModal}
                        className="px-4 py-2"
                        style={{ fontSize: '14px' }}
                    >
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SubmitSickNoteForm;
