"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CompanyDetails = ({ companyId }) => {
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const fetchCompanyDetails = async () => {
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
        setCompany(companyData);

        // Fetch departments for this company
        const { data: departmentsData } = await supabase
          .from('departments')
          .select('*')
          .eq('company_id', companyId)
          .order('name', { ascending: true });

        if (departmentsData) {
          setDepartments(departmentsData);
        }

        // Fetch employee count
        const { count: employeeCount } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyId)
          .eq('is_active', true);

        // Fetch sick notes count
        const { count: sickNotesCount } = await supabase
          .from('sick_notes')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyId);

        setCompany(prev => ({
          ...prev,
          employeeCount: employeeCount || 0,
          sickNotesCount: sickNotesCount || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching company details:', err);
      setError('An error occurred while loading company data');
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

  if (error || !company) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <span className="text-danger">{error || 'Company not found'}</span>
          <br />
          <Button
            variant="secondary"
            onClick={() => router.push('/companies/')}
            className="mt-3"
          >
            Back to Companies
          </Button>
        </div>
      </div >
    );
  }

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0" style={{ fontSize: '14px' }}>Company Details</h3>
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={() => router.push(`/companies/edit/${companyId}`)}
                className="text-white"
                style={{ fontSize: '12px' }}
              >
                <i className="ri-edit-line me-1"></i>
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/companies/')}
                style={{ fontSize: '12px' }}
              >
                Back
              </Button>
            </div>
          </div>

          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Company Name</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{company.name || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Company Code</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{company.company_code || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Email</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{company.login_email || '-'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Status</label>
                <p className="mb-0">
                  <span
                    className={`badge ${company.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} p-1 fs-11 fw-normal text-capitalize`}
                    style={{ fontSize: '11px' }}
                  >
                    {company.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Employees</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{company.employeeCount || 0}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Sick Notes</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{company.sickNotesCount || 0}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Created Date</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>{formatDate(company.created_at)}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Max Sick Days Per Year</label>
                <p className="mb-0" style={{ fontSize: '12px' }}>
                  {company.max_sick_days !== null && company.max_sick_days !== undefined
                    ? `${company.max_sick_days} days`
                    : 'Unlimited'}
                </p>
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <label className="text-secondary fw-medium" style={{ fontSize: '12px' }}>Departments</label>
                {departments.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {departments.map((dept, index) => (
                      <span
                        key={index}
                        className="badge bg-primary bg-opacity-10 text-primary p-2"
                        style={{ fontSize: '11px' }}
                      >
                        {dept.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>No departments assigned</p>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card >
    </>
  );
};

export default CompanyDetails;

