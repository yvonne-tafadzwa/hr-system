"use client";

import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";

const MarketSentimentIndicator = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [100];

  const options = {
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#ffffff",
          strokeWidth: "100%",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#FF3D00"],
        stops: [0, 50, 100],
        colorStops: [
          { offset: 0, color: "#00C851", opacity: 1 }, // Extreme Greed
          { offset: 25, color: "#8BC34A", opacity: 1 }, // Greed
          { offset: 50, color: "#FFC107", opacity: 1 }, // Neutral
          { offset: 75, color: "#FF9800", opacity: 1 }, // Fear
          { offset: 100, color: "#FF3D00", opacity: 1 }, // Extreme Fear
        ],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Market Sentiment"],
  };

  return (
    <>
      <div className="card border-0 rounded-3 bg-white p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">Market Sentiment Indicator</h3>

          <span>Last 30 Days</span>
        </div>

        <div style={{ margin: "-40px 0 -20px 0" }}>
          {Chart && (
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={323}
            />
          )}
        </div>

        <ul
          className="p-0 m-0 list-unstyled d-flex align-items-center mx-auto justify-content-center flex-wrap"
          style={{
            gap: "13px",
            maxWidth: "315px",
          }}
        >
          <li className="d-flex align-items-center gap-1">
            <span
              className="d-block rounded-circle"
              style={{
                backgroundColor: "#00d26a",
                width: "12px",
                height: "12px",
              }}
            ></span>
            <span className="fs-12">Extreme Greed</span>
          </li>

          <li className="d-flex align-items-center gap-1">
            <span
              className="d-block rounded-circle"
              style={{
                backgroundColor: "#00d26a",
                width: "12px",
                height: "12px",
              }}
            ></span>
            <span className="fs-12">Greed</span>
          </li>

          <li className="d-flex align-items-center gap-1">
            <span
              className="d-block rounded-circle"
              style={{
                backgroundColor: "#fcd53f",
                width: "12px",
                height: "12px",
              }}
            ></span>
            <span className="fs-12">Neutral</span>
          </li>

          <li className="d-flex align-items-center gap-1">
            <span
              className="d-block rounded-circle"
              style={{
                backgroundColor: "#ff6723",
                width: "12px",
                height: "12px",
              }}
            ></span>
            <span className="fs-12">Fear</span>
          </li>

          <li className="d-flex align-items-center gap-1">
            <span
              className="d-block rounded-circle"
              style={{
                backgroundColor: "#ff6723",
                width: "12px",
                height: "12px",
              }}
            ></span>
            <span className="fs-12">Extreme Fear</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MarketSentimentIndicator;
