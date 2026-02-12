import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";const initialCreatorsData = [
  {
    id: 1,
    name: "Hunny Bunny",
    items: 3204,
    coverImage: "/images/top-creator-1.png",
    profileImage: "/images/user-76.gif",
    isVerified: true,
    isFollowing: false,
  },
  {
    id: 2,
    name: "Aristocrat",
    items: 5301,
    coverImage: "/images/top-creator-2.png",
    profileImage: "/images/user-77.gif",
    isVerified: true,
    isFollowing: false,
  },
  {
    id: 3,
    name: "Hooman Robotic",
    items: 4213,
    coverImage: "/images/top-creator-3.png",
    profileImage: "/images/user-78.gif",
    isVerified: true,
    isFollowing: true,
  },
  {
    id: 4,
    name: "Colorful Life",
    items: 2314,
    coverImage: "/images/top-creator-4.png",
    profileImage: "/images/user-98.png",
    isVerified: true,
    isFollowing: false,
  },
];

const TopCreators = () => {
  const [creators, setCreators] = useState(initialCreatorsData);

  const toggleFollow = (id) => {
    setCreators((prevCreators) =>
      prevCreators.map((creator) =>
        creator.id === id
          ? { ...creator, isFollowing: !creator.isFollowing }
          : creator
      )
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h3 className="mb-0">Top Creators</h3>

        <Link to="/nft/creators" className="d-flex text-decoration-none">
          <span>Browse All</span>
          <i className="ri-arrow-right-s-line fs-15"></i>
        </Link>
      </div>

      <Row className="justify-content-center">
        {creators.map((creator) => (
          <Col key={creator.id} sm={6} md={4} lg={3}>
            <div className="bg-white rounded-3 border-0 p-3 place-bid for-dark-card mb-4 text-center">
              <div className="position-relative">
                <img
                  src={creator.coverImage}
                  className="rounded-3 w-100"
                  alt="top-creator"
                  width={230}
                  height={220}
                />
                <div className="position-absolute top-100 start-50 translate-middle">
                  <img
                    src={creator.profileImage}
                    className="rounded-circle"
                    alt="user"
                    width={64}
                    height={64}
                  />
                  {creator.isVerified && (
                    <img
                      src="/images/verify.svg"
                      className="position-absolute bottom-0 end-0"
                      alt="verify"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              </div>
              <div className="mt-5 border-bottom pb-3 mb-3">
                <h4 className="fs-16 fw-semibold">{creator.name}</h4>
                <span className="fs-12">ITEMS: {creator.items}</span>
              </div>
              <Button
                className={`btn ${
                  creator.isFollowing ? "btn-secondary" : "btn-primary"
                } py-2 px-4 fs-16 fw-medium`}
                onClick={() => toggleFollow(creator.id)}
              >
                {creator.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default TopCreators;
