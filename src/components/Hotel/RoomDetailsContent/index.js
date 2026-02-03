"use client";

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";

const RoomDetailsContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <>
      <Row className="g-4 mb-4">
        <Col lg={4}>
          <div
            className="bg-white border-0 rounded-3 mb-3"
            style={{
              padding: "13px",
            }}
          >
            {activeTab === 0 && (
              <>
                <Image
                  src="/images/room-10.jpg"
                  className="rounded-3 w-100"
                  alt="room"
                  width={640}
                  height={660}
                />
              </>
            )}

            {activeTab === 1 && (
              <>
                <Image
                  src="/images/room-11.jpg"
                  className="rounded-3 w-100"
                  alt="room"
                  width={640}
                  height={660}
                />
              </>
            )}

            {activeTab === 2 && (
              <>
                <Image
                  src="/images/room-12.jpg"
                  className="rounded-3 w-100"
                  alt="room"
                  width={640}
                  height={660}
                />
              </>
            )}

            {activeTab === 3 && (
              <>
                <Image
                  src="/images/room-13.jpg"
                  className="rounded-3 w-100"
                  alt="room"
                  width={640}
                  height={660}
                />
              </>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between gap-3">
            <div
              onClick={() => handleTabClick(0)}
              className={`border rounded-3 cursor-pointer ${
                activeTab === 0 ? "border-color-primary" : ""
              }`}
            >
              <Image
                src="/images/room-10.jpg"
                className="rounded-3"
                alt="room"
                width={110}
                height={110}
              />
            </div>

            <div
              onClick={() => handleTabClick(1)}
              className={`border rounded-3 cursor-pointer ${
                activeTab === 1 ? "border-color-primary" : ""
              }`}
            >
              <Image
                src="/images/room-11.jpg"
                className="rounded-3"
                alt="room"
                width={110}
                height={110}
              />
            </div>

            <div
              onClick={() => handleTabClick(2)}
              className={`border rounded-3 cursor-pointer ${
                activeTab === 2 ? "border-color-primary" : ""
              }`}
            >
              <Image
                src="/images/room-12.jpg"
                className="rounded-3"
                alt="room"
                width={110}
                height={110}
              />
            </div>

            <div
              onClick={() => handleTabClick(3)}
              className={`border rounded-3 cursor-pointer ${
                activeTab === 3 ? "border-color-primary" : ""
              }`}
            >
              <Image
                src="/images/room-13.jpg"
                className="rounded-3"
                alt="room"
                width={110}
                height={110}
              />
            </div>
          </div>
        </Col>

        <Col lg={8}>
          <div className="bg-white border-0 rounded-3 mb-3 p-25 h-100">
            <div
              className="d-flex flex-wrap align-items-center border-bottom pb-3 mb-3 pb-md-4 mb-md-4"
              style={{
                gap: "15px",
              }}
            >
              <div className="flex-shrink-0">
                <Image
                  src="/images/user-190.jpg"
                  className="rounded-circle"
                  alt="user"
                  width={85}
                  height={85}
                />
              </div>

              <div className="flex-grow-1">
                <span className="d-block">Code: TRZ-32</span>

                <h3 className="fs-24 mt-6 mb-10">Serenity Suite</h3>

                <ul className="p-0 m-0 list-unstyled flex-wrap d-flex align-items-center gap-1 gap-sm-3">
                  <li
                    className="d-flex align-items-center"
                    style={{ gap: "7px" }}
                  >
                    <i className="ri-phone-fill fs-18 text-danger"></i>
                    <span className="fs-14">+321 1245 6457</span>
                  </li>
                  <li
                    className="d-flex align-items-center"
                    style={{ gap: "7px" }}
                  >
                    <i className="ri-mail-line fs-18 text-danger"></i>
                    <span className="fs-14">anderson350@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="d-flex align-items-center flex-wrap border-bottom pb-3 mb-3 pb-md-4 mb-md-4 gap-2 gap-sm-5">
              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <Image
                  src="/images/schedule.svg"
                  alt="schedule"
                  width={28}
                  height={28}
                />
                <div>
                  <span className="fs-12 d-block">Check In</span>
                  <span className="fw-semibold text-secondary">
                    23 June 2025, 15:12 AM
                  </span>
                </div>
              </div>

              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <Image
                  src="/images/schedule.svg"
                  alt="schedule"
                  width={28}
                  height={28}
                />
                <div>
                  <span className="fs-12 d-block">Check Out</span>
                  <span className="fw-semibold text-secondary">
                    25 June 2025, 14:20 PM
                  </span>
                </div>
              </div>
            </div>

            <h3 className="fs-18 mb-12">Room Info</h3>
            <div className="default-table-area room-info-table mb-4 mt-15">
              <div
                className="table-responsive"
                style={{ borderRadius: "0 !important" }}
              >
                <table className="table align-middle">
                  <tbody>
                    <tr>
                      <td className="text-body">Room Code</td>
                      <td className="text-secondary text-end">L1-15</td>
                      <td className="text-body border-start">Bathroom</td>
                      <td className="text-secondary text-end">2</td>
                    </tr>
                    <tr>
                      <td className="text-body">Room Name</td>
                      <td className="text-secondary text-end">Moonlight</td>
                      <td className="text-body border-start">
                        Air Conditioner
                      </td>
                      <td className="text-secondary text-end">Yes</td>
                    </tr>
                    <tr>
                      <td className="text-body">Rate</td>
                      <td className="text-secondary text-end">$156/night</td>
                      <td className="text-body border-start">Free WiFi</td>
                      <td className="text-secondary text-end">Yes</td>
                    </tr>
                    <tr>
                      <td className="text-body">Bed</td>
                      <td className="text-secondary text-end">2 Beds</td>
                      <td className="text-body border-start">Heater</td>
                      <td className="text-secondary text-end">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="fs-18 mb-12">Description</h3>
            <p>
              This room captures the essence of boundless potential, symbolized
              by a surreal landscape where the sky meets the earth in a dazzling
              fusion of colors. The intricate design features flowing lines that
              blend together, representing the limitless paths we can take in
              life.
            </p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default RoomDetailsContent;
