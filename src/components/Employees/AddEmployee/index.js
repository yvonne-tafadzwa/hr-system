import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Nav, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, companyId } = useAuth();
  const [activeTab, setActiveTab] = useState("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [csvError, setCsvError] = useState('');
  const [csvPreview, setCsvPreview] = useState([]);
  const [resolvedCompanyId, setResolvedCompanyId] = useState(null);
  const [resolvedIsSuperAdmin, setResolvedIsSuperAdmin] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    company_id: '',
    department: '',
    is_active: true
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

      console.log('[AddEmployee] Resolved access:', { effectiveIsSuperAdmin, effectiveCompanyId });

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
      }

      // Fetch companies only for super_admin
      if (effectiveIsSuperAdmin) {
        fetchCompanies();
      }
    };

    init();
  }, [isSuperAdmin, companyId]);

  useEffect(() => {
    if (formData.company_id) {
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [formData.company_id]);

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

  const handleManualSubmit = async (e) => {
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

      // Validate email format if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Insert employee into database
      const { data, error: insertError } = await supabase
        .from('employees')
        .insert([
          {
            name: formData.name,
            employee_id: formData.employee_id,
            email: formData.email || null,
            company_id: formData.company_id,
            department: formData.department,
            is_active: formData.is_active
          }
        ])
        .select();

      if (insertError) {
        console.error('Error creating employee:', insertError);
        setError(insertError.message || 'Failed to create employee. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to employees list
      navigate('/employees/');
    } catch (err) {
      console.error('Error creating employee:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setCsvError('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    setCsvError('');

    // Read and preview CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());

      // Parse CSV data
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvError('Please select a CSV file');
      return;
    }

    setIsSubmitting(true);
    setCsvError('');

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      // For company_admin: CSV only needs name, employee_id, department
      // For super_admin: CSV needs name, employee_id, company_id, department
      const nameIndex = headers.indexOf('name');
      const employeeIdIndex = headers.indexOf('employee_id');
      const departmentIndex = headers.indexOf('department');
      const companyIdIndex = headers.indexOf('company_id');

      if (nameIndex === -1 || employeeIdIndex === -1 || departmentIndex === -1) {
        setCsvError('CSV must contain columns: name, employee_id, department' + (resolvedIsSuperAdmin ? ', company_id' : ''));
        setIsSubmitting(false);
        return;
      }

      // For super_admin, company_id column is required
      if (resolvedIsSuperAdmin && companyIdIndex === -1) {
        setCsvError('CSV must contain columns: name, employee_id, company_id, department');
        setIsSubmitting(false);
        return;
      }

      const employeesToInsert = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const name = values[nameIndex];
        const employee_id = values[employeeIdIndex];
        const department = values[departmentIndex];

        // For company_admin, use resolvedCompanyId; for super_admin, use CSV value
        const company_id = resolvedIsSuperAdmin ? values[companyIdIndex] : resolvedCompanyId;

        if (name && employee_id && company_id && department) {
          employeesToInsert.push({
            name,
            employee_id,
            company_id,
            department,
            is_active: true
          });
        }
      }

      if (employeesToInsert.length === 0) {
        setCsvError('No valid employee data found in CSV');
        setIsSubmitting(false);
        return;
      }

      // Insert employees in batches
      const batchSize = 100;
      for (let i = 0; i < employeesToInsert.length; i += batchSize) {
        const batch = employeesToInsert.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('employees')
          .insert(batch);

        if (insertError) {
          console.error('Error inserting batch:', insertError);
          setCsvError(`Error inserting employees: ${insertError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Success - redirect to employees list
      navigate('/employees/');
    } catch (err) {
      console.error('Error processing CSV:', err);
      setCsvError('An error occurred while processing the CSV file');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .add-employee-form input::placeholder,
        .add-employee-form textarea::placeholder {
          font-size: 12px !important;
        }
      `}} />
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-4 text-center" style={{ fontSize: '18px', fontWeight: '600' }}>Add Employee</h3>

              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'manual')}>
                <Nav variant="tabs" className="mb-4" style={{ borderBottom: '1px solid #D6DAE1' }}>
                  <Nav.Item>
                    <Nav.Link eventKey="manual" style={{ fontSize: '12px', color: activeTab === 'manual' ? '#605DFF' : '#6c757d' }}>
                      Manual Entry
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="csv" style={{ fontSize: '12px', color: activeTab === 'csv' ? '#605DFF' : '#6c757d' }}>
                      Upload CSV
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="manual">
                    {error && (
                      <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                        {error}
                      </div>
                    )}

                    <Form onSubmit={handleManualSubmit} className="add-employee-form">
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
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="text-secondary"
                              placeholder="Enter employee email"
                              style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
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
                              {isSubmitting ? 'Creating...' : (
                                <>
                                  <i className="ri-add-line me-1"></i>
                                  Create Employee
                                </>
                              )}
                            </Button>
                            <Button
                              variant="secondary"
                              type="button"
                              onClick={() => navigate('/employees/')}
                              className="fw-semibold py-2 px-3"
                              style={{ fontSize: '12px' }}
                            >
                              Cancel
                            </Button>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="csv">
                    {csvError && (
                      <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                        {csvError}
                      </div>
                    )}

                    {/* Show company info for company_admin */}
                    {!resolvedIsSuperAdmin && companyName && (
                      <div className="alert alert-info mb-4" role="alert" style={{ fontSize: '12px' }}>
                        Employees will be added to: <strong>{companyName}</strong>
                      </div>
                    )}

                    <div className="mb-4">
                      <Form.Group>
                        <Form.Label className="label text-secondary mb-3" style={{ fontSize: '12px' }}>
                          Upload CSV File <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".csv"
                          onChange={handleCsvFileChange}
                          style={{ fontSize: '12px' }}
                        />
                        <Form.Text className="text-muted" style={{ fontSize: '11px' }}>
                          {resolvedIsSuperAdmin
                            ? 'CSV must contain columns: name, employee_id, company_id, department'
                            : 'CSV must contain columns: name, employee_id, department'
                          }
                        </Form.Text>
                      </Form.Group>
                    </div>

                    {csvPreview.length > 0 && (
                      <div className="mb-4">
                        <h6 style={{ fontSize: '12px', marginBottom: '10px' }}>Preview (first 5 rows):</h6>
                        <div className="table-responsive">
                          <table className="table table-sm" style={{ fontSize: '11px' }}>
                            <thead>
                              <tr>
                                {Object.keys(csvPreview[0] || {}).map((key) => (
                                  <th key={key} style={{ padding: '5px', fontSize: '11px' }}>{key}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {csvPreview.map((row, index) => (
                                <tr key={index}>
                                  {Object.values(row).map((value, i) => (
                                    <td key={i} style={{ padding: '5px', fontSize: '11px' }}>{value}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-3">
                      <Button
                        variant="primary"
                        onClick={handleCsvUpload}
                        className="text-white fw-semibold py-2 px-3"
                        disabled={isSubmitting || !csvFile}
                        style={{ fontSize: '12px' }}
                      >
                        {isSubmitting ? 'Uploading...' : (
                          <>
                            <i className="ri-upload-line me-1"></i>
                            Upload CSV
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => navigate('/employees/')}
                        className="fw-semibold py-2 px-3"
                        style={{ fontSize: '12px' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;