import { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Form, Button, ProgressBar, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const EditCompany = ({ companyId }) => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState(['']);
  const [formData, setFormData] = useState({
    name: '',
    login_email: '',
    password: '',
    is_active: true,
    max_sick_days: ''
  });
  const [error, setError] = useState('');

  // CSV Import states for Employees
  const [employeesCsvFile, setEmployeesCsvFile] = useState(null);
  const [employeesCsvData, setEmployeesCsvData] = useState(null);
  const [employeesCsvErrors, setEmployeesCsvErrors] = useState([]);
  const [isUploadingEmployees, setIsUploadingEmployees] = useState(false);
  const [employeesUploadProgress, setEmployeesUploadProgress] = useState(0);
  const [employeesUploadResult, setEmployeesUploadResult] = useState(null);
  const employeesFileInputRef = useRef(null);

  // CSV Import states for Sick Notes
  const [sickNotesCsvFile, setSickNotesCsvFile] = useState(null);
  const [sickNotesCsvData, setSickNotesCsvData] = useState(null);
  const [sickNotesCsvErrors, setSickNotesCsvErrors] = useState([]);
  const [isUploadingSickNotes, setIsUploadingSickNotes] = useState(false);
  const [sickNotesUploadProgress, setSickNotesUploadProgress] = useState(0);
  const [sickNotesUploadResult, setSickNotesUploadResult] = useState(null);
  const sickNotesFileInputRef = useRef(null);

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
          is_active: companyData.is_active !== undefined ? companyData.is_active : true,
          max_sick_days: companyData.max_sick_days !== null ? companyData.max_sick_days.toString() : ''
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

  // ===== CSV HELPER FUNCTIONS =====

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      return { headers: [], rows: [], error: 'CSV file must have at least a header row and one data row' };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    return { headers, rows, error: null };
  };

  // ===== EMPLOYEES CSV FUNCTIONS =====

  // Download Employees CSV Template
  const downloadEmployeesTemplate = () => {
    const template = `employee_id,name,department,position,hire_date
EMP001,John Smith,Human Resources,HR Manager,2023-01-15
EMP002,Jane Doe,Engineering,Software Developer,2023-03-20
EMP003,Bob Johnson,Sales,Sales Representative,2023-06-01
`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Validate Employees CSV
  const validateEmployeesCSV = (rows) => {
    const errors = [];
    const employees = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2;

      if (!row.employee_id) {
        errors.push(`Row ${rowNum}: employee_id is required`);
      }
      if (!row.name) {
        errors.push(`Row ${rowNum}: name is required`);
      }

      if (row.hire_date && isNaN(Date.parse(row.hire_date))) {
        errors.push(`Row ${rowNum}: Invalid hire_date format (use YYYY-MM-DD)`);
      }

      if (row.employee_id && row.name) {
        employees.push({
          employee_id: row.employee_id,
          name: row.name,
          department: row.department || null,
          position: row.position || null,
          hire_date: row.hire_date || null
        });
      }
    });

    return { errors, employees };
  };

  // Handle Employees CSV file change
  const handleEmployeesCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setEmployeesCsvFile(null);
      setEmployeesCsvData(null);
      setEmployeesCsvErrors([]);
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setEmployeesCsvErrors(['Please select a valid CSV file']);
      return;
    }

    setEmployeesCsvFile(file);
    setEmployeesCsvErrors([]);
    setEmployeesUploadResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { headers, rows, error } = parseCSV(text);

      if (error) {
        setEmployeesCsvErrors([error]);
        setEmployeesCsvData(null);
        return;
      }

      const requiredHeaders = ['employee_id', 'name'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setEmployeesCsvErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
        setEmployeesCsvData(null);
        return;
      }

      const { errors, employees } = validateEmployeesCSV(rows);
      if (errors.length > 0) {
        setEmployeesCsvErrors(errors);
      }

      setEmployeesCsvData({ rows, employees });
    };
    reader.readAsText(file);
  };

  // Import Employees from CSV
  const handleEmployeesImport = async () => {
    if (!employeesCsvData || employeesCsvErrors.length > 0) {
      setError('Please fix CSV errors before importing');
      return;
    }

    setIsUploadingEmployees(true);
    setEmployeesUploadProgress(0);
    setError('');

    try {
      const employees = employeesCsvData.employees;
      let created = 0;
      let skipped = 0;

      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];

        // Check if employee already exists
        const { data: existing } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId)
          .eq('employee_id', emp.employee_id)
          .single();

        if (existing) {
          skipped++;
        } else {
          const { error: insertError } = await supabase
            .from('employees')
            .insert({
              employee_id: emp.employee_id,
              company_id: companyId,
              name: emp.name,
              department: emp.department,
              position: emp.position,
              hire_date: emp.hire_date,
              is_active: true
            });

          if (!insertError) {
            created++;
          }
        }

        setEmployeesUploadProgress(Math.floor((i + 1) / employees.length * 100));
      }

      setEmployeesUploadResult({ created, skipped });
      setIsUploadingEmployees(false);
      setEmployeesCsvFile(null);
      setEmployeesCsvData(null);

    } catch (err) {
      console.error('Error importing employees:', err);
      setError('Failed to import employees');
      setIsUploadingEmployees(false);
    }
  };

  // ===== SICK NOTES CSV FUNCTIONS =====

  // Download Sick Notes CSV Template
  const downloadSickNotesTemplate = () => {
    const template = `employee_id,start_date,end_date,reason,status
EMP001,2024-01-10,2024-01-12,Flu symptoms,approved
EMP002,2024-02-05,2024-02-06,Doctor appointment,approved
EMP002,2024-03-15,2024-03-18,Back pain,pending
`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sick_notes_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Validate Sick Notes CSV
  const validateSickNotesCSV = (rows) => {
    const errors = [];
    const sickNotes = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2;

      if (!row.employee_id) {
        errors.push(`Row ${rowNum}: employee_id is required`);
      }
      if (!row.start_date) {
        errors.push(`Row ${rowNum}: start_date is required`);
      }
      if (!row.end_date) {
        errors.push(`Row ${rowNum}: end_date is required`);
      }
      if (!row.reason) {
        errors.push(`Row ${rowNum}: reason is required`);
      }

      if (row.start_date && isNaN(Date.parse(row.start_date))) {
        errors.push(`Row ${rowNum}: Invalid start_date format (use YYYY-MM-DD)`);
      }
      if (row.end_date && isNaN(Date.parse(row.end_date))) {
        errors.push(`Row ${rowNum}: Invalid end_date format (use YYYY-MM-DD)`);
      }
      if (row.start_date && row.end_date && new Date(row.end_date) < new Date(row.start_date)) {
        errors.push(`Row ${rowNum}: end_date must be on or after start_date`);
      }

      const validStatuses = ['pending', 'approved', 'rejected', ''];
      if (row.status && !validStatuses.includes(row.status.toLowerCase())) {
        errors.push(`Row ${rowNum}: Invalid status. Must be pending, approved, or rejected`);
      }

      if (row.employee_id && row.start_date && row.end_date && row.reason) {
        sickNotes.push({
          employee_id: row.employee_id,
          start_date: row.start_date,
          end_date: row.end_date,
          reason: row.reason,
          status: row.status?.toLowerCase() || 'pending'
        });
      }
    });

    return { errors, sickNotes };
  };

  // Handle Sick Notes CSV file change
  const handleSickNotesCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSickNotesCsvFile(null);
      setSickNotesCsvData(null);
      setSickNotesCsvErrors([]);
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setSickNotesCsvErrors(['Please select a valid CSV file']);
      return;
    }

    setSickNotesCsvFile(file);
    setSickNotesCsvErrors([]);
    setSickNotesUploadResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { headers, rows, error } = parseCSV(text);

      if (error) {
        setSickNotesCsvErrors([error]);
        setSickNotesCsvData(null);
        return;
      }

      const requiredHeaders = ['employee_id', 'start_date', 'end_date', 'reason'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setSickNotesCsvErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
        setSickNotesCsvData(null);
        return;
      }

      const { errors, sickNotes } = validateSickNotesCSV(rows);
      if (errors.length > 0) {
        setSickNotesCsvErrors(errors);
      }

      setSickNotesCsvData({ rows, sickNotes });
    };
    reader.readAsText(file);
  };

  // Import Sick Notes from CSV
  const handleSickNotesImport = async () => {
    if (!sickNotesCsvData || sickNotesCsvErrors.length > 0) {
      setError('Please fix CSV errors before importing');
      return;
    }

    setIsUploadingSickNotes(true);
    setSickNotesUploadProgress(0);
    setError('');

    try {
      const sickNotes = sickNotesCsvData.sickNotes;
      let created = 0;
      let failed = 0;

      // First, get all employees for this company to map employee_id to database id
      const { data: employees } = await supabase
        .from('employees')
        .select('id, employee_id')
        .eq('company_id', companyId);

      const employeeMap = new Map();
      if (employees) {
        employees.forEach(emp => {
          employeeMap.set(emp.employee_id, emp.id);
        });
      }

      for (let i = 0; i < sickNotes.length; i++) {
        const note = sickNotes[i];

        const dbEmployeeId = employeeMap.get(note.employee_id);
        if (!dbEmployeeId) {
          failed++;
          console.warn(`Employee ${note.employee_id} not found in company`);
        } else {
          const { error: insertError } = await supabase
            .from('sick_notes')
            .insert({
              employee_id: dbEmployeeId,
              company_id: companyId,
              start_date: note.start_date,
              end_date: note.end_date,
              reason: note.reason,
              status: note.status
            });

          if (!insertError) {
            created++;
          } else {
            failed++;
          }
        }

        setSickNotesUploadProgress(Math.floor((i + 1) / sickNotes.length * 100));
      }

      setSickNotesUploadResult({ created, failed });
      setIsUploadingSickNotes(false);
      setSickNotesCsvFile(null);
      setSickNotesCsvData(null);

    } catch (err) {
      console.error('Error importing sick notes:', err);
      setError('Failed to import sick notes');
      setIsUploadingSickNotes(false);
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
        is_active: formData.is_active,
        max_sick_days: formData.max_sick_days ? parseInt(formData.max_sick_days, 10) : null
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
      navigate('/companies/');
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
      <style dangerouslySetInnerHTML={{
        __html: `
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

                  <Col lg={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                        Max Sick Days Per Year
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="max_sick_days"
                        value={formData.max_sick_days}
                        onChange={handleChange}
                        className="h-55 text-secondary"
                        placeholder="e.g., 10 (leave empty for unlimited)"
                        min="0"
                        style={{ fontSize: '12px', border: 'none', borderBottom: '1px solid #D6DAE1', borderRadius: 0, paddingLeft: 0, height: '25px', paddingTop: '4px', paddingBottom: '4px' }}
                      />
                      <Form.Text className="text-muted" style={{ fontSize: '10px' }}>
                        Leave empty for unlimited sick days
                      </Form.Text>
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
                        onClick={() => navigate('/companies/')}
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

          {/* Employees CSV Import Section */}
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                <i className="ri-user-add-line me-2"></i>
                Import Employees from CSV
              </h4>

              <div className="mb-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={downloadEmployeesTemplate}
                  style={{ fontSize: '11px' }}
                >
                  <i className="ri-download-line me-1"></i>
                  Download Template
                </Button>
              </div>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '12px' }}>Select Employees CSV File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={handleEmployeesCsvChange}
                  ref={employeesFileInputRef}
                  style={{ fontSize: '12px' }}
                  disabled={isUploadingEmployees}
                />
              </Form.Group>

              {employeesCsvErrors.length > 0 && (
                <Alert variant="danger" style={{ fontSize: '11px' }}>
                  <strong>Validation Errors:</strong>
                  <ul className="mb-0 mt-1">
                    {employeesCsvErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {employeesCsvErrors.length > 5 && (
                      <li>...and {employeesCsvErrors.length - 5} more errors</li>
                    )}
                  </ul>
                </Alert>
              )}

              {employeesCsvData && employeesCsvErrors.length === 0 && (
                <Alert variant="success" style={{ fontSize: '11px' }}>
                  <strong>Ready to import:</strong> {employeesCsvData.employees.length} employees found
                </Alert>
              )}

              {isUploadingEmployees && (
                <div className="mb-3">
                  <ProgressBar
                    now={employeesUploadProgress}
                    label={`${employeesUploadProgress}%`}
                    animated
                  />
                </div>
              )}

              {employeesUploadResult && (
                <Alert variant="info" style={{ fontSize: '11px' }}>
                  <strong>Import Complete:</strong> {employeesUploadResult.created} employees created, {employeesUploadResult.skipped} skipped (already exist)
                </Alert>
              )}

              <Button
                variant="success"
                size="sm"
                onClick={handleEmployeesImport}
                disabled={!employeesCsvData || employeesCsvErrors.length > 0 || isUploadingEmployees}
                style={{ fontSize: '11px' }}
              >
                {isUploadingEmployees ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Importing...
                  </>
                ) : (
                  <>
                    <i className="ri-upload-2-line me-1"></i>
                    Import Employees
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>

          {/* Sick Notes CSV Import Section */}
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                <i className="ri-file-list-3-line me-2"></i>
                Import Sick Notes from CSV
              </h4>

              <div className="mb-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={downloadSickNotesTemplate}
                  style={{ fontSize: '11px' }}
                >
                  <i className="ri-download-line me-1"></i>
                  Download Template
                </Button>
              </div>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '12px' }}>Select Sick Notes CSV File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={handleSickNotesCsvChange}
                  ref={sickNotesFileInputRef}
                  style={{ fontSize: '12px' }}
                  disabled={isUploadingSickNotes}
                />
                <Form.Text className="text-muted" style={{ fontSize: '10px' }}>
                  Note: Employee IDs must match existing employees in this company
                </Form.Text>
              </Form.Group>

              {sickNotesCsvErrors.length > 0 && (
                <Alert variant="danger" style={{ fontSize: '11px' }}>
                  <strong>Validation Errors:</strong>
                  <ul className="mb-0 mt-1">
                    {sickNotesCsvErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {sickNotesCsvErrors.length > 5 && (
                      <li>...and {sickNotesCsvErrors.length - 5} more errors</li>
                    )}
                  </ul>
                </Alert>
              )}

              {sickNotesCsvData && sickNotesCsvErrors.length === 0 && (
                <Alert variant="success" style={{ fontSize: '11px' }}>
                  <strong>Ready to import:</strong> {sickNotesCsvData.sickNotes.length} sick notes found
                </Alert>
              )}

              {isUploadingSickNotes && (
                <div className="mb-3">
                  <ProgressBar
                    now={sickNotesUploadProgress}
                    label={`${sickNotesUploadProgress}%`}
                    animated
                  />
                </div>
              )}

              {sickNotesUploadResult && (
                <Alert variant="info" style={{ fontSize: '11px' }}>
                  <strong>Import Complete:</strong> {sickNotesUploadResult.created} sick notes created
                  {sickNotesUploadResult.failed > 0 && `, ${sickNotesUploadResult.failed} failed (employee not found)`}
                </Alert>
              )}

              <Button
                variant="success"
                size="sm"
                onClick={handleSickNotesImport}
                disabled={!sickNotesCsvData || sickNotesCsvErrors.length > 0 || isUploadingSickNotes}
                style={{ fontSize: '11px' }}
              >
                {isUploadingSickNotes ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Importing...
                  </>
                ) : (
                  <>
                    <i className="ri-upload-2-line me-1"></i>
                    Import Sick Notes
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditCompany;

