"use client";

import React, { useState } from "react";
import { Card, Table, Dropdown } from "react-bootstrap";
import Image from "next/image";

const LatestTransactions = () => {
  // Sample transaction data
  const transactionsData = [
    {
      id: 1,
      client: "Johhna Loren",
      email: "loren123@gmail.com",
      amount: "$6240",
      paymentMethod: "paypal",
      status: "completed",
      avatar: "/images/user-166.png",
    },
    {
      id: 2,
      client: "Skyler Queen",
      email: "skyqueen@gmail.com",
      amount: "$5135",
      paymentMethod: "wise",
      status: "pending",
      avatar: "/images/user-170.png",
    },
    {
      id: 3,
      client: "Jonathon Watson",
      email: "jona2134@gmail.com",
      amount: "$4321",
      paymentMethod: "bank",
      status: "failed",
      avatar: "/images/user-172.png",
    },
    {
      id: 4,
      client: "Walter White",
      email: "puzzleworld@gmail.com",
      amount: "$3124",
      paymentMethod: "paypal",
      status: "completed",
      avatar: "/images/user-171.png",
    },
    {
      id: 5,
      client: "David Carlen",
      email: "liveslong@gmail.com",
      amount: "$2137",
      paymentMethod: "skrill",
      status: "pending",
      avatar: "/images/user-166.png",
    },
    {
      id: 6,
      client: "Sarah Johnson",
      email: "sarahj@gmail.com",
      amount: "$1890",
      paymentMethod: "paypal",
      status: "completed",
      avatar: "/images/user-173.png",
    },
    {
      id: 7,
      client: "Michael Brown",
      email: "michaelb@gmail.com",
      amount: "$2450",
      paymentMethod: "bank",
      status: "failed",
      avatar: "/images/user-174.png",
    },
    {
      id: 8,
      client: "Emily Davis",
      email: "emilyd@gmail.com",
      amount: "$3200",
      paymentMethod: "wise",
      status: "pending",
      avatar: "/images/user-175.png",
    },
  ];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalItems = transactionsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactionsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Status styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-success-60 bg-opacity-10",
          border: "border-success-60",
          text: "text-success-60",
        };
      case "pending":
        return {
          bg: "bg-card-bg-c bg-opacity-10",
          border: "border-card-bg-c",
          text: "text-card-bg-c",
        };
      case "failed":
        return {
          bg: "bg-danger-80 bg-opacity-10",
          border: "border-danger-80",
          text: "text-danger-80",
        };
      default:
        return {
          bg: "bg-gray-100 bg-opacity-10",
          border: "border-gray-100",
          text: "text-gray-100",
        };
    }
  };

  // Payment method icons
  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case "paypal":
        return "/images/paypal.png";
      case "wise":
        return "/images/wise.png";
      case "bank":
        return "/images/bank.png";
      case "skrill":
        return "/images/skrill.png";
      default:
        return "/images/payment-default.png";
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-10">
            <h3 className="mb-0">Latest Transactions</h3>

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
                  Daily
                </Dropdown.Item>

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

          <div className="default-table-area style-two campaigns-table latest-transactions-table">
            <div className="table-responsive">
              <Table className="align-middle border-0">
                <thead>
                  <tr className="border-bottom">
                    <th scope="col" className="bg-transparent">
                      <span className="fs-10 text-body fw-semibold letter-spacing-1">
                        CLIENT
                      </span>
                    </th>
                    <th scope="col" className="bg-transparent">
                      <span className="fs-10 text-body fw-semibold letter-spacing-1">
                        EMAIL
                      </span>
                    </th>
                    <th scope="col" className="bg-transparent">
                      <span className="fs-10 text-body fw-semibold letter-spacing-1">
                        AMOUNT
                      </span>
                    </th>
                    <th scope="col" className="bg-transparent">
                      <span className="fs-10 text-body fw-semibold letter-spacing-1">
                        PAYMENT METHOD
                      </span>
                    </th>
                    <th scope="col" className="bg-transparent">
                      <span className="fs-10 text-body fw-semibold letter-spacing-1">
                        STATUS
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((transaction) => {
                    const statusStyle = getStatusStyle(transaction.status);
                    return (
                      <tr key={transaction.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <Image
                                src={transaction.avatar}
                                className="rounded-circle"
                                alt={transaction.client}
                                width={32}
                                height={32}
                              />
                            </div>
                            <div className="flex-grow-1 ms-2">
                              <h4 className="fs-14 fw-semibold mb-0">
                                {transaction.client}
                              </h4>
                            </div>
                          </div>
                        </td>

                        <td className="fs-12 fw-semibold text-body">
                          {transaction.email}
                        </td>

                        <td className="fs-12 fw-semibold text-secondary">
                          {transaction.amount}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Image
                              src={getPaymentMethodIcon(
                                transaction.paymentMethod
                              )}
                              alt={transaction.paymentMethod}
                              width={24}
                              height={24}
                            />
                            <span className="ms-2 text-secondary fs-12 fw-semibold">
                              {transaction.paymentMethod
                                .charAt(0)
                                .toUpperCase() +
                                transaction.paymentMethod.slice(1)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`d-inline-block ${statusStyle.bg} ${statusStyle.border} border rounded-pill ${statusStyle.text} fs-12 fw-medium`}
                            style={{
                              padding: "1px 10px",
                            }}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            <div
              className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap"
              style={{ marginTop: "12px" }}
            >
              <span className="fs-12 fw-medium">
                {" "}
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} Results
              </span>

              <nav aria-label="Page navigation example">
                <ul className="pagination mb-0 justify-content-center">
                  <li className="page-item">
                    <button
                      className="page-link icon hover-bg"
                      aria-label="Previous"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <i className="material-symbols-outlined">
                        keyboard_arrow_left
                      </i>
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <li key={number} className="page-item">
                        <button
                          className={`page-link ${
                            currentPage === number ? "active" : ""
                          }`}
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    )
                  )}

                  <li className="page-item">
                    <button
                      className="page-link icon hover-bg"
                      aria-label="Next"
                      onClick={nextPage}
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
    </>
  );
};

export default LatestTransactions;
