"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const PropertiesTable = () => {
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
  const sampleProperties = [
    {
      id: "1",
      code: "TRZ-32",
      type: "Luxury Apartment",
      name: "The Golden Haven",
      image: "/images/property-17.jpg",
      address: "123 Sunshine Boulevard, Vancouver, BC",
      views: 1450,
      date: "12 Nov, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "2",
      code: "TRZ-35",
      type: "High-End Villa",
      name: "Tranquil Meadows",
      image: "/images/property-18.jpg",
      address: "456 Whispering Pines Lane, Toronto, ON",
      views: 1890,
      date: "10 Nov, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "3",
      code: "TRZ-36",
      type: "Beachfront House",
      name: "Aurora Heights",
      image: "/images/property-19.jpg",
      address: "789 Northern Lights Drive, Calgary, AB",
      views: 1320,
      date: "08 Nov, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "4",
      code: "TRZ-37",
      type: "Mountain Cabin",
      name: "Crystal Cove Villas",
      image: "/images/property-20.jpg",
      address: "234 Seaside Avenue, Halifax, NS",
      views: 1124,
      date: "10 Nov, 25",
      status: "Inactive",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "5",
      code: "TRZ-39",
      type: "Business Center",
      name: "Verdant Valley Estates",
      image: "/images/property-21.jpg",
      address: "567 Greenfield Circle, Winnipeg, MB",
      views: 1532,
      date: "18 Oct, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "6",
      code: "TRZ-42",
      type: "Conference & Event Venue",
      name: "Summit Business Hub",
      image: "/images/property-22.jpg",
      address: "890 Innovation Street, Ottawa, ON",
      views: 7721,
      date: "17 Oct, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "7",
      code: "TRZ-45",
      type: "Luxury Condo",
      name: "Azure Sky Residences",
      image: "/images/property-23.jpg",
      address: "321 Oceanview Drive, Victoria, BC",
      views: 2105,
      date: "15 Oct, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "8",
      code: "TRZ-48",
      type: "Country Estate",
      name: "Whispering Willows",
      image: "/images/property-24.jpg",
      address: "654 Meadowbrook Road, Montreal, QC",
      views: 985,
      date: "12 Oct, 25",
      status: "Inactive",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "9",
      code: "TRZ-51",
      type: "Urban Loft",
      name: "Metropolitan Heights",
      image: "/images/property-25.jpg",
      address: "987 Downtown Avenue, Quebec City, QC",
      views: 3420,
      date: "10 Oct, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "10",
      code: "TRZ-54",
      type: "Lakefront Cottage",
      name: "Serene Waters Retreat",
      image: "/images/property-26.jpg",
      address: "159 Lakeshore Drive, Kelowna, BC",
      views: 1780,
      date: "05 Oct, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "11",
      code: "TRZ-57",
      type: "Sky Penthouse",
      name: "Celestial Towers",
      image: "/images/property-17.jpg",
      address: "400 Skyrise Blvd, Edmonton, AB",
      views: 2211,
      date: "04 Oct, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "12",
      code: "TRZ-60",
      type: "Eco Farmhouse",
      name: "Green Horizon Fields",
      image: "/images/property-18.jpg",
      address: "801 Rural Road, Saskatoon, SK",
      views: 1645,
      date: "01 Oct, 25",
      status: "Inactive",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "13",
      code: "TRZ-63",
      type: "Modern Bungalow",
      name: "Maple Serenity Home",
      image: "/images/property-19.jpg",
      address: "920 Maple Avenue, London, ON",
      views: 1289,
      date: "29 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "14",
      code: "TRZ-66",
      type: "Heritage Home",
      name: "Victorian Charm",
      image: "/images/property-20.jpg",
      address: "45 Queen Street, St. John's, NL",
      views: 1032,
      date: "27 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "15",
      code: "TRZ-69",
      type: "Luxury Mansion",
      name: "Prestige Palace",
      image: "/images/property-21.jpg",
      address: "999 Royal Lane, Mississauga, ON",
      views: 4523,
      date: "25 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "16",
      code: "TRZ-72",
      type: "Commercial Plaza",
      name: "Metro Trade Park",
      image: "/images/property-22.jpg",
      address: "11 Commerce Ave, Hamilton, ON",
      views: 2904,
      date: "22 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "17",
      code: "TRZ-75",
      type: "Historic Castle",
      name: "Stonebridge Fortress",
      image: "/images/property-23.jpg",
      address: "1000 Castle Hill Rd, Charlottetown, PE",
      views: 3850,
      date: "20 Sep, 25",
      status: "Inactive",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "18",
      code: "TRZ-78",
      type: "Seaside Resort",
      name: "Ocean Pearl Villas",
      image: "/images/property-24.jpg",
      address: "222 Beachline Blvd, Nanaimo, BC",
      views: 3045,
      date: "18 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "19",
      code: "TRZ-81",
      type: "Modern Duplex",
      name: "Urban Grid Homes",
      image: "/images/property-25.jpg",
      address: "321 Cityscape Way, Barrie, ON",
      views: 1560,
      date: "15 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
    {
      id: "20",
      code: "TRZ-84",
      type: "Luxury Townhouse",
      name: "Cedar Grove Estates",
      image: "/images/property-26.jpg",
      address: "800 Cedarwood Lane, Brampton, ON",
      views: 2098,
      date: "13 Sep, 25",
      status: "Active",
      link: "/real-estate-agent/property-details",
    },
  ];

  const [properties] = useState(sampleProperties);
  const [filteredProperties, setFilteredProperties] =
    useState(sampleProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

  // Search functionality
  useEffect(() => {
    const filtered = properties.filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, properties]);

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProperties(currentProperties.map((property) => property.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const isAllSelected =
    currentProperties.length > 0 &&
    currentProperties.every((property) =>
      selectedProperties.includes(property.id)
    );

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

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success-80 border-success-60 text-success-60";
      case "Inactive":
        return "bg-danger-70 border-danger-60 text-danger-60";
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

            <button
              className="btn btn-outline-primary fw-medium rounded-3 hover-bg"
              onClick={handleToggleShowModal}
            >
              <span
                className="d-flex align-items-center"
                style={{ gap: "5px" }}
              >
                <i className="ri-add-line d-none d-sm-inline-block fs-20 lh-1"></i>
                <span>Add New Property</span>
              </span>
            </button>
          </div>

          <div className="default-table-area all-products px-20">
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
                      <span className="fs-14">Property</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Address</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Views</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Date</span>
                    </th>
                    <th scope="col">
                      <span className="fs-14">Status</span>
                    </th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentProperties.length > 0 ? (
                    currentProperties.map((property) => (
                      <tr key={property.id}>
                        <td className="text-body">
                          <div
                            className="form-check d-flex align-items-center"
                            style={{ gap: "10px" }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedProperties.includes(property.id)}
                              onChange={() => handleSelectProperty(property.id)}
                              id={`property-checkbox-${property.id}`}
                            />
                            <label
                              className="position-relative top-2"
                              htmlFor={`property-checkbox-${property.id}`}
                            >
                              {property.code}
                            </label>
                          </div>
                        </td>

                        <td>
                          <Link
                            href={property.link}
                            className="d-flex align-items-center"
                          >
                            <Image
                              src={property.image}
                              className="rounded-3"
                              alt={property.name}
                              width={60}
                              height={60}
                            />
                            <div className="ms-2 ps-1">
                              <span className="fs-13 text-body mb-1 d-block">
                                {property.type}
                              </span>
                              <h6 className="fw-medium fs-15 text-secondary mb-0">
                                {property.name}
                              </h6>
                            </div>
                          </Link>
                        </td>

                        <td className="text-secondary">
                          <p style={{ maxWidth: "300px" }}>
                            {property.address}
                          </p>
                        </td>

                        <td className="text-secondary">
                          {property.views.toLocaleString()}
                        </td>

                        <td className="text-secondary">{property.date}</td>

                        <td>
                          <span
                            className={`d-inline-block border px-2 rounded-pill fs-12 fw-medium ${getStatusBadgeClass(
                              property.status
                            )}`}
                          >
                            {property.status}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <button className="ps-0 border-0 bg-transparent lh-1 position-relative top-2">
                              <Link href={property.link}>
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
                      <td colSpan={7} className="text-center py-4">
                        No properties found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap">
              <span className="fs-13">
                Showing {indexOfFirstProperty + 1}-
                {Math.min(indexOfLastProperty, filteredProperties.length)} of{" "}
                {filteredProperties.length} Results
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
            <h3 className="fs-18 mb-0">Add New Property</h3>

            <div className="close-link" onClick={handleToggleShowModal}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <div className="p-4">
            <Form>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">Code</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="TRZ-32"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">Property Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Golden Sun Room"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">Address</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="789 Northern Blvd, New York, NY 10001"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">Views</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="2012"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">Date</Form.Label>
                    <Form.Control
                      type="date"
                      className="text-dark" 
                    />
                  </Form.Group>
                </Col>
 
                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">Status</Form.Label>
                    <Form.Select
                      className="form-control text-dark"
                      aria-label="Default select example"
                    >
                      <option>Select</option>
                      <option defaultValue="0">Active</option>
                      <option defaultValue="1">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4 only-file-upload">
                    <Form.Label className="label text-secondary">
                      Upload Property Images
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

                    <p className="mt-1 mb-0 small">
                      Rcommended size: 640 x 660
                    </p>

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

export default PropertiesTable;
