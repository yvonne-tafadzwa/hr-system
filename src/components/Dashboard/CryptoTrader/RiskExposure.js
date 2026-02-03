"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const RiskExposure = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Risk",
      data: [80, 50, 30, 40, 100, 20],
    },
    {
      name: "Risk",
      data: [20, 30, 40, 80, 20, 80],
    },
    {
      name: "Risk",
      data: [30, 70, 80, 15, 45, 10],
    },
  ];

  const categories = [
    "Market",
    "Technology",
    "Compliance",
    "Liquidity",
    "Operational",
    "Credit",
  ];

  const options = {
    chart: {
      type: "radar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          colors: "#3A4252",
          fontSize: "12px",
        },
      },
    },
    markers: {
      size: 3,
      strokeWidth: 0,
    },
    colors: ["#FD5812", "#37D80A", "#605DFF"],
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0,
        opacityTo: 0.4,
      },
    },
    yaxis: {
      show: false,
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
      position: "top",
      fontSize: "12px",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
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
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-4">
          <div
            className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20 position-relative"
            style={{ zIndex: 1 }}
          >
            <h3 className="mb-0 text-secondary-50">Risk Exposure</h3>

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

          <div style={{ margin: "-50px -17px -50px" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="radar"
                height={340}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default RiskExposure;
