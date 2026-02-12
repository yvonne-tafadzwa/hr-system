import { Row, Col, Breadcrumb } from "react-bootstrap";
import ProfileIntro from '@/components/MyProfile/ProfileIntro';
import ProfileInformation from '@/components/MyProfile/ProfileInformation';
import EditProfile from '@/components/MyProfile/EditProfile';

export default function Page() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h3 className="mb-0">My Profile</h3>

        <Breadcrumb className="breadcrumb-page-list align-items-center mb-0 lh-1">
          <Breadcrumb.Item href="/dashboard/ecommerce/">
            <div className="d-flex align-items-center text-decoration-none">
              <i className="ri-home-4-line fs-18 text-primary me-1"></i>
              <span className="text-secondary fw-medium hover">Dashboard</span>
            </div>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <span className="fw-medium">My Profile</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Row className="justify-content-center">
        <Col xs={12} lg={4} xl={4}>
          <ProfileIntro />
          <ProfileInformation />
        </Col>

        <Col xs={12} lg={8} xl={8}>
          <EditProfile />
        </Col>
      </Row>
    </>
  );
}
