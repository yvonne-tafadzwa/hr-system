"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const TotalRevenue = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Revenue",
      data: [15, 11, 29, 54, 24, 37, 14, 29, 11, 14, 29, 48],
    },
  ];

  const categories = [
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
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#757DFF"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      show: true,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisTicks: {
        show: true,
        color: "#DDE4FF",
      },
      axisBorder: {
        show: true,
        color: "#DDE4FF",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (val) => "$" + val + "k",
        style: {
          colors: "#8695AA",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
        color: "#DDE4FF",
      },
      axisTicks: {
        show: false,
        color: "#DDE4FF",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => "$" + val + "k",
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Inter",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 10,
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
    grid: {
      show: true,
      borderColor: "#ECF0FF",
    },
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <div className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <span className="d-block mb-2">Total Revenue</span>

              <div className="d-flex align-items-center gap-2">
                <h3 className="mb-0 fs-32 lh-1">$1,528</h3>
                <div>
                  <span className="d-inline-block bg-success-80 border-success-60 border px-2 rounded-pill text-success-60 fs-12 fw-medium">
                    +5.4%
                  </span>
                </div>
              </div>
            </div>

            <Dropdown className="dropdown select-dropdown">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="dropdown-toggle border text-body rounded-2 bg-gray-100"
              >
                Monthly
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-white border box-shadow">
                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Daily
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Weekly
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Monthly
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Yearly
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div style={{ margin: "-20px 0 -20px -15px" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={320}
              />
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default TotalRevenue;
