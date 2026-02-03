"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Image from "next/image";

const Stats = () => {
  // State for stats data
  const [stats, setStats] = useState([]);

  // Fetch stats data (mock API call)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: 1,
            title: "Total Listings",
            value: 3251,
            change: "+3.4%",
            status: "positive",
            image: "/images/building1.png",
          },
          {
            id: 2,
            title: "Sales Volume",
            value: "$1.2M",
            change: "-3.2%",
            status: "negative",
            image: "/images/building2.png",
          },
          {
            id: 3,
            title: "Active Deals",
            value: 1124,
            change: "+1.4%",
            status: "positive",
            image: "/images/building3.png",
          },
          {
            id: 4,
            title: "Closed Deals",
            value: 2312,
            change: "-1.2%",
            status: "negative",
            image: "/images/building4.png",
          },
        ];

        setStats(mockData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="welcome-card-wrap mb-4">
        <Row className="justify-content-center g-4">
          {stats.map((stat) => (
            <Col lg={3} sm={6} key={stat.id}>
              <Card className="border-0 rounded-3 bg-white p-25">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <span className="d-block mb-1">{stat.title}</span>

                    <h3 className="fs-24 mb-11 lh-1">{stat.value}</h3>

                    <div>
                      <span
                        className={`d-inline-block border px-2 rounded-pill fs-12 fw-medium ${
                          stat.status === "positive"
                            ? "bg-success-80 border-success-60 text-success-60"
                            : "bg-card-text-c border-danger-50 text-danger-50"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Image
                      src={stat.image}
                      width={60}
                      height={60}
                      alt={stat.title}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Stats;
