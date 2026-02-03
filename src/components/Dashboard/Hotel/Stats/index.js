"use client";

import React from "react";
import { Row, Col } from "react-bootstrap";
import NewBookings from "./NewBookings";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";

const Stats = () => {
  return (
    <>
      <div
        className="card border-0 rounded-3 bg-white position-relative mb-4"
        style={{
          padding: "10px",
        }}
      >
        <Row className="row g-2">
          <Col md={4}>
            <NewBookings />
          </Col>

          <Col md={4}>
            <CheckIn />
          </Col>

          <Col md={4}>
            <CheckOut />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Stats;
