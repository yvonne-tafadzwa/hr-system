"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const SpendingBreakdown = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [35, 25, 12, 10, 10, 8];

  const labels = [
    "Groceries",
    "Utilities",
    "Rent",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const options = {
    labels: labels,
    colors: ["#37D80A", "#FE7A36", "#3584FC", "#FF4023", "#AD63F6", "#605DFF"],
    stroke: {
      width: 2,
      show: true,
      colors: ["#ffffff"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
            name: {
              color: "#64748B",
            },
            value: {
              show: true,
              color: "#3A4252",
              fontSize: "28px",
              fontWeight: "600",
              formatter: (val, opts) => {
                if (opts && opts.w && opts.w.globals.seriesTotals) {
                  const total = opts.w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = ((val / total) * 100).toFixed(1); // Calculate percentage
                  return `${val}k (${percentage}%)`; // Show value in currency + percentage
                }
                return `${val}k`; // Fallback if opts is undefined
              },
            },
            total: {
              show: true,
              color: "#64748B",
              formatter: (w) => {
                return `${w.globals.seriesTotals.reduce((a, b) => a + b, 0)}k`; // Show total in currency
              },
            },
          },
        },
      },
    },
    legend: {
      show: true,
      fontSize: "12px",
      position: "left",
      fontFamily: "Inter",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 0,
        vertical: 7,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 7,
        offsetX: -2,
        offsetY: -0.5,
        shape: "diamond",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">Spending Breakdown</h3>

          <Dropdown className="action-opt">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="bg-transparent p-0"
            >
              <i className="ri-more-fill fs-26 text-body lh-1"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu className="bg-white border box-shadow">
              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Day
              </Dropdown.Item>

              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Week
              </Dropdown.Item>

              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Month
              </Dropdown.Item>

              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Year
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="t-chart" style={{ margin: "-4px 0 -4px 0" }}>
          {Chart && (
            <Chart
              options={options}
              series={series}
              type="donut"
              height={284}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default SpendingBreakdown;
