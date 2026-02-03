"use client";

import React from "react";
import { Card } from "react-bootstrap";

const TotalExpense = () => {
  return (
    <>
      <Card
        className="border-0 rounded-3 p-25 gradient-card-dark"
        style={{
          background: "linear-gradient(90deg, #f3e8ff, #fff)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <span className="d-block">Total Expense</span>
            <h3
              className="fs-20 mt-6"
              style={{
                marginTop: "5px",
                marginBottom: "22px",
              }}
            >
              $18,950
            </h3>

            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <span className="d-inline-block bg-danger-70 border-danger-80 border px-2 rounded-pill text-danger-80 fs-12 fw-medium">
                -18.1%
              </span>
              <span className="fs-12">Last Month</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <i
              className="material-symbols-outlined d-flex align-items-center justify-content-center fs-35 text-card-bg-c rounded-circle"
              style={{
                width: "75px",
                height: "75px",
                backgroundColor: "#f3e8ff",
              }}
            >
              {" "}
              payments
            </i>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TotalExpense;
