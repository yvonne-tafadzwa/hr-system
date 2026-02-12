import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const TotalOrders = () => {
  const { isSuperAdmin, companyId } = useAuth();
  const [Chart, setChart] = useState();
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [newCompanies, setNewCompanies] = useState(0);
  const [oldCompanies, setOldCompanies] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({ new: [0, 0, 0, 0, 0, 0, 0], old: [0, 0, 0, 0, 0, 0, 0] });
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        setIsLoading(true);

        // ─── Resolve effective company ID ───
        // If companyId from AuthContext is null but user isn't super admin,
        // look it up directly from the database as a fallback
        let effectiveCompanyId = companyId;
        let effectiveIsSuperAdmin = isSuperAdmin;

        if (!effectiveIsSuperAdmin && !effectiveCompanyId) {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Check user metadata first (fastest)
            if (user.user_metadata?.company_id) {
              effectiveCompanyId = user.user_metadata.company_id;
            }
            // Check user_metadata role
            if (user.user_metadata?.role === 'super_admin') {
              effectiveIsSuperAdmin = true;
            }

            // If still no company_id, query user_profiles directly
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

        console.log('[TotalOrders] Resolved:', { effectiveIsSuperAdmin, effectiveCompanyId });

        // ─── Build query ───
        let query = supabase
          .from('companies')
          .select('id, created_at')
          .order('created_at', { ascending: false });

        // Filter by company id if not super admin
        if (!effectiveIsSuperAdmin && effectiveCompanyId) {
          query = query.eq('id', effectiveCompanyId);
        }

        const { data: companies, error } = await query;

        if (error) {
          console.error('Error fetching companies:', error);
          return;
        }

        if (!companies) return;

        const total = companies.length;
        setTotalCompanies(total);

        // Calculate date boundaries
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        fourteenDaysAgo.setHours(0, 0, 0, 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const newCompaniesList = companies.filter(c => new Date(c.created_at) >= sevenDaysAgo);
        const oldCompaniesList = companies.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= thirtyDaysAgo && createdAt < sevenDaysAgo;
        });

        setNewCompanies(newCompaniesList.length);
        setOldCompanies(oldCompaniesList.length);

        // Percentage change
        const previousWeekNew = companies.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= fourteenDaysAgo && createdAt < sevenDaysAgo;
        }).length;

        const currentWeekNew = newCompaniesList.length;
        let change = 0;
        if (previousWeekNew > 0) {
          change = ((currentWeekNew - previousWeekNew) / previousWeekNew) * 100;
        } else if (currentWeekNew > 0) {
          change = 100;
        }
        setPercentageChange(change);

        // Chart data for last 7 days
        const chartDataNew = [];
        const chartDataOld = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          chartDataNew.push(companies.filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= date && createdAt < nextDate;
          }).length);

          chartDataOld.push(companies.filter(c => new Date(c.created_at) < date).length);
        }

        setChartData({ new: chartDataNew, old: chartDataOld });
      } catch (err) {
        console.error('Error fetching companies data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaniesData();
  }, [isSuperAdmin, companyId]);

  const series = [
    { name: "New Companies", data: chartData.new },
    { name: "Old Companies", data: chartData.old },
  ];

  const options = {
    chart: { toolbar: { show: false } },
    colors: ["#1F64F1", "#C2CDFF"],
    plotOptions: { bar: { columnWidth: "85%" } },
    dataLabels: { enabled: false },
    stroke: { width: 2, show: true, colors: ["transparent"] },
    grid: { show: true, borderColor: "#ffffff" },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTicks: { show: false, color: "#ECEEF2" },
      axisBorder: { show: false, color: "#ECEEF2" },
      labels: { show: false, style: { colors: "#8695AA", fontSize: "12px" } },
    },
    yaxis: {
      show: false,
      labels: { style: { colors: "#64748B", fontSize: "12px" } },
      axisBorder: { show: false, color: "#ECEEF2" },
      axisTicks: { show: false, color: "#ECEEF2" },
    },
    tooltip: {
      y: { formatter: function (val) { return val + " companies"; } },
    },
    legend: {
      show: false,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: { horizontal: 8, vertical: 0 },
      labels: { colors: "#64748B" },
      markers: { shape: 'diamond', offsetX: -2, offsetY: -0.5 },
    },
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4 stats-box h-80">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h6 className="mb-0 fs-14">Companies</h6>
              <h3 className="fs-20 mt-1 mb-0">
                {isLoading ? '...' : totalCompanies}
              </h3>
              <span className="fs-12">Last 7 days</span>
            </div>
            <span className={`count fs-10 ${percentageChange >= 0 ? 'up' : ''}`} style={{ fontSize: '10px' }}>
              {isLoading ? '...' : `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`}
            </span>
          </div>

          <div
            style={{
              maxWidth: '153px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '-14px',
              marginTop: '-24px'
            }}
          >
            {Chart && (
              <Chart options={options} series={series} type="bar" height={99} />
            )}
          </div>

          <ul className="ps-0 mb-0 list-unstyled stats-list">
            <li className="d-flex justify-content-between align-items-center">
              <span className="title fs-12">New Companies</span>
              <span className="fs-12">
                {isLoading ? '...' : totalCompanies > 0
                  ? `${Math.round((newCompanies / totalCompanies) * 100)}%`
                  : '0%'}
              </span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="title fs-12">Old Companies</span>
              <span className="fs-12">
                {isLoading ? '...' : totalCompanies > 0
                  ? `${Math.round((oldCompanies / totalCompanies) * 100)}%`
                  : '0%'}
              </span>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default TotalOrders;