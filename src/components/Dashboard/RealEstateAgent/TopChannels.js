"use client";

import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const TopChannels = () => {
  // State for channels data
  const [channels, setChannels] = useState([]);

  // Function to determine progress bar color based on progress
  const getProgressColor = (progress) => {
    if (progress >= 80) return "#58f229"; // Green for high progress (80%+)
    if (progress >= 60) return "#fc7936"; // Orange for medium progress (60-79%)
    return "#f44336"; // Red for low progress (<60%)
  };

  // Fetch channels data (mock API call)
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: 1,
            name: "Facebook",
            type: "Community",
            image: "/images/facebook-real.svg",
            progress: 80,
          },
          {
            id: 2,
            name: "Dribbble",
            type: "Community",
            image: "/images/dribbble-real.svg",
            progress: 75,
          },
          {
            id: 3,
            name: "Instagram",
            type: "Reel",
            image: "/images/instagram-real.svg",
            progress: 80,
          },
          {
            id: 4,
            name: "Google",
            type: "SEO & PPC",
            image: "/images/google-real.svg",
            progress: 100,
          },
          {
            id: 5,
            name: "Figma",
            type: "Community",
            image: "/images/figma-real.svg",
            progress: 60,
          },
        ];

        setChannels(mockData);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, []);

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-25">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Top Channels</h3>

            <Link href="#" className="text-decoration-none hover">
              Browse All
              <i className="ri-arrow-right-s-line fs-22 lh-1 position-relative top-3"></i>
            </Link>
          </div>

          <ul className="px-0 mb-0 list-unstyled last-child-none pt-1">
            {channels.map((channel) => {
              const progressColor = getProgressColor(channel.progress);
              return (
                <li
                  className="lcbmp-none border-bottom"
                  key={channel.id}
                  style={{
                    marginBottom: "13.5px",
                    paddingBottom: "13.5px",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-shrink-0">
                      <div className="d-flex">
                        <Image
                          src={channel.image}
                          alt={channel.name}
                          width={25}
                          height={25}
                        />
                        <div className="ms-3">
                          <h4 className="mb-0 fs-14 fw-semibold">
                            {channel.name}
                          </h4>
                          <span
                            className="fs-12 d-block"
                            style={{ marginTop: "2px" }}
                          >
                            {channel.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow-1 ms-3">
                      <div
                        className="ms-auto"
                        style={{
                          position: "relative",
                          width: "43px",
                          height: "43px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `conic-gradient(${progressColor} ${channel.progress}%, #ffffff ${channel.progress}%)`,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: "87%",
                            height: "87%",
                            backgroundColor: "#ffffff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <p className="text-body" style={{ fontSize: "10px" }}>
                            {channel.progress}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default TopChannels;
