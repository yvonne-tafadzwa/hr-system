"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const GuestActivity = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Active Guests",
      data: [15, 30, 20, 40, 35, 30, 25],
    },
    {
      name: "Returning Guests",
      data: [10, 20, 15, 25, 30, 40, 30],
    },
  ];

  const categories = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
  ];

  const options = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#ffffff", "#D8FFC8"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: [2, 2, 0],
      dashArray: [0, 6, 0],
    },
    grid: {
      show: true,
      borderColor: "#ffffff1a",
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.2,
      },
    },
    xaxis: {
      categories: categories,
      axisTicks: { show: false, color: "#ffffff1a" },
      axisBorder: { show: false, color: "#ffffff1a" },
      labels: {
        style: {
          colors: "#B1BBC8",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      min: 0,
      labels: {
        style: {
          colors: "#B1BBC8",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
      axisBorder: { show: true, color: "#ffffff1a" },
      axisTicks: { show: false, color: "#ffffff1a" },
    },
    legend: {
      show: false,
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
        shape: "circle",
      },
    },
  };

  return (
    <>
      <Card
        className="border-0 rounded-3"
        style={{ backgroundColor: "#1F64F1" }}
      >
        <div className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
            <h3 className="mb-0 text-white">Guest Activity</h3>

            <Dropdown className="dropdown select-dropdown">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="dropdown-toggle border text-white rounded-2 bg-gray-100 after-opacity"
                style={{
                  backgroundColor: "rgb(255 255 255 / 10%) !important",
                  borderColor: "rgb(255 255 255 / 10%) !important",
                }}
              >
                Daily
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

          <div style={{ margin: "-20px -20px -20px -12px" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={284}
              />
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default GuestActivity;
