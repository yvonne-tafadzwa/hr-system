import CardsWithAmount from "@/components/Dashboard/CreditCard/CardsWithAmount";
import CreditUtilizationRatio from "@/components/Dashboard/CreditCard/CreditUtilizationRatio";
import DailyLimit from "@/components/Dashboard/CreditCard/DailyLimit";
import InterestChargeFees from "@/components/Dashboard/CreditCard/InterestChargeFees";
import MonthlySpending from "@/components/Dashboard/CreditCard/MonthlySpending";
import MyCards from "@/components/Dashboard/CreditCard/MyCards";
import QuickTransfer from "@/components/Dashboard/CreditCard/QuickTransfer";
import RecentTransactions from "@/components/Dashboard/CreditCard/RecentTransactions";
import SpendingBreakdown from "@/components/Dashboard/CreditCard/SpendingBreakdown";
import Statistics from "@/components/Dashboard/CreditCard/Statistics";
import TotalBalance from "@/components/Dashboard/CreditCard/TotalBalance";
import TotalExpense from "@/components/Dashboard/CreditCard/TotalExpense";
import { Row, Col } from "react-bootstrap";

export default function Page() {
  return (
    <>
      <Row className="g-4">
        <Col xs={12} sm={12} lg={8} xl={8} xxl={8}>
          <MyCards />
        </Col>

        <Col xs={12} sm={12} lg={4} xl={4} xxl={4}>
          <Row className="g-4 mb-4">
            <Col xs={12} sm={6} lg={12}>
              <TotalBalance />
            </Col>

            <Col xs={12} sm={6} lg={12}>
              <TotalExpense />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} lg={4}>
          <CardsWithAmount />
        </Col>

        <Col xs={12} sm={12} md={6} lg={4}>
          <DailyLimit />
        </Col>

        <Col xs={12} sm={12} md={6} lg={4}>
          <QuickTransfer />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} xxl={9}>
          <RecentTransactions />
        </Col>

        <Col xs={12} sm={12} xxl={3}>
          <Row className="g-4">
            <Col sm={6} xxl={12}>
              <CreditUtilizationRatio />
            </Col>

            <Col sm={6} xxl={12}>
              <MonthlySpending />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} md={12} xxl={4}>
          <SpendingBreakdown />
        </Col>

        <Col xs={12} sm={12} md={6} xxl={4}>
          <InterestChargeFees />
        </Col>

        <Col xs={12} sm={12} md={6} xxl={4}>
          <Statistics />
        </Col>
      </Row>
    </>
  );
}
