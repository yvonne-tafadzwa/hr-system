"use client";

import React, { useState, useEffect } from "react";
import Notifications from "./Notifications";
import Profile from "./Profile";
import { supabase } from "@/lib/supabase";
import { useLeaderboard } from "@/context/LeaderboardContext";
import { useAuth } from "@/context/AuthContext";

const TopNavbar = ({ toogleActive }) => {
  const [companyName, setCompanyName] = useState('');
  const { showLeaderboard, toggleLeaderboard } = useLeaderboard();
  const { user, profile, isSuperAdmin, companyId, isLoading: authLoading } = useAuth();

  React.useEffect(() => {
    let elementId = document.getElementById("header");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        elementId.classList.add("sticky");
      } else {
        elementId.classList.remove("sticky");
      }
    });
  });

  useEffect(() => {
    // Don't fetch until auth is fully loaded
    if (authLoading) return;

    const fetchCompanyName = async () => {
      try {
        // If user is super_admin, always show "Administrator"
        if (isSuperAdmin) {
          setCompanyName('Administrator');
          return;
        }

        // If we have a companyId from AuthContext, use it to get the company name
        if (companyId) {
          const { data: company } = await supabase
            .from('companies')
            .select('name')
            .eq('id', companyId)
            .single();

          if (company) {
            setCompanyName(company.name);
            return;
          }
        }

        // Fallback: try to get company name by user email
        if (user?.email) {
          const { data: adminCompany } = await supabase
            .from('companies')
            .select('name, company_code')
            .ilike('login_email', user.email)
            .eq('is_active', true)
            .single();

          if (adminCompany) {
            // If this is the ADMIN company, show "Administrator"
            if (adminCompany.company_code === 'ADMIN') {
              setCompanyName('Administrator');
            } else {
              setCompanyName(adminCompany.name);
            }
            return;
          }
        }

        // If no user is logged in, don't show any company name
        // (removed dangerous fallback that showed first random company)
        if (!user) {
          setCompanyName('');
          return;
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, [authLoading, isSuperAdmin, companyId, user]);

  return (
    <>
      <header
        className="header-area bg-transparent mb-4 rounded-bottom-15"
        id="header"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="container-fluid p-0">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="left-header-content">
                <div className="d-flex flex-column">
                  <h4 className="mb-0 d-flex align-items-center" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                    Hi, {authLoading ? '...' : (companyName || 'Company')} 👋
                  </h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>Welcome back! Here&apos;s what&apos;s happening today.</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-header-content mt-2 mt-sm-0">
                <ul className="d-flex align-items-center justify-content-end ps-0 mb-0 list-unstyled">
                  {/* Leaderboard Toggle Switch */}
                  <li className="header-right-item">
                    <div
                      onClick={toggleLeaderboard}
                      title={showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginRight: '12px',
                        userSelect: 'none',
                        gap: '8px'
                      }}
                    >
                      {/* Label */}
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#374151',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Leader Board
                      </span>

                      {/* Toggle Track */}
                      <div
                        style={{
                          position: 'relative',
                          width: '50px',
                          height: '26px',
                          borderRadius: '13px',
                          backgroundColor: showLeaderboard ? '#22c55e' : '#1f2937',
                          transition: 'background-color 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 6px',
                          justifyContent: showLeaderboard ? 'flex-start' : 'flex-end'
                        }}
                      >
                        {/* ON/OFF Text */}
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {showLeaderboard ? 'ON' : 'OFF'}
                        </span>

                        {/* Toggle Circle */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: showLeaderboard ? 'calc(100% - 23px)' : '3px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            transition: 'left 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* Inner dot for OFF state */}
                          {!showLeaderboard && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#1f2937'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className="header-right-item">
                    <Notifications />
                  </li>

                  <li className="header-right-item">
                    <Profile />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopNavbar;

