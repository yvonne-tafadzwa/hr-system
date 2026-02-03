"use client";

import React, { useState } from "react";
import { Card, Table, Dropdown } from "react-bootstrap";

const RecentTransactions = () => {
  // Sample transaction data
  const transactionsData = [
    {
      id: 1,
      date: "2025-10-31",
      asset: "Bitcoin",
      type: "Buy",
      amount: "0.5 BTC",
      price: "$34,000",
      totalValue: "$17,000",
      status: "Done",
    },
    {
      id: 2,
      date: "2025-10-30",
      asset: "Ethereum",
      type: "Sell",
      amount: "2 ETH",
      price: "$1,800",
      totalValue: "$3,600",
      status: "Done",
    },
    {
      id: 3,
      date: "2025-10-29",
      asset: "Tether",
      type: "Buy",
      amount: "$1.00",
      price: "$175",
      totalValue: "$1,750",
      status: "Failed",
    },
    {
      id: 4,
      date: "2025-10-28",
      asset: "USD Coin",
      type: "Sell",
      amount: "$0.9999",
      price: "$230",
      totalValue: "$1,150",
      status: "Done",
    },
    {
      id: 5,
      date: "2025-10-27",
      asset: "Cardano",
      type: "Buy",
      amount: "5000 ADA",
      price: "$0.07",
      totalValue: "$350",
      status: "Pending",
    },
    {
      id: 6,
      date: "2025-10-26",
      asset: "Tron",
      type: "Buy",
      amount: "142 TRX",
      price: "$0.192391",
      totalValue: "$350",
      status: "Failed",
    },
    {
      id: 7,
      date: "2025-10-25",
      asset: "Solana",
      type: "Sell",
      amount: "5 SOL",
      price: "$32.50",
      totalValue: "$162.50",
      status: "Done",
    },
    {
      id: 8,
      date: "2025-10-24",
      asset: "Polygon",
      type: "Buy",
      amount: "1000 MATIC",
      price: "$0.75",
      totalValue: "$750",
      status: "Pending",
    },
    {
      id: 9,
      date: "2025-10-23",
      asset: "Litecoin",
      type: "Buy",
      amount: "3 LTC",
      price: "$65.00",
      totalValue: "$195.00",
      status: "Done",
    },
    {
      id: 10,
      date: "2025-10-22",
      asset: "Ripple",
      type: "Sell",
      amount: "100 XRP",
      price: "$0.50",
      totalValue: "$50.00",
      status: "Pending",
    },
    {
      id: 11,
      date: "2025-10-21",
      asset: "Binance Coin",
      type: "Buy",
      amount: "1 BNB",
      price: "$220.00",
      totalValue: "$220.00",
      status: "Done",
    },
    {
      id: 12,
      date: "2025-10-20",
      asset: "Shiba Inu",
      type: "Sell",
      amount: "100000 SHIB",
      price: "$0.00001",
      totalValue: "$1.00",
      status: "Failed",
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

  // Get style for transaction type
  const getTypeStyle = (type) => {
    return type === "Buy"
      ? "bg-success-60 bg-opacity-25 text-success-60"
      : "bg-danger-80 bg-opacity-25 text-danger-80";
  };

  // Get style for status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Done":
        return "bg-success-60 bg-opacity-25 text-success-60";
      case "Failed":
        return "bg-danger-80 bg-opacity-25 text-danger-80";
      case "Pending":
        return "bg-warning bg-opacity-25 text-warning";
      default:
        return "bg-gray-100 bg-opacity-25 text-gray-100";
    }
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

          <div className="default-table-area style-two py-14 ct-recent-transactions2">
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
                      Total Value{" "}
                    </th>
                    <th scope="col" className="text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>

                      <td className="fw-medium">{transaction.asset}</td>

                      <td>
                        <span
                          className={`d-inline-block ${getTypeStyle(
                            transaction.type
                          )} rounded-1 fs-12 fw-medium`}
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
                          className={`d-inline-block ${getStatusStyle(
                            transaction.status
                          )} rounded-1 fs-12 fw-medium`}
                          style={{ padding: "2px 8px" }}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div
              className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap p-4"
              style={{
                paddingTop: "15px !important",
              }}
            >
              <span className="fs-13">
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
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
