"use client";

import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const Stats = () => {
  // Dynamic stats data
  const statsData = [
    {
      id: 1,
      title: "Total Value of all Crypto",
      value: "$597.655B",
      subtitle: null,
      date: null,
    },
    {
      id: 2,
      title: "First Trade Volume",
      value: "$21.953M",
      subtitle: "1 Jan, 2025",
      date: "(1 Jan, 2025)",
    },
    {
      id: 3,
      title: "Last Trade Volume",
      value: "$25.965B",
      subtitle: "1 Nov, 2025",
      date: "(1 Nov, 2025)",
    },
    {
      id: 4,
      title: "Crypto Total Market Cap",
      value: "$1.36T",
      subtitle: null,
      date: null,
    },
  ];

  return (
    <>
      <Card
        className="border-0 rounded-3 bg-white p-25 bg-img mb-4"
        style={{
          backgroundImage: "url(/images/sparkline-bg.jpg)",
        }}
      >
        <Row className="g-3 g-md-4">
          {statsData.map((stat) => (
            <Col xxl={3} sm={6} key={stat.id}>
              <div className="card border-0 rounded-3 bg-white p-25">
                <span className="d-block">{stat.title}</span>

                <h3 className="fs-20 mt-1 mb-0">
                  {stat.value}{" "}
                  {stat.date && (
                    <sub className="bottom-0 fw-normal text-body fs-14">
                      {stat.date}
                    </sub>
                  )}
                </h3>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </>
  );
};

export default Stats;
