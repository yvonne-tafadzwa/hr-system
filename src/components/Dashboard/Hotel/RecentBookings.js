"use client";

import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import Calendar from "react-calendar";

const RecentBookings = () => {
  // State for current date
  const [currentDate, setCurrentDate] = useState("");

  // Set current date on mount
  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);
  }, []);

  // Calendar
  const [value, setValue] = useState(new Date());

  // State for bookings data
  const [bookings, setBookings] = useState([]);

  // Fetch bookings data (mock API call)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: 1,
            room: "Duluxe Room - G - 3215",
            bookedBy: "Angela Carter",
            duration: "10 Dec - 15 Dec",
            image: "/images/room-5.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 2,
            room: "The Garden Suite 101",
            bookedBy: "Jack Smith",
            duration: "12 Dec - 16 Dec",
            image: "/images/room-6.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 3,
            room: "The Tranquil S-02",
            bookedBy: "Jennifer Anderson",
            duration: "15 Dec - 20 Dec",
            image: "/images/room-7.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 4,
            room: "The Queen - X - 231",
            bookedBy: "Angela Carter",
            duration: "11 Dec - 14 Dec",
            image: "/images/room-8.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 5,
            room: "Duluxe Room - G - 3215",
            bookedBy: "Angela Carter",
            duration: "10 Dec - 15 Dec",
            image: "/images/room-5.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 6,
            room: "The Garden Suite 101",
            bookedBy: "Jack Smith",
            duration: "12 Dec - 16 Dec",
            image: "/images/room-6.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 7,
            room: "The Tranquil S-02",
            bookedBy: "Jennifer Anderson",
            duration: "15 Dec - 20 Dec",
            image: "/images/room-7.jpg",
            link: "/hotel/room-details",
          },
          {
            id: 8,
            room: "The Queen - X - 231",
            bookedBy: "Angela Carter",
            duration: "11 Dec - 14 Dec",
            image: "/images/room-8.jpg",
            link: "/hotel/room-details",
          },
        ];

        setBookings(mockData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <div className="p-25">
          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3 mb-4">
            <h3 className="fs-18 fw-bold mb-0">Recent Bookings</h3>
            <div>
              <div className="d-flex align-items-center bg-gray-100 py-2 px-3 rounded-2 for-dark-digital-date">
                {currentDate}
                <i className="ri-calendar-2-line ms-2 fs-18 lh-1"></i>
              </div>
            </div>
          </div>

          <div className="calendar-container style-three">
            <Calendar
              onChange={setValue}
              value={value}
              className={"ra-calendar"}
            />
          </div>
        </div>

        <div className="p-25 pt-0 pe-0">
          <div
            className="last-child-none pe-4 recent-room-bookings"
            style={{
              height: "560px",
              overflowY: "auto",
            }}
          >
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={booking.link}
                className="mb-3 pb-3 border-bottom border-border-color child d-flex justify-content-between align-items-center flex-wrap gap-3 text-decoration-none"
              >
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "15px" }}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={booking.image}
                      className="rounded-1"
                      alt={booking.room}
                      width={80}
                      height={80}
                    />
                  </div>

                  <div className="flex-grow-1">
                    <h3 className="fs-14 fw-semibold mb-6">{booking.room}</h3>

                    <span className="d-block fs-12 mb-2 text-body">
                      Booked by {booking.bookedBy}
                    </span>

                    <span
                      className="bg-primary bg-opacity-10 fs-12 fw-medium text-primary d-inline-block rounded-1"
                      style={{
                        padding: "3px 8px",
                      }}
                    >
                      {booking.duration}
                    </span>
                  </div>
                </div>
                <i className="ri-arrow-right-line wh-30 d-flex d-lg-none d-xxl-flex justify-content-center align-items-center bg-border-color rounded-circle hover-bg"></i>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default RecentBookings;
