// AdminPage.jsx
// Route audit — every path here must have a matching entry in App.jsx ADMIN_EXACT or ADMIN_PREFIX
//
//  /admin-dashboard              → ADMIN_EXACT ✓
//  /employees                    → ADMIN_EXACT ✓
//  /services                     → ADMIN_EXACT ✓
//  /add-blog                     → ADMIN_EXACT ✓
//  /manage-blog                  → ADMIN_EXACT ✓
//  /manage-blog/:slug            → ADMIN_PREFIX /manage-blog/ ✓
//  /services/add                 → ADMIN_PREFIX /services/ ✓
//  /services/bundle/add          → ADMIN_PREFIX /services/ ✓
//  /services/:serviceId          → ADMIN_PREFIX /services/ ✓
//  /services/edit/:serviceId     → ADMIN_PREFIX /services/ ✓
//  /orders                       → ADMIN_EXACT ✓
//  /orders/:applicationId        → ADMIN_PREFIX /orders/ ✓
//  /settings                     → ADMIN_EXACT ✓
//  /settings/general             → ADMIN_PREFIX /settings/ ✓
//  /customers                    → ADMIN_EXACT ✓
//  /reports                      → ADMIN_EXACT ✓
//  /tasks                        → ADMIN_EXACT ✓
//  /compliance                   → ADMIN_EXACT ✓
//  /documents                    → ADMIN_EXACT ✓

import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminNav from "./Navbar/AdminNav";
import AdminDashboard from "./admin-dashboard/AdminDashboard";
import Employe from "./employee_repo/Employe";
import Service from "./service/Service";
import AddService from "./service/add-service/AddService";
import AddBundleService from "./service/add-service/AddBundleService";
import ViewService from "./service/get-service/ViewService";
import EditService from "./service/get-service/EditService";
import EditBundle from "./service/get-service/EditBundle";
import OrderManagement from "./order-management/OrderManagement";
import ViewOrder from "./order-management/ViewOrder";
import PaymentSettings from "./payments/PaymentSettings";
import "@src/App.css";
import CreateAmendmentLink from "../amendment-service/CreateAmendmentLink";
import Report from "./report/Report";
import DetailReport from "./report/DetailReport";
import Profile from "./profile/Profile";
import Users from "./users/Users";
import PaymentHistory from "./payments/PaymentHistory";
import EmailDashboard from "./sms/EmailDashboard";
import CreateBlog from "./blog/CreateBlog";
import BlogList from "./blog/BlogList";
import ViewEditBlog from "./blog/ViewEditBlog";
import UTM from "./utm/UTM";
import ServiceRequests from "../service-request/serviceRequest";

const AdminPage = ({ setRefreshDepartmentsTrigger }) => (
  <>
    <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />

    {/* Offset content from fixed sidebar (collapsed = 80px wide) */}
    <div className="md:pl-20 pb-16 md:pb-0">
      <Routes>
        {/* Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Employee Management */}
        <Route path="/employees" element={<Employe />} />

        {/* Service Management
            NOTE: static segments (/add, /bundle/add, /edit/:id) must come
            BEFORE the catch-all dynamic segment (:serviceId) so React Router
            matches them correctly. */}
        <Route path="/services-hub" element={<Service />} />
        <Route path="/services/add" element={<AddService />} />
        <Route path="/services/bundle/add" element={<AddBundleService />} />
        <Route path="/services/edit/:serviceId" element={<EditService />} />
        <Route path="/bundle/edit/:bundleId" element={<EditBundle />} />
        <Route path="/services/:serviceId" element={<ViewService />} />
        <Route path="/amendment" element={<CreateAmendmentLink />} />
        <Route path="/users" element={<Users />} />
        <Route path="/payment-history" element={<PaymentHistory/>} />
        <Route path="/utm" element={<UTM/>} />
        <Route path="/requests" element={<ServiceRequests/>} />

        {/* Order Management */}
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/orders/:applicationId" element={<ViewOrder />} />

        {/* Settings */}
        <Route path="/reports" element={<Report />} />
        <Route path="/reports/:applicationId" element={<DetailReport />} />
        <Route path="/settings" element={<PaymentSettings />} />
        <Route path="/email-config" element={<EmailDashboard />} />
        <Route path="/Profile" element={<Profile/>} />

        {/* ── Blog Management ── */}
        <Route path="/add-blog"             element={<CreateBlog />} />
        <Route path="/manage-blog"          element={<BlogList />} />
        <Route path="/manage-blog/:slug"    element={<ViewEditBlog />} />
      </Routes>
    </div>
  </>
);

export default AdminPage;
