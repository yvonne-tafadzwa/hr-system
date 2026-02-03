"use client";

import React from "react";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";

const data = [
  { country: "pt", value: 10295909 }, // Portugal
  { country: "de", value: 83129285 }, // Germany
  { country: "es", value: 47351567 }, // Spain
  { country: "ca", value: 38929902 }, // Canada
];

const salesData = [
  {
    country: "Portugal",
    flag: "/images/portugal.svg",
    percentage: 85,
  },
  {
    country: "Germany",
    flag: "/images/germany.svg",
    percentage: 65,
  },
  {
    country: "Spain",
    flag: "/images/spain.svg",
    percentage: 45,
  },
  {
    country: "Canada",
    flag: "/images/canada.svg",
    percentage: 75,
  },
];

// Conditional progress bar color
const getProgressColor = (percent) => {
  if (percent >= 80) return "#757DFF"; // Blue
  if (percent >= 60) return "#0F79F3"; // Sky Blue
  if (percent >= 40) return "#9135E8"; // Purple
  return "#25B003"; // Green
};

const SalesByCountry = () => {
  return (
    <div className="card bg-white border-0 rounded-3">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h3 className="mb-0">Sales By Country</h3>

          <Dropdown className="action-opt">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="bg-transparent p-0"
            >
              <i className="ri-more-2-fill fs-20"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-white border box-shadow">
              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Day
              </Dropdown.Item>
              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Week
              </Dropdown.Item>
              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Month
              </Dropdown.Item>
              <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                This Year
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="text-center">
          <WorldMap
            backgroundColor="transparent"
            color="blue"
            value-suffix="people"
            size="sm"
            data={data}
          />
        </div>

        <ul className="p-0 m-0 list-unstyled border-top">
          {salesData.map((item) => (
            <li
              key={item.country}
              className="border-bottom"
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="flex-shrink-0">
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "8px" }}
                  >
                    <Image
                      src={item.flag}
                      alt={item.country}
                      width={24}
                      height={24}
                    />
                    <h4 className="mb-0 fs-14 fw-medium lh-1 text-body">
                      {item.country}
                    </h4>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex align-items-center justify-content-end">
                    <div
                      className="progress-responsive"
                      style={{ width: "120px" }}
                    >
                      <div
                        className="progress rounded-pill"
                        style={{ height: "5px", backgroundColor: "#ECF0FF" }}
                      >
                        <div
                          className="progress-bar rounded-pill"
                          style={{
                            width: `${item.percentage}%`,
                            height: "5px",
                            backgroundColor: getProgressColor(item.percentage),
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="count text-body ms-3 fs-14 fw-medium">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SalesByCountry;
