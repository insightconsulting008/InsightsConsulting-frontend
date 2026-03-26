// StaffPage.jsx
// Route audit — every path here must have a matching entry in App.jsx STAFF_EXACT or STAFF_PREFIX
//
//  /staff/dashboard              → STAFF_EXACT ✓
//  /tasks                        → STAFF_EXACT ✓
//  /schedule                     → STAFF_EXACT ✓
//  /compliance                   → STAFF_EXACT ✓
//  /documents                    → STAFF_EXACT ✓
//  /profile                      → STAFF_EXACT ✓
//  /settings                     → STAFF_EXACT ✓

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffNav         from "./staff-navbar/StaffNav";
import StaffDashboard   from "./staff-dashboard/StaffDashboard";
import StaffMyService   from "./my-service/StaffMyService";
import StaffViewDetails from "./my-service/StaffViewDetails";
import "@src/App.css"
import CreateAmendmentLink from '../amendment-service/CreateAmendmentLink';
import Profile from '../admin/profile/Profile';

const StaffPage = () => (
  <>
    <StaffNav />

    {/* Offset content from fixed sidebar (collapsed = 80px wide) */}
    <div className="lg:ml-20 pb-16 lg:pb-0">
      <Routes>
        <Route path="/staff/dashboard"              element={<StaffDashboard />} />

        {/* Static route before dynamic */}
        <Route path="/tasks"                     element={<StaffMyService />} />
        <Route path="/tasks/:applicationId"      element={<StaffViewDetails />} />
        <Route path="/amendment"      element={<CreateAmendmentLink />} />

        <Route path="/profile"     element={<Profile/>} />
        <Route path="/settings"    element={<div className="p-8">Settings Page</div>} />
      </Routes>
    </div>
  </>
);

export default StaffPage;