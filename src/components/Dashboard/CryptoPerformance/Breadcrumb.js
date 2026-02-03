"use client";

import React from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";

const Breadcrumb = () => {
  return (
    <>
      <Card
        className="border-0 rounded-3 bg-white p-25 bg-img debit-card-bg-for-dark-mode mb-4"
        style={{
          backgroundImage: "url(/images/sparkline-bg.jpg)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 crypto-performance">
          <h3 className="mb-0 text-white">Crypto Performance</h3>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb align-items-center mb-0 lh-1">
              <li className="breadcrumb-item">
                <Link
                  href="/dashboard/ecommerce/"
                  className="d-flex align-items-center text-decoration-none"
                >
                  <i className="ri-home-4-line fs-18 text-white me-1 position-relative"></i>
                  <span className="text-secondary hover text-white fs-13">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <span className="text-white fs-13">Crypto Performance</span>
              </li>
            </ol>
          </nav>
        </div>
      </Card>
    </>
  );
};

export default Breadcrumb;
