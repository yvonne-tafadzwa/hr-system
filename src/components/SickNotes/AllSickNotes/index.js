"use client";

import React, { useEffect, useState } from "react";
import { Card, Form, Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const AllSickNotes = () => {
  const router = useRouter();
  const { isSuperAdmin, companyId } = useAuth();
  const [sickNotes, setSickNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [resolvedCompanyId, setResolvedCompanyId] = useState(null);
  const [resolvedIsSuperAdmin, setResolvedIsSuperAdmin] = useState(false);
  const itemsPerPage = 10;

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
    const fetchSickNotes = async () => {
      try {
        setIsLoading(true);

        // Resolve company access with fallbacks
        const { effectiveCompanyId, effectiveIsSuperAdmin } = await resolveCompanyAccess();
        setResolvedCompanyId(effectiveCompanyId);
        setResolvedIsSuperAdmin(effectiveIsSuperAdmin);

        console.log('[AllSickNotes] Resolved access:', { effectiveIsSuperAdmin, effectiveCompanyId });

        // Simple query - employees table has: id, employee_id, name, company_id, department, position
        // No email column, user_id is mostly NULL
        let query = supabase
          .from('sick_notes')
          .select(`
            *,
            employees (
              id,
              employee_id,
              name,
              department,
              position
            ),
            companies (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false });

        // Filter by company_id if not super admin
        if (!effectiveIsSuperAdmin && effectiveCompanyId) {
          query = query.eq('company_id', effectiveCompanyId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('[AllSickNotes] Error fetching sick notes:', error);
          setSickNotes([]);
          return;
        }

        console.log('[AllSickNotes] Fetched:', data?.length, 'records');
        if (data && data.length > 0) {
          console.log('[AllSickNotes] Sample record:', data[0]);
        }

        setSickNotes(data || []);

        // Set up real-time subscription
        const subscription = supabase
          .channel('sick-notes-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              let refreshQuery = supabase
                .from('sick_notes')
                .select(`
                  *,
                  employees (
                    id,
                    employee_id,
                    name,
                    department,
                    position
                  ),
                  companies (
                    id,
                    name
                  )
                `)
                .order('created_at', { ascending: false });

              if (!effectiveIsSuperAdmin && effectiveCompanyId) {
                refreshQuery = refreshQuery.eq('company_id', effectiveCompanyId);
              }

              const { data: updatedData } = await refreshQuery;
              setSickNotes(updatedData || []);
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('[AllSickNotes] Exception:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSickNotes();
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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success bg-opacity-10 text-success';
      case 'rejected':
        return 'bg-danger bg-opacity-10 text-danger';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  // Get employee name from employees.name or fallback to employee_id
  const getEmployeeName = (sickNote) => {
    if (sickNote.employees?.name) {
      return sickNote.employees.name;
    }
    if (sickNote.employees?.employee_id) {
      return sickNote.employees.employee_id;
    }
    return '-';
  };

  // Get employee ID
  const getEmployeeId = (sickNote) => {
    return sickNote.employees?.employee_id || '-';
  };

  // Get company name
  const getCompanyName = (sickNote) => {
    return sickNote.companies?.name || '-';
  };

  // Filter sick notes based on search and status
  const filteredSickNotes = sickNotes.filter((note) => {
    const employeeName = getEmployeeName(note).toLowerCase();
    const employeeId = getEmployeeId(note).toLowerCase();
    const companyName = getCompanyName(note).toLowerCase();
    const status = (note.status || '').toLowerCase();

    const matchesSearch =
      employeeName.includes(searchQuery.toLowerCase()) ||
      employeeId.includes(searchQuery.toLowerCase()) ||
      companyName.includes(searchQuery.toLowerCase()) ||
      note.reason?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSickNotes = filteredSickNotes.slice(
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

  const handleView = (noteId) => {
    router.push(`/sick-notes/details/${noteId}`);
  };

  const handleEdit = (noteId) => {
    router.push(`/sick-notes/edit/${noteId}`);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this sick note? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('sick_notes')
          .delete()
          .eq('id', noteId);

        if (error) {
          console.error('Error deleting sick note:', error);
          alert('Failed to delete sick note. Please try again.');
          return;
        }

        setSickNotes(prev => prev.filter(note => note.id !== noteId));
      } catch (err) {
        console.error('Error deleting sick note:', err);
        alert('An error occurred while deleting the sick note.');
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredSickNotes.length === 0) {
      alert('No sick notes to export');
      return;
    }

    // Helper function to escape CSV values
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      // Always wrap in quotes and escape any existing quotes
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Helper function to format date for CSV (YYYY-MM-DD format)
    const formatDateForCSV = (dateString) => {
      if (!dateString) return '""';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '""';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `"${year}-${month}-${day}"`;
    };

    // Build CSV headers - always include Company column for consistency
    const headers = [
      'Employee Name',
      'Employee ID',
      'Company',
      'Start Date',
      'End Date',
      'Reason',
      'Status',
      'Created Date'
    ];

    // Build CSV rows
    const rows = filteredSickNotes.map(note => {
      const row = [
        escapeCSV(getEmployeeName(note)),
        escapeCSV(getEmployeeId(note)),
        escapeCSV(getCompanyName(note)),
        formatDateForCSV(note.start_date),
        formatDateForCSV(note.end_date),
        escapeCSV(note.reason || '-'),
        escapeCSV(note.status || 'Pending'),
        formatDateForCSV(note.created_at)
      ];
      return row.join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Generate filename with date
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    link.download = `sick_notes_export_${dateStr}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
              <Button
                variant="outline-success"
                onClick={exportToCSV}
                className="fw-semibold py-1 px-2"
                style={{ fontSize: '11px' }}
                disabled={filteredSickNotes.length === 0}
              >
                <i className="ri-download-line me-1"></i>
                Export CSV
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/sick-notes/add')}
                className="text-white fw-semibold py-1 px-2"
                style={{ fontSize: '11px' }}
              >
                <i className="ri-add-line me-1"></i>
                Add Sick Note
              </Button>
            </div>
          </div>

          <div className="default-table-area style-two default-table-width">
            <div className="table-responsive" style={{ overflowX: 'hidden' }}>
              <Table className="align-middle" style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Employee</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Employee ID</th>
                    {/* Show Company column only for super admin */}
                    {resolvedIsSuperAdmin && (
                      <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Company</th>
                    )}
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Start Date</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>End Date</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Reason</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Status</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Created Date</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={resolvedIsSuperAdmin ? 9 : 8} className="text-center py-4" style={{ fontSize: '12px' }}>
                        <span className="text-muted">Loading...</span>
                      </td>
                    </tr>
                  ) : currentSickNotes.length === 0 ? (
                    <tr>
                      <td colSpan={resolvedIsSuperAdmin ? 9 : 8} className="text-center py-4" style={{ fontSize: '12px' }}>
                        <span className="text-muted">No sick notes found</span>
                      </td>
                    </tr>
                  ) : (
                    currentSickNotes.map((note) => (
                      <tr key={note.id}>
                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 fw-medium" style={{ fontSize: '12px' }}>
                              {getEmployeeName(note)}
                            </h6>
                          </div>
                        </td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">
                          {getEmployeeId(note)}
                        </td>

                        {/* Show Company column only for super admin */}
                        {resolvedIsSuperAdmin && (
                          <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">
                            {getCompanyName(note)}
                          </td>
                        )}

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{formatDate(note.start_date)}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{formatDate(note.end_date)}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="text-body">
                          {note.reason || '-'}
                        </td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <span
                            className={`badge bg-opacity-10 p-1 fw-normal text-capitalize ${getStatusBadgeClass(note.status)}`}
                            style={{ fontSize: '11px' }}
                          >
                            {note.status || 'Pending'}
                          </span>
                        </td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{formatDate(note.created_at)}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() => handleView(note.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>
                                visibility
                              </span>
                            </button>

                            <button
                              onClick={() => handleEdit(note.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-body" style={{ fontSize: '14px' }}>
                                edit
                              </span>
                            </button>

                            <button
                              onClick={() => handleDelete(note.id)}
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
              {!isLoading && filteredSickNotes.length > 0 && (
                <div className="p-4">
                  <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap">
                    <span className="fs-12 fw-medium">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredSickNotes.length)} of{" "}
                      {filteredSickNotes.length} Results
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
                              filteredSickNotes.length / itemsPerPage
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
                              Math.ceil(filteredSickNotes.length / itemsPerPage)
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

export default AllSickNotes;