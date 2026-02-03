"use client";

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const CardsWithAmount = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [
    {
      name: "Projects",
      data: [1870, 2000, 1490, 1410, 1680],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#605DFF"],
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "11px",
        fontFamily: "Inter",
        fontWeight: "normal",
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: [
        "Rewards Card",
        "Cashback Card",
        "Travel Card",
        "Student Card",
        "Business Card",
      ],
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "11px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "11px",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
    },
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <h3 className="mb-4">Cards With Amount</h3>

        <div style={{ margin: "-25px 0 -20px -10px" }}>
          {Chart && (
            <Chart options={options} series={series} type="bar" height={211} />
          )}
        </div>
      </Card>
    </>
  );
};

export default CardsWithAmount;
