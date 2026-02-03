"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const RiskStabilityIndicators = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Liquidity",
      data: [60, 80, 100, 120, 140, 150],
    },
    {
      name: "Volatility",
      data: [180, 160, 80, 140, 100, 80],
    },
    {
      name: "Operational",
      data: [100, 130, 140, 60, 40, 20],
    },
  ];

  const options = {
    chart: {
      toolbar: { show: false },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0,
        opacityTo: 0.4,
      },
    },
    colors: ["#AD63F6", "#605DFF", "#37D80A"],
    yaxis: {
      show: true,
      tickAmount: 4,
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
      customLegendItems: ["Liquidity 50%", "Volatility 20%", "Operational 30%"],
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <h3 className="mb-4 fw-semibold">Risk & Stability Indicators</h3>

        {Chart && (
          <Chart options={options} series={series} type="radar" height={345} />
        )}
      </Card>
    </>
  );
};

export default RiskStabilityIndicators;
