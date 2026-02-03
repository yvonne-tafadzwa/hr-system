"use client";

import React from "react";
import { Card } from "react-bootstrap"; 

const PortfolioValue = () => {
  return (
    <>
      <Card
        className="border-0 rounded-3 bg-primary-70 p-25"
        style={{
          paddingTop: "15px",
          paddingBottom: "15px",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <span className="d-block">Portfolio Value</span>
            <h3 className="fs-20 mb-0" style={{ marginTop: "4px" }}>
              $94.69B
            </h3>
          </div>

          <div className="flex-shrink-0">
            <i
              className="material-symbols-outlined d-flex align-items-center justify-content-center text-primary rounded-circle fs-24 bg-white bg-black-for-dark"
              style={{
                width: "53px",
                height: "53px",
              }}
            >
              attach_money
            </i>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PortfolioValue;
