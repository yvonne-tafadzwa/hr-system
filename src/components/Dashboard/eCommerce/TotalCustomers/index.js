import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const TotalCustomers = () => {
  const { isSuperAdmin, companyId } = useAuth();
  const [Chart, setChart] = useState();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({ new: [0, 0, 0, 0, 0, 0, 0], old: [0, 0, 0, 0, 0, 0, 0] });
  const [percentageChange, setPercentageChange] = useState(0);
  const [dateLabels, setDateLabels] = useState(["", "", "", "", "", "", ""]);

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const fetchEmployeesData = async () => {
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

        console.log('[TotalCustomers] Resolved:', { effectiveIsSuperAdmin, effectiveCompanyId });

        // ─── Build query ───
        let query = supabase
          .from('employees')
          .select('id, created_at, company_id')
          .order('created_at', { ascending: false });

        // Filter by company_id if not super admin
        if (!effectiveIsSuperAdmin && effectiveCompanyId) {
          query = query.eq('company_id', effectiveCompanyId);
        }

        const { data: employees, error } = await query;

        if (error) {
          console.error('Error fetching employees:', error);
          return;
        }

        if (!employees) return;

        const total = employees.length;
        setTotalEmployees(total);

        // Calculate date boundaries
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        fourteenDaysAgo.setHours(0, 0, 0, 0);

        // Percentage change
        const previousWeekEmployees = employees.filter(e => {
          const createdAt = new Date(e.created_at);
          return createdAt >= fourteenDaysAgo && createdAt < sevenDaysAgo;
        }).length;

        const currentWeekEmployees = employees.filter(e => {
          return new Date(e.created_at) >= sevenDaysAgo;
        }).length;

        let change = 0;
        if (previousWeekEmployees > 0) {
          change = ((currentWeekEmployees - previousWeekEmployees) / previousWeekEmployees) * 100;
        } else if (currentWeekEmployees > 0) {
          change = 100;
        }
        setPercentageChange(change);

        // Chart data and labels for last 7 days
        const chartDataNew = [];
        const chartDataOld = [];
        const labels = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          chartDataNew.push(employees.filter(e => {
            const createdAt = new Date(e.created_at);
            return createdAt >= date && createdAt < nextDate;
          }).length);

          chartDataOld.push(employees.filter(e => new Date(e.created_at) < date).length);

          const day = String(date.getDate()).padStart(2, '0');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          labels.push(`${day} ${monthNames[date.getMonth()]}`);
        }

        setChartData({ new: chartDataNew, old: chartDataOld });
        setDateLabels(labels);
      } catch (err) {
        console.error('Error fetching employees data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeesData();
  }, [isSuperAdmin, companyId]);

  const series = [
    { name: "New Employees", data: chartData.new },
    { name: "Old Employees", data: chartData.old },
  ];

  const options = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    colors: ["#605DFF", "#C2CDFF"],
    stroke: { width: 2, curve: "smooth" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    grid: { show: true, borderColor: "#ffffff" },
    xaxis: {
      categories: dateLabels,
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
              <h6 className="mb-0 fs-14">Employees</h6>
              <h3 className="fs-20 mt-1 mb-0">
                {isLoading ? '...' : totalEmployees.toLocaleString()}
              </h3>
              <span className="fs-12">Last 7 days</span>
            </div>
            <span className={`count fs-10 ${percentageChange >= 0 ? 'up' : ''}`} style={{ fontSize: '10px' }}>
              {isLoading ? '...' : `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`}
            </span>
          </div>

          <div
            style={{
              maxWidth: "290px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "-19px",
              marginTop: "-32px",
            }}
          >
            {Chart && (
              <Chart options={options} series={series} type="area" height={140} />
            )}
          </div>

          <div className="d-flex justify-content-between flex-wrap gap-2">
            <span className="fs-12">{dateLabels[0] || ''}</span>
            <span className="fs-12">{dateLabels[6] || ''}</span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default TotalCustomers;