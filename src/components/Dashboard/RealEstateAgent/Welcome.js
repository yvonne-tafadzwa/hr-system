"use client";

import React from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";
import Stats from "./Stats";

const Welcome = () => {
  return (
    <>
      <div className="border-0 rounded-3 bg-rating-color mb-4 p-25">
        <div className="welcome-real-estate-agent">
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="mb-3 mt-8">
                <span
                  className="fs-16 text-card-text-c fw-medium d-inline-block"
                  style={{
                    backgroundColor: "#212529",
                    padding: "1px 13px",
                  }}
                >
                  Hello Olivia!
                </span>
              </div>

              <h2
                className="fs-32 text-white mx-auto ms-lg-0"
                style={{
                  letterSpacing: "-.5px",
                  maxWidth: "480px",
                }}
              >
                Welcome Back! Ready to Close More Deals Today?
              </h2>
            </Col>

            <Col lg={6} className="text-lg-end text-center">
              <Image
                src="/images/bank-real-estate.png"
                alt="bank-real-estate"
                width={470}
                height={175}
              />
            </Col>
          </Row>
        </div>
      </div>

      <Stats />
    </>
  );
};

export default Welcome;
