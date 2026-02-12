import { useState, useRef } from "react";
import { Row, Col, Card, Form, Button, Modal, ProgressBar, Alert, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerCompanyAction } from "@/app/actions/registerCompany";
import { supabase } from "@/lib/supabase";

const AddCompany = () => {
  const navigate = useNavigate();
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
    is_active: true,
    max_sick_days: ''
  });
  const [error, setError] = useState('');

  // CSV Import states
  const [activeTab, setActiveTab] = useState('manual');
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [csvErrors, setCsvErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState(null);
  const fileInputRef = useRef(null);

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

  // CSV Template Download
  const downloadCsvTemplate = () => {
    const template = `employee_id,employee_name,department,position,hire_date,sick_note_start_date,sick_note_end_date,sick_note_reason,sick_note_status
EMP001,John Smith,Human Resources,HR Manager,2023-01-15,2024-01-10,2024-01-12,Flu symptoms,approved
EMP002,Jane Doe,Engineering,Software Developer,2023-03-20,2024-02-05,2024-02-06,Doctor appointment,approved
EMP002,Jane Doe,Engineering,Software Developer,2023-03-20,2024-03-15,2024-03-18,Back pain,pending
EMP003,Bob Johnson,Sales,Sales Representative,2023-06-01,,,, 
`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company_data_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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

  // Validate CSV data
  const validateCSVData = (rows) => {
    const errors = [];
    const employeeMap = new Map();

    rows.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of 0-index and header row

      // Required fields for employee
      if (!row.employee_id) {
        errors.push(`Row ${rowNum}: employee_id is required`);
      }
      if (!row.employee_name) {
        errors.push(`Row ${rowNum}: employee_name is required`);
      }

      // Validate dates if sick note is provided
      if (row.sick_note_start_date || row.sick_note_end_date || row.sick_note_reason) {
        if (!row.sick_note_start_date) {
          errors.push(`Row ${rowNum}: sick_note_start_date is required when providing sick note data`);
        }
        if (!row.sick_note_end_date) {
          errors.push(`Row ${rowNum}: sick_note_end_date is required when providing sick note data`);
        }
        if (!row.sick_note_reason) {
          errors.push(`Row ${rowNum}: sick_note_reason is required when providing sick note data`);
        }

        // Validate date formats
        if (row.sick_note_start_date && isNaN(Date.parse(row.sick_note_start_date))) {
          errors.push(`Row ${rowNum}: Invalid sick_note_start_date format (use YYYY-MM-DD)`);
        }
        if (row.sick_note_end_date && isNaN(Date.parse(row.sick_note_end_date))) {
          errors.push(`Row ${rowNum}: Invalid sick_note_end_date format (use YYYY-MM-DD)`);
        }
        if (row.sick_note_start_date && row.sick_note_end_date) {
          if (new Date(row.sick_note_end_date) < new Date(row.sick_note_start_date)) {
            errors.push(`Row ${rowNum}: sick_note_end_date must be on or after sick_note_start_date`);
          }
        }

        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected', ''];
        if (row.sick_note_status && !validStatuses.includes(row.sick_note_status.toLowerCase())) {
          errors.push(`Row ${rowNum}: Invalid sick_note_status. Must be pending, approved, or rejected`);
        }
      }

      // Track employees for grouping
      if (row.employee_id) {
        if (!employeeMap.has(row.employee_id)) {
          employeeMap.set(row.employee_id, {
            employee_id: row.employee_id,
            name: row.employee_name,
            department: row.department || null,
            position: row.position || null,
            hire_date: row.hire_date || null,
            sick_notes: []
          });
        }

        // Add sick note if present
        if (row.sick_note_start_date && row.sick_note_end_date && row.sick_note_reason) {
          employeeMap.get(row.employee_id).sick_notes.push({
            start_date: row.sick_note_start_date,
            end_date: row.sick_note_end_date,
            reason: row.sick_note_reason,
            status: row.sick_note_status?.toLowerCase() || 'pending'
          });
        }
      }
    });

    return { errors, employees: Array.from(employeeMap.values()) };
  };

  // Handle CSV file selection
  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCsvFile(null);
      setCsvData(null);
      setCsvErrors([]);
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setCsvErrors(['Please select a valid CSV file']);
      return;
    }

    setCsvFile(file);
    setCsvErrors([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { headers, rows, error } = parseCSV(text);

      if (error) {
        setCsvErrors([error]);
        setCsvData(null);
        return;
      }

      // Check required headers
      const requiredHeaders = ['employee_id', 'employee_name'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setCsvErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
        setCsvData(null);
        return;
      }

      const { errors, employees } = validateCSVData(rows);
      if (errors.length > 0) {
        setCsvErrors(errors);
      }

      setCsvData({ rows, employees });
    };
    reader.readAsText(file);
  };

  // Handle CSV Import
  const handleCsvImport = async () => {
    if (!csvData || csvErrors.length > 0) {
      setError('Please fix CSV errors before importing');
      return;
    }

    // Validate company info
    if (!formData.name || !formData.first_name || !formData.last_name || !formData.position || !formData.login_email || !formData.password) {
      setError('Please fill in all company details first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Step 1: Create the company (10%)
      setUploadProgress(5);

      const result = await registerCompanyAction({
        companyName: formData.name,
        firstName: formData.first_name,
        lastName: formData.last_name,
        position: formData.position,
        email: formData.login_email,
        password: formData.password,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create company');
        setIsUploading(false);
        return;
      }

      setUploadProgress(10);

      // Get the company ID
      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .eq('company_code', result.data.companyCode)
        .single();

      if (!companyData) {
        setError('Failed to retrieve company after creation');
        setIsUploading(false);
        return;
      }

      const companyId = companyData.id;

      // Step 2: Create departments from CSV data (20%)
      const departmentsSet = new Set();
      csvData.employees.forEach(emp => {
        if (emp.department) departmentsSet.add(emp.department);
      });
      // Also add manually entered departments
      departments.filter(d => d.trim()).forEach(d => departmentsSet.add(d.trim()));

      if (departmentsSet.size > 0) {
        const departmentsToInsert = Array.from(departmentsSet).map(name => ({
          company_id: companyId,
          name: name,
          description: null
        }));

        await supabase.from('departments').insert(departmentsToInsert);
      }

      setUploadProgress(20);

      // Step 3: Create employees (60%)
      const employeesData = csvData.employees;
      const employeeIdMap = new Map(); // Map employee_id to database id
      let employeesCreated = 0;
      let sickNotesCreated = 0;

      for (let i = 0; i < employeesData.length; i++) {
        const emp = employeesData[i];

        const { data: empData, error: empError } = await supabase
          .from('employees')
          .insert({
            employee_id: emp.employee_id,
            company_id: companyId,
            name: emp.name,
            department: emp.department,
            position: emp.position,
            hire_date: emp.hire_date || null,
            is_active: true
          })
          .select()
          .single();

        if (empError) {
          console.error(`Error creating employee ${emp.employee_id}:`, empError);
          continue;
        }

        employeesCreated++;
        employeeIdMap.set(emp.employee_id, empData.id);

        // Update progress
        setUploadProgress(20 + Math.floor((i + 1) / employeesData.length * 40));
      }

      setUploadProgress(60);

      // Step 4: Create sick notes (90%)
      let sickNoteErrors = [];
      let totalSickNotes = 0;

      // Count total sick notes first
      employeesData.forEach(emp => {
        totalSickNotes += emp.sick_notes.length;
      });

      let sickNotesProcessed = 0;
      for (const emp of employeesData) {
        const dbEmployeeId = employeeIdMap.get(emp.employee_id);
        if (!dbEmployeeId) continue;

        for (const sickNote of emp.sick_notes) {
          const { error: snError } = await supabase
            .from('sick_notes')
            .insert({
              employee_id: dbEmployeeId,
              company_id: companyId,
              start_date: sickNote.start_date,
              end_date: sickNote.end_date,
              reason: sickNote.reason,
              status: sickNote.status || 'pending'
            });

          if (snError) {
            console.error(`Error creating sick note for ${emp.employee_id}:`, snError);
            sickNoteErrors.push(`Failed to create sick note for ${emp.employee_id}: ${snError.message}`);
          } else {
            sickNotesCreated++;
          }

          sickNotesProcessed++;
          if (totalSickNotes > 0) {
            setUploadProgress(60 + Math.floor(sickNotesProcessed / totalSickNotes * 30));
          }
        }
      }

      setUploadProgress(100);

      // Success
      setUploadStats({
        employeesCreated,
        sickNotesCreated,
        sickNoteErrors
      });
      setRegistrationData(result.data);
      setShowSuccessModal(true);
      setIsUploading(false);

    } catch (err) {
      console.error('CSV Import error:', err);
      setError('An unexpected error occurred during import');
      setIsUploading(false);
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

      // Update max_sick_days if provided
      if (companyData && formData.max_sick_days) {
        await supabase
          .from('companies')
          .update({ max_sick_days: parseInt(formData.max_sick_days, 10) })
          .eq('id', companyData.id);
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
    navigate('/companies/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .add-company-form input::placeholder {
          font-size: 12px !important;
        }
        .nav-tabs .nav-link {
          font-size: 12px;
          padding: 8px 16px;
        }
        .nav-tabs .nav-link.active {
          font-weight: 600;
          color: #0d6efd;
        }
        .csv-upload-zone {
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .csv-upload-zone:hover {
          border-color: #0d6efd;
          background-color: #f8f9fa;
        }
        .csv-upload-zone.has-file {
          border-color: #198754;
          background-color: #d1e7dd;
        }
      `}} />
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '700px', width: '100%' }}>
          <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-4 text-center" style={{ fontSize: '18px', fontWeight: '600' }}>Add Company</h3>

              {error && (
                <div className="alert alert-danger mb-4" role="alert" style={{ fontSize: '12px' }}>
                  {error}
                </div>
              )}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                fill
              >
                <Tab eventKey="manual" title="Manual Entry">
                  <Form onSubmit={handleSubmit} className="add-company-form mt-3">
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
                </Tab>

                <Tab eventKey="csv" title="Import from CSV">
                  <div className="mt-3">
                    {/* Company Details Section */}
                    <div className="mb-4">
                      <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
                        <span className="badge bg-primary me-2">1</span>
                        Company Details
                      </h6>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                              Company Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="e.g., Tech Solutions Inc."
                              style={{ fontSize: '12px' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                              Admin First Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              placeholder="First name"
                              style={{ fontSize: '12px' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                              Admin Last Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              placeholder="Last name"
                              style={{ fontSize: '12px' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                              Position <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="position"
                              value={formData.position}
                              onChange={handleChange}
                              placeholder="e.g., CEO, Manager"
                              style={{ fontSize: '12px' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                              Email <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="login_email"
                              value={formData.login_email}
                              onChange={handleChange}
                              placeholder="admin@company.com"
                              style={{ fontSize: '12px' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label text-secondary" style={{ fontSize: '12px' }}>
                              Password <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Min 6 characters"
                              style={{ fontSize: '12px' }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* CSV Upload Section */}
                    <div className="mb-4">
                      <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
                        <span className="badge bg-primary me-2">2</span>
                        Upload CSV with Employees & Sick Notes
                      </h6>
                      <p className="text-muted mb-3" style={{ fontSize: '12px' }}>
                        Upload a CSV file containing employee information and their sick notes (including historical data from the past).
                      </p>

                      <div className="d-flex gap-2 mb-3">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={downloadCsvTemplate}
                          style={{ fontSize: '11px' }}
                        >
                          <i className="ri-download-line me-1"></i>
                          Download Template
                        </Button>
                      </div>

                      <div
                        className={`csv-upload-zone ${csvFile ? 'has-file' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleCsvFileChange}
                          style={{ display: 'none' }}
                        />
                        {csvFile ? (
                          <div>
                            <span className="material-symbols-outlined text-success mb-2" style={{ fontSize: '32px' }}>
                              check_circle
                            </span>
                            <p className="mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>{csvFile.name}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                              Click to change file
                            </p>
                          </div>
                        ) : (
                          <div>
                            <span className="material-symbols-outlined text-muted mb-2" style={{ fontSize: '32px' }}>
                              cloud_upload
                            </span>
                            <p className="mb-1" style={{ fontSize: '14px' }}>Click to upload CSV file</p>
                            <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                              Supports: employee_id, employee_name, department, position, hire_date, sick notes
                            </p>
                          </div>
                        )}
                      </div>

                      {/* CSV Validation Errors */}
                      {csvErrors.length > 0 && (
                        <Alert variant="danger" className="mt-3" style={{ fontSize: '11px' }}>
                          <Alert.Heading style={{ fontSize: '12px' }}>CSV Validation Errors</Alert.Heading>
                          <ul className="mb-0 ps-3" style={{ maxHeight: '150px', overflow: 'auto' }}>
                            {csvErrors.slice(0, 10).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                            {csvErrors.length > 10 && (
                              <li className="text-muted">...and {csvErrors.length - 10} more errors</li>
                            )}
                          </ul>
                        </Alert>
                      )}

                      {/* CSV Preview */}
                      {csvData && csvErrors.length === 0 && (
                        <Alert variant="success" className="mt-3" style={{ fontSize: '12px' }}>
                          <Alert.Heading style={{ fontSize: '13px' }}>✓ CSV Valid</Alert.Heading>
                          <p className="mb-0">
                            Found <strong>{csvData.employees.length}</strong> employees with{' '}
                            <strong>{csvData.employees.reduce((sum, emp) => sum + emp.sick_notes.length, 0)}</strong> sick notes
                          </p>
                        </Alert>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="mb-4">
                        <h6 className="mb-2" style={{ fontSize: '12px' }}>Importing...</h6>
                        <ProgressBar
                          now={uploadProgress}
                          label={`${uploadProgress}%`}
                          animated
                          striped
                        />
                        <p className="text-muted mt-2 mb-0" style={{ fontSize: '11px' }}>
                          {uploadProgress < 10 && 'Creating company...'}
                          {uploadProgress >= 10 && uploadProgress < 20 && 'Setting up departments...'}
                          {uploadProgress >= 20 && uploadProgress < 60 && 'Creating employees...'}
                          {uploadProgress >= 60 && uploadProgress < 100 && 'Creating sick notes...'}
                          {uploadProgress >= 100 && 'Complete!'}
                        </p>
                      </div>
                    )}

                    {/* Import Button */}
                    <div className="d-flex gap-3">
                      <Button
                        variant="primary"
                        onClick={handleCsvImport}
                        disabled={isUploading || !csvData || csvErrors.length > 0}
                        className="text-white fw-semibold py-2 px-3"
                        style={{ fontSize: '12px' }}
                      >
                        {isUploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Importing...
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-2-line me-1"></i>
                            Import Company & Data
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => navigate('/companies/')}
                        className="fw-semibold py-2 px-3"
                        style={{ fontSize: '12px' }}
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
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

          {/* CSV Import Stats */}
          {uploadStats && (
            <div className="alert alert-success mt-3 mb-0" style={{ fontSize: '12px' }}>
              <strong>Import Summary:</strong>
              <ul className="mb-0 mt-2">
                <li>Employees created: <strong>{uploadStats.employeesCreated}</strong></li>
                <li>Sick notes created: <strong>{uploadStats.sickNotesCreated}</strong></li>
                {uploadStats.sickNoteErrors?.length > 0 && (
                  <li className="text-warning">
                    <strong>{uploadStats.sickNoteErrors.length}</strong> sick notes failed to import
                  </li>
                )}
              </ul>
            </div>
          )}
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
