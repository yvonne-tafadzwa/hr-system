import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LeftSidebar from "@/components/Layout/LeftSidebar";
import TopNavbar from "@/components/Layout/TopNavbar";
import Footer from "@/components/Layout/Footer";
import ControlPanel from "@/components/Layout/ControlPanel";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LeaderboardProvider } from "@/context/LeaderboardContext";

const LayoutProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const { pathname } = useLocation();

  const toogleActive = () => {
    setActive(!active);
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <LeaderboardProvider>
          <>
            <div className={`main-wrapper-content ${active && "active"}`}>
              {!(
                pathname === "/sign-in/" ||
                pathname === "/sign-up/" ||
                pathname === "/forgot-password/" ||
                pathname === "/reset-password/" ||
                pathname === "/lock-screen/" ||
                pathname === "/confirm-email/" ||
                pathname === "/logout/" ||
                pathname === "/submit-sick-note/" ||

                pathname === "/" ||
                pathname === "/front-pages/features/" ||
                pathname === "/front-pages/team/" ||
                pathname === "/front-pages/faq/" ||
                pathname === "/front-pages/contact/"
              ) && (
                  <>
                    <LeftSidebar toogleActive={toogleActive} />
                  </>
                )}

              <div className="main-content d-flex flex-column">
                {!(
                  pathname === "/sign-in/" ||
                  pathname === "/sign-up/" ||
                  pathname === "/forgot-password/" ||
                  pathname === "/reset-password/" ||
                  pathname === "/lock-screen/" ||
                  pathname === "/confirm-email/" ||
                  pathname === "/logout/" ||
                  pathname === "/submit-sick-note/" ||

                  pathname === "/" ||
                  pathname === "/front-pages/features/" ||
                  pathname === "/front-pages/team/" ||
                  pathname === "/front-pages/faq/" ||
                  pathname === "/front-pages/contact/"
                ) && (
                    <>
                      <TopNavbar toogleActive={toogleActive} />
                    </>
                  )}

                {children}

                {!(
                  pathname === "/sign-in/" ||
                  pathname === "/sign-up/" ||
                  pathname === "/forgot-password/" ||
                  pathname === "/reset-password/" ||
                  pathname === "/lock-screen/" ||
                  pathname === "/confirm-email/" ||
                  pathname === "/logout/" ||
                  pathname === "/submit-sick-note/" ||

                  pathname === "/" ||
                  pathname === "/front-pages/features/" ||
                  pathname === "/front-pages/team/" ||
                  pathname === "/front-pages/faq/" ||
                  pathname === "/front-pages/contact/"
                ) && <Footer />}
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

