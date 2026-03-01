// AdminPage.jsx
// Route audit — every path here must have a matching entry in App.jsx ADMIN_EXACT or ADMIN_PREFIX
//
//  /admin-dashboard              → ADMIN_EXACT ✓
//  /employees                    → ADMIN_EXACT ✓
//  /services                     → ADMIN_EXACT ✓
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

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav         from "./Navbar/AdminNav";
import AdminDashboard   from "./AdminDashboard";
import Employe          from "./employee_repo/Employe";
import Service          from "./service/Service";
import AddService       from "./service/add-service/AddService";
import AddBundleService from "./service/add-service/AddBundleService";
import ViewService      from "./service/get-service/ViewService";
import EditService      from "./service/get-service/EditService";
import OrderManagement  from "./order-management/OrderManagement";
import ViewOrder        from "./order-management/ViewOrder";
import PaymentSettings  from "./settings/PaymentSettings";
import "@src/App.css"
import CreateAmendmentLink from '../amendment-service/CreateAmendmentLink';

const AdminPage = ({ setRefreshDepartmentsTrigger }) => (
  <>
    <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />

    {/* Offset content from fixed sidebar (collapsed = 80px wide) */}
    <div className="ml-20">
      <Routes>
        {/* Dashboard */}
        <Route path="/admin-dashboard"           element={<AdminDashboard />} />

        {/* Employee Management */}
        <Route path="/employees"                 element={<Employe />} />

        {/* Service Management
            NOTE: static segments (/add, /bundle/add, /edit/:id) must come
            BEFORE the catch-all dynamic segment (:serviceId) so React Router
            matches them correctly. */}
        <Route path="/services"                  element={<Service />} />
        <Route path="/services/add"              element={<AddService />} />
        <Route path="/services/bundle/add"       element={<AddBundleService />} />
        <Route path="/services/edit/:serviceId"  element={<EditService />} />
        <Route path="/services/:serviceId"       element={<ViewService />} />
         <Route path="/amendment"      element={<CreateAmendmentLink />} />

        {/* Order Management */}
        <Route path="/orders"                    element={<OrderManagement />} />
        <Route path="/orders/:applicationId"     element={<ViewOrder />} />

        {/* Settings */}
        <Route path="/settings"                  element={<PaymentSettings />} />
        <Route path="/settings/general"          element={<div className="p-8">General Settings</div>} />

        {/* Stub pages */}
        <Route path="/customers"   element={<div className="p-8">Customer Management</div>} />
        <Route path="/reports"     element={<div className="p-8">Reports</div>} />
        <Route path="/tasks"       element={<div className="p-8">Tasks</div>} />
        <Route path="/compliance"  element={<div className="p-8">Compliance</div>} />
        <Route path="/documents"   element={<div className="p-8">Documents</div>} />
      </Routes>
    </div>
  </>
);

export default AdminPage;