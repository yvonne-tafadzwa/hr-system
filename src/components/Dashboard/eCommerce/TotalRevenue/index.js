import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const TotalRevenue = () => {
  const { isSuperAdmin, companyId } = useAuth();
  const [Chart, setChart] = useState();
  const [totalSickNotes, setTotalSickNotes] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({ approved: [0, 0, 0, 0, 0, 0], pending: [0, 0, 0, 0, 0, 0] });
  const [percentageChange, setPercentageChange] = useState(0);
  const [approvedPercentage, setApprovedPercentage] = useState(0);
  const [pendingPercentage, setPendingPercentage] = useState(0);

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const fetchSickNotesData = async () => {
      try {
        setIsLoading(true);

        // Build query based on user role
        let query = supabase
          .from('sick_notes')
          .select('id, status, created_at, start_date, end_date, company_id')
          .order('created_at', { ascending: false });

        // Filter by company_id if not super admin
        if (!isSuperAdmin && companyId) {
          query = query.eq('company_id', companyId);
        }

        const { data: sickNotes, error } = await query;

        if (error) {
          console.error('Error fetching sick notes:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          return;
        }

        console.log('Fetched sick notes:', sickNotes?.length || 0);
        if (!sickNotes) {
          console.log('No sick notes returned (null)');
          return;
        }

        const total = sickNotes.length;
        setTotalSickNotes(total);

        // Count by status (handle null/undefined status)
        const approved = sickNotes.filter(note => note.status === 'approved').length;
        const pending = sickNotes.filter(note => note.status === 'pending').length;
        const rejected = sickNotes.filter(note => note.status === 'rejected').length;
        const noStatus = sickNotes.filter(note => !note.status).length;

        setApprovedCount(approved);
        setPendingCount(pending);

        // Calculate percentages (if no status, treat as pending for display)
        const displayPending = pending + noStatus;
        const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
        const pendingPct = total > 0 ? Math.round((displayPending / total) * 100) : 0;
        setApprovedCount(approved);
        setPendingCount(displayPending);
        setApprovedPercentage(approvedPct);
        setPendingPercentage(pendingPct);

        // Calculate percentage change (comparing last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        sixtyDaysAgo.setHours(0, 0, 0, 0);

        // Build queries for period comparison with company filtering
        let currentPeriodQuery = supabase
          .from('sick_notes')
          .select('id')
          .gte('created_at', thirtyDaysAgo.toISOString());

        let previousPeriodQuery = supabase
          .from('sick_notes')
          .select('id')
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString());

        // Filter by company_id if not super admin
        if (!isSuperAdmin && companyId) {
          currentPeriodQuery = currentPeriodQuery.eq('company_id', companyId);
          previousPeriodQuery = previousPeriodQuery.eq('company_id', companyId);
        }

        const { data: currentPeriodNotes } = await currentPeriodQuery;
        const { data: previousPeriodNotes } = await previousPeriodQuery;

        const currentTotal = currentPeriodNotes?.length || 0;
        const previousTotal = previousPeriodNotes?.length || 0;

        let change = 0;
        if (previousTotal > 0) {
          change = ((currentTotal - previousTotal) / previousTotal) * 100;
        } else if (currentTotal > 0) {
          change = 100;
        }
        setPercentageChange(change);

        // Generate chart data for last 30 days (grouped into 6 periods of 5 days each)
        const chartDataApproved = [];
        const chartDataPending = [];
        const periodLabels = [];

        // Filter sick notes from last 30 days for chart (reuse thirtyDaysAgo from above)
        const recentSickNotes = sickNotes.filter(note => {
          const createdAt = new Date(note.created_at);
          return createdAt >= thirtyDaysAgo;
        });

        for (let i = 5; i >= 0; i--) {
          const periodEnd = new Date();
          periodEnd.setDate(periodEnd.getDate() - (i * 5));
          periodEnd.setHours(23, 59, 59, 999);
          const periodStart = new Date(periodEnd);
          periodStart.setDate(periodStart.getDate() - 5);
          periodStart.setHours(0, 0, 0, 0);

          const periodApproved = recentSickNotes.filter(note => {
            const createdAt = new Date(note.created_at);
            return createdAt >= periodStart && createdAt <= periodEnd && note.status === 'approved';
          }).length;

          const periodPending = recentSickNotes.filter(note => {
            const createdAt = new Date(note.created_at);
            return createdAt >= periodStart && createdAt <= periodEnd && note.status === 'pending';
          }).length;

          chartDataApproved.push(periodApproved);
          chartDataPending.push(periodPending);

          // Format period label (e.g., "Jan", "Feb")
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[periodStart.getMonth()];
          periodLabels.push(month);
        }

        setChartData({ approved: chartDataApproved, pending: chartDataPending });

        // Set up real-time subscription
        const subscription = supabase
          .channel('sick_notes-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              // Refetch data when sick_notes table changes
              let refreshQuery = supabase
                .from('sick_notes')
                .select('id, status, created_at, company_id')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: false });

              // Filter by company_id if not super admin
              if (!isSuperAdmin && companyId) {
                refreshQuery = refreshQuery.eq('company_id', companyId);
              }

              const { data: updatedSickNotes } = await refreshQuery;

              if (updatedSickNotes) {
                const updatedTotal = updatedSickNotes.length;
                setTotalSickNotes(updatedTotal);

                const updatedApproved = updatedSickNotes.filter(note => note.status === 'approved').length;
                const updatedPending = updatedSickNotes.filter(note => note.status === 'pending').length;

                setApprovedCount(updatedApproved);
                setPendingCount(updatedPending);

                const updatedApprovedPct = updatedTotal > 0 ? Math.round((updatedApproved / updatedTotal) * 100) : 0;
                const updatedPendingPct = updatedTotal > 0 ? Math.round((updatedPending / updatedTotal) * 100) : 0;
                setApprovedPercentage(updatedApprovedPct);
                setPendingPercentage(updatedPendingPct);

                // Recalculate chart data
                const updatedChartDataApproved = [];
                const updatedChartDataPending = [];

                for (let i = 5; i >= 0; i--) {
                  const periodEnd = new Date();
                  periodEnd.setDate(periodEnd.getDate() - (i * 5));
                  periodEnd.setHours(23, 59, 59, 999);
                  const periodStart = new Date(periodEnd);
                  periodStart.setDate(periodStart.getDate() - 5);
                  periodStart.setHours(0, 0, 0, 0);

                  const periodApproved = updatedSickNotes.filter(note => {
                    const createdAt = new Date(note.created_at);
                    return createdAt >= periodStart && createdAt <= periodEnd && note.status === 'approved';
                  }).length;

                  const periodPending = updatedSickNotes.filter(note => {
                    const createdAt = new Date(note.created_at);
                    return createdAt >= periodStart && createdAt <= periodEnd && note.status === 'pending';
                  }).length;

                  updatedChartDataApproved.push(periodApproved);
                  updatedChartDataPending.push(periodPending);
                }

                setChartData({ approved: updatedChartDataApproved, pending: updatedChartDataPending });
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching sick notes data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSickNotesData();
  }, [isSuperAdmin, companyId]);

  const series = [
    {
      name: "Approved",
      data: chartData.approved,
    },
    {
      name: "Pending",
      data: chartData.pending,
    },
  ];

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "55%",
      },
    },
    colors: ["#605DFF", "#C2CDFF"],
    grid: {
      show: true,
      borderColor: "#ffffff",
    },
    stroke: {
      width: 2,
      show: true,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // These will be dynamically generated but keeping format
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: false,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
    },
    legend: {
      show: false,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        shape: 'diamond',
        offsetX: -2,
        offsetY: -0.5,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4 stats-box h-80">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h6 className="mb-0 fs-14">Sick Notes</h6>
              <h3 className="fs-20 mt-1 mb-0">
                {isLoading ? '...' : totalSickNotes.toLocaleString()}
              </h3>
              <span className="fs-12">Last 30 days</span>
            </div>
            <span className={`count fs-10 ${percentageChange >= 0 ? 'up' : ''}`} style={{ fontSize: '10px' }}>
              {isLoading ? '...' : `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`}
            </span>
          </div>

          <div
            style={{
              maxWidth: "196px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "-19px",
              marginTop: "-32px",
            }}
          >
            {Chart && (
              <Chart options={options} series={series} type="bar" height={112} />
            )}
          </div>

          <ul className="ps-0 mb-0 list-unstyled stats-list">
            <li className="d-flex justify-content-between align-items-center">
              <span className="title fs-12">Approved</span>
              <span className="fs-12">{isLoading ? '...' : `${approvedPercentage}%`}</span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <span className="title fs-12">Pending</span>
              <span className="fs-12">{isLoading ? '...' : `${pendingPercentage}%`}</span>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default TotalRevenue;
