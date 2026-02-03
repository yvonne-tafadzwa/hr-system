"use client";

import React, { useState } from "react";
import { Dropdown, Card, Table } from "react-bootstrap";

const RecentTransactions = () => {
  // Sample transaction data
  const transactionsData = [
    {
      id: 1,
      date: "30 Apr 2025",
      description: "Starbucks Coffee",
      category: "Dining",
      amount: "$500,000",
      status: "completed",
    },
    {
      id: 2,
      date: "29 Apr 2025",
      description: "Whole Foods",
      category: "Groceries",
      amount: "$90.50",
      status: "pending",
    },
    {
      id: 3,
      date: "28 Apr 2025",
      description: "Gas Station",
      category: "Transportation",
      amount: "$15.00",
      status: "cancelled",
    },
    {
      id: 4,
      date: "27 Apr 2025",
      description: "Electric Bill",
      category: "Utilities",
      amount: "$150.00",
      status: "completed",
    },
    {
      id: 5,
      date: "26 Apr 2025",
      description: "Spotify Subscription",
      category: "Entertainment",
      amount: "$10.00",
      status: "rejected",
    },
    {
      id: 6,
      date: "25 Apr 2025",
      description: "Football Ticket",
      category: "Sports",
      amount: "$99.99",
      status: "completed",
    },
    {
      id: 7,
      date: "24 Apr 2025",
      description: "Amazon Purchase",
      category: "Shopping",
      amount: "$75.25",
      status: "pending",
    },
    {
      id: 8,
      date: "23 Apr 2025",
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: "$14.99",
      status: "completed",
    },
    {
      id: 9,
      date: "22 Apr 2025",
      description: "Car Insurance",
      category: "Insurance",
      amount: "$120.00",
      status: "completed",
    },
    {
      id: 10,
      date: "21 Apr 2025",
      description: "Dinner Reservation",
      category: "Dining",
      amount: "$85.00",
      status: "cancelled",
    },
    {
      id: 11,
      date: "25 Apr 2025",
      description: "Football Ticket",
      category: "Sports",
      amount: "$99.99",
      status: "completed",
    },
    {
      id: 12,
      date: "24 Apr 2025",
      description: "Amazon Purchase",
      category: "Shopping",
      amount: "$75.25",
      status: "pending",
    },
  ];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      case "cancelled":
        return {
          bg: "bg-danger-50 bg-opacity-10",
          border: "border-danger-50",
          text: "text-danger-50",
        };
      case "rejected":
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

  // Capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-4">
            <h3 className="mb-0">Recent Transactions</h3>

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

          <div className="default-table-area style-two cc-recent-transactions py-19">
            <div className="table-responsive">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th scope="col" className="text-secondary">
                      Date
                    </th>
                    <th scope="col" className="text-secondary">
                      Description
                    </th>
                    <th scope="col" className="text-secondary">
                      Category
                    </th>
                    <th scope="col" className="text-secondary">
                      Amount ($)
                    </th>
                    <th scope="col" className="text-secondary">
                      Status
                    </th>
                    <th scope="col" className="text-secondary">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((transaction) => {
                    const statusStyle = getStatusStyle(transaction.status);
                    return (
                      <tr key={transaction.id}>
                        <td className="text-body">{transaction.date}</td>
                        <td className="text-body">{transaction.description}</td>
                        <td className="text-body">{transaction.category}</td>
                        <td className="text-body">{transaction.amount}</td>
                        <td>
                          {/* <span
                        className="d-inline-block bg-success-60 bg-opacity-10 border-success-60 border rounded-pill text-success-60 fs-12 fw-medium"
                        style={{
                          padding: "1px 10px",
                        }}
                      >
                        Completed
                      </span> */}

                          <span
                            className={`d-inline-block ${statusStyle.bg} ${statusStyle.border} border rounded-pill ${statusStyle.text} fs-12 fw-medium`}
                            style={{ padding: "1px 10px" }}
                          >
                            {capitalize(transaction.status)}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-1">
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
                    );
                  })}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap p-4 pt-3">
              <span className="fs-13">
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

export default RecentTransactions;
