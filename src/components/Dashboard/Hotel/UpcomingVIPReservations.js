"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Table, Card, Dropdown } from "react-bootstrap";

const UpcomingVIPReservations = () => {
  // State for reservations and pagination
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Mock API fetch (replace with real API call)
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Simulated API response
        const mockData = [
          {
            id: "TRZ-32",
            room: "Duluxe Room - G - 3215",
            customer: "Angela Carter",
            duration: "10 Dec - 15 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-34",
            room: "Sweet Suite - S - 1265",
            customer: "Walter White",
            duration: "12 Dec - 16 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-42",
            room: "The Queensland - Q32",
            customer: "Zennifer Loren",
            duration: "15 Dec - 20 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-15",
            room: "Sweet Suite - S - 3214",
            customer: "Johna Mandala",
            duration: "11 Dec - 14 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-29",
            room: "Duluxe Room - F - 7213",
            customer: "Viktor James",
            duration: "10 Dec - 15 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-30",
            room: "Premium Suite - P - 4210",
            customer: "Emma Stone",
            duration: "18 Dec - 22 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-31",
            room: "Royal Room - R - 5211",
            customer: "Liam Neeson",
            duration: "20 Dec - 25 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-45",
            room: "Ocean View Room - O - 1288",
            customer: "Sophia Turner",
            duration: "13 Dec - 17 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-46",
            room: "Garden Suite - G - 2301",
            customer: "David Beckham",
            duration: "19 Dec - 24 Dec",
            viewRoom: "/hotel/room-details/",
          },
          {
            id: "TRZ-47",
            room: "Executive Room - E - 3030",
            customer: "Natalie Portman",
            duration: "21 Dec - 26 Dec",
            viewRoom: "/hotel/room-details/",
          },
        ];

        // Calculate total pages
        setTotalPages(Math.ceil(mockData.length / itemsPerPage));

        // Slice data for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = mockData.slice(
          startIndex,
          startIndex + itemsPerPage
        );

        setReservations(paginatedData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [currentPage]);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id) => {
    if (confirm(`Are you sure you want to delete reservation ${id}?`)) {
      setReservations(reservations.filter((res) => res.id !== id));
      alert(`Deleted reservation: ${id}`);
    }
  };

  return (
    <>
      <Card className="border-0 rounded-3 bg-white position-relative mb-4 p-25">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-1">
          <h3 className="mb-0">Upcoming VIP Reservations</h3>

          <Dropdown className="dropdown select-dropdown">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="dropdown-toggle bg-border-color border text-body rounded-2"
            >
              Monthly
            </Dropdown.Toggle>

            <Dropdown.Menu className="bg-white border box-shadow">
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

        <div className="default-table-area style-two upcoming-vip-reservations-table">
          <div className="table-responsive">
            <Table className="table align-middle border-0">
              <thead>
                <tr className="border-bottom">
                  <th
                    scope="col"
                    className="bg-transparent text-body fw-medium"
                  >
                    <span className="fs-10 text-body fw-bold letter-spacing-1">
                      CODE
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="bg-transparent text-body fw-medium"
                  >
                    <span className="fs-10 text-body fw-bold letter-spacing-1">
                      ROOM
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="bg-transparent text-body fw-medium"
                  >
                    <span className="fs-10 text-body fw-bold letter-spacing-1">
                      CUSTOMER
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="bg-transparent text-body fw-medium"
                  >
                    <span className="fs-10 text-body fw-bold letter-spacing-1">
                      DURATION
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="text-end bg-transparent text-body fw-medium"
                  >
                    <span className="fs-10 text-body fw-bold letter-spacing-1 opacity-0">
                      ACTION
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="fs-12 fw-semibold text-body">
                      {reservation.id}
                    </td>
                    <td>
                      <Link
                        href={reservation.viewRoom}
                        className="fs-14 fw-semibold text-secondary"
                      >
                        {reservation.room}
                      </Link>
                    </td>

                    <td className="fs-12 fw-semibold text-body-color-50">
                      {reservation.customer}
                    </td>

                    <td>
                      <span
                        className="fs-12 fw-medium bg-primary bg-opacity-10 text-primary d-inline-block rounded-1"
                        style={{
                          padding: "3px 8px",
                        }}
                      >
                        {reservation.duration}
                      </span>
                    </td>

                    <td className="text-end">
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                          <Link href={reservation.viewRoom}>
                            <i className="material-symbols-outlined fs-16 text-primary">
                              visibility
                            </i>
                          </Link>
                        </button>

                        <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                          <i className="material-symbols-outlined fs-16 text-primary-div-50">
                            edit
                          </i>
                        </button>

                        <button
                          className="ps-0 border-0 bg-transparent lh-1 position-relative top-2"
                          onClick={() => handleDelete(reservation.id)}
                        >
                          <i className="material-symbols-outlined fs-16 text-danger">
                            delete
                          </i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap mt-10">
            <span className="fs-12 fw-medium">
              Showing {reservations.length} of {totalPages * itemsPerPage}{" "}
              Results
            </span>

            <nav aria-label="Page navigation example">
              <ul className="pagination mb-0 justify-content-center">
                <li className="page-item">
                  <button
                    className="page-link icon hover-bg"
                    aria-label="Previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="material-symbols-outlined">
                      keyboard_arrow_left
                    </i>
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li className="page-item" key={index}>
                    <button
                      className={`page-link ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link icon hover-bg"
                    aria-label="Next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="material-symbols-outlined">
                      keyboard_arrow_right
                    </i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Card>
    </>
  );
};

export default UpcomingVIPReservations;
