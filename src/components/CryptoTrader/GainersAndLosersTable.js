"use client";

import React, { useEffect, useState } from "react";
import { Card, Form, Button, Table, Dropdown, Row, Col } from "react-bootstrap";
import Image from "next/image";

const GainersAndLosersTable = () => {
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

  // State for chart component
  const [Chart, setChart] = useState(null);
  // State for data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize data
  useEffect(() => {
    // Mock data (replace with API call in production)
    const mockData = [
      {
        id: 1,
        name: "Bitcoin",
        symbol: "BTC",
        image: "/images/cardano.png",
        price: 85818.27,
        hourChange: 0.47,
        dayChange: 2.65,
        weekChange: 3.01,
        marketCap: 1702262413645,
        volume: 37182010584,
        chartData: [60, 40, 80, 70, 50, 90, 60, 85, 55, 75, 65, 95],
      },
      {
        id: 2,
        name: "Ethereum",
        symbol: "ETH",
        image: "/images/ethereum-2.png",
        price: 1993.88,
        hourChange: -1.03,
        dayChange: 2.44,
        weekChange: 5.59,
        marketCap: 240652882527,
        volume: 19913301026,
        chartData: [50, 60, 45, 70, 55, 80, 65, 75, 60, 85, 70, 90],
      },
      {
        id: 3,
        name: "Binance",
        symbol: "BNB",
        image: "/images/binance-2.png",
        price: 2.49,
        hourChange: 0.16,
        dayChange: -7.75,
        weekChange: 10.25,
        marketCap: 145187520169,
        volume: 10614863319,
        chartData: [70, 65, 60, 55, 50, 45, 60, 65, 70, 75, 80, 85],
      },
      {
        id: 4,
        name: "Tether",
        symbol: "USDT",
        image: "/images/tether.png",
        price: 1.0,
        hourChange: 0.01,
        dayChange: 0.04,
        weekChange: -0.01,
        marketCap: 143685783527,
        volume: 78972924872,
        chartData: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      },
      {
        id: 5,
        name: "XRP",
        symbol: "XRP",
        image: "/images/xrp.png",
        price: 628.38,
        hourChange: 0.96,
        dayChange: 2.38,
        weekChange: 8.31,
        marketCap: 89534085091,
        volume: 2236753285,
        chartData: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
      },
      {
        id: 6,
        name: "Solana",
        symbol: "SOL",
        image: "/images/solana-2.png",
        price: 132.46,
        hourChange: 1.45,
        dayChange: 4.79,
        weekChange: 4.31,
        marketCap: 67541375453,
        volume: 3658703755,
        chartData: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110],
      },
      {
        id: 7,
        name: "Cardano",
        symbol: "ADA",
        image: "/images/cardano.png",
        price: 0.4123,
        hourChange: 0.23,
        dayChange: 1.98,
        weekChange: 2.75,
        marketCap: 14638957482,
        volume: 589321077,
        chartData: [40, 45, 50, 55, 60, 55, 50, 60, 65, 70, 75, 80],
      },
      {
        id: 8,
        name: "Dogecoin",
        symbol: "DOGE",
        image: "/images/dogecoin.png",
        price: 0.0832,
        hourChange: -0.12,
        dayChange: 0.34,
        weekChange: 1.12,
        marketCap: 11938457520,
        volume: 1248573201,
        chartData: [20, 30, 25, 35, 40, 45, 50, 48, 42, 47, 52, 58],
      },
      {
        id: 9,
        name: "Polkadot",
        symbol: "DOT",
        image: "/images/polkadot.png",
        price: 5.74,
        hourChange: 0.88,
        dayChange: 2.12,
        weekChange: 3.44,
        marketCap: 7638271584,
        volume: 614820373,
        chartData: [25, 30, 35, 32, 38, 40, 42, 45, 48, 44, 49, 51],
      },
      {
        id: 10,
        name: "Litecoin",
        symbol: "LTC",
        image: "/images/litecoin.png",
        price: 72.11,
        hourChange: 0.45,
        dayChange: 1.78,
        weekChange: 2.95,
        marketCap: 5256183047,
        volume: 389245721,
        chartData: [30, 32, 35, 38, 36, 40, 42, 44, 41, 45, 47, 50],
      },
      {
        id: 11,
        name: "Chainlink",
        symbol: "LINK",
        image: "/images/chainlink.png",
        price: 13.29,
        hourChange: 0.56,
        dayChange: 3.24,
        weekChange: 5.18,
        marketCap: 7788200015,
        volume: 642157348,
        chartData: [20, 25, 30, 28, 34, 36, 38, 35, 37, 39, 41, 43],
      },
      {
        id: 12,
        name: "Avalanche",
        symbol: "AVAX",
        image: "/images/avalanche.png",
        price: 31.76,
        hourChange: -0.34,
        dayChange: 0.87,
        weekChange: 3.42,
        marketCap: 11723945838,
        volume: 1275238994,
        chartData: [50, 55, 60, 62, 58, 63, 67, 70, 68, 72, 75, 78],
      },
      {
        id: 13,
        name: "Shiba Inu",
        symbol: "SHIB",
        image: "/images/shiba-inu.png",
        price: 0.0000271,
        hourChange: 0.23,
        dayChange: 1.03,
        weekChange: 0.97,
        marketCap: 15927450165,
        volume: 451001202,
        chartData: [10, 12, 11, 13, 14, 13, 12, 15, 16, 14, 17, 18],
      },
      {
        id: 14,
        name: "Toncoin",
        symbol: "TON",
        image: "/images/toncoin.png",
        price: 6.91,
        hourChange: 0.41,
        dayChange: 1.55,
        weekChange: 2.63,
        marketCap: 16904837429,
        volume: 637728401,
        chartData: [30, 35, 38, 40, 37, 42, 45, 47, 50, 48, 53, 55],
      },
      {
        id: 15,
        name: "Tron",
        symbol: "TRX",
        image: "/images/tron.png",
        price: 0.1224,
        hourChange: 0.05,
        dayChange: 0.61,
        weekChange: 0.83,
        marketCap: 10798227514,
        volume: 623718234,
        chartData: [20, 22, 25, 24, 26, 28, 30, 29, 32, 33, 34, 35],
      },
      {
        id: 16,
        name: "Uniswap",
        symbol: "UNI",
        image: "/images/uniswap.png",
        price: 8.45,
        hourChange: -0.25,
        dayChange: 1.37,
        weekChange: 2.14,
        marketCap: 4848291745,
        volume: 307624519,
        chartData: [18, 20, 23, 21, 25, 28, 27, 29, 32, 31, 34, 36],
      },
      {
        id: 17,
        name: "Internet Computer",
        symbol: "ICP",
        image: "/images/internet-computer.png",
        price: 12.33,
        hourChange: 0.18,
        dayChange: 2.01,
        weekChange: 3.77,
        marketCap: 5498290012,
        volume: 312394830,
        chartData: [15, 18, 20, 23, 21, 25, 28, 30, 27, 32, 34, 36],
      },
      {
        id: 18,
        name: "NEAR Protocol",
        symbol: "NEAR",
        image: "/images/near-protocol.png",
        price: 7.78,
        hourChange: 0.66,
        dayChange: 1.94,
        weekChange: 4.85,
        marketCap: 7781948021,
        volume: 298312003,
        chartData: [40, 45, 48, 50, 47, 52, 54, 56, 53, 57, 60, 63],
      },
      {
        id: 19,
        name: "Aptos",
        symbol: "APT",
        image: "/images/aptos.png",
        price: 9.67,
        hourChange: -0.19,
        dayChange: 1.26,
        weekChange: 2.89,
        marketCap: 3461928017,
        volume: 209185009,
        chartData: [25, 28, 30, 33, 31, 36, 38, 40, 37, 42, 44, 46],
      },
      {
        id: 20,
        name: "Filecoin",
        symbol: "FIL",
        image: "/images/filecoin.png",
        price: 6.29,
        hourChange: 0.07,
        dayChange: 0.93,
        weekChange: 1.72,
        marketCap: 3170187391,
        volume: 172001298,
        chartData: [12, 15, 18, 20, 19, 22, 24, 26, 23, 28, 30, 32],
      },
    ];
    setData(mockData);
    setFilteredData(mockData);
  }, []);

  // Load chart component
  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, data]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Chart options with conditional coloring
  const getChartOptions = (weekChange) => ({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "monotoneCubic",
      width: 1,
    },
    colors: [weekChange >= 0 ? "#25b003" : "#ff0000"], // Green for positive, red for negative
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
    },
  });

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-25">
            <Form className="position-relative table-src-form me-0">
              <Form.Control
                type="text"
                className="border-0"
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y text-secondary">
                search
              </i>
            </Form>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <button
                className="btn btn-outline-primary fw-medium rounded-3 hover-bg"
                onClick={handleToggleShowModal}
              >
                <span className="d-flex align-items-center gap-1">
                  <i className="ri-add-line d-none d-sm-inline-block fs-20 lh-1"></i>
                  <span>Add Crypto</span>
                </span>
              </button>

              <Dropdown className="dropdown select-dropdown">
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  className="dropdown-toggle border text-body rounded-2 bg-transparent"
                >
                  Last 30 Days
                </Dropdown.Toggle>

                <Dropdown.Menu className="bg-white border box-shadow">
                  <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                    Last 7 Days
                  </Dropdown.Item>

                  <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                    Last 15 Days
                  </Dropdown.Item>

                  <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                    Last 30 Days
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="default-table-area style-two py-15 individual-asset-performance">
            <div className="table-responsive">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th scope="col" className="text-secondary">
                      Name
                    </th>
                    <th scope="col" className="text-secondary">
                      Price
                    </th>
                    <th scope="col" className="text-secondary">
                      1h %
                    </th>
                    <th scope="col" className="text-secondary">
                      24h %
                    </th>
                    <th scope="col" className="text-secondary">
                      7d %
                    </th>
                    <th scope="col" className="text-secondary">
                      Market Cap
                    </th>
                    <th scope="col" className="text-secondary">
                      Volume (24h)
                    </th>
                    <th scope="col" className="text-secondary">
                      Last 7 Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-body">
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: "8px" }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name.toLowerCase()}
                            width={22}
                            height={22}
                          />
                          <span className="fw-medium text-secondary fs-13">
                            {item.name}{" "}
                            <span className="fw-normal fs-12 text-body">
                              ({item.symbol})
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="fw-medium">
                        ${item.price.toLocaleString()}
                      </td>

                      <td
                        className={`fw-medium ${
                          item.hourChange >= 0
                            ? "text-success-60"
                            : "text-danger-80"
                        }`}
                      >
                        {item.hourChange >= 0 ? "+" : ""}
                        {item.hourChange.toFixed(2)}%
                      </td>

                      <td
                        className={`fw-medium ${
                          item.dayChange >= 0
                            ? "text-success-60"
                            : "text-danger-80"
                        }`}
                      >
                        {item.dayChange >= 0 ? "+" : ""}
                        {item.dayChange.toFixed(2)}%
                      </td>

                      <td
                        className={`fw-medium ${
                          item.weekChange >= 0
                            ? "text-success-60"
                            : "text-danger-80"
                        }`}
                      >
                        {item.weekChange >= 0 ? "+" : ""}
                        {item.weekChange.toFixed(2)}%
                      </td>

                      <td className="text-secondary fw-medium">
                        ${item.marketCap.toLocaleString()}
                      </td>

                      <td className="text-secondary fw-medium">
                        ${item.volume.toLocaleString()}
                      </td>

                      <td className="overflow-hidden">
                        <div style={{ position: "relative", top: "5px" }}>
                          {Chart && (
                            <Chart
                              options={getChartOptions(item.weekChange)}
                              series={[{ name: "Price", data: item.chartData }]}
                              type="line"
                              height={40}
                              width={100}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div
              className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap p-4"
              style={{ paddingTop: "15px !important" }}
            >
              <span className="fs-13">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                {filteredData.length} results
              </span>

              <nav aria-label="Page navigation example">
                <ul className="pagination mb-0 justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link icon hover-bg"
                      onClick={() => paginate(currentPage - 1)}
                      aria-label="Previous"
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
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link icon hover-bg"
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Next"
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
            <h3 className="fs-18 mb-0">Add New Crypto</h3>

            <div className="close-link" onClick={handleToggleShowModal}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <div className="p-4">
            <Form>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Asset"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Price</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Price"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">1h</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter 1h"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">24h</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter 24h"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">7d</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter 7d"
                    />
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Market Cap</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Market Cap"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Volume (24h)</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Volume (24h)"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4 only-file-upload">
                    <Form.Label className="label text-secondary">
                      Image
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

                    <p className="mt-1 mb-0 small">Rcommended size: 25 x 25</p>

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

export default GainersAndLosersTable;
