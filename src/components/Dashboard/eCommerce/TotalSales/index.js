"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, Form } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const TotalSales = () => {
  const { isSuperAdmin, companyId } = useAuth();
  const [Chart, setChart] = useState();
  const [currentMonthData, setCurrentMonthData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [lastMonthData, setLastMonthData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const fetchMonthlySickNotes = async () => {
      try {
        setIsLoading(true);
        
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        
        // Fetch all sick notes for current year
        const currentYearStart = new Date(currentYear, 0, 1);
        const currentYearEnd = new Date(currentYear, 11, 31, 23, 59, 59);
        
        // Fetch December of previous year for January comparison
        const previousYearDecStart = new Date(previousYear, 11, 1);
        const previousYearDecEnd = new Date(previousYear, 11, 31, 23, 59, 59);

        // Build queries with company filtering
        let currentYearQuery = supabase
          .from('sick_notes')
          .select('created_at, company_id')
          .gte('created_at', currentYearStart.toISOString())
          .lte('created_at', currentYearEnd.toISOString());

        let previousYearDecQuery = supabase
          .from('sick_notes')
          .select('created_at, company_id')
          .gte('created_at', previousYearDecStart.toISOString())
          .lte('created_at', previousYearDecEnd.toISOString());

        // Filter by company_id if not super admin
        if (!isSuperAdmin && companyId) {
          currentYearQuery = currentYearQuery.eq('company_id', companyId);
          previousYearDecQuery = previousYearDecQuery.eq('company_id', companyId);
        }

        // Fetch sick notes for current year and December of previous year
        const [currentYearNotes, previousYearDecNotes] = await Promise.all([
          currentYearQuery,
          previousYearDecQuery
        ]);

        if (currentYearNotes.error) {
          console.error('Error fetching current year sick notes:', currentYearNotes.error);
          return;
        }

        if (previousYearDecNotes.error) {
          console.error('Error fetching previous year December sick notes:', previousYearDecNotes.error);
          return;
        }

        // Initialize arrays for 12 months
        const currentMonthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const lastMonthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // Count sick notes per month for current year
        if (currentYearNotes.data) {
          currentYearNotes.data.forEach(note => {
            const date = new Date(note.created_at);
            const month = date.getMonth(); // 0-11
            currentMonthCounts[month]++;
          });
        }

        // Count December of previous year for January comparison
        let previousDecCount = 0;
        if (previousYearDecNotes.data) {
          previousDecCount = previousYearDecNotes.data.length;
        }

        // Build lastMonthCounts array:
        // Jan position = Dec of previous year
        // Feb position = Jan of current year
        // Mar position = Feb of current year
        // etc.
        lastMonthCounts[0] = previousDecCount; // January shows December of previous year
        for (let i = 1; i < 12; i++) {
          lastMonthCounts[i] = currentMonthCounts[i - 1]; // Each month shows previous month
        }

        setCurrentMonthData(currentMonthCounts);
        setLastMonthData(lastMonthCounts);

        // Set up real-time subscription
        const subscription = supabase
          .channel('sick_notes-monthly-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sick_notes' },
            async () => {
              // Build refresh queries with company filtering
              let refreshCurrentYearQuery = supabase
                .from('sick_notes')
                .select('created_at, company_id')
                .gte('created_at', currentYearStart.toISOString())
                .lte('created_at', currentYearEnd.toISOString());

              let refreshPreviousDecQuery = supabase
                .from('sick_notes')
                .select('created_at, company_id')
                .gte('created_at', previousYearDecStart.toISOString())
                .lte('created_at', previousYearDecEnd.toISOString());

              // Filter by company_id if not super admin
              if (!isSuperAdmin && companyId) {
                refreshCurrentYearQuery = refreshCurrentYearQuery.eq('company_id', companyId);
                refreshPreviousDecQuery = refreshPreviousDecQuery.eq('company_id', companyId);
              }

              const [updatedCurrentYear, updatedPreviousDec] = await Promise.all([
                refreshCurrentYearQuery,
                refreshPreviousDecQuery
              ]);

              if (updatedCurrentYear.data && updatedPreviousDec.data) {
                const updatedCurrentCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const updatedLastCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                updatedCurrentYear.data.forEach(note => {
                  const date = new Date(note.created_at);
                  const month = date.getMonth();
                  updatedCurrentCounts[month]++;
                });

                const updatedPreviousDecCount = updatedPreviousDec.data.length;
                updatedLastCounts[0] = updatedPreviousDecCount;
                for (let i = 1; i < 12; i++) {
                  updatedLastCounts[i] = updatedCurrentCounts[i - 1];
                }

                setCurrentMonthData(updatedCurrentCounts);
                setLastMonthData(updatedLastCounts);
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching monthly sick notes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlySickNotes();
  }, [isSuperAdmin, companyId]);

  const maxValue = useMemo(() => {
    const currentMax = currentMonthData.length > 0 ? Math.max(...currentMonthData) : 0;
    const lastMax = lastMonthData.length > 0 ? Math.max(...lastMonthData) : 0;
    return Math.max(currentMax, lastMax, 10);
  }, [currentMonthData, lastMonthData]);

  const series = useMemo(() => [
    {
      name: "This Month",
      data: currentMonthData,
    },
    {
      name: "Last Month",
      data: lastMonthData,
    },
  ], [currentMonthData, lastMonthData]);

  const options = useMemo(() => ({
    chart: {
      zoom: {
        enabled: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    colors: ["#605DFF", "#DDE4FF"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
      dashArray: [0, 6],
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      max: maxValue > 0 ? Math.ceil(maxValue * 1.1) : 10,
      min: 0,
      labels: {
        formatter: (val) => {
          return Math.round(val);
        },
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
      show: true,
      position: "top",
      fontSize: "12px",
      horizontalAlign: "left",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        shape: 'diamond',
        radius: 2,
        offsetX: -2,
        offsetY: -0.5,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " sick notes";
        },
      },
    },
  }), [maxValue]);

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4 z-0 h-100">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 mb-lg-30">
            <h3 className="mb-0" style={{ fontSize: '14px' }}>Total Sick Notes</h3>
            <Form.Select
              className="month-select form-control"
              aria-label="Default select example"
            >
              <option defaultValue="0">Select</option>
              <option defaultValue="1">Today</option>
              <option defaultValue="2">Weekly</option>
              <option defaultValue="3">Monthly</option>
              <option defaultValue="4">Yearly</option>
            </Form.Select>
          </div>

          <div
            style={{
              marginBottom: "-15px",
              marginLeft: "-10px",
              marginTop: "-5px",
            }}
          >
            {Chart && !isLoading && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={280}
              />
            )}
            {isLoading && (
              <div className="text-center py-5">
                <span className="text-muted">Loading...</span>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default TotalSales;
