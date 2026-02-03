import AssetAllocation from "@/components/Dashboard/CryptoTrader/AssetAllocation";
import GainersAndLosers from "@/components/Dashboard/CryptoTrader/GainersAndLosers";
import LivePriceTracker from "@/components/Dashboard/CryptoTrader/LivePriceTracker";
import MarketSentimentIndicator from "@/components/Dashboard/CryptoTrader/MarketSentimentIndicator";
import PortfolioDistribution from "@/components/Dashboard/CryptoTrader/PortfolioDistribution";
import PriceMovement from "@/components/Dashboard/CryptoTrader/PriceMovement";
import ProfitAndLoss from "@/components/Dashboard/CryptoTrader/ProfitAndLoss";
import RecentTransactions from "@/components/Dashboard/CryptoTrader/RecentTransactions";
import RiskExposure from "@/components/Dashboard/CryptoTrader/RiskExposure";
import Stats from "@/components/Dashboard/CryptoTrader/Stats";
import TradesPerMonth from "@/components/Dashboard/CryptoTrader/TradesPerMonth";
import TradingVolume from "@/components/Dashboard/CryptoTrader/TradingVolume";
import { Row, Col } from "react-bootstrap";

export default function Page() {
  return (
    <>
      <Stats />

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={12} xl={12} xxl={8}>
          <PriceMovement />
        </Col>

        <Col xs={12} sm={12} lg={12} xl={12} xxl={4}>
          <Row className="g-4">
            <Col xs={12} sm={12} md={6} xxl={12}>
              <TradingVolume />
            </Col>

            <Col xs={12} sm={12} md={6} xxl={12}>
              <PortfolioDistribution />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} sm={12} lg={8} xl={12} xxl={8}>
          <Row className="g-4 mb-4">
            <Col xs={12} md={6}>
              <ProfitAndLoss />
            </Col>

            <Col xs={12} md={6}>
              <RiskExposure />
            </Col>
          </Row>

          <RecentTransactions />
        </Col>

        <Col xs={12} sm={12} lg={4} xl={12} xxl={4}>
          <LivePriceTracker />

          <TradesPerMonth />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} md={6} xxl={4}>
          <AssetAllocation />
        </Col>

        <Col xs={12} sm={12} md={6} xxl={4}>
          <GainersAndLosers />
        </Col>

        <Col xs={12} sm={12} md={12} xxl={4}>
          <MarketSentimentIndicator />
        </Col>
      </Row>
    </>
  );
}
