import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutProvider from '@/providers/LayoutProvider';

// Auth pages
const SignIn = lazy(() => import('@/app/sign-in/page'));
const SignUp = lazy(() => import('@/app/sign-up/page'));
const ForgotPassword = lazy(() => import('@/app/forgot-password/page'));
const ResetPassword = lazy(() => import('@/app/reset-password/page'));
const LockScreen = lazy(() => import('@/app/lock-screen/page'));
const ConfirmEmail = lazy(() => import('@/app/confirm-email/page'));
const Logout = lazy(() => import('@/app/logout/page'));
const SubmitSickNote = lazy(() => import('@/app/submit-sick-note/page'));

// Dashboard
const Dashboard = lazy(() => import('@/app/dashboard/page'));
const EcommerceDashboard = lazy(() => import('@/app/dashboard/ecommerce/page'));

// Companies
const Companies = lazy(() => import('@/app/companies/page'));
const AllCompanies = lazy(() => import('@/app/companies/companies/page'));
const AddCompany = lazy(() => import('@/app/companies/add-company/page'));
const CompanyDetails = lazy(() => import('@/app/companies/details/[id]/page'));
const EditCompany = lazy(() => import('@/app/companies/edit/[id]/page'));

// Employees
const Employees = lazy(() => import('@/app/employees/page'));
const AllEmployees = lazy(() => import('@/app/employees/employees/page'));
const AddEmployee = lazy(() => import('@/app/employees/add/page'));
const EmployeeDetails = lazy(() => import('@/app/employees/details/[id]/page'));
const EditEmployee = lazy(() => import('@/app/employees/edit/[id]/page'));

// Sick Notes
const SickNotes = lazy(() => import('@/app/sick-notes/page'));
const AllSickNotes = lazy(() => import('@/app/sick-notes/sick-notes/page'));
const AddSickNote = lazy(() => import('@/app/sick-notes/add/page'));
const SickNoteDetails = lazy(() => import('@/app/sick-notes/details/[id]/page'));

// Other core pages
const Calendar = lazy(() => import('@/app/calendar/page'));
const Reports = lazy(() => import('@/app/reports/page'));
const MyProfile = lazy(() => import('@/app/my-profile/page'));
const Notifications = lazy(() => import('@/app/notifications/page'));
const Members = lazy(() => import('@/app/members/page'));

// Settings
const SettingsAccount = lazy(() => import('@/app/settings/account-settings/page'));
const SettingsChangePassword = lazy(() => import('@/app/settings/change-password/page'));
const SettingsConnections = lazy(() => import('@/app/settings/connections/page'));
const SettingsPrivacyPolicy = lazy(() => import('@/app/settings/privacy-policy/page'));
const SettingsTermsConditions = lazy(() => import('@/app/settings/terms-conditions/page'));

// Not Found
const NotFound = lazy(() => import('@/app/not-found'));

// Debug (temporary)
const Debug = lazy(() => import('@/app/debug/page'));

function App() {
    return (
        <LayoutProvider>
            <Suspense fallback={null}>
                <Routes>
                    {/* Root - redirect to sign-in */}
                    <Route path="/" element={<Navigate to="/sign-in/" replace />} />

                    {/* Auth pages */}
                    <Route path="/sign-in/" element={<SignIn />} />
                    <Route path="/sign-up/" element={<SignUp />} />
                    <Route path="/forgot-password/" element={<ForgotPassword />} />
                    <Route path="/reset-password/" element={<ResetPassword />} />
                    <Route path="/lock-screen/" element={<LockScreen />} />
                    <Route path="/confirm-email/" element={<ConfirmEmail />} />
                    <Route path="/logout/" element={<Logout />} />
                    <Route path="/submit-sick-note/" element={<SubmitSickNote />} />

                    {/* Dashboard */}
                    <Route path="/dashboard/" element={<Dashboard />} />
                    <Route path="/dashboard/ecommerce/" element={<EcommerceDashboard />} />

                    {/* Companies */}
                    <Route path="/companies/" element={<Companies />} />
                    <Route path="/companies/companies/" element={<AllCompanies />} />
                    <Route path="/companies/add-company/" element={<AddCompany />} />
                    <Route path="/companies/details/:id/" element={<CompanyDetails />} />
                    <Route path="/companies/edit/:id/" element={<EditCompany />} />

                    {/* Employees */}
                    <Route path="/employees/" element={<Employees />} />
                    <Route path="/employees/employees/" element={<AllEmployees />} />
                    <Route path="/employees/add/" element={<AddEmployee />} />
                    <Route path="/employees/details/:id/" element={<EmployeeDetails />} />
                    <Route path="/employees/edit/:id/" element={<EditEmployee />} />

                    {/* Sick Notes */}
                    <Route path="/sick-notes/" element={<SickNotes />} />
                    <Route path="/sick-notes/sick-notes/" element={<AllSickNotes />} />
                    <Route path="/sick-notes/add/" element={<AddSickNote />} />
                    <Route path="/sick-notes/details/:id/" element={<SickNoteDetails />} />

                    {/* Calendar */}
                    <Route path="/calendar/" element={<Calendar />} />

                    {/* Reports */}
                    <Route path="/reports/" element={<Reports />} />

                    {/* My Profile */}
                    <Route path="/my-profile/" element={<MyProfile />} />

                    {/* Notifications */}
                    <Route path="/notifications/" element={<Notifications />} />

                    {/* Members */}
                    <Route path="/members/" element={<Members />} />

                    {/* Settings */}
                    <Route path="/settings/account-settings/" element={<SettingsAccount />} />
                    <Route path="/settings/change-password/" element={<SettingsChangePassword />} />
                    <Route path="/settings/connections/" element={<SettingsConnections />} />
                    <Route path="/settings/privacy-policy/" element={<SettingsPrivacyPolicy />} />
                    <Route path="/settings/terms-conditions/" element={<SettingsTermsConditions />} />

                    {/* Debug (temporary) */}
                    <Route path="/debug/" element={<Debug />} />

                    {/* Catch all - 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </LayoutProvider>
    );
}

export default App;
