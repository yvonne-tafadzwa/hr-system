"use client";

import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import TotalSales from '@/components/Dashboard/eCommerce/TotalSales';
import TotalOrders from '@/components/Dashboard/eCommerce/TotalOrders';
import TotalCustomers from '@/components/Dashboard/eCommerce/TotalCustomers';
import TotalRevenue from '@/components/Dashboard/eCommerce/TotalRevenue';
import PendingSickNotes from '@/components/Dashboard/eCommerce/PendingSickNotes';
import LatestSickNotes from '@/components/Dashboard/eCommerce/LatestSickNotes';
import RecentActivities from '@/components/Dashboard/eCommerce/RecentActivities';

export default function Page() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Check if we're coming from a fresh login
        const justLoggedIn = sessionStorage.getItem('just_logged_in');

        if (justLoggedIn === 'true') {
            // Clear the flag
            sessionStorage.removeItem('just_logged_in');
            // Force a full page reload to ensure fresh data
            console.log('Fresh login detected, reloading dashboard...');
            window.location.reload();
            return;
        }

        // Set ready state after a small delay to ensure hydration
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Show loading while not ready
    if (!isReady) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
