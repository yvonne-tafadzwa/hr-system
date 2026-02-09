"use client";

import React, { use } from "react";
import { Breadcrumb } from "react-bootstrap";
import EditCompany from '@/components/Companies/EditCompany';

export default function Page({ params }) {
  // In Next.js 15+, params is a promise that needs to be unwrapped with use()
  const resolvedParams = typeof params?.then === 'function' ? use(params) : params;
  const companyId = resolvedParams?.id;

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h3 className="mb-0" style={{ fontSize: '14px' }}>Edit Company</h3>

        <Breadcrumb className="breadcrumb-page-list align-items-center mb-0 lh-1">
          <Breadcrumb.Item href="/dashboard/">
            <div className="d-flex align-items-center text-decoration-none">
              <i className="ri-home-4-line fs-18 text-primary me-1"></i>
              <span className="text-secondary fw-medium hover" style={{ fontSize: '12px' }}>Dashboard</span>
            </div>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/companies/">
            <span className="text-secondary fw-medium hover" style={{ fontSize: '12px' }}>Companies</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <span className="fw-medium" style={{ fontSize: '12px' }}>Edit Company</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <EditCompany companyId={companyId} />
    </div>
  );
}
