"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const MarketPerformance = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [25, 18, 22, 35, 15, 28];

  const options = {
    labels: [
      "Revenue Growth",
      "Profit Margins",
      "Cost of Goods Sold",
      "Market Share",
      "Sales Volume",
      "Return on Investment",
    ], // Example sectors
    colors: ["#37D80A", "#3584FC", "#FE7A36", "#AD63F6", "#FF4023", "#605DFF"],
    stroke: {
      width: 0,
      show: true,
      colors: ["#ffffff"],
    },
    legend: {
      show: true,
      fontSize: "12px",
      fontFamily: "Inter",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 6,
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
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h3 className="mb-0 fw-semibold">Market Performance</h3>

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

        <div style={{ margin: "-15px 0 -14px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="pie" height={340} />
          )}
        </div>
      </Card>
    </>
  );
};

export default MarketPerformance;
