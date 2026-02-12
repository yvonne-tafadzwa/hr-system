import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; const LeftSidebar = ({ toogleActive }) => {
  const pathname = useLocation().pathname;

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
          <Link to="/dashboard/"
            className="d-block text-decoration-none position-relative"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}
          >
            <img
              src="/images/logo-icon.png"
              alt="logo-icon"
              width={16}
              height={16}
            />
            <span className="logo-text fw-bold text-dark" style={{ fontSize: '18px' }}>Verity</span>
          </Link>
          <button
            className="sidebar-burger-menu bg-transparent p-0 border-0 d-lg-none position-absolute top-50 end-0 translate-middle-y"
            onClick={toogleActive}
            style={{ marginRight: '10px' }}
          >
            <i className="ri-close-line" style={{ fontSize: '24px', color: '#333' }}></i>
          </button>
        </div>

        <div className="sidebar-menu" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
          {/* Main Menu */}
          <div style={{ flex: 1 }}>
            <Accordion defaultActiveKey="0" flush>
              <div className="menu-item">
                <Link to="/dashboard/"
                  className={`menu-link ${pathname === "/dashboard/" ? "active" : ""
                    }`}
                >
                  <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</i>
                  <span className="title" style={{ fontSize: '12px' }}>Dashboard</span>
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/companies/"
                  className={`menu-link ${pathname === "/companies/" ? "active" : ""
                    }`}
                >
                  <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>business</i>
                  <span className="title" style={{ fontSize: '12px' }}>Companies</span>
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/sick-notes/"
                  className={`menu-link ${pathname === "/sick-notes/" ? "active" : ""
                    }`}
                >
                  <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>medical_services</i>
                  <span className="title" style={{ fontSize: '12px' }}>Sick Notes</span>
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/employees/"
                  className={`menu-link ${pathname === "/employees/" ? "active" : ""
                    }`}
                >
                  <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>groups</i>
                  <span className="title" style={{ fontSize: '12px' }}>Employees</span>
                </Link>
              </div>

              <div className="menu-item">
                <Link to="/calendar/"
                  className={`menu-link ${pathname === "/calendar/" ? "active" : ""
                    }`}
                >
                  <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</i>
                  <span className="title" style={{ fontSize: '12px' }}>Calendar</span>
                </Link>
              </div>

              <div className="menu-item">
                <Link to="/reports"
                  className={`menu-link ${pathname === "/reports" ? "active" : ""
                    }`}
                >
                  <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>assessment</i>
                  <span className="title" style={{ fontSize: '12px' }}>Reports</span>
                </Link>
              </div>
            </Accordion>
          </div>

          {/* Account Section - Fixed at bottom */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '12px',
            marginTop: 'auto',
            paddingBottom: '20px'
          }}>
            <span style={{
              fontSize: '10px',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              paddingLeft: '20px',
              display: 'block',
              marginBottom: '8px'
            }}>
              Account
            </span>
            <div className="menu-item">
              <Link to="/logout/"
                className={`menu-link ${pathname === "/logout/" ? "active" : ""
                  }`}
              >
                <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>exit_to_app</i>
                <span className="title" style={{ fontSize: '12px' }}>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
