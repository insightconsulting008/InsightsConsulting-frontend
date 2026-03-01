// StaffPage.jsx
// Route audit — every path here must have a matching entry in App.jsx STAFF_EXACT or STAFF_PREFIX
//
//  /staff/dashboard              → STAFF_EXACT ✓
//  /services                     → STAFF_EXACT ✓
//  /services/:applicationId      → STAFF_PREFIX /services/ ✓
//  /tasks                        → STAFF_EXACT ✓
//  /schedule                     → STAFF_EXACT ✓
//  /compliance                   → STAFF_EXACT ✓
//  /documents                    → STAFF_EXACT ✓
//  /profile                      → STAFF_EXACT ✓
//  /settings                     → STAFF_EXACT ✓

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffNav         from "./staff-navbar/StaffNav";
import StaffDashboard   from "./StaffDashboard";
import StaffMyService   from "./my-service/StaffMyService";
import StaffViewDetails from "./my-service/StaffViewDetails";
import "@src/App.css"
import CreateAmendmentLink from '../amendment-service/CreateAmendmentLink';

const StaffPage = () => (
  <>
    <StaffNav />

    {/* Offset content from fixed sidebar (collapsed = 80px wide) */}
    <div className="ml-20">
      <Routes>
        <Route path="/staff/dashboard"              element={<StaffDashboard />} />

        {/* Static route before dynamic */}
        <Route path="/services"                     element={<StaffMyService />} />
        <Route path="/services/:applicationId"      element={<StaffViewDetails />} />
        <Route path="/amendment"      element={<CreateAmendmentLink />} />

        <Route path="/tasks"       element={<div className="p-8">Tasks Page</div>} />
        <Route path="/schedule"    element={<div className="p-8">Schedule Page</div>} />
        <Route path="/compliance"  element={<div className="p-8">Compliance Page</div>} />
        <Route path="/documents"   element={<div className="p-8">Documents Page</div>} />
        <Route path="/profile"     element={<div className="p-8">Profile Page</div>} />
        <Route path="/settings"    element={<div className="p-8">Settings Page</div>} />
      </Routes>
    </div>
  </>
);

export default StaffPage;