"use client";

import { useState } from "react";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerCompanyAction } from "@/app/actions/registerCompany";

const SignUpForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    login_email: '',
    password: '',
    departments: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.first_name || !formData.last_name || !formData.position || !formData.login_email || !formData.password) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      if (!formData.agreeToTerms) {
        setError('Please agree to the Terms and Conditions and Privacy Policy');
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.login_email)) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsSubmitting(false);
        return;
      }

      // Parse departments (comma-separated)
      const departmentsList = formData.departments
        ? formData.departments.split(',').map(d => d.trim()).filter(d => d.length > 0)
        : [];

      // Call the server action to register the company
      const result = await registerCompanyAction({
        companyName: formData.name,
        firstName: formData.first_name,
        lastName: formData.last_name,
        position: formData.position,
        email: formData.login_email,
        password: formData.password,
        departments: departmentsList,
      });

      if (!result.success) {
        setError(result.error || 'Failed to register company. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success - show success modal with company code
      setRegistrationData(result.data);
      setShowSuccessModal(true);
      setIsSubmitting(false);

    } catch (err) {
      console.error('Error creating company:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/authentication/sign-in/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .register-company-form input::placeholder,
        .register-company-form textarea::placeholder {
          font-size: 12px !important;
        }
      `}} />
      <div className="auth-main-content m-auto m-1230 px-3 my-5">
        <Row className="align-items-center">
          <Col lg={12}>
            <div className="mw-480 ms-lg-auto bg-white p-4 rounded-3" style={{ backgroundColor: '#ffffff' }}>
              <h3 className="fs-28 mb-4" style={{ fontSize: '16px' }}>Register Company</h3>

              {error && (
                <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit} className="register-company-form">
                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Company Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-55 text-secondary"
                    placeholder="e.g., Tech Solutions Inc."
                    required
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                </Form.Group>

                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        First Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="h-55 text-secondary"
                        placeholder="Enter your first name"
                        required
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Last Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="h-55 text-secondary"
                        placeholder="Enter your last name"
                        required
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Position <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="h-55 text-secondary"
                    placeholder="e.g., CEO, Director, Manager"
                    required
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="login_email"
                    value={formData.login_email}
                    onChange={handleChange}
                    className="h-55 text-secondary"
                    placeholder="Enter your email"
                    required
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-55 text-secondary"
                      placeholder="Enter your password (min 6 characters)"
                      required
                      style={{ fontSize: '12px', paddingRight: '40px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute"
                      style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 30
                      }}
                    >
                      {showPassword ? (
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6c757d' }}>
                          visibility_off
                        </span>
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6c757d' }}>
                          visibility
                        </span>
                      )}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Departments <span className="text-muted">(optional)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="departments"
                    value={formData.departments}
                    onChange={handleChange}
                    className="h-55 text-secondary"
                    placeholder="e.g., HR, Finance, Engineering, Sales"
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                  <Form.Text className="text-muted" style={{ fontSize: '10px' }}>
                    Separate departments with commas. You can add more later.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    label={
                      <span style={{ fontSize: '12px' }}>
                        By creating an account you agree to the{' '}
                        <Link href="/settings/terms-conditions/" className="text-primary">Terms and Conditions</Link>
                        {' '}and{' '}
                        <Link href="/settings/privacy-policy/" className="text-primary">Privacy Policy</Link>
                      </span>
                    }
                    required
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
                        Registering...
                      </>
                    ) : 'Register Company'}
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
            Registration Successful!
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
            Your company <strong>{registrationData?.companyName}</strong> has been successfully registered!
          </p>

          <div className="bg-light rounded p-3 mb-3">
            <p className="mb-2" style={{ fontSize: '12px', color: '#666' }}>Your Company Code:</p>
            <h4 className="mb-0 text-primary fw-bold text-center" style={{ fontSize: '24px', letterSpacing: '2px' }}>
              {registrationData?.companyCode}
            </h4>
          </div>

          <p className="text-center mb-2" style={{ fontSize: '12px', color: '#666' }}>
            {registrationData?.emailSent ? (
              <>
                <span className="text-success me-1">✓</span>
                A welcome email has been sent to <strong>{registrationData?.email}</strong>
              </>
            ) : (
              <>
                <span className="text-warning me-1">!</span>
                Please save your company code. You&apos;ll need it to log in.
              </>
            )}
          </p>

          <div className="alert alert-info mt-3 mb-0" style={{ fontSize: '12px' }}>
            <strong>Important:</strong> Please save your Company Code. You&apos;ll need it along with your password to sign in.
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', justifyContent: 'center' }}>
          <Button
            variant="primary"
            onClick={handleCloseSuccessModal}
            className="px-4 py-2"
            style={{ fontSize: '14px' }}
          >
            Go to Sign In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignUpForm;