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
        // Check if this is a fresh login (first load after navigation)
        const hasRefreshed = sessionStorage.getItem('dashboard_refreshed');

        if (!hasRefreshed) {
            // Mark that we've initiated a refresh check
            sessionStorage.setItem('dashboard_refreshed', 'pending');

            // Set a 10 second timeout to auto-refresh if page is stuck loading
            const refreshTimer = setTimeout(() => {
                const refreshStatus = sessionStorage.getItem('dashboard_refreshed');
                if (refreshStatus === 'pending') {
                    console.log('Dashboard stuck loading, auto-refreshing...');
                    sessionStorage.setItem('dashboard_refreshed', 'done');
                    window.location.reload();
                }
            }, 10000);

            // Mark as done after initial render (short delay to ensure data loaded)
            const loadCheckTimer = setTimeout(() => {
                sessionStorage.setItem('dashboard_refreshed', 'done');
            }, 3000);

            return () => {
                clearTimeout(refreshTimer);
                clearTimeout(loadCheckTimer);
            };
        }

        // Clear the refresh flag when user navigates away (on unmount won't work for this)
        // Reset flag after 30 seconds to allow refresh on next visit
        const resetTimer = setTimeout(() => {
            sessionStorage.removeItem('dashboard_refreshed');
        }, 30000);

        return () => clearTimeout(resetTimer);
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
