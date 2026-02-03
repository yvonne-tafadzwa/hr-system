"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Row, Col } from "react-bootstrap";
import Image from "next/image";

const WalletTable = () => {
  // Modal
  const [isShowModal, setShowModal] = useState("false");
  const handleToggleShowModal = () => {
    setShowModal(!isShowModal);
  };

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
        name: "BTC Wallet",
        address: "3FZasd93cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Bitcoin",
          symbol: "BTC",
          image: "/images/cardano.png",
        },
        balance: "0.25 BTC",
        lastTransactionDate: "2025-10-01",
        status: "Active",
      },
      {
        id: 2,
        name: "ETH Wallet",
        address: "0x32Be343pjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Ethereum",
          symbol: "ETH",
          image: "/images/ethereum-2.png",
        },
        balance: "5.2 ETH",
        lastTransactionDate: "2025-10-02",
        status: "Deactivated",
      },
      {
        id: 3,
        name: "BNB Wallet",
        address: "DdzFFzCqrh3cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Binance",
          symbol: "BNB",
          image: "/images/binance-2.png",
        },
        balance: "1000 BNB",
        lastTransactionDate: "2025-10-03",
        status: "Active",
      },
      {
        id: 4,
        name: "USDT Wallet",
        address: "Dsbeompjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Tether",
          symbol: "USDT",
          image: "/images/tether.png",
        },
        balance: "2500 USDT",
        lastTransactionDate: "2025-10-04",
        status: "Active",
      },
      {
        id: 5,
        name: "XRP Wallet",
        address: "4pN1bycd93cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: { name: "XRP", symbol: "XRP", image: "/images/xrp.png" },
        balance: "15 XRP",
        lastTransactionDate: "2025-10-05",
        status: "Active",
      },
      {
        id: 6,
        name: "SOL Wallet",
        address: "LZjTAtMjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Solana",
          symbol: "SOL",
          image: "/images/solana-2.png",
        },
        balance: "12 SOL",
        lastTransactionDate: "2025-10-06",
        status: "Active",
      },
      {
        id: 7,
        name: "USDC Wallet",
        address: "3FZasd93cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "USDC",
          symbol: "USDC",
          image: "/images/usdc.png",
        },
        balance: "0.5 USDC",
        lastTransactionDate: "2025-10-07",
        status: "Active",
      },
      {
        id: 8,
        name: "TRX Wallet",
        address: "3FZbc3cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: { name: "Tron", symbol: "TRX", image: "/images/tron.png" },
        balance: "1500 TRX",
        lastTransactionDate: "2025-10-08",
        status: "Deactivated",
      },
      {
        id: 9,
        name: "AVAX Wallet",
        address: "1FZbt93cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Avalanche",
          symbol: "AVAX",
          image: "/images/avalanche.png",
        },
        balance: "100 AVAX",
        lastTransactionDate: "2025-10-09",
        status: "Active",
      },
      {
        id: 10,
        name: "LINK Wallet",
        address: "16cbfe2pjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Chainlink",
          symbol: "LINK",
          image: "/images/chainlink.png",
        },
        balance: "5000 LINK",
        lastTransactionDate: "2025-10-10",
        status: "Active",
      },
      {
        id: 11,
        name: "DOGE Wallet",
        address: "DGE19d93cpjq2LkjuV5qJHunfnkDOGE333",
        cryptoAsset: {
          name: "Dogecoin",
          symbol: "DOGE",
          image: "/images/dogecoin.png",
        },
        balance: "25000 DOGE",
        lastTransactionDate: "2025-10-11",
        status: "Active",
      },
      {
        id: 12,
        name: "DOT Wallet",
        address: "1DOTa45kjq2LkjuV5qJHunfnkPolk1a23",
        cryptoAsset: {
          name: "Polkadot",
          symbol: "DOT",
          image: "/images/polkadot.png",
        },
        balance: "350 DOT",
        lastTransactionDate: "2025-10-12",
        status: "Active",
      },
      {
        id: 13,
        name: "LTC Wallet",
        address: "LTCd12cpjq2LkjuV5qJHunfnkLtktZc4",
        cryptoAsset: {
          name: "Litecoin",
          symbol: "LTC",
          image: "/images/litecoin.png",
        },
        balance: "5.7 LTC",
        lastTransactionDate: "2025-10-13",
        status: "Active",
      },
      {
        id: 14,
        name: "SHIB Wallet",
        address: "0xSHIbcd12kjq2LkjuV5qJHunfnkZSHIBA",
        cryptoAsset: {
          name: "Shiba Inu",
          symbol: "SHIB",
          image: "/images/shiba-inu.png",
        },
        balance: "5000000 SHIB",
        lastTransactionDate: "2025-10-14",
        status: "Deactivated",
      },
      {
        id: 15,
        name: "TON Wallet",
        address: "TONwallet123pqLkjuV5qJHunfnkLtZc4",
        cryptoAsset: {
          name: "Toncoin",
          symbol: "TON",
          image: "/images/toncoin.png",
        },
        balance: "120 TON",
        lastTransactionDate: "2025-10-15",
        status: "Active",
      },
      {
        id: 16,
        name: "UNI Wallet",
        address: "0xUniswapWalletAdd09870x",
        cryptoAsset: {
          name: "Uniswap",
          symbol: "UNI",
          image: "/images/uniswap.png",
        },
        balance: "80 UNI",
        lastTransactionDate: "2025-10-16",
        status: "Active",
      },
      {
        id: 17,
        name: "ICP Wallet",
        address: "ICPpqw9834LkjuV5qJHunfnkLtZc4",
        cryptoAsset: {
          name: "Internet Computer",
          symbol: "ICP",
          image: "/images/internet-computer.png",
        },
        balance: "45 ICP",
        lastTransactionDate: "2025-10-17",
        status: "Active",
      },
      {
        id: 18,
        name: "NEAR Wallet",
        address: "NEARtx1q2LkjuV5qJHunfnkZc4",
        cryptoAsset: {
          name: "NEAR Protocol",
          symbol: "NEAR",
          image: "/images/near-protocol.png",
        },
        balance: "90 NEAR",
        lastTransactionDate: "2025-10-18",
        status: "Deactivated",
      },
      {
        id: 19,
        name: "APT Wallet",
        address: "APTwallet998cpjq2LkjuV5qJHunf",
        cryptoAsset: {
          name: "Aptos",
          symbol: "APT",
          image: "/images/aptos.png",
        },
        balance: "60 APT",
        lastTransactionDate: "2025-10-19",
        status: "Active",
      },
      {
        id: 20,
        name: "FIL Wallet",
        address: "FILwallet0xLTkjq2LkjuV5qJHunfnk",
        cryptoAsset: {
          name: "Filecoin",
          symbol: "FIL",
          image: "/images/filecoin.png",
        },
        balance: "30 FIL",
        lastTransactionDate: "2025-10-20",
        status: "Active",
      },
    ];
    setData(mockData);
    setFilteredData(mockData);
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cryptoAsset.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.cryptoAsset.symbol
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-25">
            <Form className="position-relative table-src-form me-0">
              <Form.Control
                type="text"
                className="border-0"
                placeholder="Search by name, asset, or address..."
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
              <span className="d-flex align-items-center gap-2">
                <i className="ri-add-line d-none d-sm-inline-block fs-20 lh-1"></i>
                <span>Add Wallet</span>
              </span>
            </button>
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
                      Address
                    </th>
                    <th scope="col" className="text-secondary">
                      Crypto Asset
                    </th>
                    <th scope="col" className="text-secondary">
                      Balance
                    </th>
                    <th scope="col" className="text-secondary">
                      Last Transaction Date
                    </th>
                    <th scope="col" className="text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-medium text-primary">{item.name}</td>

                      <td className="text-secondary fw-medium">
                        {item.address}
                      </td>

                      <td className="text-body">
                        <div className="d-flex align-items-center gap-2">
                          <Image
                            src={item.cryptoAsset.image}
                            alt={item.cryptoAsset.name.toLowerCase()}
                            width={22}
                            height={22}
                          />
                          <span className="fw-medium text-secondary fs-13">
                            {item.cryptoAsset.name}{" "}
                            <span className="fw-normal fs-12 text-body">
                              ({item.cryptoAsset.symbol})
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="text-secondary">{item.balance}</td>

                      <td className="text-secondary">
                        {item.lastTransactionDate}
                      </td>

                      <td
                        className={`text-${
                          item.status === "Active" ? "success" : "danger-80"
                        }`}
                      >
                        {item.status}
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
            <h3 className="fs-18 mb-0">Add New Wallet</h3>

            <div className="close-link" onClick={handleToggleShowModal}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <div className="p-4">
            <Form>
              <Row>
                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">
                      Wallet Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Wallet Name"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">
                      Wallet Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Wallet Address"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">
                      Crypto Asset
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Crypto Asset"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">
                      Balance
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Balance"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">
                      Last Transaction Date
                    </Form.Label>
                    <Form.Control type="date" className="text-dark" />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label text-secondary">
                      Status
                    </Form.Label>
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

export default WalletTable;
