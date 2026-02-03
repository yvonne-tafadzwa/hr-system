"use client";

import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const LeftSidebar = ({ toogleActive }) => {
  const pathname = usePathname();

  // Enable the dark sidebar exclusively for the /dashboard/beauty-salon/ page URL.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Only check or set the theme if we're on the beauty-salon page.
    if (pathname === "/dashboard/beauty-salon/") {
      const storedTheme = localStorage.getItem("beautySalonSidebarTheme");
      if (storedTheme) {
        setIsDark(storedTheme === "dark");
      } else {
        // Default to dark theme and persist it in localStorage
        setIsDark(true);
        localStorage.setItem("beautySalonSidebarTheme", "dark");
      }
    } else {
      // For other pages, do not use localStorage for the theme
      setIsDark(false);
    }
  }, [pathname]);

  return (
    <>
      <div
        className={`sidebar-area ${pathname === "/dashboard/beauty-salon/" && isDark ? "dark" : ""
          }`}
      >
        <div className="logo position-relative">
          <Link
            href="/dashboard/ecommerce/"
            className="d-block text-decoration-none position-relative"
          >
            <Image
              src="/images/logo-icon.png"
              alt="logo-icon"
              width={26}
              height={26}
            />
            <span className="logo-text fw-bold text-dark">HRSY</span>
          </Link>
          <button
            className="sidebar-burger-menu bg-transparent p-0 border-0 opacity-0 z-n1 position-absolute top-50 end-0 translate-middle-y"
            onClick={toogleActive}
          >
            <i className="material-symbols-outlined fs-24">close</i>
          </button>
        </div>

        <div className="sidebar-menu">


          <Accordion defaultActiveKey="0" flush>



            <div className="menu-item">
              <Link
                href="/dashboard/ecommerce/"
                className={`menu-link ${pathname === "/dashboard/ecommerce/" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</i>
                <span className="title" style={{ fontSize: '12px' }}>Dashboard</span>
              </Link>
            </div>
            <div className="menu-item">
              <Link
                href="/companies/companies"
                className={`menu-link ${pathname === "/companies/companies" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>business</i>
                <span className="title" style={{ fontSize: '12px' }}>Companies</span>
              </Link>
            </div>
            <div className="menu-item">
              <Link
                href="/sick-notes/sick-notes"
                className={`menu-link ${pathname === "/sick-notes/sick-notes" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>medical_services</i>
                <span className="title" style={{ fontSize: '12px' }}>Sick Notes</span>
              </Link>
            </div>
            <div className="menu-item">
              <Link
                href="/employees/employees"
                className={`menu-link ${pathname === "/employees/employees" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>groups</i>
                <span className="title" style={{ fontSize: '12px' }}>Employees</span>
              </Link>
            </div>

            <div className="menu-item">
              <Link
                href="/apps/calendar/"
                className={`menu-link ${pathname === "/apps/calendar/" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</i>
                <span className="title" style={{ fontSize: '12px' }}>Calendar</span>
              </Link>
            </div>


            <div className="menu-item">
              <Link
                href="/authentication/logout/"
                className={`menu-link ${pathname === "/authentication/logout/" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>exit_to_app</i>
                <span className="title" style={{ fontSize: '12px' }}>Logout</span>
              </Link>
            </div>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
