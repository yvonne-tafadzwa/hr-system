import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LeftSidebar from "@/components/Layout/LeftSidebar";
import TopNavbar from "@/components/Layout/TopNavbar";
import Footer from "@/components/Layout/Footer";
import ControlPanel from "@/components/Layout/ControlPanel";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LeaderboardProvider } from "@/context/LeaderboardContext";

// Paths that should NOT show the dashboard layout (sidebar, topbar, footer)
const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/lock-screen",
  "/confirm-email",
  "/logout",
  "/submit-sick-note",
  "/front-pages/features",
  "/front-pages/team",
  "/front-pages/faq",
  "/front-pages/contact",
];

const isPublicPage = (pathname) => {
  // Normalize: remove trailing slash for comparison
  const normalized = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;

  if (normalized === "") return true; // root path

  return PUBLIC_PATHS.some((p) => normalized === p);
};

const LayoutProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const { pathname } = useLocation();

  const toogleActive = () => {
    setActive(!active);
  };

  const isPublic = isPublicPage(pathname);

  return (
    <AuthProvider>
      <NotificationProvider>
        <LeaderboardProvider>
          <>
            <div className={`main-wrapper-content ${active && "active"}`}>
              {!isPublic && (
                <>
                  <LeftSidebar toogleActive={toogleActive} />
                </>
              )}

              <div className="main-content d-flex flex-column">
                {!isPublic && (
                  <>
                    <TopNavbar toogleActive={toogleActive} />
                  </>
                )}

                {children}

                {!isPublic && <Footer />}
              </div>
            </div>

            <div
              style={{
                position: 'fixed',
                bottom: '0',
                right: '0',
                opacity: '0',
                visibility: 'hidden'
              }}
            >
              <ControlPanel />
            </div>
          </>
        </LeaderboardProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default LayoutProvider;
