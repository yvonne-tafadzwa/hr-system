"use client";

import React, { useEffect, useState } from "react";
import { Card, Dropdown, Table } from "react-bootstrap";
import Image from "next/image";

const LivePriceTracker = () => {
  // Sample cryptocurrency data
  const [cryptoData, setCryptoData] = useState([
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      icon: "/images/cardano.png",
      price: 68848.92,
      change24h: 2.5,
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      icon: "/images/ethereum-2.png",
      price: 2565.77,
      change24h: -1.2,
    },
    {
      id: 3,
      name: "Binance",
      symbol: "BNB",
      icon: "/images/binance-2.png",
      price: 2565.77,
      change24h: 0.8,
    },
    {
      id: 4,
      name: "Tether",
      symbol: "USDT",
      icon: "/images/tether.png",
      price: 1.0,
      change24h: 0.0,
    },
    {
      id: 5,
      name: "XRP",
      symbol: "XRP",
      icon: "/images/xrp.png",
      price: 0.529105,
      change24h: 3.7,
    },
    {
      id: 6,
      name: "Solana",
      symbol: "SOL",
      icon: "/images/solana-2.png",
      price: 179.44,
      change24h: -2.1,
    },
    {
      id: 7,
      name: "USDC",
      symbol: "USDC",
      icon: "/images/usdc.png",
      price: 1.0,
      change24h: 0.0,
    },
    {
      id: 8,
      name: "Tron",
      symbol: "TRX",
      icon: "/images/tron.png",
      price: 0.192391,
      change24h: 1.5,
    },
    {
      id: 9,
      name: "Litecoin",
      symbol: "LTC",
      icon: "/images/litecoin.png",
      price: 84.75,
      change24h: 1.1,
    },
    {
      id: 10,
      name: "Avalanche",
      symbol: "AVAX",
      icon: "/images/avalanche.png",
      price: 42.31,
      change24h: -3.2,
    },
    {
      id: 11,
      name: "Polkadot",
      symbol: "DOT",
      icon: "/images/polkadot.png",
      price: 6.71,
      change24h: 2.3,
    },
    {
      id: 12,
      name: "Shiba Inu",
      symbol: "SHIB",
      icon: "/images/shiba-inu.png",
      price: 0.000025,
      change24h: -0.8,
    },
    {
      id: 13,
      name: "Chainlink",
      symbol: "LINK",
      icon: "/images/chainlink.png",
      price: 15.52,
      change24h: 4.9,
    },
    {
      id: 14,
      name: "Uniswap",
      symbol: "UNI",
      icon: "/images/uniswap.png",
      price: 7.82,
      change24h: 0.6,
    },
    {
      id: 15,
      name: "Stellar",
      symbol: "XLM",
      icon: "/images/stellar.png",
      price: 0.13,
      change24h: 1.2,
    },
  ]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Calculate pagination
  const totalItems = cryptoData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cryptoData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prevData) =>
        prevData.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() * 0.02 - 0.01)), // Random price fluctuation
          change24h: crypto.change24h + (Math.random() * 0.2 - 0.1), // Random change fluctuation
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  // Get color class based on price change
  const getChangeColor = (change) => {
    return change > 0
      ? "text-success"
      : change < 0
      ? "text-danger"
      : "text-body";
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-4">
            <h3 className="mb-0 text-secondary-50">Live Price Tracker</h3>

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

          <div className="default-table-area style-two py-11">
            <div className="table-responsive">
              <Table className="align-middle">
                <tbody>
                  {currentItems.map((crypto) => (
                    <tr key={crypto.id}>
                      <td className="text-body">
                        <div className="d-flex align-items-center gap-2">
                          <Image
                            src={crypto.icon}
                            alt={crypto.symbol}
                            width={22}
                            height={22}
                          />
                          <span className="fw-medium text-secondary fs-13">
                            {crypto.name}{" "}
                            <span className="fw-normal fs-12 text-body">
                              ({crypto.symbol})
                            </span>
                          </span>

                          <div
                            className={`fs-11 ${getChangeColor(
                              crypto.change24h
                            )}`}
                          >
                            {crypto.change24h > 0 ? "+" : ""}
                            {crypto.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </td>
                      <td className="text-body text-end fs-13">
                        {formatPrice(crypto.price)}
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
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
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
                      onClick={prevPage}
                      aria-label="Previous"
                      disabled={currentPage === 1}
                    >
                      <i className="material-symbols-outlined">
                        keyboard_arrow_left
                      </i>
                    </button>
                  </li>

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link icon hover-bg"
                      onClick={nextPage}
                      aria-label="Next"
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

export default LivePriceTracker;
