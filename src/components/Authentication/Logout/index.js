"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Spinner } from "react-bootstrap";
import { supabase } from "@/lib/supabase";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Sign out
        await supabase.auth.signOut();
        console.log('User logged out successfully');
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        // Redirect to sign-in page
        router.replace('/authentication/sign-in/');
      }
    };

    performLogout();
  }, [router]);

  // Show a brief loading state while logging out
  return (
    <>
      <div className="auth-main-content m-auto m-1230 px-3">
        <Row className="align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Col lg={12}>
            <div
              className="text-center p-4 rounded-3 mx-auto"
              style={{
                width: '350px',
                maxWidth: '100%',
              }}
            >
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="fw-semibold" style={{ fontSize: '16px', color: '#666' }}>
                Logging out...
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Logout;

