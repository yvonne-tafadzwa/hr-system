"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Row, Col } from "react-bootstrap";
import Image from "next/image";

const GuestsListTable = () => {
  // Modal
  const [isShowModal, setShowModal] = useState("false");
  const handleToggleShowModal = () => {
    setShowModal(!isShowModal);
  };

  // Upload Image
  const [images, setImages] = useState([]); // State to store uploaded images

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Optional: Remove an image from the preview
  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    // Revoke the object URL to free memory
    URL.revokeObjectURL(images[indexToRemove].url);
  };

  // Sample data - in a real app, this would come from an API
  const sampleGuests = [
    {
      id: "1",
      code: "#001",
      name: "Joanna Watson",
      image: "/images/user-1.jpg",
      checkIn: "Nov 01, 25 - 09:42 AM",
      checkOut: "Nov 03, 25 - 09:42 AM",
      room: "G0-12",
      totalBill: "$166.00",
      paymentStatus: "Completed",
    },
    {
      id: "2",
      code: "#002",
      name: "Orion Vale",
      image: "/images/user-2.jpg",
      checkIn: "Nov 02, 25 - 10:08 AM",
      checkOut: "Nov 05, 25 - 10:08 AM",
      room: "L1-15",
      totalBill: "$158.50",
      paymentStatus: "Pending",
    },
    {
      id: "3",
      code: "#003",
      name: "Seraphina Nyx",
      image: "/images/user-3.jpg",
      checkIn: "Nov 03, 25 - 11:12 AM",
      checkOut: "Nov 07, 25 - 11:12 AM",
      room: "L2-27",
      totalBill: "$250.50",
      paymentStatus: "Failed",
    },
    {
      id: "4",
      code: "#004",
      name: "Cassian Rhys",
      image: "/images/user-4.jpg",
      checkIn: "Oct 30, 25 - 10:32 AM",
      checkOut: "Nov 01, 25 - 10:32 AM",
      room: "G0-15",
      totalBill: "$313.99",
      paymentStatus: "Completed",
    },
    {
      id: "5",
      code: "#005",
      name: "Aurelia Dawn",
      image: "/images/user-5.jpg",
      checkIn: "Oct 27, 25 - 13:15 AM",
      checkOut: "Oct 30, 25 - 13:15 AM",
      room: "L3-32",
      totalBill: "$514.75",
      paymentStatus: "Completed",
    },
    {
      id: "6",
      code: "#006",
      name: "Lucien Drake",
      image: "/images/user-185.jpg",
      checkIn: "Oct 18, 25 - 12:18 AM",
      checkOut: "Oct 21, 25 - 12:18 AM",
      room: "G0-17",
      totalBill: "$215.99",
      paymentStatus: "Completed",
    },
    {
      id: "7",
      code: "#007",
      name: "Elara Quinn",
      image: "/images/user-186.jpg",
      checkIn: "Oct 15, 25 - 20:23 AM",
      checkOut: "Oct 20, 25 - 20:23 AM",
      room: "L1-19",
      totalBill: "$216.50",
      paymentStatus: "Pending",
    },
    {
      id: "8",
      code: "#008",
      name: "Evander Cole",
      image: "/images/user-187.jpg",
      checkIn: "Oct 14, 25 - 21:14 AM",
      checkOut: "Oct 18, 25 - 21:14 AM",
      room: "G0-11",
      totalBill: "$112.99",
      paymentStatus: "Failed",
    },
    {
      id: "9",
      code: "#009",
      name: "Isolde Faye",
      image: "/images/user-188.jpg",
      checkIn: "Sep 05, 25 - 19:37 AM",
      checkOut: "Sep 10, 25 - 19:37 AM",
      room: "L2-24",
      totalBill: "$513.50",
      paymentStatus: "Completed",
    },
    {
      id: "10",
      code: "#010",
      name: "Theo Alistair",
      image: "/images/user-189.jpg",
      checkIn: "Sep 01, 25 - 09:42 AM",
      checkOut: "Sep 02, 25 - 09:42 AM",
      room: "L3-30",
      totalBill: "$115.25",
      paymentStatus: "Completed",
    },
    {
      id: "11",
      code: "#011",
      name: "Nova Gray",
      image: "/images/user-1.jpg",
      checkIn: "Aug 28, 25 - 07:00 AM",
      checkOut: "Aug 30, 25 - 07:00 AM",
      room: "G0-09",
      totalBill: "$189.00",
      paymentStatus: "Completed",
    },
    {
      id: "12",
      code: "#012",
      name: "Ronan Wolfe",
      image: "/images/user-2.jpg",
      checkIn: "Aug 25, 25 - 16:40 AM",
      checkOut: "Aug 29, 25 - 16:40 AM",
      room: "L1-28",
      totalBill: "$320.40",
      paymentStatus: "Pending",
    },
    {
      id: "13",
      code: "#013",
      name: "Lyra Storm",
      image: "/images/user-3.jpg",
      checkIn: "Aug 20, 25 - 18:22 AM",
      checkOut: "Aug 23, 25 - 18:22 AM",
      room: "L2-35",
      totalBill: "$212.35",
      paymentStatus: "Completed",
    },
    {
      id: "14",
      code: "#014",
      name: "Finnian Blake",
      image: "/images/user-4.jpg",
      checkIn: "Aug 18, 25 - 14:19 AM",
      checkOut: "Aug 22, 25 - 14:19 AM",
      room: "G0-20",
      totalBill: "$198.90",
      paymentStatus: "Failed",
    },
    {
      id: "15",
      code: "#015",
      name: "Celeste Marlowe",
      image: "/images/user-5.jpg",
      checkIn: "Aug 15, 25 - 12:00 AM",
      checkOut: "Aug 19, 25 - 12:00 AM",
      room: "L3-38",
      totalBill: "$267.00",
      paymentStatus: "Completed",
    },
    {
      id: "16",
      code: "#016",
      name: "Dorian Pike",
      image: "/images/user-6.jpg",
      checkIn: "Aug 10, 25 - 11:15 AM",
      checkOut: "Aug 13, 25 - 11:15 AM",
      room: "G0-23",
      totalBill: "$133.33",
      paymentStatus: "Pending",
    },
    {
      id: "17",
      code: "#017",
      name: "Mira Solace",
      image: "/images/user-7.jpg",
      checkIn: "Aug 08, 25 - 10:01 AM",
      checkOut: "Aug 11, 25 - 10:01 AM",
      room: "L1-41",
      totalBill: "$411.00",
      paymentStatus: "Completed",
    },
    {
      id: "18",
      code: "#018",
      name: "Thorne Ash",
      image: "/images/user-8.jpg",
      checkIn: "Aug 05, 25 - 09:15 AM",
      checkOut: "Aug 08, 25 - 09:15 AM",
      room: "L2-44",
      totalBill: "$284.70",
      paymentStatus: "Failed",
    },
    {
      id: "19",
      code: "#019",
      name: "Rowan Ember",
      image: "/images/user-9.jpg",
      checkIn: "Aug 02, 25 - 08:45 AM",
      checkOut: "Aug 05, 25 - 08:45 AM",
      room: "G0-30",
      totalBill: "$190.25",
      paymentStatus: "Completed",
    },
    {
      id: "20",
      code: "#020",
      name: "Amara Voss",
      image: "/images/user-10.jpg",
      checkIn: "Jul 30, 25 - 07:50 AM",
      checkOut: "Aug 02, 25 - 07:50 AM",
      room: "L3-50",
      totalBill: "$305.45",
      paymentStatus: "Pending",
    },
  ];

  const [guests] = useState(sampleGuests);
  const [filteredGuests, setFilteredGuests] = useState(sampleGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 10;

  // Search functionality
  useEffect(() => {
    const filtered = guests.filter(
      (guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGuests(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, guests]);

  // Pagination
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest
  );
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGuests(currentGuests.map((guest) => guest.id));
    } else {
      setSelectedGuests([]);
    }
  };

  const handleSelectGuest = (guestId) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    );
  };

  const isAllSelected =
    currentGuests.length > 0 &&
    currentGuests.every((guest) => selectedGuests.includes(guest.id));

  // Page change handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get status badge class based on payment status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success-80 border-success-60 text-success-60";
      case "Pending":
        return "bg-primary-div-60 border-primary-div-50 text-primary-div-50";
      case "Failed":
        return "bg-danger-70 border-danger-80 text-danger-80";
      default:
        return "bg-secondary border-secondary text-secondary";
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <Form className="position-relative table-src-form me-0">
              <Form.Control
                type="text"
                className="border-0"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y text-secondary">
                search
              </i>
            </Form>

            <Button
              variant="outline-primary"
              className="fw-medium rounded-3 hover-bg"
              onClick={handleToggleShowModal}
            >
              <span
                className="d-flex align-items-center"
                style={{ gap: "5px" }}
              >
                <i className="ri-add-line d-none d-sm-inline-block fs-20 lh-1"></i>
                <span>Add New Guest</span>
              </span>
            </Button>
          </div>

          <div className="default-table-area all-products">
            <div className="table-responsive">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th scope="col">
                      <div
                        className="form-check d-flex align-items-center"
                        style={{ gap: "10px" }}
                      >
                        <input
                          className="form-check-input position-relative top-1"
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          id="flexCheckDefault1"
                        />
                        <label
                          className="position-relative top-2 fs-14"
                          htmlFor="flexCheckDefault1"
                        >
                          Code
                        </label>
                      </div>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Guest Name</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Check In</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Check Out</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Room</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Total Bill</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Payment Status</span>
                    </th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGuests.length > 0 ? (
                    currentGuests.map((guest) => (
                      <tr key={guest.id}>
                        <td className="text-body">
                          <div
                            className="form-check d-flex align-items-center"
                            style={{ gap: "10px" }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedGuests.includes(guest.id)}
                              onChange={() => handleSelectGuest(guest.id)}
                              id={`guest-checkbox-${guest.id}`}
                            />
                            <label
                              className="position-relative top-2 text-secondary"
                              htmlFor={`guest-checkbox-${guest.id}`}
                            >
                              {guest.code}
                            </label>
                          </div>
                        </td>
                        <td>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: "12px" }}
                          >
                            <Image
                              src={guest.image}
                              className="rounded-circle"
                              alt={guest.name}
                              width={40}
                              height={40}
                            />
                            <h6 className="fw-semibold fs-14 text-secondary mb-0">
                              {guest.name}
                            </h6>
                          </div>
                        </td>
                        <td className="text-secondary">{guest.checkIn}</td>
                        <td className="text-secondary">{guest.checkOut}</td>
                        <td className="text-body">{guest.room}</td>
                        <td className="text-secondary">{guest.totalBill}</td>
                        <td>
                          <span
                            className={`d-inline-block border px-2 rounded-pill fs-12 fw-medium ${getStatusBadgeClass(
                              guest.paymentStatus
                            )}`}
                          >
                            {guest.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 justify-content-end">
                            <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                              <i className="material-symbols-outlined fs-16 text-primary">
                                visibility
                              </i>
                            </button>
                            <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                              <i className="material-symbols-outlined fs-16 text-body">
                                edit
                              </i>
                            </button>
                            <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                              <i className="material-symbols-outlined fs-16 text-danger">
                                delete
                              </i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        No guests found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap">
              <span className="fs-13">
                Showing {indexOfFirstGuest + 1}-
                {Math.min(indexOfLastGuest, filteredGuests.length)} of{" "}
                {filteredGuests.length} Results
              </span>

              <nav aria-label="Page navigation example">
                <ul className="pagination mb-0 justify-content-center">
                  <li className="page-item">
                    <button
                      className="page-link icon hover-bg"
                      aria-label="Previous"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <i className="material-symbols-outlined">
                        keyboard_arrow_left
                      </i>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <li className="page-item" key={pageNumber}>
                        <button
                          className={`page-link ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                          onClick={() => handlePageClick(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    )
                  )}
                  <li className="page-item">
                    <button
                      className="page-link icon hover-bg"
                      aria-label="Next"
                      onClick={handleNextPage}
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
        </Card.Body>
      </Card>

      {/* Modal */}
      <div className={`custom-modal center ${isShowModal ? "" : "show"}`}>
        <div className="custom-modal-content position-relative z-3">
          <div className="border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <h3 className="fs-18 mb-0">Add New Guest</h3>

            <div className="close-link" onClick={handleToggleShowModal}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <div className="p-4">
            <Form>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Code</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="#001"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Guest Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="John Doe"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Check In</Form.Label>
                    <Form.Control
                      type="date"
                      className="text-dark" 
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Check Out</Form.Label>
                    <Form.Control
                      type="date"
                      className="text-dark" 
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Room</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="GO-24"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Total Bill</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="$250.00"
                    />
                  </Form.Group>
                </Col>
 
                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Payment Status</Form.Label>
                    <Form.Select
                      className="form-control text-dark"
                      aria-label="Default select example"
                    >
                      <option>Select</option>
                      <option defaultValue="0">Completed</option>
                      <option defaultValue="1">Pending</option>
                      <option defaultValue="2">Failed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4 only-file-upload">
                    <Form.Label className="label text-secondary">
                      Avatar
                    </Form.Label>

                    <div className="form-control h-100 text-center position-relative p-4 p-lg-5">
                      <div className="product-upload">
                        <label
                          htmlFor="file-upload"
                          className="file-upload mb-0"
                        >
                          <i className="ri-folder-image-line bg-primary bg-opacity-10 p-2 rounded-1 text-primary"></i>
                          <span className="d-block text-body fs-14">
                            Drag and drop an image or{" "}
                            <span className="text-primary text-decoration-underline">
                              Browse
                            </span>
                          </span>
                        </label>
                        <label
                          className="position-absolute top-0 bottom-0 start-0 end-0 cursor"
                          id="upload-container"
                        >
                          <input
                            className="form__file bottom-0"
                            id="upload-files"
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>

                    <p className="mt-1 mb-0 small">Rcommended size: 100 x 100</p>

                    {/* Dynamic Image Preview */}
                    <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                      {images.map((image, index) => (
                        <div key={index} className="position-relative">
                          <Image
                            src={image.url}
                            alt={image.name}
                            width={60}
                            height={60}
                            style={{ objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="position-absolute p-0 top-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "16px",
                              height: "16px",
                              fontSize: "12px",
                              border: "none",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <div className="d-flex justify-content-end flex-wrap gap-3">
                    <Button
                      className="btn btn-danger py-2 px-4 fw-medium fs-16 text-white"
                      onClick={handleToggleShowModal}
                    >
                      Cancel
                    </Button>

                    <Button className="btn btn-primary py-2 px-4 fw-medium fs-16">
                      {" "}
                      <i className="ri-add-line text-white fw-medium"></i>{" "}
                      Create
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>

        <div className="close-outside" onClick={handleToggleShowModal}></div>
      </div>
    </>
  );
};

export default GuestsListTable;
