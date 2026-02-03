"use client";

import React, { useState, useEffect } from "react";
import Notifications from "./Notifications";
import Profile from "./Profile";
import { supabase } from "@/lib/supabase";

const TopNavbar = ({ toogleActive }) => {
  const [companyName, setCompanyName] = useState('');

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
    const fetchCompanyName = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email) {
          // First, check if user is an administrator (matches company login_email)
          const { data: adminCompany } = await supabase
            .from('companies')
            .select('name')
            .eq('login_email', user.email)
            .eq('is_active', true)
            .single();
          
          if (adminCompany) {
            setCompanyName(adminCompany.name);
            return;
          }
          
          // Try to get company from user's metadata
          const userCompanyId = user.user_metadata?.company_id;
          
          if (userCompanyId) {
            const { data: company } = await supabase
              .from('companies')
              .select('name')
              .eq('id', userCompanyId)
              .single();
            
            if (company) {
              setCompanyName(company.name);
              return;
            }
          }
          
          // If not an admin, try to get from employees table
          const { data: employee } = await supabase
            .from('employees')
            .select('company_id, companies(name)')
            .eq('id', user.id)
            .single();
          
          if (employee?.companies?.name) {
            setCompanyName(employee.companies.name);
          } else if (employee?.company_id) {
            const { data: company } = await supabase
              .from('companies')
              .select('name')
              .eq('id', employee.company_id)
              .single();
            
            if (company) {
              setCompanyName(company.name);
            }
          }
        } else {
          // If no user, try to get the first active company as fallback
          const { data: companies } = await supabase
            .from('companies')
            .select('name')
            .eq('is_active', true)
            .limit(1);
          
          if (companies && companies.length > 0) {
            setCompanyName(companies[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, []);

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
                    Hi, {companyName || 'Company'} 👋
                  </h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>Welcome back! Here's what's happening today.</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-header-content mt-2 mt-sm-0">
                <ul className="d-flex align-items-center justify-content-end ps-0 mb-0 list-unstyled">
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
