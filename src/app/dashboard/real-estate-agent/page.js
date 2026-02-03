import ClientRatings from "@/components/Dashboard/RealEstateAgent/ClientRatings";
import DownloadApp from "@/components/Dashboard/RealEstateAgent/DownloadApp";
import LatestTransactions from "@/components/Dashboard/RealEstateAgent/LatestTransactions";
import MyFeaturedListings from "@/components/Dashboard/RealEstateAgent/MyFeaturedListings";
import RecentClients from "@/components/Dashboard/RealEstateAgent/RecentClients";
import RevenueGoalProgress from "@/components/Dashboard/RealEstateAgent/RevenueGoalProgress";
import SalesByCountry from "@/components/Dashboard/RealEstateAgent/SalesByCountry";
import TopChannels from "@/components/Dashboard/RealEstateAgent/TopChannels";
import TotalRevenue from "@/components/Dashboard/RealEstateAgent/TotalRevenue";
import Welcome from "@/components/Dashboard/RealEstateAgent/Welcome";
import { Row, Col } from "react-bootstrap";

export default function Page() {
  return (
    <>
      <Welcome />

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={8} xl={8} xxl={8}>
          <TotalRevenue />
        </Col>

        <Col xs={12} sm={12} lg={4} xl={4} xxl={4}>
          <TopChannels />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={4} xl={4} xxl={4}>
          <RecentClients />
        </Col>

        <Col xs={12} sm={12} lg={8} xl={8} xxl={8}>
          <MyFeaturedListings />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={8} xl={8} xxl={8}>
          <RevenueGoalProgress />
        </Col>

        <Col xs={12} sm={12} lg={4} xl={4} xxl={4}>
          <SalesByCountry />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={3} xl={3} xxl={3}>
          <DownloadApp />
        </Col>

        <Col xs={12} sm={12} lg={9} xl={9} xxl={9}>
          <LatestTransactions />
        </Col>
      </Row>

      <ClientRatings />
    </>
  );
}
