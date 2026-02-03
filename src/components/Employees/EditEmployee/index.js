"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const EditEmployee = ({ employeeId }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    company_id: '',
    department: '',
    is_active: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
      fetchCompanies();
    }
  }, [employeeId]);

  useEffect(() => {
    if (formData.company_id) {
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [formData.company_id]);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (employeeError) {
        console.error('Error fetching employee:', employeeError);
        setError('Failed to load employee data');
        return;
      }

      if (employeeData) {
        setFormData({
          name: employeeData.name || '',
          employee_id: employeeData.employee_id || '',
          company_id: employeeData.company_id || '',
          department: employeeData.department || '',
          is_active: employeeData.is_active !== undefined ? employeeData.is_active : true
        });
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError('An error occurred while loading employee data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, company_code')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
        return;
      }

      if (data) {
        setCompanies(data);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('company_id', formData.company_id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
        return;
      }

      if (data) {
        setDepartments(data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

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
      if (!formData.name || !formData.employee_id || !formData.company_id || !formData.department) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Update employee
      const { error: updateError } = await supabase
        .from('employees')
        .update({
          name: formData.name,
          employee_id: formData.employee_id,
          company_id: formData.company_id,
          department: formData.department,
          is_active: formData.is_active
        })
        .eq('id', employeeId);

      if (updateError) {
        console.error('Error updating employee:', updateError);
        setError(updateError.message || 'Failed to update employee. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to employees list
      router.push('/employees/employees');
    } catch (err) {
      console.error('Error updating employee:', err);
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
        .add-employee-form input::placeholder {
          font-size: 12px !important;
        }
      `}} />
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-4 text-center" style={{ fontSize: '18px', fontWeight: '600' }}>Edit Employee</h3>

              {error && (
                <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit} className="add-employee-form">
                <Row>
                  <Col lg={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-secondary"
                        placeholder="Enter employee name"
                        required
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Employee ID <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        className="text-secondary"
                        placeholder="Enter employee ID"
                        required
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Company <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="company_id"
                        value={formData.company_id}
                        onChange={handleChange}
                        className="form-control text-dark"
                        required
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name} ({company.company_code})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Department <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-control text-dark"
                        required
                        disabled={!formData.company_id || departments.length === 0}
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      >
                        <option value="">
                          {!formData.company_id ? 'Select Company First' : departments.length === 0 ? 'No Departments Available' : 'Select Department'}
                        </option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>
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
                        className="form-control text-dark"
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
                            Update Employee
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => router.push('/employees/employees')}
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

export default EditEmployee;

