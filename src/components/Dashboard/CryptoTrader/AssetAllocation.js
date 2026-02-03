"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const AssetAllocation = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [30, 25, 20, 15, 10];

  const options = {
    labels: ["BTC 30%", "ETH 25%", "USDC 20%", "ADA 15%", "SHIB 10%"],
    colors: ["#605DFF", "#757DFF", "#9CAAFF", "#C2CDFF", "#DDE4FF"],
    legend: {
      show: true,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 8,
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
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">Asset Allocation</h3>

          <span>Last 30 Days</span>
        </div>

        <div>
          <span className="d-block">Total Value</span>
          <h3 className="fs-20 mb-0 mt-6">$17,485</h3>
        </div>

        <div className="t-chart" style={{ margin: "0 0 -15px 0" }}>
          {Chart && (
            <Chart options={options} series={series} type="pie" height={207} />
          )}
        </div>
      </Card>
    </>
  );
};

export default AssetAllocation;
