"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

const PopularRooms = () => {
  // State for rooms data
  const [rooms, setRooms] = useState([]);

  // Fetch rooms data (mock API call)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: 1,
            name: "The Velvet - F - 32045",
            code: "SJ-32056",
            image: "/images/room-1.jpg",
            status: "Booked",
            link: "/hotel/room-details",
          },
          {
            id: 2,
            name: "Duluxe Room - G - 3215",
            code: "SJ-32056",
            image: "/images/room-2.jpg",
            status: "Available",
            link: "/hotel/room-details",
          },
          {
            id: 3,
            name: "The Garden Suite 101",
            code: "SJ-32056",
            image: "/images/room-3.jpg",
            status: "Booked",
            link: "/hotel/room-details",
          },
          {
            id: 4,
            name: "The Tranquil S-02",
            code: "SJ-32056",
            image: "/images/room-4.jpg",
            status: "Available",
            link: "/hotel/room-details",
          },
          {
            id: 5,
            name: "The Velvet - F - 32045",
            code: "SJ-32056",
            image: "/images/room-1.jpg",
            status: "Booked",
            link: "/hotel/room-details",
          },
          {
            id: 6,
            name: "Duluxe Room - G - 3215",
            code: "SJ-32056",
            image: "/images/room-2.jpg",
            status: "Available",
            link: "/hotel/room-details",
          },
          {
            id: 7,
            name: "The Garden Suite 101",
            code: "SJ-32056",
            image: "/images/room-3.jpg",
            status: "Booked",
            link: "/hotel/room-details",
          },
          {
            id: 8,
            name: "The Tranquil S-02",
            code: "SJ-32056",
            image: "/images/room-4.jpg",
            status: "Available",
            link: "/hotel/room-details",
          },
        ];

        setRooms(mockData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>
      <div className="border-0 rounded-3 bg-white position-relative mb-4 p-25 popular-rooms-bg">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h3 className="mb-0">Popular Rooms</h3>
        </div>

        <Swiper
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
            1440: {
              slidesPerView: 4,
            },
            1850: {
              slidesPerView: 4,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="popular-rooms-slide z-0"
        >
          {rooms.map((room) => (
            <SwiperSlide key={room.id}>
              <Link
                href={room.link}
                className="text-decoration-none position-relative d-block"
              >
                <Image
                  src={room.image}
                  className="rounded-3"
                  alt={room.name}
                  width={500}
                  height={500}
                />

                <h3 className="mt-3 mb-6 fs-16 fw-semibold hover">
                  {room.name}
                </h3>

                <span className="text-body">
                  Code <strong className="fw-semibold">{room.code}</strong>
                </span>

                <div className="position-absolute top-0 end-0 m-2">
                  <span
                    className={`d-inline-block border px-2 rounded-pill fs-12 fw-medium ${
                      room.status === "Booked"
                        ? "bg-card-text-c border-danger-50 text-danger-50"
                        : "bg-success-80 border-success-60 text-success-60"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default PopularRooms;
