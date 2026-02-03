import Breadcrumb from "@/components/Dashboard/CryptoPerformance/Breadcrumb";
import ComparativeAnalysis from "@/components/Dashboard/CryptoPerformance/ComparativeAnalysis";
import CryptoMarketCap from "@/components/Dashboard/CryptoPerformance/CryptoMarketCap";
import IndividualAssetPerformance from "@/components/Dashboard/CryptoPerformance/IndividualAssetPerformance";
import MarketPerformance from "@/components/Dashboard/CryptoPerformance/MarketPerformance";
import PerformanceMetrics from "@/components/Dashboard/CryptoPerformance/PerformanceMetrics";
import PerformancePerInvestment from "@/components/Dashboard/CryptoPerformance/PerformancePerInvestment";
import PortfolioValue from "@/components/Dashboard/CryptoPerformance/PortfolioValue";
import RiskStabilityIndicators from "@/components/Dashboard/CryptoPerformance/RiskStabilityIndicators";
import TransactionsHistory from "@/components/Dashboard/CryptoPerformance/TransactionsHistory";
import { Row, Col } from "react-bootstrap";

export default function Page() {
  return (
    <>
      <Breadcrumb />

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={6}>
          <PerformancePerInvestment />
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Row className="g-4">
            <Col xs={12} sm={6} lg={6}>
              <PortfolioValue />
            </Col>

            <Col xs={12} sm={6} lg={6}>
              <CryptoMarketCap />
            </Col>

            <Col xs={12} sm={12} lg={12}>
              <TransactionsHistory />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={5}>
          <MarketPerformance />
        </Col>

        <Col xs={12} sm={12} lg={7}>
          <PerformanceMetrics />
        </Col>
      </Row>

      <IndividualAssetPerformance />

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={4}>
          <RiskStabilityIndicators />
        </Col>

        <Col xs={12} sm={12} lg={8}>
          <ComparativeAnalysis />
        </Col>
      </Row>
    </>
  );
}
