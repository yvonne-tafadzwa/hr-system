"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const RevenueGoalProgress = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Prediction",
      data: [108, 130, 110, 140, 130, 115, 125, 115, 130, 140, 140, 130],
    },
    {
      name: "Gained",
      data: [135, 115, 128, 120, 125, 130, 135, 130, 135, 145, 120, 125],
    },
  ];

  const categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#757DFF", "#E9D5FF"],
    stroke: {
      width: 4,
      curve: "straight",
      dashArray: [0, 8],
    },
    grid: {
      show: true,
      borderColor: "#ECF0FF",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      axisTicks: {
        show: false,
        color: "#DDE4FF",
      },
      axisBorder: {
        show: false,
        color: "#DDE4FF",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => "$" + val + "K",
        style: {
          colors: "#8695AA",
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
        color: "#DDE4FF",
      },
      axisTicks: {
        show: false,
        color: "#DDE4FF",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val + "k",
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: true,
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
      <Card className="bg-white border-0 rounded-3">
        <div className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h3 className="mb-0">Revenue Goal Progress</h3>

            <Dropdown className="dropdown select-dropdown">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="dropdown-toggle border text-body rounded-2 bg-gray-100"
              >
                Monthly
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

          <div style={{ margin: "-20px 0 -25px -15px" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="line"
                height={410}
              />
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default RevenueGoalProgress;
