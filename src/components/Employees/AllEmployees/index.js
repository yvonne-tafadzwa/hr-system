import React, { useEffect, useState } from "react";
import { Card, Form, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const AllEmployees = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, companyId } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [resolvedCompanyId, setResolvedCompanyId] = useState(null);
  const [resolvedIsSuperAdmin, setResolvedIsSuperAdmin] = useState(false);
  const itemsPerPage = 10;

  // Helper: resolve company ID with fallbacks (same pattern as dashboard cards)
  const resolveCompanyAccess = async () => {
    let effectiveCompanyId = companyId;
    let effectiveIsSuperAdmin = isSuperAdmin;

    if (!effectiveIsSuperAdmin && !effectiveCompanyId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check user_metadata first
        if (user.user_metadata?.company_id) {
          effectiveCompanyId = user.user_metadata.company_id;
        }
        if (user.user_metadata?.role === 'super_admin') {
          effectiveIsSuperAdmin = true;
        }

        // If still no company_id, query user_profiles
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

        // Last resort: find company by login email
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

  // Helper: fetch employees with sick notes count
  const fetchEmployeesWithCounts = async (employeesData) => {
    return Promise.all(
      employeesData.map(async (employee) => {
        const { count, error: countError } = await supabase
          .from('sick_notes')
          .select('*', { count: 'exact', head: true })
          .eq('employee_id', employee.id);

        if (countError) {
          console.error('Error fetching sick notes count:', countError);
          return { ...employee, sickNotesCount: 0 };
        }

        return { ...employee, sickNotesCount: count || 0 };
      })
    );
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);

        // Resolve company access with fallbacks
        const { effectiveCompanyId, effectiveIsSuperAdmin } = await resolveCompanyAccess();
        setResolvedCompanyId(effectiveCompanyId);
        setResolvedIsSuperAdmin(effectiveIsSuperAdmin);

        console.log('[AllEmployees] Resolved access:', { effectiveIsSuperAdmin, effectiveCompanyId });

        // Build query based on resolved role
        let query = supabase
          .from('employees')
          .select(`
            *,
            companies(name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Filter by company_id if not super admin
        if (!effectiveIsSuperAdmin && effectiveCompanyId) {
          query = query.eq('company_id', effectiveCompanyId);
        }

        const { data: employeesData, error } = await query;

        if (error) {
          console.error('Error fetching employees:', error);
          setEmployees([]);
          return;
        }

        if (employeesData) {
          const employeesWithCounts = await fetchEmployeesWithCounts(employeesData);
          setEmployees(employeesWithCounts);
        }

        // Set up real-time subscriptions
        const employeesSubscription = supabase
          .channel('employees-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'employees' },
            async () => {
              let refreshQuery = supabase
                .from('employees')
                .select(`
                  *,
                  companies(name)
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

              if (!effectiveIsSuperAdmin && effectiveCompanyId) {
                refreshQuery = refreshQuery.eq('company_id', effectiveCompanyId);
              }

              const { data: updatedEmployees } = await refreshQuery;

              if (updatedEmployees) {
                const employeesWithCounts = await fetchEmployeesWithCounts(updatedEmployees);
                setEmployees(employeesWithCounts);
              }
            }
          )
          .subscribe();

        const sickNotesSubscription = supabase
          .channel('sick-notes-count-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              let refreshQuery = supabase
                .from('employees')
                .select(`
                  *,
                  companies(name)
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

              if (!effectiveIsSuperAdmin && effectiveCompanyId) {
                refreshQuery = refreshQuery.eq('company_id', effectiveCompanyId);
              }

              const { data: allEmployees } = await refreshQuery;

              if (allEmployees) {
                const employeesWithCounts = await fetchEmployeesWithCounts(allEmployees);
                setEmployees(employeesWithCounts);
              }
            }
          )
          .subscribe();

        return () => {
          employeesSubscription.unsubscribe();
          sickNotesSubscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [isSuperAdmin, companyId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive
      ? 'bg-success bg-opacity-10 text-success'
      : 'bg-danger bg-opacity-10 text-danger';
  };

  const getEmployeeName = (employee) => {
    return employee.name || '-';
  };

  const getCompanyName = (employee) => {
    if (employee.companies) {
      return employee.companies.name || '-';
    }
    return '-';
  };

  // Filter employees based on search and status
  const filteredEmployees = employees.filter((employee) => {
    const employeeName = getEmployeeName(employee).toLowerCase();
    const companyName = getCompanyName(employee).toLowerCase();
    const isActive = employee.is_active;

    const matchesSearch =
      employeeName.includes(searchQuery.toLowerCase()) ||
      companyName.includes(searchQuery.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleView = (employeeId) => {
    navigate(`/employees/details/${employeeId}`);
  };

  const handleEdit = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', employeeId);

        if (error) {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Please try again.');
          return;
        }

        // Refresh the employees list
        let refreshQuery = supabase
          .from('employees')
          .select(`
            *,
            companies(name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!resolvedIsSuperAdmin && resolvedCompanyId) {
          refreshQuery = refreshQuery.eq('company_id', resolvedCompanyId);
        }

        const { data: employeesData } = await refreshQuery;

        if (employeesData) {
          const employeesWithCounts = await fetchEmployeesWithCounts(employeesData);
          setEmployees(employeesWithCounts);
        }
      } catch (err) {
        console.error('Error deleting employee:', err);
        alert('An error occurred while deleting the employee.');
      }
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-4">
            <Form className="position-relative table-src-form me-0">
              <Form.Control
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <span className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y">
                search
              </span>
            </Form>

            <div className="d-flex align-items-center gap-2">
              <Form.Select
                className="month-select form-control"
                aria-label="Status filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                style={{ width: 'auto' }}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
              <Button
                variant="primary"
                onClick={() => navigate('/employees/add')}
                className="text-white fw-semibold py-1 px-2"
                style={{ fontSize: '11px' }}
              >
                <i className="ri-add-line me-1"></i>
                Add Employee
              </Button>
            </div>
          </div>

          <div className="default-table-area style-two default-table-width">
            <div className="table-responsive" style={{ overflowX: 'hidden' }}>
              <Table className="align-middle" style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Employee</th>
                    {/* Only show Company column for super admin */}
                    {resolvedIsSuperAdmin && (
                      <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Company</th>
                    )}
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Employee ID</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Department</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Sick Notes</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Created Date</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Status</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={resolvedIsSuperAdmin ? 8 : 7} className="text-center py-4" style={{ fontSize: '12px' }}>
                        <span className="text-muted">Loading...</span>
                      </td>
                    </tr>
                  ) : currentEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={resolvedIsSuperAdmin ? 8 : 7} className="text-center py-4" style={{ fontSize: '12px' }}>
                        <span className="text-muted">No employees found</span>
                      </td>
                    </tr>
                  ) : (
                    currentEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 fw-medium" style={{ fontSize: '12px' }}>
                              {getEmployeeName(employee)}
                            </h6>
                          </div>
                        </td>

                        {/* Only show Company column for super admin */}
                        {resolvedIsSuperAdmin && (
                          <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{getCompanyName(employee)}</td>
                        )}

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{employee.employee_id || '-'}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{employee.department || '-'}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{employee.sickNotesCount || 0}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{formatDate(employee.created_at)}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <span
                            className={`badge bg-opacity-10 p-1 fw-normal text-capitalize ${getStatusBadgeClass(employee.is_active)}`}
                            style={{ fontSize: '11px' }}
                          >
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() => handleView(employee.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>
                                visibility
                              </span>
                            </button>

                            <button
                              onClick={() => handleEdit(employee.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-body" style={{ fontSize: '14px' }}>
                                edit
                              </span>
                            </button>

                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-danger" style={{ fontSize: '14px' }}>
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {!isLoading && filteredEmployees.length > 0 && (
                <div className="p-4">
                  <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap">
                    <span className="fs-12 fw-medium">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
                      {filteredEmployees.length} Results
                    </span>

                    <nav aria-label="Page navigation example">
                      <ul className="pagination mb-0 justify-content-center">
                        <li className="page-item">
                          <button
                            className="page-link icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <span className="material-symbols-outlined">
                              keyboard_arrow_left
                            </span>
                          </button>
                        </li>

                        {Array.from(
                          {
                            length: Math.ceil(
                              filteredEmployees.length / itemsPerPage
                            ),
                          },
                          (_, i) => (
                            <li className="page-item" key={i + 1}>
                              <button
                                className={`page-link ${currentPage === i + 1 ? "active" : ""
                                  }`}
                                onClick={() => handlePageChange(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          )
                        )}

                        <li className="page-item">
                          <button
                            className="page-link icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredEmployees.length / itemsPerPage)
                            }
                          >
                            <span className="material-symbols-outlined">
                              keyboard_arrow_right
                            </span>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default AllEmployees;