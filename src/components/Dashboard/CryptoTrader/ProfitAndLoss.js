"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const ProfitAndLoss = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Profit",
      data: [35, 45, 55, 35, 65, 38, 63],
    },
    {
      name: "Loss",
      data: [25, 15, 45, 25, 15, 20, 25],
    },
  ];

  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
      tickAmount: 5,
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
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
            <h3 className="mb-0 text-secondary-50">Profit & Loss</h3>

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

          <div style={{ margin: "-21px 0 -20px 0" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={280}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProfitAndLoss;
