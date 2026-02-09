"use client";

import { Row, Col, Breadcrumb } from "react-bootstrap";
import FullCalendarDemo from "@/components/Apps/Calendar/FullCalendarDemo";
import WorkingSchedule from "@/components/Dashboard/ProjectManagement/WorkingSchedule";

export default function Page() {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                <h3 className="mb-0" style={{ fontSize: '14px' }}>Calendar</h3>

                <Breadcrumb className="breadcrumb-page-list align-items-center mb-0 lh-1">
                    <Breadcrumb.Item href="/dashboard/">
                        <div className="d-flex align-items-center text-decoration-none">
                            <i className="ri-home-4-line fs-18 text-primary me-1"></i>
                            <span className="text-secondary fw-medium hover" style={{ fontSize: '12px' }}>Dashboard</span>
                        </div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        <span className="fw-medium" style={{ fontSize: '12px' }}>Calendar</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Row>
                <Col lg={8}>
                    <FullCalendarDemo />
                </Col>

                <Col lg={4}>
                    <WorkingSchedule />
                </Col>
            </Row>
        </>
    );
}
