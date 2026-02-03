"use client";

import React, { useState, useEffect } from "react";
import { Card, Dropdown } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const RecentClients = () => {
  // State for clients data
  const [clients, setClients] = useState([]);

  // Fetch clients data (mock API call)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: 1,
            name: "Johhna Loren",
            occupation: "Doctor",
            image: "/images/user-177.png",
            status: "active",
            link: "#",
          },
          {
            id: 2,
            name: "Zinia Watson",
            occupation: "Lawyer",
            image: "/images/user-157.png",
            status: "active",
            link: "#",
          },
          {
            id: 3,
            name: "Angela Carter",
            occupation: "Businesswoman",
            image: "/images/user-158.png",
            status: "active",
            link: "#",
          },
          {
            id: 4,
            name: "Skyler White",
            occupation: "Entrepreneur",
            image: "/images/user-159.png",
            status: "inactive",
            link: "#",
          },
          {
            id: 5,
            name: "Jane Ronan",
            occupation: "Editor",
            image: "/images/user-160.png",
            status: "active",
            link: "#",
          },
          {
            id: 6,
            name: "Viktor James",
            occupation: "Editor",
            image: "/images/user-154.png",
            status: "inactive",
            link: "#",
          },
          {
            id: 7,
            name: "Zinia Lisa",
            occupation: "Lawyer",
            image: "/images/user-155.png",
            status: "active",
            link: "#",
          },
        ];

        setClients(mockData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <h3 className="mb-0">Recent Clients</h3>

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

          <ul className="ps-0 mb-0 list-unstyled pt-3 border-top">
            {clients.map((client) => (
              <li
                key={client.id}
                className="lcbmp-none border-bottom d-flex justify-content-between align-items-center"
                style={{
                  marginBottom: "10.6px",
                  paddingBottom: "10.6px",
                }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "14px" }}
                >
                  <div
                    className="flex-shrink-0 position-relative"
                    style={{ top: "-2px" }}
                  >
                    <Image
                      src={client.image}
                      alt={client.name}
                      width={35}
                      height={35}
                    />
                    <div
                      className={`position-absolute border border-1 border-white rounded-circle status-position2 bottom-0 ${
                        client.status === "active"
                          ? "bg-success-60"
                          : "bg-body-color-60"
                      }`}
                      style={{
                        width: "12px",
                        height: "12px",
                      }}
                    ></div>
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="fs-14 fw-semibold mb-0">{client.name}</h4>
                    <span
                      className="fs-12 d-block"
                      style={{ marginTop: "2px" }}
                    >
                      {client.occupation}
                    </span>
                  </div>
                </div>
                <Link href={client.link} className="text-decoration-none">
                  <i className="ri-arrow-right-line fs-18"></i>
                </Link>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default RecentClients;
