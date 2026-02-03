"use client";

import React, { useState, useEffect } from "react";
import { Row, Card, Table, Form, Button, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const RoomsListTable = () => {
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
  const sampleRooms = [
    {
      id: "1",
      code: "TRZ-32",
      name: "Serenity Suite",
      hotel: "Elysian Grand",
      image: "/images/room-5.jpg",
      bedType: "Double Bed",
      floor: "G-02",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$157/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "2",
      code: "TRZ-35",
      name: "Cozy Book Nook",
      hotel: "Celestial Haven",
      image: "/images/room-6.jpg",
      bedType: "Single Bed",
      floor: "G-01",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$146/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "3",
      code: "TRZ-36",
      name: "Velvet Orchid",
      hotel: "Opulent Orchid",
      image: "/images/room-7.jpg",
      bedType: "Master Bed",
      floor: "L1-15",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$125/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "4",
      code: "TRZ-37",
      name: "Vintage Studio",
      hotel: "The Aurelia",
      image: "/images/room-8.jpg",
      bedType: "Double Bed",
      floor: "L1-17",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$159/night",
      status: "Not Available",
      link: "/hotel/room-details",
    },
    {
      id: "5",
      code: "TRZ-39",
      name: "Blissful Dream",
      hotel: "Regal Horizon",
      image: "/images/room-9.jpg",
      bedType: "Master Bed",
      floor: "L2-22",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$120/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "6",
      code: "TRZ-42",
      name: "Rustic Hearth",
      hotel: "Velvet Vista",
      image: "/images/room-1.jpg",
      bedType: "Single Bed",
      floor: "L2-24",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$100/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "7",
      code: "TRZ-46",
      name: "Enchanted Forest",
      hotel: "The Ember Nest",
      image: "/images/room-2.jpg",
      bedType: "Double Bed",
      floor: "L2-28",
      facilities:
        "High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)",
      rate: "$145/night",
      status: "Not Available",
      link: "/hotel/room-details",
    },
    {
      id: "8",
      code: "TRZ-47",
      name: "Ocean Breeze",
      hotel: "Azure Retreat",
      image: "/images/room-3.jpg",
      bedType: "Queen Bed",
      floor: "L3-02",
      facilities: "High-speed Wi-Fi, Mini-fridge, Sea view, Air conditioning",
      rate: "$170/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "9",
      code: "TRZ-48",
      name: "Twilight Haven",
      hotel: "Nocturne Haven",
      image: "/images/room-4.jpg",
      bedType: "King Bed",
      floor: "L3-10",
      facilities: "High-speed Wi-Fi, Smart TV, Room service, Air conditioning",
      rate: "$180/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "10",
      code: "TRZ-49",
      name: "Luna Essence",
      hotel: "Luna Essence",
      image: "/images/room-5.jpg",
      bedType: "Double Bed",
      floor: "G-02",
      facilities:
        "High-speed Wi-Fi, Luxurious bath, Balcony view, Air conditioning",
      rate: "$157/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "11",
      code: "TRZ-50",
      name: "Harmony Hideaway",
      hotel: "Peaceful Pines",
      image: "/images/room-6.jpg",
      bedType: "Double Bed",
      floor: "L4-01",
      facilities: "Wi-Fi, Room heater, Coffee machine",
      rate: "$135/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "12",
      code: "TRZ-51",
      name: "Golden Glow",
      hotel: "Sunset Heights",
      image: "/images/room-7.jpg",
      bedType: "Queen Bed",
      floor: "L4-10",
      facilities: "Wi-Fi, Bathtub, Air conditioning, TV",
      rate: "$165/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "13",
      code: "TRZ-52",
      name: "Winter Whisper",
      hotel: "Frosty Peak Inn",
      image: "/images/room-8.jpg",
      bedType: "Master Bed",
      floor: "L5-05",
      facilities: "Heating, Wi-Fi, Cozy blankets, Hot shower",
      rate: "$140/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "14",
      code: "TRZ-53",
      name: "Crystal Chamber",
      hotel: "The Diamond View",
      image: "/images/room-9.jpg",
      bedType: "King Bed",
      floor: "L5-12",
      facilities: "Jacuzzi, Wi-Fi, Air conditioning, Minibar",
      rate: "$210/night",
      status: "Not Available",
      link: "/hotel/room-details",
    },
    {
      id: "15",
      code: "TRZ-54",
      name: "Mountain Mist",
      hotel: "Skyline Cabins",
      image: "/images/room-1.jpg",
      bedType: "Double Bed",
      floor: "L6-03",
      facilities: "Wi-Fi, Fireplace, Mini kitchen",
      rate: "$155/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "16",
      code: "TRZ-55",
      name: "Aurora Suite",
      hotel: "Northern Lights Lodge",
      image: "/images/room-2.jpg",
      bedType: "Queen Bed",
      floor: "L6-08",
      facilities: "Wi-Fi, Heating, Sky window view",
      rate: "$190/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "17",
      code: "TRZ-56",
      name: "Coral Cove",
      hotel: "Ocean's Embrace",
      image: "/images/room-3.jpg",
      bedType: "Double Bed",
      floor: "B1-10",
      facilities: "Wi-Fi, Sea view, Mini bar",
      rate: "$150/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "18",
      code: "TRZ-57",
      name: "Sunset Veranda",
      hotel: "The Cliffside Resort",
      image: "/images/room-4.jpg",
      bedType: "King Bed",
      floor: "L7-01",
      facilities: "Wi-Fi, Balcony, Sunset view",
      rate: "$175/night",
      status: "Available",
      link: "/hotel/room-details",
    },
    {
      id: "19",
      code: "TRZ-58",
      name: "Rainforest Retreat",
      hotel: "Amazon Escape",
      image: "/images/room-5.jpg",
      bedType: "Double Bed",
      floor: "G-01",
      facilities: "Wi-Fi, Mosquito net, Jungle view",
      rate: "$130/night",
      status: "Not Available",
      link: "/hotel/room-details",
    },
    {
      id: "20",
      code: "TRZ-59",
      name: "Skyline Studio",
      hotel: "Urban Heights",
      image: "/images/room-6.jpg",
      bedType: "Single Bed",
      floor: "Top-20",
      facilities: "Wi-Fi, City view, Workspace",
      rate: "$160/night",
      status: "Available",
      link: "/hotel/room-details",
    },
  ];

  const [rooms] = useState(sampleRooms);
  const [filteredRooms, setFilteredRooms] = useState(sampleRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  // Search functionality
  useEffect(() => {
    const filtered = rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.bedType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, rooms]);

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRooms(currentRooms.map((room) => room.id));
    } else {
      setSelectedRooms([]);
    }
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const isAllSelected =
    currentRooms.length > 0 &&
    currentRooms.every((room) => selectedRooms.includes(room.id));

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

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <form className="position-relative table-src-form me-0">
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y text-secondary">
                search
              </i>
            </form>
            <button
              className="btn btn-outline-primary fw-medium rounded-3 hover-bg"
              onClick={handleToggleShowModal}
            >
              <span className="d-flex align-items-center gap-2">
                <i className="ri-add-line d-none d-sm-inline-block fs-20 lh-1"></i>
                <span>Add New Room</span>
              </span>
            </button>
          </div>

          <div className="default-table-area all-products px-20">
            <div className="table-responsive">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th scope="col">
                      <div className="form-check d-flex align-items-center gap-2">
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
                      <span className="fs-14">Room Name</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Bed Type</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Floor</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Facilities</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Rate</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Status</span>
                    </th>
                    <th scope="col" className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentRooms.length > 0 ? (
                    currentRooms.map((room) => (
                      <tr key={room.id}>
                        <td className="text-body">
                          <div className="form-check d-flex align-items-center gap-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedRooms.includes(room.id)}
                              onChange={() => handleSelectRoom(room.id)}
                              id={`room-checkbox-${room.id}`}
                            />
                            <label
                              className="position-relative top-2"
                              htmlFor={`room-checkbox-${room.id}`}
                            >
                              {room.code}
                            </label>
                          </div>
                        </td>

                        <td>
                          <Link
                            href={room.link}
                            className="d-flex align-items-center"
                          >
                            <Image
                              src={room.image}
                              className="rounded-3"
                              alt={room.name}
                              width={60}
                              height={60}
                            />
                            <div className="ms-2 ps-1">
                              <h6 className="fw-medium fs-15 text-secondary mb-1">
                                {room.name}
                              </h6>
                              <span className="fs-13 text-body">
                                {room.hotel}
                              </span>
                            </div>
                          </Link>
                        </td>

                        <td className="text-secondary">{room.bedType}</td>

                        <td className="text-secondary">{room.floor}</td>

                        <td className="text-body">
                          <p style={{ maxWidth: "300px" }}>{room.facilities}</p>
                        </td>

                        <td className="text-secondary">{room.rate}</td>

                        <td>
                          <span
                            className={`d-inline-block border px-2 rounded-pill fs-12 fw-medium ${
                              room.status === "Available"
                                ? "bg-success-80 border-success-60 text-success-60"
                                : "bg-danger-70 border-danger-60 text-danger-60"
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                              <Link href={room.link}>
                                <i className="material-symbols-outlined fs-16 text-primary">
                                  visibility
                                </i>
                              </Link>
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
                        No rooms found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap">
              <span className="fs-13">
                Showing {indexOfFirstRoom + 1}-
                {Math.min(indexOfLastRoom, filteredRooms.length)} of{" "}
                {filteredRooms.length} Results
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
            <h3 className="fs-18 mb-0">Add New Room</h3>

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
                      placeholder="TRZ-32"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Room Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Golden Sun Room"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Level</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="L2-24"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Rate</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="157/night"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Facilities</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Status</Form.Label>
                    <Form.Select
                      className="form-control text-dark"
                      aria-label="Default select example"
                    >
                      <option>Select</option>
                      <option defaultValue="0">Available</option>
                      <option defaultValue="1">Not Available</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4 only-file-upload">
                    <Form.Label className="label text-secondary">
                      Upload Room Images
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
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>

                    <p className="mt-1 mb-0 small">Rcommended size: 640 x 660</p>

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

export default RoomsListTable;
