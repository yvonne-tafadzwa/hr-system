"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";

const RoomsAvailability = () => {
  const [Chart, setChart] = useState();
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  const series = [72.5];

  const options = {
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            offsetY: -10,
            fontSize: "14px",
            fontFamily: "Inter",
            color: "#64748B",
            fontWeight: "400",
          },
          value: {
            fontSize: "36px",
            fontFamily: "Inter",
            color: "#3A4252",
            fontWeight: "700",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        track: {
          background: "#EEFFE5",
        },
      },
    },
    colors: ["#37D80A"],
    labels: ["Total Booked"],
    stroke: {
      dashArray: 7,
    },
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <div className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-0">
            <h3 className="mb-0">Rooms Availability</h3>

            <Dropdown className="dropdown select-dropdown">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="dropdown-toggle bg-border-color border text-body rounded-2"
              >
                Daily
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-white border box-shadow">
                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Daily
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Weekly
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Monthly
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Yearly
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div style={{ margin: "-17px 0 0 0" }}>
            {Chart && (
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={380}
              />
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default RoomsAvailability;
