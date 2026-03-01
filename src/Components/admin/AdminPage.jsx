// AdminPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav from "./Navbar/AdminNav";
import Employe from "./employee_repo/Employe";
import AddService from "./service/add-service/AddService";
import Service from "./service/Service";
import AdminDashboard from "./AdminDashboard";
import PaymentSettings from "./settings/PaymentSettings";
import ViewService from "./service/get-service/ViewService";
import EditService from "./service/get-service/EditService";
import AddBundleService from "./service/add-service/AddBundleService";
import OrderManagement from "./order-management/OrderManagement";
import ViewOrder from "./order-management/ViewOrder";

const AdminPage = ({ setRefreshDepartmentsTrigger }) => {
  return (
    <>
      <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Employee Management */}
        <Route path="/employees" element={<Employe />} /> {/* Changed from /employee-repo */}
        
        {/* Service Management */}
        <Route path="/services" element={<Service />} /> {/* Changed from /service-hub */}
        <Route path="/services/add" element={<AddService />} /> {/* Changed from /add-service */}
        <Route path="/services/bundle/add" element={<AddBundleService />} /> {/* Changed from /add-bundle-service */}
        <Route path="/services/:serviceId" element={<ViewService />} /> {/* Changed from /service/view/:serviceId */}
        <Route path="/services/:serviceId/edit" element={<EditService />} /> {/* Changed from /service/edit/:serviceId */}
        
        {/* Order Management */}
        <Route path="/orders" element={<OrderManagement />} /> {/* Changed from /order-management */}
        <Route path="/orders/:applicationId" element={<ViewOrder />} />
        
        {/* Settings */}
        <Route path="/settings" element={<PaymentSettings />} /> {/* Changed from /settings */}
        
        {/* Additional admin routes */}
        <Route path="/customers" element={<div>Customer Management</div>} />
        <Route path="/reports" element={<div>Reports</div>} />
        <Route path="/settings/general" element={<div>General Settings</div>} />
      </Routes>
    </>
  );
};

export default AdminPage;