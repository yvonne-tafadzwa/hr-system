"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const AddSickNote = () => {
  const router = useRouter();
  const { isSuperAdmin, companyId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [resolvedCompanyId, setResolvedCompanyId] = useState(null);
  const [resolvedIsSuperAdmin, setResolvedIsSuperAdmin] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    company_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'pending'
  });
  const [error, setError] = useState('');

  // Helper: resolve company ID with fallbacks
  const resolveCompanyAccess = async () => {
    let effectiveCompanyId = companyId;
    let effectiveIsSuperAdmin = isSuperAdmin;

    if (!effectiveIsSuperAdmin && !effectiveCompanyId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.user_metadata?.company_id) {
          effectiveCompanyId = user.user_metadata.company_id;
        }
        if (user.user_metadata?.role === 'super_admin') {
          effectiveIsSuperAdmin = true;
        }

        if (!effectiveIsSuperAdmin && !effectiveCompanyId) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('company_id, role')
            .eq('id', user.id)
            .single();

          if (profile) {
            if (profile.role === 'super_admin') {
              effectiveIsSuperAdmin = true;
            } else if (profile.company_id) {
              effectiveCompanyId = profile.company_id;
            }
          }
        }

        if (!effectiveIsSuperAdmin && !effectiveCompanyId && user.email) {
          const { data: companyMatch } = await supabase
            .from('companies')
            .select('id, company_code')
            .ilike('login_email', user.email)
            .single();

          if (companyMatch && companyMatch.company_code !== 'ADMIN') {
            effectiveCompanyId = companyMatch.id;
          } else if (companyMatch && companyMatch.company_code === 'ADMIN') {
            effectiveIsSuperAdmin = true;
          }
        }
      }
    }

    return { effectiveCompanyId, effectiveIsSuperAdmin };
  };

  useEffect(() => {
    const init = async () => {
      // Resolve company access
      const { effectiveCompanyId, effectiveIsSuperAdmin } = await resolveCompanyAccess();
      setResolvedCompanyId(effectiveCompanyId);
      setResolvedIsSuperAdmin(effectiveIsSuperAdmin);

      console.log('[AddSickNote] Resolved access:', { effectiveIsSuperAdmin, effectiveCompanyId });

      // For company_admin, auto-set company_id and fetch company name
      if (!effectiveIsSuperAdmin && effectiveCompanyId) {
        setFormData(prev => ({ ...prev, company_id: effectiveCompanyId }));

        // Fetch company name for display
        const { data: companyData } = await supabase
          .from('companies')
          .select('name')
          .eq('id', effectiveCompanyId)
          .single();

        if (companyData) {
          setCompanyName(companyData.name);
        }

        // Fetch employees for this company
        fetchEmployees(effectiveCompanyId);
      } else if (effectiveIsSuperAdmin) {
        // Fetch all companies for super_admin
        fetchCompanies();
        // Fetch all employees initially
        fetchEmployees();
      }
    };

    init();
  }, [isSuperAdmin, companyId]);

  const fetchEmployees = async (filterCompanyId = null) => {
    try {
      setIsLoadingEmployees(true);

      let query = supabase
        .from('employees')
        .select(`
          id,
          employee_id,
          name,
          company_id,
          companies(name)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      // Filter by company if specified
      if (filterCompanyId) {
        query = query.eq('company_id', filterCompanyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
        return;
      }

      if (data) {
        setEmployees(data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoadingEmployees(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If company changes (super_admin only), filter employees by company
    if (name === 'company_id' && resolvedIsSuperAdmin) {
      setFormData(prev => ({
        ...prev,
        company_id: value,
        employee_id: '' // Reset employee selection
      }));

      // Fetch employees for selected company
      if (value) {
        fetchEmployees(value);
      } else {
        fetchEmployees();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.employee_id || !formData.company_id || !formData.start_date || !formData.end_date || !formData.reason) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate < startDate) {
        setError('End date must be after start date');
        setIsSubmitting(false);
        return;
      }

      // Insert sick note into database
      const { data, error: insertError } = await supabase
        .from('sick_notes')
        .insert([
          {
            employee_id: formData.employee_id,
            company_id: formData.company_id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            reason: formData.reason,
            status: formData.status
          }
        ])
        .select();

      if (insertError) {
        console.error('Error creating sick note:', insertError);
        setError(insertError.message || 'Failed to create sick note. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to sick notes list
      router.push('/sick-notes/sick-notes');
    } catch (err) {
      console.error('Error creating sick note:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Filter employees by selected company (for super_admin when browsing)
  const filteredEmployees = resolvedIsSuperAdmin && formData.company_id
    ? employees.filter(emp => emp.company_id === formData.company_id)
    : employees;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .add-sick-note-form input::placeholder,
        .add-sick-note-form textarea::placeholder {
          font-size: 12px !important;
        }
      `}} />
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-4 text-center" style={{ fontSize: '18px', fontWeight: '600' }}>Add Sick Note</h3>

              {error && (
                <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit} className="add-sick-note-form">
                <Row>
                  <Col lg={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Company <span className="text-danger">*</span>
                      </Form.Label>
                      {resolvedIsSuperAdmin ? (
                        // Super admin can select any company
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
                      ) : (
                        // Company admin sees their company name (read-only)
                        <Form.Control
                          type="text"
                          value={companyName || 'Loading...'}
                          className="text-secondary"
                          readOnly
                          disabled
                          style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px', backgroundColor: '#f8f9fa' }}
                        />
                      )}
                    </Form.Group>
                  </Col>

                  <Col lg={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Employee <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        className="form-control text-dark"
                        required
                        disabled={!formData.company_id || isLoadingEmployees}
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      >
                        <option value="">
                          {!formData.company_id
                            ? 'Select Company First'
                            : isLoadingEmployees
                              ? 'Loading...'
                              : filteredEmployees.length === 0
                                ? 'No Employees Found'
                                : 'Select Employee'}
                        </option>
                        {filteredEmployees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name || employee.employee_id}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Start Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
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
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="text-secondary"
                        required
                        min={formData.start_date}
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={12}>
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
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control text-dark"
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
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
                        {isSubmitting ? 'Creating...' : (
                          <>
                            <i className="ri-add-line me-1"></i>
                            Create Sick Note
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => router.push('/sick-notes/sick-notes')}
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

export default AddSickNote;