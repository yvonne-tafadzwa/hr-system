"use client";

import React from "react";
import { Card } from "react-bootstrap";
import Image from "next/image";

const DailyLimit = () => {
  return (
    <>
      <Card className="border-0 rounded-3 bg-white" style={{ padding: "10px" }}>
        <div className="bg-success-90 p-25 rounded-3 mb-2 bg-black-for-dark">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <span className="d-block mb-2">Daily Limit</span>

              <h3 className="mb-0 fs-20">
                $5,000
                <sub className="fs-14 fw-normal bottom-0 text-body">/$2250</sub>
              </h3>
            </div>

            <span className="d-inline-block bg-danger-70 border-danger-80 border px-2 rounded-pill text-danger-80 fs-12 fw-medium">
              -45.9%
            </span>
          </div>

          <div className="progress-responsive mt-3">
            <div
              className="progress rounded-pill"
              style={{
                height: "10px",
                backgroundColor: "#B2FF97",
              }}
            >
              <div
                className="progress-bar rounded-pill"
                style={{
                  width: "85%",
                  height: "10px",
                  backgroundColor: "#37d80a",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div
          className="bg-success rounded-3 mb-0 position-relative"
          style={{
            padding: "18px 25px",
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <div className="flex-shrink-0">
              <Image
                src="/images/avatar-with-laptop.png"
                alt="avatar-with-laptop"
                width={75}
                height={85}
              />
            </div>
            <div className="flex-grow-1">
              <span className="d-block text-white">Get a Platinum Card</span>
              <span className="text-white mt-1 d-block">
                For <span className="fw-bold fs-20">Free</span>
              </span>
            </div>
          </div>

          <Image
            src="/images/4dots.png"
            className="position-absolute bottom-0 end-0"
            alt="4dots"
            width={68}
            height={68}
          />
        </div>
      </Card>
    </>
  );
};

export default DailyLimit;
