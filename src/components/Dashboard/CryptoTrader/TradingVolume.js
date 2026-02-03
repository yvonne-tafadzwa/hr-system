"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const TradingVolume = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Volume",
      data: [130, 200, 160, 80, 70, 120, 140],
    },
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
        columnWidth: "15px",
        colors: {
          backgroundBarColors: ["#DDE4FF"],
          backgroundBarOpacity: 0.2,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#F6F7F9",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      tickAmount: 4,
      max: 200,
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
        color: "#64748B",
      },
      axisTicks: {
        show: false,
        color: "#64748B",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val + "k";
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "12px",
      fontFamily: "Inter",
      horizontalAlign: "left",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
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
      <Card className="bg-white border-0 rounded-3">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <div>
                <span className="d-block mb-1">Trading Volume</span>
                <h3 className="mb-0 fs-20 lh-1">$117,950</h3>
              </div>
              <div>
                <span className="d-inline-block bg-success-80 border-success-60 border px-2 rounded-pill text-success-60 fs-12 fw-medium">
                  +7.6%
                </span>
              </div>
            </div>

            <span>Last 7 days</span>
          </div>

          <div style={{ margin: "-24px 0 -24px 0" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={180}
              />
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default TradingVolume;
