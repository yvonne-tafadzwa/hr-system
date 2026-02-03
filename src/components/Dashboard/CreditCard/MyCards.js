"use client";

import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import Image from "next/image";

const MyCards = () => {
  // Modal
  const [isShowModal, setShowModal] = useState("false");
  const handleToggleShowModal = () => {
    setShowModal(!isShowModal);
  };

  return (
    <>
      <Card
        className="border-0 rounded-3 bg-white p-25 bg-img cc-card"
        style={{
          backgroundImage: "url(/images/debit-card-bg.jpg)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">My Cards</h3>

          <button
            className="btn btn-outline-primary d-flex align-items-center gap-1 hover-bg"
            onClick={handleToggleShowModal}
          >
            <i className="material-symbols-outlined fs-22">add</i>
            <span>Add Card</span>
          </button>
        </div>

        <Row className="g-4">
          <Col sm={6}>
            <div
              className="bg-img p-4 rounded-3"
              style={{
                backgroundImage: "url(/images/debit-card-2.jpg)",
              }}
            >
              <div className="d-flex align-content-center justify-content-between">
                <div>
                  <span className="text-white fs-12 fw-medium d-block mb-3">
                    Credit Card
                  </span>
                  <Image
                    src="/images/board-1.png"
                    alt="board"
                    width={45}
                    height={30}
                  />
                </div>
                <i className="ri-visa-fill fs-35 text-white lh-1"></i>
              </div>

              <h3
                className="fw-semibold mb-12 d-flex gap-1 lh-1"
                style={{
                  marginTop: "40px",
                }}
              >
                <span className="text-white">****</span>
                <span className="text-white">****</span>
                <span className="text-white">****</span>
                <span className="text-white">1784</span>
              </h3>

              <div className="d-flex align-content-center justify-content-between">
                <span className="text-white">Russell McCray</span>
                <span className="text-white fs-12">EXP : 12/30</span>
              </div>
            </div>
          </Col>

          <Col sm={6}>
            <div
              className="bg-img p-4 rounded-3"
              style={{
                backgroundImage: "url(/images/debit-card-3.jpg)",
              }}
            >
              <div className="d-flex align-content-center justify-content-between">
                <div>
                  <span className="text-white fs-12 fw-medium d-block mb-3">
                    Credit Card
                  </span>
                  <Image
                    src="/images/board-1.png"
                    alt="board"
                    width={45}
                    height={30}
                  />
                </div>
                <i className="ri-mastercard-fill fs-35 text-white lh-1"></i>
              </div>

              <h3
                className="fw-semibold mb-12 d-flex gap-1 lh-1"
                style={{
                  marginTop: "40px",
                }}
              >
                <span className="text-white">****</span>
                <span className="text-white">****</span>
                <span className="text-white">****</span>
                <span className="text-white">1794</span>
              </h3>

              <div className="d-flex align-content-center justify-content-between">
                <span className="text-white">Russell McCray</span>
                <span className="text-white fs-12">EXP : 12/30</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Modal */}
      <div className={`custom-modal right ${isShowModal ? "" : "show"}`}>
        <div className="custom-modal-content position-relative z-3">
          <div className="border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <h3 className="fs-18 mb-0">Add Card Detail</h3>

            <div className="close-link" onClick={handleToggleShowModal}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <div className="p-4">
            <Form>
              <Row>
                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Name"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter card number"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Expiry Date</Form.Label>
                    <Form.Control
                      type="date"
                      className="text-dark" 
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">CVV</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark" 
                      placeholder="Enter CVV"
                    />
                  </Form.Group>
                </Col> 
              </Row>

              <Form.Group className="d-flex gap-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="text-white fw-semibold py-2 px-2 px-sm-3"
                >
                  <span className="py-sm-1 d-block">
                    <i className="ri-add-line text-white"></i>{" "}
                    <span>Add Card</span>
                  </span>
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>

        <div className="close-outside" onClick={handleToggleShowModal}></div>
      </div>
    </>
  );
};

export default MyCards;
