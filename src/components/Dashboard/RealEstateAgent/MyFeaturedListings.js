"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

const MyFeaturedListings = () => {
  // State for listings data
  const [listings, setListings] = useState([]);

  // Fetch listings data (mock API call)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: 1,
            title: "Luxury Comfort Villa",
            location: "London, United Kingdom",
            image: "/images/property-1.jpg",
            status: "For Rent",
            size: "425 Sft",
            beds: "3 Bed",
            baths: "2 Bath",
            price: "$4,274/m",
            link: "/real-estate-agent/property-details/",
          },
          {
            id: 2,
            title: "White House Villa",
            location: "New Castle, United Kingdom",
            image: "/images/property-2.jpg",
            status: "For Rent",
            size: "321 Sft",
            beds: "2 Bed",
            baths: "1 Bath",
            price: "$4,274/m",
            link: "/real-estate-agent/property-details/",
          },
          {
            id: 3,
            title: "Luxury Comfort Villa",
            location: "London, United Kingdom",
            image: "/images/property-1.jpg",
            status: "For Rent",
            size: "425 Sft",
            beds: "3 Bed",
            baths: "2 Bath",
            price: "$4,274/m",
            link: "/real-estate-agent/property-details/",
          },
          {
            id: 4,
            title: "White House Villa",
            location: "New Castle, United Kingdom",
            image: "/images/property-2.jpg",
            status: "For Rent",
            size: "321 Sft",
            beds: "2 Bed",
            baths: "1 Bath",
            price: "$4,274/m",
            link: "/real-estate-agent/property-details/",
          },
        ];

        setListings(mockData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <>
      <div className="border-0 rounded-3 position-relative p-25 bg-card-text-c my-featured-listings-bg">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-1 mb-4">
          <h3 className="mb-0">My Featured Listings</h3>
        </div>

        <Swiper
          spaceBetween={25}
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
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="my-featured-listings-slide z-0"
        >
          {listings.map((listing) => (
            <SwiperSlide key={listing.id}>
              <Link
                href={listing.link}
                className="text-decoration-none position-relative d-block"
              >
                <div
                  className="position-relative z-1 bg-img rounded-top-2"
                  style={{
                    backgroundImage: `url(${listing.image})`,
                    height: "202px",
                  }}
                >
                  <div className="position-absolute top-0 start-0 m-2">
                    <span
                      className="d-inline-block bg-card-text-c px-2 rounded-1 text-danger-50 fs-12 fw-medium"
                      style={{
                        paddingTop: "3px",
                        paddingBottom: "3px",
                      }}
                    >
                      {listing.status}
                    </span>
                  </div>
                </div>

                <div
                  className="bg-white rounded-bottom-2"
                  style={{
                    padding: "20px",
                  }}
                >
                  <h3
                    className="fs-16 fw-semibold"
                    style={{ marginBottom: "6px" }}
                  >
                    {listing.title}
                  </h3>

                  <span className="text-body">{listing.location}</span>

                  <ul
                    className="px-0 border-bottom list-unstyled d-flex justify-content-between align-items-center"
                    style={{
                      paddingBottom: "13px",
                      marginBottom: "13px",
                      marginTop: "13px",
                    }}
                  >
                    <li className="d-flex align-items-center gap-1 text-body">
                      <i className="material-symbols-outlined fs-18">
                        open_run{" "}
                      </i>
                      <span>{listing.size}</span>
                    </li>
                    
                    <li className="d-flex align-items-center gap-1 text-body">
                      <i className="material-symbols-outlined fs-18">bed </i>
                      <span>{listing.beds}</span>
                    </li>

                    <li className="d-flex align-items-center gap-1 text-body">
                      <i className="material-symbols-outlined fs-18">
                        bathtub{" "}
                      </i>
                      <span>{listing.baths}</span>
                    </li>
                  </ul>

                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">{listing.price}</h3>
                    <i className="ri-arrow-right-line wh-30 d-flex justify-content-center align-items-center bg-border-color rounded-circle hover-bg lh-1"></i>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default MyFeaturedListings;
