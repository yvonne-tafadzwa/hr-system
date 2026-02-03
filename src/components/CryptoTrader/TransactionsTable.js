"use client";

import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Dropdown, Row, Col } from "react-bootstrap";

const TransactionsTable = () => {
  // Modal
  const [isShowModal, setShowModal] = useState("false");
  const handleToggleShowModal = () => {
    setShowModal(!isShowModal);
  };

  // Sample data - in a real app, this would come from an API
  const sampleTransactions = [
    {
      id: "1",
      date: "2025-10-31",
      asset: "Bitcoin",
      type: "Buy",
      amount: "0.5 BTC",
      price: "$34,000",
      totalValue: "$17,000",
      status: "Done",
    },
    {
      id: "2",
      date: "2025-10-30",
      asset: "Ethereum",
      type: "Sell",
      amount: "2 ETH",
      price: "$1,800",
      totalValue: "$3,600",
      status: "Done",
    },
    {
      id: "3",
      date: "2025-10-29",
      asset: "Tether",
      type: "Buy",
      amount: "$1.00",
      price: "$175",
      totalValue: "$1,750",
      status: "Failed",
    },
    {
      id: "4",
      date: "2025-10-28",
      asset: "USD Coin",
      type: "Sell",
      amount: "$0.9999",
      price: "$230",
      totalValue: "$1,150",
      status: "Done",
    },
    {
      id: "5",
      date: "2025-10-27",
      asset: "Cardano",
      type: "Buy",
      amount: "5000 ADA",
      price: "$0.07",
      totalValue: "$350",
      status: "Pending",
    },
    {
      id: "6",
      date: "2025-10-26",
      asset: "Solana",
      type: "Buy",
      amount: "10 SOL",
      price: "$32",
      totalValue: "$320",
      status: "Done",
    },
    {
      id: "7",
      date: "2025-10-25",
      asset: "Ripple",
      type: "Sell",
      amount: "1000 XRP",
      price: "$0.50",
      totalValue: "$500",
      status: "Done",
    },
    {
      id: "8",
      date: "2025-10-24",
      asset: "Polkadot",
      type: "Buy",
      amount: "50 DOT",
      price: "$6",
      totalValue: "$300",
      status: "Pending",
    },
    {
      id: "9",
      date: "2025-10-23",
      asset: "Dogecoin",
      type: "Sell",
      amount: "10000 DOGE",
      price: "$0.08",
      totalValue: "$800",
      status: "Failed",
    },
    {
      id: "10",
      date: "2025-10-22",
      asset: "Litecoin",
      type: "Buy",
      amount: "5 LTC",
      price: "$70",
      totalValue: "$350",
      status: "Done",
    },
    {
      id: "11",
      date: "2025-10-21",
      asset: "Avalanche",
      type: "Sell",
      amount: "25 AVAX",
      price: "$9",
      totalValue: "$225",
      status: "Done",
    },
    {
      id: "12",
      date: "2025-10-20",
      asset: "Chainlink",
      type: "Buy",
      amount: "40 LINK",
      price: "$7.5",
      totalValue: "$300",
      status: "Done",
    },
    {
      id: "13",
      date: "2025-10-19",
      asset: "Stellar",
      type: "Sell",
      amount: "2000 XLM",
      price: "$0.12",
      totalValue: "$240",
      status: "Pending",
    },
    {
      id: "14",
      date: "2025-10-18",
      asset: "Uniswap",
      type: "Buy",
      amount: "15 UNI",
      price: "$5",
      totalValue: "$75",
      status: "Failed",
    },
    {
      id: "15",
      date: "2025-10-17",
      asset: "Aave",
      type: "Buy",
      amount: "3 AAVE",
      price: "$60",
      totalValue: "$180",
      status: "Done",
    },
    {
      id: "16",
      date: "2025-10-16",
      asset: "Cosmos",
      type: "Sell",
      amount: "20 ATOM",
      price: "$8",
      totalValue: "$160",
      status: "Done",
    },
    {
      id: "17",
      date: "2025-10-15",
      asset: "Tezos",
      type: "Buy",
      amount: "100 XTZ",
      price: "$0.90",
      totalValue: "$90",
      status: "Pending",
    },
    {
      id: "18",
      date: "2025-10-14",
      asset: "VeChain",
      type: "Sell",
      amount: "15000 VET",
      price: "$0.02",
      totalValue: "$300",
      status: "Done",
    },
    {
      id: "19",
      date: "2025-10-13",
      asset: "NEAR Protocol",
      type: "Buy",
      amount: "10 NEAR",
      price: "$10",
      totalValue: "$100",
      status: "Done",
    },
    {
      id: "20",
      date: "2025-10-12",
      asset: "Filecoin",
      type: "Sell",
      amount: "8 FIL",
      price: "$6.5",
      totalValue: "$52",
      status: "Failed",
    },
  ];

  const [transactions] = useState(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Search functionality
  useEffect(() => {
    const filtered = transactions.filter(
      (transaction) =>
        transaction.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.date.includes(searchTerm)
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, transactions]);

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
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

  // Get badge class based on type or status
  const getBadgeClass = (type) => {
    switch (type) {
      case "Buy":
      case "Done":
        return "bg-success-60 bg-opacity-25 text-success-60";
      case "Sell":
        return "bg-danger-80 bg-opacity-25 text-danger-80";
      case "Pending":
        return "bg-warning bg-opacity-25 text-warning";
      case "Failed":
        return "bg-danger-80 bg-opacity-25 text-danger-80";
      default:
        return "bg-secondary bg-opacity-25 text-secondary";
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-25">
            <Form className="position-relative table-src-form me-0">
              <Form.Control
                type="text"
                className="border-0"
                placeholder="Search here...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y text-secondary">
                search
              </i>
            </Form>

            <div
              className="d-flex flex-wrap align-items-center"
              style={{ gap: "15px" }}
            >
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
                  <span>Add Transaction</span>
                </span>
              </Button>

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

          <div className="default-table-area style-two pyx-19 recent-transactions3">
            <div className="table-responsive">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th scope="col" className="text-secondary">
                      Date
                    </th>
                    <th scope="col" className="text-secondary">
                      Asset
                    </th>
                    <th scope="col" className="text-secondary">
                      Type
                    </th>
                    <th scope="col" className="text-secondary">
                      Amount
                    </th>
                    <th scope="col" className="text-secondary">
                      Price
                    </th>
                    <th scope="col" className="text-secondary">
                      Total Value
                    </th>
                    <th scope="col" className="text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td className="fw-medium">{transaction.asset}</td>
                        <td>
                          <span
                            className={`d-inline-block rounded-1 fs-12 fw-medium ${getBadgeClass(
                              transaction.type
                            )}`}
                            style={{ padding: "2px 8px" }}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.price}</td>
                        <td>{transaction.totalValue}</td>
                        <td>
                          <span
                            className={`d-inline-block rounded-1 fs-12 fw-medium ${getBadgeClass(
                              transaction.status
                            )}`}
                            style={{ padding: "2px 8px" }}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        No transactions found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div
              className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap p-4"
              style={{ paddingTop: "15px !important" }}
            >
              <span className="fs-13">
                Showing {indexOfFirstTransaction + 1}-
                {Math.min(indexOfLastTransaction, filteredTransactions.length)}{" "}
                of {filteredTransactions.length} results
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
            <h3 className="fs-18 mb-0">Add New Transaction</h3>

            <div className="close-link" onClick={handleToggleShowModal}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <div className="p-4">
            <Form>
              <Row>
                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Date</Form.Label>
                    <Form.Control
                      type="date"
                      className="text-dark" 
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Asset</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Asset"
                    />
                  </Form.Group>
                </Col>

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Type</Form.Label>
                    <Form.Select
                      className="form-control text-dark" 
                    > 
                      <option>Select</option>
                      <option defaultValue="0">Buy</option>
                      <option defaultValue="1">Sell</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Amount</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Amount"
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

                <Col sm={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="label">Total Value</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-dark"
                      placeholder="Enter Total Value"
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
                      <option defaultValue="0">Done</option>
                      <option defaultValue="1">Pending</option>
                      <option defaultValue="2">Failed</option>
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

export default TransactionsTable;
