import CustomerRatings from "@/components/Dashboard/Hotel/CustomerRatings";
import GuestActivity from "@/components/Dashboard/Hotel/GuestActivity";
import PopularRooms from "@/components/Dashboard/Hotel/PopularRooms";
import RecentBookings from "@/components/Dashboard/Hotel/RecentBookings";
import RoomsAvailability from "@/components/Dashboard/Hotel/RoomsAvailability";
import Stats from "@/components/Dashboard/Hotel/Stats";
import UpcomingVIPReservations from "@/components/Dashboard/Hotel/UpcomingVIPReservations";
import { Row, Col } from "react-bootstrap";

export default function Page() {
  return (
    <>
      <Row className="g-4">
        <Col xs={12} sm={12} lg={8} xl={12} xxl={8}>
          <Stats />

          <Row className="g-4 mb-4">
            <Col xs={12} sm={12} lg={6}>
              <RoomsAvailability />
            </Col>

            <Col xs={12} sm={12} lg={6}>
              <GuestActivity />
            </Col>
          </Row>

          <UpcomingVIPReservations />
        </Col>

        <Col xs={12} sm={12} lg={4} xl={12} xxl={4}>
          <RecentBookings />
        </Col>
      </Row>

      <PopularRooms />

      <CustomerRatings />
    </>
  );
}
