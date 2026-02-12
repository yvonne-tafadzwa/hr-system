import { useState, useRef, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/services";

const SignInForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");

  // Safety timeout ref — prevents "Signing in..." from getting stuck forever
  const timeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!companyId.trim()) {
      setError("Company ID is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    // Safety net: if login hasn't completed in 15s, unblock the button
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setError("Login is taking too long. Please check your connection and try again.");
    }, 15000);

    try {
      console.log('Submitting login for:', companyId.trim().toUpperCase());

      const result = await authService.signInWithCompanyOnly(
        companyId.trim().toUpperCase(),
        password
      );

      if (result.error) {
        setError(result.error.message || "Invalid credentials");
        return;
      }

      if (result.data) {
        console.log('Login successful, redirecting...');
        // Set flag to trigger dashboard reload for fresh data
        sessionStorage.setItem('just_logged_in', 'true');
        // Use window.location for a full page load to ensure clean dashboard state
        window.location.href = "/dashboard/";
        // Don't clear timeout here — let the navigation happen
        return;
      }

    } catch (err) {
      console.error('Sign in exception:', err);
      if (err.name === 'AbortError') {
        setError("Request was cancelled. Please try again.");
      } else {
        setError(`Error: ${err.message || "An unexpected error occurred"}`);
      }
    } finally {
      // Clear the safety timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .signin-form input::placeholder {
          font-size: 12px !important;
        }
      `}} />
      <div className="auth-main-content m-auto px-3 signin-form" style={{ maxWidth: '100%', width: '100%' }}>
        <Row className="align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Col xs={12} sm={12} md={10} lg={8} xl={6}>
            <div className="mx-auto" style={{
              width: '500px',
              maxWidth: '100%',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
              borderRadius: '8px',
              padding: '32px'
            }}>
              <div className="mb-3">
                <h3 className="mb-2" style={{ fontSize: '16px' }}>Welcome Back</h3>
                <p className="fw-medium fs-16 mb-0" style={{ fontSize: '12px' }}>
                  Enter your company ID and password to sign in
                </p>
              </div>

              {error && (
                <div className="p-3 mb-4 text-sm text-danger bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded" style={{ fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Company ID <span className="text-danger">*</span>
                  </label>
                  <Form.Control
                    type="text"
                    className="h-55"
                    placeholder="e.g., TECH-1234"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    style={{
                      fontSize: '12px',
                      border: 'none',
                      borderBottom: '1px solid #D6DAE1',
                      borderRadius: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      textTransform: 'uppercase',
                      height: '25px',
                      paddingTop: '4px',
                      paddingBottom: '4px'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <label className="label text-secondary" style={{ fontSize: '12px' }}>
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      className="h-55"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        fontSize: '12px',
                        border: 'none',
                        borderBottom: '1px solid #D6DAE1',
                        borderRadius: 0,
                        paddingLeft: 0,
                        paddingRight: '40px',
                        height: '25px',
                        paddingTop: '4px',
                        paddingBottom: '4px'
                      }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute"
                      style={{
                        right: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 30
                      }}
                    >
                      {showPassword ? (
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6c757d' }}>
                          visibility_off
                        </span>
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6c757d' }}>
                          visibility
                        </span>
                      )}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="checkbox"
                        id="keepLoggedIn"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="form-check-input"
                      />
                      <label className="form-check-label mb-0" htmlFor="keepLoggedIn" style={{ fontSize: '12px' }}>
                        Keep me logged in
                      </label>
                    </div>
                    <Link to='/forgot-password/'
                      className="fw-medium text-primary text-decoration-none"
                      style={{ fontSize: '12px' }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary fw-medium py-2 px-3 w-100"
                    disabled={isLoading}
                  >
                    <div className="d-flex align-items-center justify-content-center py-1">
                      <span className="material-symbols-outlined fs-20 text-white me-2">
                        login
                      </span>
                      <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                    </div>
                  </button>
                </Form.Group>

                <Form.Group>
                  <p className="text-center mb-0" style={{ fontSize: '12px' }}>
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up/"
                      className="fw-medium text-primary text-decoration-none"
                    >
                      Register Company
                    </Link>
                  </p>
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SignInForm;