"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const Statistics = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Income",
      data: [40, 50, 45, 35, 60, 50, 65],
    },
    {
      name: "Expenses",
      data: [20, 25, 40, 22, 18, 20, 25],
    },
  ];

  const categories = ["2022", "2023", "2024", "2025"];

  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#37D80A", "#EE3E08"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0,
        opacityTo: 0.5,
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      tickAmount: 5,
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
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">Statistics</h3>

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

        <div style={{ margin: "-18px 0 -16px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="area" height={298} />
          )}
        </div>
      </Card>
    </>
  );
};

export default Statistics;
