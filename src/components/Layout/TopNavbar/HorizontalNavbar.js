import React from "react";
import { Link } from "react-router-dom";import { useLocation } from "react-router-dom";

const HorizontalNavbar = () => {
  const pathname = useLocation().pathname;

  return (
    <>
      <div className="horizontal-navbar-area position-relative">
        <div className="accordion d-flex justify-content-start align-items-center">
          {/* Max 7 accordion-item in this list */}
          <div className="accordion-item border-radius border-0 megamenu">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">dashboard</i>
              <span className="title lh-1">Dashboard</span>
              <span className="trezo-badge rounded-circle fw-medium d-inline-block text-center">
                25
              </span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <Link to="/dashboard/ecommerce/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/ecommerce/" ? "active" : ""
                      }`}
                  >
                    eCommerce
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/crm"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/crm/" ? "active" : ""
                      }`}
                  >
                    CRM
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/project-management/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/project-management/"
                      ? "active"
                      : ""
                      }`}
                  >
                    Project Management
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/lms/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/lms/" ? "active" : ""
                      }`}
                  >
                    LMS
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/helpdesk/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/helpdesk/" ? "active" : ""
                      }`}
                  >
                    HelpDesk
                    <span className="trezo-badge d-inline-block position-relative">
                      Hot
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/analytics/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/analytics/" ? "active" : ""
                      }`}
                  >
                    Analytics
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/crypto/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/crypto/" ? "active" : ""
                      }`}
                  >
                    Crypto
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/sales/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/sales/" ? "active" : ""
                      }`}
                  >
                    Sales
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/hospital/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/hospital/" ? "active" : ""
                      }`}
                  >
                    Hospital
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/hrm/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/hrm/" ? "active" : ""
                      }`}
                  >
                    HRM
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/school/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/school/" ? "active" : ""
                      }`}
                  >
                    School
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/call-center/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/call-center/" ? "active" : ""
                      }`}
                  >
                    Call Center
                    <span className="trezo-badge d-inline-block position-relative style-two">
                      Popular
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/marketing/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/marketing/" ? "active" : ""
                      }`}
                  >
                    Marketing
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/nft/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/nft/" ? "active" : ""
                      }`}
                  >
                    NFT
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/saas/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/saas/" ? "active" : ""
                      }`}
                  >
                    SaaS
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/real-estate/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/real-estate/" ? "active" : ""
                      }`}
                  >
                    Real Estate
                    <span className="trezo-badge d-inline-block position-relative style-three">
                      Top
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/shipment/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/shipment/" ? "active" : ""
                      }`}
                  >
                    Shipment
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/finance/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/finance/" ? "active" : ""
                      }`}
                  >
                    Finance
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/pos-system/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/pos-system/" ? "active" : ""
                      }`}
                  >
                    POS System
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/podcast/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/podcast/" ? "active" : ""
                      }`}
                  >
                    Podcast
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/social-media/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/social-media-system/"
                      ? "active"
                      : ""
                      }`}
                  >
                    Social Media
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/doctor/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/doctor/" ? "active" : ""
                      }`}
                  >
                    Doctor
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/beauty-salon/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/beauty-salon/" ? "active" : ""
                      }`}
                  >
                    Beauty Salon
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/store-analysis/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/store-analysis/" ? "active" : ""
                      }`}
                  >
                    Store Analysis
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/dashboard/restaurant/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/dashboard/restaurant/" ? "active" : ""
                      }`}
                  >
                    Restaurant
                    <span className="trezo-badge d-inline-block position-relative">
                      New
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="accordion-item border-radius border-0">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">deployed_code</i>
              <span className="title lh-1">Apps</span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <Link to="/apps/to-do-list/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/apps/to-do-list/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">
                      format_list_bulleted
                    </i>
                    <span className="title lh-1">To Do List</span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/calendar/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/calendar/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">date_range</i>
                    <span className="title lh-1">Calendar</span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/apps/contacts/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/apps/contacts/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">contact_page</i>
                    <span className="title lh-1">Contacts</span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/apps/chat/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/apps/chat/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">chat</i>
                    <span className="title lh-1">Chat</span>
                  </Link>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">mail</i>
                    <span className="title lh-1">Email</span>
                    <span className="trezo-badge rounded-circle fw-medium d-inline-block text-center style-two">
                      3
                    </span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/apps/email/inbox/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/email/inbox/" ? "active" : ""
                            }`}
                        >
                          Inbox
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/email/compose/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/email/compose/" ? "active" : ""
                            }`}
                        >
                          Compose
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/email/read-email/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/email/read-email/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Read
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <Link to="/apps/kanban-board/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/apps/kanban-board/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">team_dashboard</i>
                    <span className="title lh-1">Kanban Board</span>
                  </Link>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">folder_open</i>
                    <span className="title lh-1">File Manager</span>
                    <span className="trezo-badge rounded-circle fw-medium d-inline-block text-center style-three">
                      7
                    </span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/" ? "active" : ""
                            }`}
                        >
                          My Drive
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/assets/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/assets/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Assets
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/projects/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/projects/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Projects
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/personal/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/personal/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Personal
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/applications/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/applications/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Applications
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/documents/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/documents/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Documents
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/apps/file-manager/media/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/apps/file-manager/media/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Media
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="accordion-item border-radius border-0">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">layers</i>
              <span className="title lh-1">Pages</span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">note_stack</i>
                    <span className="title lh-1">Front Pages</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/" ? "active" : ""
                            }`}
                        >
                          Home
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/front-pages/features/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/front-pages/features/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Features
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/front-pages/team/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/front-pages/team/" ? "active" : ""
                            }`}
                        >
                          Our Team
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/front-pages/faq/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/front-pages/faq/" ? "active" : ""
                            }`}
                        >
                          FAQ’s
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/front-pages/contact/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/front-pages/contact/" ? "active" : ""
                            }`}
                        >
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">shopping_cart</i>
                    <span className="title lh-1">eCommerce</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <button
                          type="button"
                          className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
                        >
                          Products
                        </button>
                        <div className="accordion-body border-radius">
                          <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                            <li className="sidemenu-item">
                              <Link to="/ecommerce/products-grid/"
                                className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/products-grid/"
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                Products Grid
                              </Link>
                            </li>
                            <li className="sidemenu-item">
                              <Link to="/ecommerce/products-list/"
                                className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/products-list/"
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                Products List
                              </Link>
                            </li>
                            <li className="sidemenu-item">
                              <Link to="/ecommerce/product-details/"
                                className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/product-details/"
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                Product Details
                              </Link>
                            </li>
                            <li className="sidemenu-item">
                              <Link to="/ecommerce/create-product/"
                                className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/create-product/"
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                Create Product
                              </Link>
                            </li>
                            <li className="sidemenu-item">
                              <Link to="/ecommerce/edit-product/"
                                className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/edit-product/"
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                Edit Product
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>

                      <li className="sidemenu-item">
                        <Link to="/ecommerce/cart/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/cart/" ? "active" : ""
                            }`}
                        >
                          Cart
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/checkout/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/checkout/" ? "active" : ""
                            }`}
                        >
                          Checkout
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/orders/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/orders/" ? "active" : ""
                            }`}
                        >
                          Orders
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/orders/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/orders/details/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Order Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/orders/create/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/orders/create/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Create Order
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/orders/tracking/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/orders/tracking/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Order Tracking
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/customers/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/customers/" ? "active" : ""
                            }`}
                        >
                          Customers
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/customers/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/customers/details/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Customer Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/categories/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/categories/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Categories
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/sellers/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/sellers/" ? "active" : ""
                            }`}
                        >
                          Sellers
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/sellers/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/sellers/details/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Seller Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/sellers/create/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/sellers/create/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Create Seller
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/reviews/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/reviews/" ? "active" : ""
                            }`}
                        >
                          Reviews
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ecommerce/refunds/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ecommerce/refunds/" ? "active" : ""
                            }`}
                        >
                          Refunds
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">handshake</i>
                    <span className="title lh-1">CRM</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/crm/contacts/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/crm/contacts/" ? "active" : ""
                            }`}
                        >
                          Contacts
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/crm/customers/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/crm/customers/" ? "active" : ""
                            }`}
                        >
                          Customers
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/crm/leads/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/crm/leads/" ? "active" : ""
                            }`}
                        >
                          Leads
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/crm/deals/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/crm/deals/" ? "active" : ""
                            }`}
                        >
                          Deals
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">description</i>
                    <span className="title lh-1">Project Management</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/project-management/project-overview/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/project-overview/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Project Overview
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/project-management/projects-list/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/projects-list/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Projects List
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/project-management/create-project/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/create-project/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Create Project
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/project-management/clients/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/clients/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Clients
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/project-management/teams/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/teams/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Teams
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/project-management/kanban-board/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/kanban-board/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Kanban Board
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/project-management/users/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/project-management/users/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Users
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">auto_stories</i>
                    <span className="title lh-1">LMS</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/lms/courses/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/lms/courses/" ? "active" : ""
                            }`}
                        >
                          Courses List
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/lms/courses/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/lms/courses/details/" ? "active" : ""
                            }`}
                        >
                          Course Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/lms/lesson-preview/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/lms/lesson-preview/" ? "active" : ""
                            }`}
                        >
                          Lesson Preview
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/lms/create-course/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/lms/courses/" ? "active" : ""
                            }`}
                        >
                          Create Course
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/lms/edit-course/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/lms/edit-course/" ? "active" : ""
                            }`}
                        >
                          Edit Course
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/lms/instructors/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/lms/instructors/" ? "active" : ""
                            }`}
                        >
                          Instructors
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">support</i>
                    <span className="title lh-1">HelpDesk</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/helpdesk/tickets/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/helpdesk/tickets/" ? "active" : ""
                            }`}
                        >
                          Tickets
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/helpdesk/tickets/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/helpdesk/tickets/details/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Ticket Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/helpdesk/agents/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/helpdesk/agents/" ? "active" : ""
                            }`}
                        >
                          Agents
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/helpdesk/reports/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/helpdesk/reports/" ? "active" : ""
                            }`}
                        >
                          Reports
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">store</i>
                    <span className="title lh-1">NFT Marketplace</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/nft/marketplace/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/marketplace/" ? "active" : ""
                            }`}
                        >
                          Marketplace
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/nft/explore-all/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/explore-all/" ? "active" : ""
                            }`}
                        >
                          Explore All
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/nft/live-auction/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/live-auction/" ? "active" : ""
                            }`}
                        >
                          Live Auction
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/nft/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/details/" ? "active" : ""
                            }`}
                        >
                          NFT Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/nft/creators/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/creators/" ? "active" : ""
                            }`}
                        >
                          Creators
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/nft/creators/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/creators/details/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Creator Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/nft/connect-wallet/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/nft/connect-wallet/" ? "active" : ""
                            }`}
                        >
                          Wallet Connect
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">
                      real_estate_agent
                    </i>
                    <span className="title lh-1">Real Estate</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/real-estate/property-list/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/property-list/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Property List
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/real-estate/property-overview/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/property-overview/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Property Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/real-estate/add-property/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/add-property/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Add Property
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/real-estate/agent-list/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/agent-list/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Agents
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/real-estate/agent-overview/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/agent-overview/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Agent Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/real-estate/add-agent/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/add-agent/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Add Agent
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/real-estate/customers/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/real-estate/customers/"
                            ? "active"
                            : ""
                            }`}
                        >
                          Customers
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">calculate</i>
                    <span className="title lh-1">Finance</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/finance/wallet/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/finance/wallet/" ? "active" : ""
                            }`}
                        >
                          Wallet
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/finance/transaction/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/finance/transaction/" ? "active" : ""
                            }`}
                        >
                          Transactions
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">local_activity</i>
                    <span className="title lh-1">Events</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/events/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/events/" ? "active" : ""
                            }`}
                        >
                          Events Grid
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/events/list/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/events/list/" ? "active" : ""
                            }`}
                        >
                          Events List
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/events/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/events/details/" ? "active" : ""
                            }`}
                        >
                          Event Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/events/create-an-event/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/events/create-an-event/" ? "active" : ""
                            }`}
                        >
                          Create An Event
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/events/edit-an-event/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/events/edit-an-event/" ? "active" : ""
                            }`}
                        >
                          Edit An Event
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">share</i>
                    <span className="title lh-1">Social</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/social/profile/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/social/profile/" ? "active" : ""
                            }`}
                        >
                          Profile
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/social/settings/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/social/settings/" ? "active" : ""
                            }`}
                        >
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">content_paste</i>
                    <span className="title lh-1">Invoices</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/invoices/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/invoices/" ? "active" : ""
                            }`}
                        >
                          Invoices
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/invoices/details/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/invoices/details/" ? "active" : ""
                            }`}
                        >
                          Invoice Details
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/invoices/create/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/invoices/create/" ? "active" : ""
                            }`}
                        >
                          Create Invoice
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/invoices/edit/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/invoices/edit/" ? "active" : ""
                            }`}
                        >
                          Edit Invoice
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">person</i>
                    <span className="title lh-1">Users</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/users/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/users/" ? "active" : ""
                            }`}
                        >
                          Team Members
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/users/users-list/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/users/users-list/" ? "active" : ""
                            }`}
                        >
                          Users List
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/users/add-user/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/invoices/add-user/" ? "active" : ""
                            }`}
                        >
                          Add User
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">account_box</i>
                    <span className="title lh-1">Profile</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/profile/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/profile/" ? "active" : ""
                            }`}
                        >
                          User Profile
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/profile/teams/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/profile/teams/" ? "active" : ""
                            }`}
                        >
                          Teams
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/profile/projects/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/profile/projects/" ? "active" : ""
                            }`}
                        >
                          Projects
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <Link to="/starter/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/starter/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">star_border</i>
                    <span className="title lh-1">Starter</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="accordion-item border-radius border-0">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">token</i>
              <span className="title lh-1">Modules</span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">qr_code_scanner</i>
                    <span className="title lh-1">UI Elements</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/alerts/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/alerts/" ? "active" : ""
                            }`}
                        >
                          Alerts
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/avatar/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/avatar/" ? "active" : ""
                            }`}
                        >
                          Avatars
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/buttons/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/buttons/" ? "active" : ""
                            }`}
                        >
                          Buttons
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/badges/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/badges/" ? "active" : ""
                            }`}
                        >
                          Badges
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/cards/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/cards/" ? "active" : ""
                            }`}
                        >
                          Buttons
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/carousel/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/carousel/" ? "active" : ""
                            }`}
                        >
                          Carousel
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/dropdowns/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/dropdowns/" ? "active" : ""
                            }`}
                        >
                          Dropdowns
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/images/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/images/" ? "active" : ""
                            }`}
                        >
                          Images
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/list-groups/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/list-groups/" ? "active" : ""
                            }`}
                        >
                          List Groups
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/navbars/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/navbars/" ? "active" : ""
                            }`}
                        >
                          Navbars
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/navs/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/starter/navs/" ? "active" : ""
                            }`}
                        >
                          Navs
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/accordion/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/accordion/" ? "active" : ""
                            }`}
                        >
                          Accordion
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/progress-bars/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/progress-bars/" ? "active" : ""
                            }`}
                        >
                          Progress Bars
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/date-time-picker/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/date-time-picker/" ? "active" : ""
                            }`}
                        >
                          Date Time Picker
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/ui-kit/videos/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/ui-kit/videos/" ? "active" : ""
                            }`}
                        >
                          Videos
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">emoji_emotions</i>
                    <span className="title lh-1">Icons</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/icons/material-symbols/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/icons/material-symbols/" ? "active" : ""
                            }`}
                        >
                          Material Symbols
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/icons/remixicon/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/icons/remixicon/" ? "active" : ""
                            }`}
                        >
                          RemixIcon
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <Link to="/tables/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/tables/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">table_chart</i>
                    <span className="title lh-1">Tables</span>
                  </Link>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">lock_open</i>
                    <span className="title lh-1">Authentication</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/sign-in/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Sign In
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/sign-up/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Sign Up
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/forgot-password/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Forgot Password
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/reset-password/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Reset Password
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/confirm-email/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Confirm Email
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/lock-screen/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Lock Screen
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/logout/"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">content_copy</i>
                    <span className="title lh-1">Extra Pages</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/pricing-plan/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/pricing-plan/" ? "active" : ""
                            }`}
                        >
                          Pricing
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/timeline/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/timeline/" ? "active" : ""
                            }`}
                        >
                          Timeline
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/faq/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/faq/" ? "active" : ""
                            }`}
                        >
                          FAQ
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/gallery/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/gallery/" ? "active" : ""
                            }`}
                        >
                          Gallery
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/testimonials/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/testimonials/" ? "active" : ""
                            }`}
                        >
                          Testimonials
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/search/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/search/" ? "active" : ""
                            }`}
                        >
                          Search
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/extra-pages/blank-page/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/extra-pages/blank-page/" ? "active" : ""
                            }`}
                        >
                          Blank Page
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">error</i>
                    <span className="title lh-1">Errors</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/not-found/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/not-found/" ? "active" : ""
                            }`}
                        >
                          404 Error Page
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/internal-error/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/internal-error/" ? "active" : ""
                            }`}
                        >
                          Internal Error
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <Link to="/widgets/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/widgets/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">widgets</i>
                    <span className="title lh-1">Widgets</span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/maps/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/maps/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">map</i>
                    <span className="title lh-1">Maps</span>
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/notifications/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/notifications/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">notifications</i>
                    <span className="title lh-1">Notifications</span>
                  </Link>
                </li>

                <li className="sidemenu-item">
                  <Link to="/members/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/members/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">people</i>
                    <span className="title lh-1">Members</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="accordion-item border-radius border-0">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">forum</i>
              <span className="title lh-1">Forms</span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <Link to="/forms/basic-elements/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/forms/basic-elements/" ? "active" : ""
                      }`}
                  >
                    Basic Elements
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/forms/advanced-elements/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/forms/advanced-elements/" ? "active" : ""
                      }`}
                  >
                    Advanced Elements
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/forms/validation/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/forms/validation/" ? "active" : ""
                      }`}
                  >
                    Validation
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/forms/editors/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/forms/editors/" ? "active" : ""
                      }`}
                  >
                    Editors
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/forms/file-upload/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/forms/file-upload/" ? "active" : ""
                      }`}
                  >
                    File Upload
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="accordion-item border-radius border-0">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">pie_chart</i>
              <span className="title lh-1">Charts</span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <Link to="/charts/line/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/line/" ? "active" : ""
                      }`}
                  >
                    Line
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/area/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/area/" ? "active" : ""
                      }`}
                  >
                    Area
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/column/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/column/" ? "active" : ""
                      }`}
                  >
                    Column
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/mixed/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/mixed/" ? "active" : ""
                      }`}
                  >
                    Mixed
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/radialbar/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/radialbar/" ? "active" : ""
                      }`}
                  >
                    RadialBar
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/radar/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/radar/" ? "active" : ""
                      }`}
                  >
                    Radar
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/pie/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/pie/" ? "active" : ""
                      }`}
                  >
                    Pie
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/polar/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/polar/" ? "active" : ""
                      }`}
                  >
                    Polar
                  </Link>
                </li>
                <li className="sidemenu-item">
                  <Link to="/charts/more/"
                    className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/charts/more/" ? "active" : ""
                      }`}
                  >
                    More
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="accordion-item border-radius border-0">
            <button
              type="button"
              className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
            >
              <i className="material-symbols-outlined">open_run</i>
              <span className="title lh-1">Others</span>
            </button>
            <div className="accordion-body border-radius">
              <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                <li className="sidemenu-item">
                  <Link to="/my-profile/"
                    className={`sidemenu-link with-icon border-radius d-block position-relative transition fw-medium ${pathname === "/my-profile/" ? "active" : ""
                      }`}
                  >
                    <i className="material-symbols-outlined">account_circle</i>
                    <span className="title lh-1">My Profile</span>
                  </Link>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">settings</i>
                    <span className="title lh-1">Settings</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="/settings/account-settings/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/settings/account-settings/" ? "active" : ""
                            }`}
                        >
                          Account Settings
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/settings/change-password/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/settings/change-password/" ? "active" : ""
                            }`}
                        >
                          Change Password
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/settings/connections/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/settings/connections/" ? "active" : ""
                            }`}
                        >
                          Connections
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/settings/privacy-policy/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/settings/privacy-policy/" ? "active" : ""
                            }`}
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="/settings/terms-conditions/"
                          className={`sidemenu-link border-radius d-block position-relative transition fw-medium ${pathname === "/settings/terms-conditions/" ? "active" : ""
                            }`}
                        >
                          Terms & Conditions
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <button
                    type="button"
                    className="accordion-button with-icon text-start shadow-none fw-medium border-0 transition border-radius"
                  >
                    <i className="material-symbols-outlined">unfold_more</i>
                    <span className="title lh-1">Multi Level Menu</span>
                  </button>
                  <div className="accordion-body border-radius">
                    <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                      <li className="sidemenu-item">
                        <Link to="#"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          First
                        </Link>
                      </li>
                      <li className="sidemenu-item">
                        <Link to="#"
                          className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                        >
                          Third
                        </Link>
                      </li>

                      <li className="sidemenu-item">
                        <button
                          type="button"
                          className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
                        >
                          Third
                          <span className="trezo-badge rounded-circle fw-medium d-inline-block text-center">
                            3
                          </span>
                        </button>
                        <div className="accordion-body border-radius">
                          <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                            <li className="sidemenu-item">
                              <Link to="#"
                                className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                              >
                                Third 1
                              </Link>
                            </li>

                            <li className="sidemenu-item">
                              <button
                                type="button"
                                className="accordion-button text-start shadow-none fw-medium border-0 transition border-radius"
                              >
                                Third 2
                              </button>
                              <div className="accordion-body border-radius">
                                <ul className="sidebar-sub-menu p-0 list-unstyled mb-0">
                                  <li className="sidemenu-item">
                                    <Link to="#"
                                      className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                                    >
                                      Four 1
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li className="sidemenu-item">
                              <Link to="#"
                                className="sidemenu-link border-radius d-block position-relative transition fw-medium"
                              >
                                Third 3
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="sidemenu-item">
                  <Link to="/logout/"
                    className="sidemenu-link with-icon border-radius d-block position-relative transition fw-medium"
                  >
                    <i className="material-symbols-outlined">logout</i>
                    <span className="title lh-1">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HorizontalNavbar;
