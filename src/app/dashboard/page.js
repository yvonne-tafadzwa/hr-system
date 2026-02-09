"use client";

import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";
import TotalSales from '@/components/Dashboard/eCommerce/TotalSales';
import TotalOrders from '@/components/Dashboard/eCommerce/TotalOrders';
import TotalCustomers from '@/components/Dashboard/eCommerce/TotalCustomers';
import TotalRevenue from '@/components/Dashboard/eCommerce/TotalRevenue';
import PendingSickNotes from '@/components/Dashboard/eCommerce/PendingSickNotes';
import LatestSickNotes from '@/components/Dashboard/eCommerce/LatestSickNotes';
import RecentActivities from '@/components/Dashboard/eCommerce/RecentActivities';

export default function Page() {
    const { isLoading: authLoading } = useAuth();

    useEffect(() => {
        // Clear the login flag when dashboard mounts
        sessionStorage.removeItem('just_logged_in');
    }, []);

    // Show loading while auth is initializing
    if (authLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Initializing dashboard...</p>
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
