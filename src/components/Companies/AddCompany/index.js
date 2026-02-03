"use client";

import { useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { registerCompanyAction } from "@/app/actions/registerCompany";
import { supabase } from "@/lib/supabase";

const AddCompany = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [departments, setDepartments] = useState(['']);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    login_email: '',
    password: '',
    is_active: true
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDepartmentChange = (index, value) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
  };

  const addDepartment = () => {
    setDepartments([...departments, '']);
  };

  const removeDepartment = (index) => {
    if (departments.length > 1) {
      const newDepartments = departments.filter((_, i) => i !== index);
      setDepartments(newDepartments);
    }
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

      // Validate at least one department
      const validDepartments = departments.filter(dept => dept.trim() !== '');
      if (validDepartments.length === 0) {
        setError('Please add at least one department');
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

      // Call the server action to register the company with proper auth
      const result = await registerCompanyAction({
        companyName: formData.name,
        firstName: formData.first_name,
        lastName: formData.last_name,
        position: formData.position,
        email: formData.login_email,
        password: formData.password,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create company. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Get the company ID to add departments
      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .eq('company_code', result.data.companyCode)
        .single();

      // Insert departments into departments table
      if (validDepartments.length > 0 && companyData) {
        const companyId = companyData.id;
        
        const departmentsToInsert = validDepartments.map(deptName => ({
          company_id: companyId,
          name: deptName.trim(),
          description: null
        }));

        const { error: departmentsError } = await supabase
          .from('departments')
          .insert(departmentsToInsert);

        if (departmentsError) {
          console.error('Error creating departments:', departmentsError);
          // Don't fail - company was created successfully
        }
      }

      // Success - show success modal
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
    router.push('/companies/companies');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .add-company-form input::placeholder {
          font-size: 12px !important;
        }
      `}} />
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-4 text-center" style={{ fontSize: '18px', fontWeight: '600' }}>Add Company</h3>

          {error && (
            <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit} className="add-company-form">
            <Row>
              <Col lg={12}>
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
              </Col>

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
                    placeholder="Enter admin first name"
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
                    placeholder="Enter admin last name"
                    required
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                </Form.Group>
              </Col>

              <Col lg={12}>
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
              </Col>

              <Col lg={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Department <span className="text-danger">*</span>
                  </Form.Label>
                  {departments.map((department, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2">
                      <Form.Control
                        type="text"
                        value={department}
                        onChange={(e) => handleDepartmentChange(index, e.target.value)}
                        className="h-55 text-secondary"
                        placeholder="Enter department"
                        required={index === 0}
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                      {departments.length > 1 && (
                        <Button
                          variant="danger"
                          type="button"
                          onClick={() => removeDepartment(index)}
                          className="px-2 py-1"
                          style={{ fontSize: '12px', minWidth: '40px' }}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline-primary"
                    type="button"
                    onClick={addDepartment}
                    className="mt-2"
                    style={{ fontSize: '12px' }}
                  >
                    <i className="ri-add-line me-1"></i>
                    Add Department
                  </Button>
                </Form.Group>
              </Col>

              <Col lg={6}>
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
                    placeholder="Enter admin email"
                    required
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                </Form.Group>
              </Col>

              <Col lg={6}>
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
                      placeholder="Enter password (min 6 characters)"
                      required
                      style={{ fontSize: '12px', paddingRight: '40px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '35px', paddingTop: '6px', paddingBottom: '6px' }}
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
              </Col>

              <Col lg={12}>
                <Form.Group className="d-flex gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="text-white fw-semibold py-2 px-3"
                    disabled={isSubmitting}
                    style={{ fontSize: '12px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="ri-add-line me-1"></i>
                        Create Company
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => router.push('/companies/companies')}
                    className="fw-semibold py-2 px-3"
                    style={{ fontSize: '12px' }}
                  >
                    Cancel
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
            </Card.Body>
          </Card>
        </div>
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
            Company Created Successfully!
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
            Company <strong>{registrationData?.companyName}</strong> has been successfully created!
          </p>
          
          <div className="bg-light rounded p-3 mb-3">
            <p className="mb-2" style={{ fontSize: '12px', color: '#666' }}>Company Code:</p>
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
                Welcome email could not be sent. Please inform the company admin of their credentials.
              </>
            )}
          </p>
          
          <div className="alert alert-info mt-3 mb-0" style={{ fontSize: '12px' }}>
            <strong>Login Details:</strong>
            <ul className="mb-0 mt-2">
              <li>Company Code: <strong>{registrationData?.companyCode}</strong></li>
              <li>Email: <strong>{registrationData?.email}</strong></li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', justifyContent: 'center' }}>
          <Button 
            variant="primary" 
            onClick={handleCloseSuccessModal}
            className="px-4 py-2"
            style={{ fontSize: '14px' }}
          >
            Go to Companies List
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCompany;
