"use client";

import React from "react";
import Image from "next/image";

const NewBookings = () => {
  return (
    <>
      <div
        className="card border-0 rounded-3 bg-primary-70 position-relative welcome-for-hotel"
        style={{
          padding: "20px",
        }}
      >
        <div className="d-flex d-md-block justify-content-between align-items-center">
          <div>
            <span className="d-block">New Bookings</span>

            <h3
              className="fs-28 fw-900 lh-1"
              style={{ marginTop: "6px", marginBottom: "11px" }}
            >
              1540
            </h3>

            <div>
              <span className="d-inline-block bg-card-text-c border-danger-50 border px-2 rounded-pill text-danger-50 fs-12 fw-medium">
                -4.15%
              </span>
            </div>
          </div>

          <div
            className="d-flex justify-content-end"
            style={{
              marginTop: "-15px",
            }}
          >
            <div
              className="bg-white rounded-circle d-flex align-items-center justify-content-end"
              style={{
                width: "79px",
                height: "79px",
              }}
            >
              <Image
                src="/images/add-event2.svg"
                alt="add-event2"
                width={56}
                height={56}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBookings;
