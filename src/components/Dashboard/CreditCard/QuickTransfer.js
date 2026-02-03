"use client";

import React from "react";
import { Card, Form } from "react-bootstrap";

const QuickTransfer = () => {
  return (
    <>
      <Card className="border-0 rounded-3 bg-white p-25">
        <h3 className="mb-4">Quick Transfer</h3>

        <Form className="quick-transfer">
          <div className="form-group mb-20">
            <label className="fs-12 mb-2">Card Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="**** **** **** 1580"
            />
          </div>

          <div className="form-group">
            <label className="fs-12 mb-2">Transfer Amount</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="$1,580"
              />

              <button
                className="btn btn-primary d-flex justify-content-center align-items-center position-absolute top-50 end-0 translate-middle-y"
                style={{
                  width: "51px",
                  height: "51px",
                }}
              >
                <i className="material-symbols-outlined">send_money</i>
              </button>
            </div>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default QuickTransfer;
