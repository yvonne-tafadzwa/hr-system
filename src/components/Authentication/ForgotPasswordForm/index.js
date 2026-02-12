import { Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";const ForgotPasswordForm = () => {
  return (
    <>
      <div className="auth-main-content d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="align-items-center justify-content-center w-100">
          <Col lg={5} md={6} sm={8} xs={12}>
            <div className="mw-480 mx-auto">

              <h3 className="fs-20 mb-2">Forgot your password?</h3>
              <p className="fw-medium fs-14 mb-4">
                Enter the email address you used when you joined and we'll send
                you instructions to reset your password.
              </p>

              <Form>
                <Form.Group className="mb-4">
                  <label className="label text-secondary">Email Address</label>
                  <Form.Control
                    type="email"
                    className="h-55"
                    placeholder="example@company.com"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary fw-medium py-2 px-3 w-100"
                  >
                    <div className="d-flex align-items-center justify-content-center py-1">
                      <span className="material-symbols-outlined fs-20 text-white me-2">
                        autorenew
                      </span>
                      <span>Send</span>
                    </div>
                  </button>
                </Form.Group>

                <Form.Group>
                  <p>
                    Back to{" "}
                    <Link to="/sign-in/"
                      className="fw-medium text-primary text-decoration-none"
                    >
                      Sign In
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

export default ForgotPasswordForm;
