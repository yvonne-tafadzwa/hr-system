"use client";

import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import TotalSales from '@/components/Dashboard/eCommerce/TotalSales';
import TotalOrders from '@/components/Dashboard/eCommerce/TotalOrders';
import TotalCustomers from '@/components/Dashboard/eCommerce/TotalCustomers';
import TotalRevenue from '@/components/Dashboard/eCommerce/TotalRevenue';
import PendingSickNotes from '@/components/Dashboard/eCommerce/PendingSickNotes';
import LatestSickNotes from '@/components/Dashboard/eCommerce/LatestSickNotes';
import RecentActivities from '@/components/Dashboard/eCommerce/RecentActivities';

export default function Page() {
    useEffect(() => {
        // Clear the login flag when dashboard mounts
        sessionStorage.removeItem('just_logged_in');
    }, []);

    return (
        <>
            <Row>
                <Col xs={12} sm={6} lg={3}>
                    <TotalOrders />
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <TotalCustomers />
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <TotalRevenue />
                </Col>

                <Col xs={12} sm={6} lg={3}>
                    <PendingSickNotes />
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12} lg={8}>
                    <TotalSales />
                </Col>
                <Col xs={12} lg={4}>
                    <LatestSickNotes />
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <RecentActivities />
                </Col>
            </Row>
        </>
    );
}
