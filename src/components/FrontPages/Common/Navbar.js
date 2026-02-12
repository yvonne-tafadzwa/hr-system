import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";import { useLocation } from "react-router-dom";

const Navbar = () => {
  const pathname = useLocation().pathname;

  const [isToggleNavbar, setToggleNavbar] = useState(true);

  const handleToggleNavbar = () => {
    setToggleNavbar(!isToggleNavbar);
  };

  useEffect(() => {
    const handleScroll = () => {
      const elementId = document.getElementById("navbar");
      if (window.scrollY > 170) {
        elementId?.classList.add("sticky");
      } else {
        elementId?.classList.remove("sticky");
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg fixed-top"
        id="navbar"
      >
        <div className="container">
          <Link className="navbar-brand me-xl-5 me-3" href="/">
            <img
              src="/images/landing/logo.svg"
              alt="logo"
              width={132}
              height={34}
              className="black-logo"
            />
            <img
              src="/images/white-logo.svg"
              alt="logo"
              width={132}
              height={34}
              className="white-logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleToggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isToggleNavbar ? "" : "show"
              }`}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/"
                  className={`nav-link fs-16 fw-medium text-body hover px-0 px-md-2 mx-1 mx-xl-0 px-xl-4 ${pathname === "/" ? "active" : ""
                    }`}
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/front-pages/features/"
                  className={`nav-link fs-16 fw-medium text-body hover px-0 px-md-2 mx-1 mx-xl-0 px-xl-4 ${pathname === "/front-pages/features/" ? "active" : ""
                    }`}
                >
                  Features
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/front-pages/team/"
                  className={`nav-link fs-16 fw-medium text-body hover px-0 px-md-2 mx-1 mx-xl-0 px-xl-4 ${pathname === "/front-pages/team/" ? "active" : ""
                    }`}
                >
                  Our Team
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/front-pages/faq/"
                  className={`nav-link fs-16 fw-medium text-body hover px-0 px-md-2 mx-1 mx-xl-0 px-xl-4 ${pathname === "/front-pages/faq/" ? "active" : ""
                    }`}
                >
                  FAQ’s
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/front-pages/contact/"
                  className={`nav-link fs-16 fw-medium text-body hover px-0 px-md-2 mx-1 mx-xl-0 px-xl-4 ${pathname === "/front-pages/contact/" ? "active" : ""
                    }`}
                >
                  Contact
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link fs-16 fw-medium text-body hover px-0 px-md-2 mx-1 mx-xl-0 px-xl-4"
                  href="/dashboard/ecommerce/"
                >
                  Admin
                </Link>
              </li>
            </ul>

            <div className="othres d-flex align-items-center gap-3">
              <Link to="/sign-in/"
                className="btn btn-outline-primary-div py-2 px-4 fw-medium fs-16 rounded-3 d-flex align-items-center gap-1"
              >
                <i className="ri-login-box-line fs-18 lh-1"></i>
                <span>Login</span>
              </Link>

              <Link to="/sign-up/"
                className="btn btn-primary-div py-2 px-4 fw-medium fs-16 text-white rounded-3 d-flex align-items-center gap-1"
              >
                <i className="ri-user-line fs-18 lh-1"></i>
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
