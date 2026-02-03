"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const PerformancePerInvestment = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Investment",
      data: [
        { x: "Bitcoin", y: [8, 2] },
        { x: "Ethereum", y: [5, 3] },
        { x: "Solana", y: [4, 8] },
        { x: "Tether", y: [3, 5] },
        { x: "USDC", y: [2, 5] },
        { x: "XRP", y: [1, 2] },
      ],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#3584FC"],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter",
        fontWeight: "400",
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    xaxis: {
      axisTicks: {
        show: true,
        color: "#64748B",
      },
      axisBorder: {
        show: true,
        color: "#64748B",
      },
      labels: {
        style: {
          colors: "#3A4252",
          fontFamily: "Inter",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      min: 0,
      labels: {
        style: {
          colors: "#3A4252",
          fontFamily: "Inter",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
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
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h3 className="mb-0 fw-semibold">Performance Per Investment</h3>

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

        <div style={{ margin: "-15px 0 -14px 0" }}>
          {Chart && (
            <Chart
              options={options}
              series={series}
              type="rangeBar"
              height={435}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default PerformancePerInvestment;
