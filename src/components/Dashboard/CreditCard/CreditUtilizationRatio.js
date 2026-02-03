"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap"; 

const CreditUtilizationRatio = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);
 
  const series = [
    {
      name: "Ratio",
      data: [30, 65, 85],
    },
  ];

  const options = {
    chart: {
      toolbar: { show: false },
    },
    colors: ["#37D80A", "#FE7A36", "#FF4023"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    xaxis: {
      categories: ["0-30%", "30-70%", "70%+"],
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
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    legend: {
      show: false,
      fontSize: "12px",
      fontFamily: "Inter",
      position: "bottom",
      horizontalAlign: "left",
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "square",
      },
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <h3 className="mb-4">Credit Utilization Ratio</h3>

        <div style={{ margin: "-20px 0 -22px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="bar" height={185} />
          )}
        </div>
      </Card>
    </>
  );
};

export default CreditUtilizationRatio;
