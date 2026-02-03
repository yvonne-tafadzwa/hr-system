"use client";

import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import Image from "next/image";

const IndividualAssetPerformance = () => {
  const [Chart, setChart] = useState();
  const [assets, setAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });

    // Simulate fetching data from an API
    const fetchData = () => {
      const mockData = [
        {
          id: 1,
          name: "Bitcoin",
          symbol: "BTC",
          icon: "/images/cardano.png",
          allocation: 35,
          roi: 120,
          currentValue: 35000,
          netGain: 15000,
          oneDayChange: 0.5,
          sevenDayChange: 3.0,
          sparklineData: [60, 40, 80, 70, 50, 90, 60, 85, 55, 75, 65, 95],
        },
        {
          id: 2,
          name: "Ethereum",
          symbol: "ETH",
          icon: "/images/ethereum-2.png",
          allocation: 25,
          roi: 80,
          currentValue: 25000,
          netGain: 8000,
          oneDayChange: -1.0,
          sevenDayChange: 1.5,
          sparklineData: [50, 60, 45, 70, 55, 65, 50, 75, 60, 70, 65, 80],
        },
        {
          id: 3,
          name: "Binance",
          symbol: "BNB",
          icon: "/images/binance-2.png",
          allocation: 15,
          roi: 30,
          currentValue: 7500,
          netGain: 1500,
          oneDayChange: -2.5,
          sevenDayChange: -5.0,
          sparklineData: [70, 60, 65, 50, 55, 45, 40, 50, 45, 55, 50, 60],
        },
        {
          id: 4,
          name: "Tether",
          symbol: "USDT",
          icon: "/images/tether.png",
          allocation: 10,
          roi: 45,
          currentValue: 4500,
          netGain: 1000,
          oneDayChange: 0.2,
          sevenDayChange: 2.0,
          sparklineData: [30, 35, 40, 38, 42, 45, 43, 47, 45, 48, 46, 50],
        },
        {
          id: 5,
          name: "XRP",
          symbol: "XRP",
          icon: "/images/xrp.png",
          allocation: 5,
          roi: 60,
          currentValue: 3000,
          netGain: 1200,
          oneDayChange: 1.5,
          sevenDayChange: 4.5,
          sparklineData: [40, 45, 50, 48, 52, 55, 53, 57, 55, 58, 56, 60],
        },
        // Add more mock data to demonstrate pagination
        {
          id: 6,
          name: "Cardano",
          symbol: "ADA",
          icon: "/images/cardano.png",
          allocation: 8,
          roi: 25,
          currentValue: 2000,
          netGain: 500,
          oneDayChange: 0.8,
          sevenDayChange: 2.5,
          sparklineData: [30, 35, 32, 38, 35, 40, 42, 45, 43, 47, 45, 50],
        },
        {
          id: 7,
          name: "Solana",
          symbol: "SOL",
          icon: "/images/solana.png",
          allocation: 12,
          roi: 75,
          currentValue: 6000,
          netGain: 2500,
          oneDayChange: -0.5,
          sevenDayChange: 5.0,
          sparklineData: [40, 45, 50, 55, 60, 65, 70, 65, 60, 55, 50, 45],
        },
        {
          id: 8,
          name: "Polkadot",
          symbol: "DOT",
          icon: "/images/polkadot.png",
          allocation: 7,
          roi: 15,
          currentValue: 1500,
          netGain: 200,
          oneDayChange: -1.2,
          sevenDayChange: -2.0,
          sparklineData: [50, 48, 45, 42, 40, 38, 35, 40, 45, 50, 55, 60],
        },
        {
          id: 9,
          name: "Dogecoin",
          symbol: "DOGE",
          icon: "/images/dogecoin.png",
          allocation: 3,
          roi: 10,
          currentValue: 750,
          netGain: 75,
          oneDayChange: 2.0,
          sevenDayChange: 8.0,
          sparklineData: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
        },
        {
          id: 10,
          name: "Litecoin",
          symbol: "LTC",
          icon: "/images/litecoin.png",
          allocation: 5,
          roi: 20,
          currentValue: 1200,
          netGain: 200,
          oneDayChange: -0.3,
          sevenDayChange: 1.5,
          sparklineData: [40, 42, 45, 43, 47, 45, 50, 55, 60, 65, 70, 75],
        },
      ];
      setAssets(mockData);
    };

    fetchData();
  }, []);

  const getChartOptions = (color) => ({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "monotoneCubic",
      width: 1,
    },
    colors: [color],
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getChangeColorClass = (value) => {
    return value >= 0 ? "text-success-60" : "text-danger-80";
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Pagination logic
  const totalItems = assets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedAssets = assets.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Card className="bg-white border-0 rounded-3 mb-4">
      <Card.Body className="card-body p-0">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-4">
          <h3 className="mb-0">Individual Asset Performance</h3>
        </div>

        <div className="default-table-area style-two py-21 cp-individual-asset-performance">
          <div className="table-responsive">
            <Table className="align-middle">
              <thead>
                <tr>
                  <th scope="col" className="text-secondary">
                    Asset
                  </th>
                  <th scope="col" className="text-secondary">
                    Allocation %
                  </th>
                  <th scope="col" className="text-secondary">
                    ROI
                  </th>
                  <th scope="col" className="text-secondary">
                    Current Value
                  </th>
                  <th scope="col" className="text-secondary">
                    Net Gain/Loss
                  </th>
                  <th scope="col" className="text-secondary">
                    1D Change
                  </th>
                  <th scope="col" className="text-secondary">
                    7D Change
                  </th>
                  <th scope="col" className="text-secondary">
                    Sparkline
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="text-body">
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: "8px" }}
                      >
                        <Image
                          src={asset.icon}
                          alt={asset.symbol.toLowerCase()}
                          width={22}
                          height={22}
                        />
                        <span className="fw-medium text-secondary fs-13">
                          {asset.name}{" "}
                          <span className="fw-normal fs-12 text-body">
                            ({asset.symbol})
                          </span>
                        </span>
                      </div>
                    </td>

                    <td>{asset.allocation}%</td>

                    <td>+{asset.roi}%</td>

                    <td>{formatCurrency(asset.currentValue)}</td>

                    <td>{formatCurrency(asset.netGain)}</td>

                    <td className={getChangeColorClass(asset.oneDayChange)}>
                      {formatPercentage(asset.oneDayChange)}
                    </td>

                    <td className={getChangeColorClass(asset.sevenDayChange)}>
                      {formatPercentage(asset.sevenDayChange)}
                    </td>

                    <td className="overflow-hidden">
                      <div className="position-relative">
                        {Chart && (
                          <Chart
                            options={getChartOptions(
                              asset.sevenDayChange >= 0 ? "#25b003" : "#ff0000"
                            )}
                            series={[{ data: asset.sparklineData }]}
                            type="line"
                            height={30}
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
  );
};

export default IndividualAssetPerformance;