"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const MonthlySpending = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Spend",
      data: [0, 51, 45, 75, 70],
    },
  ];

  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#5C61F2"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May"],
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
          colors: "#3A4252",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      max: 100,
      min: 0,
      labels: {
        formatter: function (val) {
          return "$" + val;
        },
        style: {
          colors: "#3A4252",
          fontSize: "12px",
          fontFamily: "Inter",
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
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val;
        },
      },
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <h3 className="mb-4">Monthly Spending</h3>

        <div style={{ margin: "-20px 0 -22px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="line" height={185} />
          )}
        </div>
      </Card>
    </>
  );
};

export default MonthlySpending;
