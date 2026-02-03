"use client";

import React from "react";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Sample dynamic data
const reviews = [
  {
    id: 1,
    name: "David Carlen",
    location: "New Castle, United Kingdom",
    image: "/images/user-182.jpg",
    review:
      "Working with William was an absolute pleasure. His market knowledge and attention to detail helped us sell our home quickly and at a great price.",
    rating: 5.0,
  },
  {
    id: 2,
    name: "Zinia Anderson",
    location: "New Brunswick, Canada",
    image: "/images/user-183.jpg",
    review:
      "William’s professionalism and responsiveness set him apart from other agents. He listened, and delivered outstanding results.",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Walter White",
    location: "New York, USA",
    image: "/images/user-184.jpg",
    review:
      "Thanks to William, I felt confident every step of the way during my first home purchase. His friendly demeanor and expert advice helped us.",
    rating: 4.0,
  },
  {
    id: 4,
    name: "Sophia Martinez",
    location: "Barcelona, Spain",
    image: "/images/user-1.jpg",
    review:
      "From the first call to the final signature, William provided top-tier service. I couldn’t have asked for a better experience.",
    rating: 5.0,
  },
  {
    id: 5,
    name: "Kenji Nakamura",
    location: "Tokyo, Japan",
    image: "/images/user-2.jpg",
    review:
      "William was efficient, clear, and truly had my best interest in mind. I’ll be recommending him to friends and family.",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Fatima El-Zahra",
    location: "Casablanca, Morocco",
    image: "/images/user-3.jpg",
    review:
      "Incredible service! William made what seemed like a stressful situation feel smooth and manageable. Thank you for everything!",
    rating: 4.9,
  },
];

const ClientRatings = () => {
  // Function to determine background color based on rating
  const getBackgroundClass = (rating) => {
    if (rating >= 5.0) return "bg-border-color-50"; // Blue for 5.0
    if (rating >= 4.5) return "bg-danger-100"; // Red for 4.5
    return "bg-success-90"; // Green for anything else (e.g., 4.0)
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="ri-star-fill text-danger lh-1"></i>
      );
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="ri-star-half-line text-danger lh-1"></i>
      );
    }

    // Add empty stars to complete 5
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="ri-star-line text-danger lh-1"></i>
      );
    }

    return stars;
  };

  return (
    <>
      <div className="bg-white border-0 rounded-3 mb-4 rea-client-ratings-card">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h3 className="mb-0">Client Ratings</h3>

            <Dropdown className="dropdown select-dropdown">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="dropdown-toggle border text-body rounded-2 bg-gray-100"
              >
                Top Rated
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-white border box-shadow">
                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Top Rated
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Latest
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  Oldest
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
            autoHeight={true}
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
              1440: {
                slidesPerView: 3,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="rea-client-ratings-slide z-0"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div
                  className={`border-0 rounded-3 ${getBackgroundClass(
                    review.rating
                  )} p-25`}
                >
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={review.image}
                        className="rounded-circle position-relative"
                        alt="user"
                        width={38}
                        height={38}
                        style={{
                          top: "-2px",
                        }}
                      />
                    </div>

                    <div className="flex-grow-1">
                      <h6
                        className="fw-semibold fs-14"
                        style={{
                          marginBottom: "3px",
                        }}
                      >
                        {review.name}
                      </h6>
                      <span className="fs-12 text-body">{review.location}</span>
                    </div>
                  </div>

                  <p
                    className="fs-16 text-secondary mb-20"
                    style={{
                      lineHeight: 1.5,
                    }}
                  >
                    {review.review}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "2px" }}
                    >
                      {renderStars(review.rating)}

                      <span className="fs-12 mx-1">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <i className="ri-double-quotes-r fs-30 text-white lh-1"></i>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ClientRatings;
