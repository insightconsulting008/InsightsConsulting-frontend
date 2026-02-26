// StaffPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffNav from "./staff-navbar/StaffNav";
import StaffDashboard from "./StaffDashboard";
import StaffMyService from "./my-service/StaffMyService";
import StaffViewDetails from "./my-service/StaffViewDetails";

const StaffPage = () => {
  return (
    <>
      <StaffNav />
      <Routes>
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/services" element={<StaffMyService />} /> {/* Changed from /my-services */}
        <Route path="/services/:applicationId" element={<StaffViewDetails />} /> {/* Changed from /service/:applicationId */}
        <Route path="/tasks" element={<div>Tasks Page</div>} />
        <Route path="/schedule" element={<div>Schedule Page</div>} />
        <Route path="/documents" element={<div>Documents Page</div>} />
      </Routes>
    </>
  );
};

export default StaffPage;