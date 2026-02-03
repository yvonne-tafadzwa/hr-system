"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Pagination from "./Pagination";

const AllCompanies = () => {
  const router = useRouter();
  const { isSuperAdmin, companyId } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [resolvedCompanyId, setResolvedCompanyId] = useState(null);
  const [resolvedIsSuperAdmin, setResolvedIsSuperAdmin] = useState(false);

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

  // Helper: fetch companies with counts
  const fetchCompaniesWithCounts = async (companiesData) => {
    return Promise.all(
      companiesData.map(async (company) => {
        const [employeeCountResult, sickNotesCountResult] = await Promise.all([
          supabase
            .from('employees')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('is_active', true),
          supabase
            .from('sick_notes')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
        ]);

        const employeeCount = employeeCountResult.error ? 0 : (employeeCountResult.count || 0);
        const sickNotesCount = sickNotesCountResult.error ? 0 : (sickNotesCountResult.count || 0);

        return {
          ...company,
          employeeCount,
          sickNotesCount
        };
      })
    );
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);

        // Resolve company access with fallbacks
        const { effectiveCompanyId, effectiveIsSuperAdmin } = await resolveCompanyAccess();
        setResolvedCompanyId(effectiveCompanyId);
        setResolvedIsSuperAdmin(effectiveIsSuperAdmin);

        console.log('[AllCompanies] Resolved access:', { effectiveIsSuperAdmin, effectiveCompanyId });

        // Build query based on resolved role
        let query = supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false });

        // Filter by company id if not super admin
        if (!effectiveIsSuperAdmin && effectiveCompanyId) {
          query = query.eq('id', effectiveCompanyId);
        }

        const { data: companiesData, error } = await query;

        if (error) {
          console.error('Error fetching companies:', error);
          setCompanies([]);
          return;
        }

        if (companiesData) {
          const companiesWithCounts = await fetchCompaniesWithCounts(companiesData);
          setCompanies(companiesWithCounts);
        }

        // Set up real-time subscriptions
        const companiesSubscription = supabase
          .channel('companies-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'companies' },
            async () => {
              let refreshQuery = supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });

              if (!effectiveIsSuperAdmin && effectiveCompanyId) {
                refreshQuery = refreshQuery.eq('id', effectiveCompanyId);
              }

              const { data: updatedCompanies } = await refreshQuery;

              if (updatedCompanies) {
                const companiesWithCounts = await fetchCompaniesWithCounts(updatedCompanies);
                setCompanies(companiesWithCounts);
              }
            }
          )
          .subscribe();

        const employeesSubscription = supabase
          .channel('employees-count-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'employees' },
            async () => {
              let refreshQuery = supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });

              if (!effectiveIsSuperAdmin && effectiveCompanyId) {
                refreshQuery = refreshQuery.eq('id', effectiveCompanyId);
              }

              const { data: allCompanies } = await refreshQuery;

              if (allCompanies) {
                const companiesWithCounts = await fetchCompaniesWithCounts(allCompanies);
                setCompanies(companiesWithCounts);
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
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });

              if (!effectiveIsSuperAdmin && effectiveCompanyId) {
                refreshQuery = refreshQuery.eq('id', effectiveCompanyId);
              }

              const { data: allCompanies } = await refreshQuery;

              if (allCompanies) {
                const companiesWithCounts = await fetchCompaniesWithCounts(allCompanies);
                setCompanies(companiesWithCounts);
              }
            }
          )
          .subscribe();

        return () => {
          companiesSubscription.unsubscribe();
          employeesSubscription.unsubscribe();
          sickNotesSubscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(companies.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleView = (companyId) => {
    router.push(`/companies/details/${companyId}`);
  };

  const handleEdit = (companyId) => {
    router.push(`/companies/edit/${companyId}`);
  };

  const handleDelete = async (companyIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('companies')
          .delete()
          .eq('id', companyIdToDelete);

        if (error) {
          console.error('Error deleting company:', error);
          alert('Failed to delete company. Please try again.');
          return;
        }

        // Refresh the companies list
        let refreshQuery = supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false });

        if (!resolvedIsSuperAdmin && resolvedCompanyId) {
          refreshQuery = refreshQuery.eq('id', resolvedCompanyId);
        }

        const { data: companiesData } = await refreshQuery;

        if (companiesData) {
          const companiesWithCounts = await fetchCompaniesWithCounts(companiesData);
          setCompanies(companiesWithCounts);
        }
      } catch (err) {
        console.error('Error deleting company:', err);
        alert('An error occurred while deleting the company.');
      }
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-0">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h3 className="mb-0" style={{ fontSize: '14px' }}>
                {resolvedIsSuperAdmin ? 'All Companies' : 'My Company'}
              </h3>
              {/* Only show Add Company button for super admin */}
              {resolvedIsSuperAdmin && (
                <Link href="/companies/add-company">
                  <Button variant="primary" className="text-white fw-semibold py-1 px-2" style={{ fontSize: '11px' }}>
                    <i className="ri-add-line me-1" style={{ fontSize: '12px' }}></i>
                    Add Company
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="default-table-area style-two all-projects">
            <div className="table-responsive" style={{ overflowX: 'hidden' }}>
              <Table className="align-middle" style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Company</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Code</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Email</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Employees</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Sick Notes</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Created Date</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Status</th>
                    <th scope="col" style={{ fontSize: '12px', padding: '10px 8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4" style={{ fontSize: '12px' }}>
                        <span className="text-muted">Loading...</span>
                      </td>
                    </tr>
                  ) : currentCompanies.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4" style={{ fontSize: '12px' }}>
                        <span className="text-muted">No companies found</span>
                      </td>
                    </tr>
                  ) : (
                    currentCompanies.map((company) => (
                      <tr key={company.id}>
                        <td style={{ fontSize: '12px', padding: '10px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                          <span className="fw-medium">{company.name || '-'}</span>
                        </td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>{company.company_code || '-'}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }} className="text-body">{company.login_email || '-'}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{company.employeeCount || 0}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{company.sickNotesCount || 0}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }} className="text-body">{formatDate(company.created_at)}</td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <span
                            className={`badge ${getStatusBadgeClass(company.is_active)} p-1 fs-11 fw-normal text-capitalize`}
                            style={{ fontSize: '11px' }}
                          >
                            {company.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td style={{ fontSize: '12px', padding: '10px 8px' }}>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() => handleView(company.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>
                                visibility
                              </span>
                            </button>

                            <button
                              onClick={() => handleEdit(company.id)}
                              className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined text-body" style={{ fontSize: '14px' }}>
                                edit
                              </span>
                            </button>

                            {/* Only show delete button for super admin */}
                            {resolvedIsSuperAdmin && (
                              <button
                                onClick={() => handleDelete(company.id)}
                                className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                                style={{ cursor: 'pointer' }}
                              >
                                <span className="material-symbols-outlined text-danger" style={{ fontSize: '14px' }}>
                                  delete
                                </span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {!isLoading && companies.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={companies.length}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default AllCompanies;