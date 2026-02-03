"use client";

import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";

const GainersAndLosers = () => {
  // Sample cryptocurrency data
  const [cryptoData, setCryptoData] = useState([
    {
      id: 1,
      name: "Goatseus Maximus",
      symbol: "GOAT",
      price: 0.719,
      change: 47.44,
      isGainer: true,
    },
    {
      id: 2,
      name: "Uniswap",
      symbol: "UNI",
      price: 9.15,
      change: -31.87,
      isGainer: false,
    },
    {
      id: 3,
      name: "Aave",
      symbol: "AAVE",
      price: 161.05,
      change: 23.94,
      isGainer: true,
    },
    {
      id: 4,
      name: "Bittenso",
      symbol: "BTN",
      price: 526.97,
      change: -22.94,
      isGainer: false,
    },
    {
      id: 5,
      name: "Injective",
      symbol: "INJ",
      price: 20.87,
      change: 21.41,
      isGainer: true,
    },
    {
      id: 6,
      name: "Monero",
      symbol: "XMR",
      price: 209.38,
      change: -0.84,
      isGainer: false,
    },
  ]);

  // Simulate data updates when timeframe changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prevData) =>
        prevData.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() * 0.02 - 0.01)),
          change: crypto.change + (Math.random() * 5 - 2.5),
          isGainer: Math.random() > 0.5,
        }))
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  });

  // Format price with proper decimals
  const formatPrice = (price) => {
    return price < 1 ? price.toFixed(4) : price.toFixed(2);
  };

  // Get change color and sign
  const getChangeDisplay = (change) => {
    const isPositive = change >= 0;
    return {
      text: isPositive
        ? `+ ${change.toFixed(2)}%`
        : `- ${Math.abs(change).toFixed(2)}%`,
      color: isPositive ? "text-success-60" : "text-danger-80",
    };
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3">
        <Card.Body className="p-0 pb-1">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-4">
            <h3 className="mb-0">Gainers & Losers</h3>

            <span>Timeframe: 24h</span>
          </div>

          <div className="default-table-area style-two ct-gainers-losers">
            <div className="table-responsive">
              <Table className="table align-middle">
                <tbody>
                  {cryptoData.map((crypto, index) => {
                    const change = getChangeDisplay(crypto.change);
                    const isLast = index === cryptoData.length - 1;

                    return (
                      <tr key={crypto.id}>
                        <td
                          className={`text-body fs-13 ${
                            isLast ? "border-0" : ""
                          }`}
                        >
                          {crypto.name}{" "}
                          <span className="text-muted">({crypto.symbol})</span>
                        </td>
                        <td
                          className={`text-body text-center fs-13 ${
                            isLast ? "border-0" : ""
                          }`}
                        >
                          ${formatPrice(crypto.price)}
                        </td>
                        <td
                          className={`${change.color} text-end fs-13 ${
                            isLast ? "border-0" : ""
                          }`}
                        >
                          {change.text}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default GainersAndLosers;
