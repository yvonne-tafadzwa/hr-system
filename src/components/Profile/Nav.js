import { Link } from "react-router-dom";import { useLocation } from "react-router-dom";

const Nav = () => {
  const pathname = useLocation().pathname;

  return (
    <>
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
        <Link
          className={`btn btn-outline-primary py-2 px-3 fw-medium ${
            pathname === "/profile/" ? "btn-primary text-white" : ""
          }`}
          href="/profile/"
        >
          Profile
        </Link>

        <Link
          className={`btn btn-outline-primary py-2 px-3 fw-medium ${
            pathname === "/profile/teams/" ? "btn-primary text-white" : ""
          }`}
          href="/profile/teams/"
        >
          Team
        </Link>

        <Link
          className={`btn btn-outline-primary py-2 px-3 fw-medium ${
            pathname === "/profile/projects/" ? "btn-primary text-white" : ""
          }`}
          href="/profile/projects/"
        >
          Projects
        </Link>
      </div>
    </>
  );
};

export default Nav;
