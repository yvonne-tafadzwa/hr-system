"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const PerformanceMetrics = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Revenue",
      data: [120, 130, 140, 155, 165, 175, 185, 190, 200, 205, 200, 225],
    },
    {
      name: "Expenses",
      data: [10, 20, 30, 40, 50, 60, 70, 70, 90, 100, 110, 90],
    },
    { name: "Profit", data: [0, 5, 10, 15, 20, 25, 30, 35, 25, 45, 50, 55] },
  ];

  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#37D80A", "#FF4023", "#605DFF"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: "smooth",
      dashArray: [0, 0, 0],
    },
    markers: {
      size: 3,
      hover: {
        sizeOffset: 3,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val + "k";
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    xaxis: {
      categories: categories,
      axisTicks: {
        show: true,
        color: "#64748B",
      },
      axisBorder: {
        show: true,
        color: "#64748B",
      },
      labels: {
        show: true,
        style: {
          colors: "#3A4252",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (val) => {
          return "$" + val + "k";
        },
        style: {
          colors: "#3A4252",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
        color: "#64748B",
      },
      axisTicks: {
        show: false,
        color: "#64748B",
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Inter",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 10,
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
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h3 className="mb-0 fw-semibold">Performance Metrics</h3>

          <Dropdown className="dropdown select-dropdown position-relative">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="dropdown-toggle bg-transparent border-0 text-body rounded-2 py-0"
            >
              Last Month
            </Dropdown.Toggle>

            <Dropdown.Menu className="bg-white border box-shadow">
              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                Today
              </Dropdown.Item>

              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                Last Week
              </Dropdown.Item>

              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                Last Month
              </Dropdown.Item>

              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                Last Year
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div style={{ margin: "-20px 0 -22px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="line" height={342} />
          )}
        </div>
      </Card>
    </>
  );
};

export default PerformanceMetrics;
