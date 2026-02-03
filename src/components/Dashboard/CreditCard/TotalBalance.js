"use client";

import React from "react";
import { Card } from "react-bootstrap";

const TotalBalance = () => {
  return (
    <>
      <Card
        className="border-0 rounded-3 p-25 gradient-card-dark"
        style={{
          background: "linear-gradient(90deg, #daebff, #fff)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <span className="d-block">Total Balance</span>
            <h3
              className="fs-20 mt-6"
              style={{
                marginTop: "5px",
                marginBottom: "22px",
              }}
            >
              $20,507
            </h3>

            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <span className="d-inline-block bg-success-80 border-success-60 border px-2 rounded-pill text-success-60 fs-12 fw-medium">
                +28.5%
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
                backgroundColor: "#daebff",
              }}
            >
              {" "}
              account_balance_wallet
            </i>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TotalBalance;
