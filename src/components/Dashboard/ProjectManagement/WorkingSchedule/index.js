"use client";

import { Card } from "react-bootstrap";
import LatestSickNotes from "./UpcomingEvents";

const WorkingSchedule = () => {
  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <LatestSickNotes />
        </Card.Body>
      </Card>
    </>
  );
};
 
export default WorkingSchedule;

