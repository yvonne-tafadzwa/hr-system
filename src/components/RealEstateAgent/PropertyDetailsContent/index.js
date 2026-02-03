"use client";

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";

const PropertyDetailsContent = () => {
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
          <div className="bg-white border-0 rounded-3 p-25 h-100">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <span className="d-block mb-2">Code: TRZ-32</span>

                <h3 className="fs-24 mb-11">The Golden Haven</h3>

                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <i className="ri-map-pin-line text-primary fs-17 position-relative top-2"></i>
                  <span className="fw-semibold">
                    123 Sunshine Boulevard, Vancouver, BC
                  </span>
                </div>
              </div>

              <ul
                className="p-0 m-0 list-unstyled d-flex align-items-center justify-content-end"
                style={{ gap: "3px" }}
              >
                <li>
                  <i className="ri-star-fill fs-15 text-rating-color"></i>
                </li>
                <li>
                  <i className="ri-star-fill fs-15 text-rating-color"></i>
                </li>
                <li>
                  <i className="ri-star-fill fs-15 text-rating-color"></i>
                </li>
                <li>
                  <i className="ri-star-fill fs-15 text-rating-color"></i>
                </li>
                <li>
                  <i className="ri-star-fill fs-15 text-rating-color"></i>
                </li>
                <li>
                  <span className="fs-12">5.0</span>
                </li>
              </ul>
            </div>

            <div
              className="border-top border-bottom my-4 d-flex justify-content-between flex-wrap gap-2"
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            >
              <ul className="px-0 mb-0 list-unstyled d-flex align-items-center gap-1 gap-sm-4">
                <li className="d-flex align-items-center gap-1 text-body">
                  <i className="material-symbols-outlined fs-18">open_run </i>
                  <span>425 sft</span>
                </li>

                <li className="d-flex align-items-center gap-1 text-body">
                  <i className="material-symbols-outlined fs-18">bathtub </i>
                  <span>2 Baths</span>
                </li>

                <li className="d-flex align-items-center gap-1 text-body">
                  <i className="material-symbols-outlined fs-18">bed </i>
                  <span>3 Beds</span>
                </li>
              </ul>

              <h2 className="fs-18 mb-0">$4,274/m</h2>
            </div>

            <h3 className="fs-18 mb-3">Property Description</h3>
            <p>
              Nestled in a serene neighborhood, this modern 3-bedroom home
              boasts an open-concept layout with abundant natural light. The
              chef’s kitchen features state-of-the-art appliances and a spacious
              island for entertaining.
            </p>
            <p>
              Enjoy the tranquility of a private backyard oasis with a patio and
              lush landscaping. Located minutes from top-rated schools,
              shopping, and parks, it offers convenience and comfort. This home
              is the perfect blend of style and functionality.
            </p>

            <h3 className="fs-18 mb-3 pt-md-2">Property Details</h3>
            <div className="default-table-area room-info-table mb-4">
              <div
                className="table-responsive"
                style={{
                  borderRadius: "0 !important",
                }}
              >
                <table className="table align-middle">
                  <tbody>
                    <tr>
                      <td className="text-body">Beds</td>
                      <td className="text-secondary text-end">03</td>
                      <td className="text-body border-start">Ceiling Height</td>
                      <td className="text-secondary text-end">3.20 m</td>
                    </tr>
                    <tr>
                      <td className="text-body">Baths</td>
                      <td className="text-secondary text-end">02</td>
                      <td className="text-body border-start">Property Type</td>
                      <td className="text-secondary text-end">Villa</td>
                    </tr>
                    <tr>
                      <td className="text-body">Floor</td>
                      <td className="text-secondary text-end">Ground</td>
                      <td className="text-body border-start">Year Built</td>
                      <td className="text-secondary text-end">2010</td>
                    </tr>
                    <tr>
                      <td className="text-body">Garage</td>
                      <td className="text-secondary text-end">03</td>
                      <td className="text-body border-start">Status</td>
                      <td className="text-secondary text-end">For Sale</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="fs-18 mb-3 pt-md-2">Amenities</h3>
            <div className="row gy-2">
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>A/C & Heating</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Parking</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>WiFi</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Pet Friendly</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Furniture</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Ceiling Height</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Play Ground</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Elevator</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Garage</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Fireplace</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Garden</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line fs-18 text-primary position-relative top-1"></i>
                  <span>Disabled Access</span>
                </div>
              </div>
            </div>

            <h3 className="fs-18 mb-3 mt-4 pt-1">Location</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387196.07665879064!2d-74.30914977179596!3d40.69667269554806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1744528848880!5m2!1sen!2sbd"
              className="rounded-3"
              style={{
                border: "0",
                height: "250px",
                width: "100%",
                display: "block",
              }}
            ></iframe>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PropertyDetailsContent;
