"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const InterestChargeFees = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Interest Charge",
      data: [28, 15, 18, 25],
    },
    {
      name: "Fees",
      data: [5, 8, 8, 9],
    },
  ];

  const categories = ["2022", "2023", "2024", "2025"];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#605DFF", "#FF4023"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      show: true,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
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
      max: 40,
      min: 0,
      labels: {
        formatter: function (val) {
          return val + "%";
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
      borderColor: "#ECEEF2",
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">Interest Charge & Fees</h3>

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

        <div style={{ margin: "-19px 0 -17px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="bar" height={300} />
          )}
        </div>
      </Card>
    </>
  );
};

export default InterestChargeFees;
