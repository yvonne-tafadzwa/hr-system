"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const ComparativeAnalysis = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const weeklyData = {
    series: [
      { name: "Bitcoin", data: [[100, 20, 50]] },
      { name: "Ethereum", data: [[300, 50, 70]] },
      { name: "Cardano", data: [[500, 80, 80]] },
      { name: "Solana", data: [[650, 40, 50]] },
      { name: "Tether", data: [[850, 60, 70]] },
      { name: "XRP", data: [[900, 20, 60]] },
    ],
    xaxisRange: { min: 0, max: 1000 },
  };

  const options = {
    series: weeklyData.series,
    chart: {
      toolbar: { show: false },
    },
    colors: ["#757DFF", "#5DA8FF", "#BF85FB", "#1E8308", "#FE7A36", "#174EDE"],
    dataLabels: { enabled: false },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    fill: { opacity: 1 },
    xaxis: {
      tickAmount: 8,
      min: weeklyData.xaxisRange.min,
      max: weeklyData.xaxisRange.max,
      axisTicks: { show: true, color: "#64748B" },
      axisBorder: { show: true, color: "#64748B" },
      labels: {
        show: true,
        style: { colors: "#3A4252", fontSize: "12px", fontFamily: "Inter" },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (val) => "$" + val + "k",
        style: { colors: "#3A4252", fontSize: "12px", fontFamily: "Inter" },
      },
      axisBorder: { show: false, color: "#64748B" },
      axisTicks: { show: false, color: "#64748B" },
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "12px",
      fontFamily: "Inter",
      horizontalAlign: "center",
      itemMargin: { horizontal: 10, vertical: 8 },
      labels: { colors: "#64748B" },
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
          <h3 className="mb-0 fw-semibold">Comparative Analysis</h3>

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

        <div style={{ margin: "-10px 0 -20px 0" }}>
          {Chart && (
            <Chart
              options={options}
              series={weeklyData.series}
              type="bubble"
              height={372}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default ComparativeAnalysis;
