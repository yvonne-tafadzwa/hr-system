import { Link } from "react-router-dom";const UpgradePlans = () => {
  return (
    <>
      <div
        className="rounded-3 p-4 text-center mb-4"
        style={{
          background: "linear-gradient(164deg, #B95232 3.1%, #EB6D5C 99.22%)",
        }}
      >
        <h2
          className="fs-24 text-white mx-auto mb-5 text-center"
          style={{ maxWidth: "300px", lineHeight: "1.4" }}
        >
          Have A Team More Than 10 Members?
        </h2>

        <Link to="#"
          className="btn btn-dark fs-16 fw-medium rounded-3 py-2 px-3"
        >
          Upgrade Plans
        </Link>

        <div className="text-center py-5 mt-4">
          <img src="/images/saas.png" alt="saas" width={207} height={188} />
        </div>
      </div>
    </>
  );
};

export default UpgradePlans;
