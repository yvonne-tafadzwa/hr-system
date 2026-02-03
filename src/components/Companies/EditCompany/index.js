"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const EditCompany = ({ companyId }) => {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState(['']);
  const [formData, setFormData] = useState({
    name: '',
    login_email: '',
    password: '',
    is_active: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        setError('Failed to load company data');
        return;
      }

      if (companyData) {
        // Split name into first and last name if it contains a space
        const nameParts = companyData.name ? companyData.name.split(' ') : ['', ''];
        setFormData({
          name: companyData.name || '',
          login_email: companyData.login_email || '',
          password: '', // Don't load password
          is_active: companyData.is_active !== undefined ? companyData.is_active : true
        });

        // Fetch departments for this company
        const { data: departmentsData } = await supabase
          .from('departments')
          .select('name')
          .eq('company_id', companyId);

        if (departmentsData && departmentsData.length > 0) {
          setDepartments(departmentsData.map(dept => dept.name));
        } else {
          setDepartments(['']);
        }
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('An error occurred while loading company data');
    } finally {
      setIsLoading(false);
    }
  };

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
      if (!formData.name || !formData.login_email) {
        setError('Please fill in all required fields');
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

      // Validate password if provided
      if (formData.password && formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
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

      // Update company
      const updateData = {
        name: formData.name,
        login_email: formData.login_email,
        is_active: formData.is_active
      };

      // Only update password if provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const { error: updateError } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', companyId);

      if (updateError) {
        console.error('Error updating company:', updateError);
        setError(updateError.message || 'Failed to update company. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Update departments
      // First, delete existing departments
      await supabase
        .from('departments')
        .delete()
        .eq('company_id', companyId);

      // Then insert new departments
      if (validDepartments.length > 0) {
        const departmentsToInsert = validDepartments.map(deptName => ({
          company_id: companyId,
          name: deptName.trim(),
          description: null
        }));

        const { error: departmentsError } = await supabase
          .from('departments')
          .insert(departmentsToInsert);

        if (departmentsError) {
          console.error('Error updating departments:', departmentsError);
          setError('Company updated but failed to update departments. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Success - redirect to companies list
      router.push('/companies/companies');
    } catch (err) {
      console.error('Error updating company:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <span className="text-muted">Loading...</span>
      </div>
    );
  }

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
              <h3 className="mb-4 text-center" style={{ fontSize: '18px', fontWeight: '600' }}>Edit Company</h3>

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
                    placeholder="Enter your email"
                    required
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Password (leave blank to keep current)
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-55 text-secondary"
                      placeholder="Enter new password (min 6 characters)"
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
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Status
                  </Form.Label>
                  <Form.Select
                    name="is_active"
                    value={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    className="form-control text-dark h-55"
                    style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
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
                    {isSubmitting ? 'Updating...' : (
                      <>
                        <i className="ri-save-line me-1"></i>
                        Update Company
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
    </>
  );
};

export default EditCompany;

