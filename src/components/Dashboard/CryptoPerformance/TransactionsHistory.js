"use client";

import React, { useState } from "react";
import { Card, Dropdown, Table } from "react-bootstrap";
import Image from "next/image";

const TransactionsHistory = () => {
  // Sample transaction data
  const transactionsData = [
    {
      id: 1,
      asset: "Bitcoin",
      symbol: "BTC",
      icon: "/images/cardano.png",
      type: "Sold",
      amount: 68848.92,
    },
    {
      id: 2,
      asset: "Ethereum",
      symbol: "ETH",
      icon: "/images/ethereum-2.png",
      type: "Withdraw",
      amount: 2565.77,
    },
    {
      id: 3,
      asset: "Binance",
      symbol: "BNB",
      icon: "/images/binance-2.png",
      type: "Sold",
      amount: 2565.77,
    },
    {
      id: 4,
      asset: "Tether",
      symbol: "USDT",
      icon: "/images/tether.png",
      type: "Sold",
      amount: 1.0,
    },
    {
      id: 5,
      asset: "XRP",
      symbol: "XRP",
      icon: "/images/xrp.png",
      type: "Withdraw",
      amount: 0.529105,
    },
    {
      id: 6,
      asset: "Solana",
      symbol: "SOL",
      icon: "/images/solana-2.png",
      type: "Deposit",
      amount: 179.44,
    },
    {
      id: 7,
      asset: "Cardano",
      symbol: "ADA",
      icon: "/images/cardano.png",
      type: "Sold",
      amount: 0.45,
    },
    {
      id: 8,
      asset: "Dogecoin",
      symbol: "DOGE",
      icon: "/images/dogecoin.png",
      type: "Withdraw",
      amount: 0.12,
    },
    {
      id: 9,
      asset: "Binance",
      symbol: "BNB",
      icon: "/images/binance-2.png",
      type: "Sold",
      amount: 2565.77,
    },
    {
      id: 10,
      asset: "Tether",
      symbol: "USDT",
      icon: "/images/tether.png",
      type: "Sold",
      amount: 1.0,
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

  // Get style for transaction type
  const getTypeStyle = (type) => {
    switch (type) {
      case "Sold":
        return {
          bg: "bg-success-60 bg-opacity-25",
          text: "text-success-60",
        };
      case "Withdraw":
        return {
          bg: "bg-danger-80 bg-opacity-25",
          text: "text-danger-80",
        };
      case "Deposit":
        return {
          bg: "bg-primary bg-opacity-25",
          text: "text-primary",
        };
      default:
        return {
          bg: "bg-gray-100 bg-opacity-25",
          text: "text-gray-100",
        };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: amount < 1 ? 6 : 2,
      maximumFractionDigits: amount < 1 ? 6 : 2,
    }).format(amount);
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-4">
            <h3 className="mb-0">Transactions History</h3>

            <Dropdown className="action-opt">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="bg-transparent p-0"
              >
                <i className="ri-more-fill fs-26 text-body lh-1"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-white border box-shadow">
                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  This Day
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  This Week
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  This Month
                </Dropdown.Item>

                <Dropdown.Item href="#" className="text-secondary py-2 px-3">
                  This Year
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="default-table-area style-two cp-transactions-history">
            <div className="table-responsive">
              <Table className="align-middle">
                <tbody>
                  {currentItems.map((transaction) => {
                    const typeStyle = getTypeStyle(transaction.type);
                    return (
                      <tr key={transaction.id}>
                        <td className="text-body">
                          <div
                            className="d-flex align-items-center"
                            style={{
                              gap: "8px",
                            }}
                          >
                            <Image
                              src={transaction.icon}
                              alt={transaction.symbol}
                              width={22}
                              height={22}
                            />
                            <span className="fw-medium text-secondary fs-13">
                              {transaction.asset}{" "}
                              <span className="fw-normal fs-12 text-body">
                                ({transaction.symbol})
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span
                            className={`d-inline-block ${typeStyle.bg} ${typeStyle.text} rounded-1 fs-12 fw-medium`}
                            style={{ padding: "2px 8px" }}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="text-body text-end fs-13">
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    );
                  })}
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

export default TransactionsHistory;
