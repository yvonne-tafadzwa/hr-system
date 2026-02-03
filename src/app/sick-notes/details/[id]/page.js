"use client";

import { Breadcrumb } from "react-bootstrap";
import SickNoteDetails from '@/components/SickNotes/SickNoteDetails';

export default function Page({ params }) {
  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h3 className="mb-0" style={{ fontSize: '14px' }}>Sick Note Details</h3>

        <Breadcrumb className="breadcrumb-page-list align-items-center mb-0 lh-1">
          <Breadcrumb.Item href="/dashboard/ecommerce/">
            <div className="d-flex align-items-center text-decoration-none">
              <i className="ri-home-4-line fs-18 text-primary me-1"></i>
              <span className="text-secondary fw-medium hover" style={{ fontSize: '12px' }}>Dashboard</span>
            </div>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/sick-notes/sick-notes">
            <span className="text-secondary fw-medium hover" style={{ fontSize: '12px' }}>Sick Notes</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <span className="fw-medium" style={{ fontSize: '12px' }}>Details</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <SickNoteDetails sickNoteId={params?.id} />
    </div>
  );
}

