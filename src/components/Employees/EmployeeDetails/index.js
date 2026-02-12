import { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const EmployeeDetails = ({ employeeId }) => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setIsLoading(true);

      // Fetch employee data
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select(`
          *,
          companies(name, company_code)
        `)
        .eq('id', employeeId)
        .single();

      if (employeeError) {
        console.error('Error fetching employee:', employeeError);
        setError('Failed to load employee data');
        return;
      }

      if (employeeData) {
        // Fetch sick notes count
        const { count: sickNotesCount } = await supabase
          .from('sick_notes')
          .select('*', { count: 'exact', head: true })
          .eq('employee_id', employeeId);

        setEmployee({
          ...employeeData,
          sickNotesCount: sickNotesCount || 0
        });
      }
    } catch (err) {
      console.error('Error fetching employee details:', err);
      setError('An error occurred while loading employee data');
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <span className="text-muted">Loading...</span>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <span className="text-danger">{error || 'Employee not found'}</span>
          <br />
          <Button
            variant="secondary"
            onClick={() => navigate('/employees/')}
            className="mt-3"
          >
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0" style={{ fontSize: '14px' }}>Employee Details</h3>
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={() => navigate(`/employees/edit/${employeeId}`)}
                className="text-white"
                style={{ fontSize: '12px' }}
              >
                <i className="ri-edit-line me-1"></i>
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/employees/')}
                style={{ fontSize: '12px' }}
              >
                Back
              </Button>
            </div>
          </div>

          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Name</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{employee.name || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Employee ID</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{employee.employee_id || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Company</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>
                  {employee.companies?.name || '-'}
                  {employee.companies?.company_code && ` (${employee.companies.company_code})`}
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Department</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{employee.department || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Sick Notes</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{employee.sickNotesCount || 0}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Status</label>
                <p className="mb-0">
                  <span
                    className={`badge ${employee.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} p-1 fs-11 fw-normal text-capitalize`}
                    style={{ fontSize: '11px' }}
                  >
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Created Date</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{formatDate(employee.created_at)}</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default EmployeeDetails;

