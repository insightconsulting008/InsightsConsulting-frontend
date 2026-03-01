// UserPage.jsx
// Route audit — every path here must have a matching entry in App.jsx USER_EXACT
//
//  /user-dashboard               → USER_EXACT ✓
//  /services                     → USER_EXACT ✓
//  /my-services                  → USER_EXACT ✓
//  /profile                      → USER_EXACT ✓
//  /settings                     → USER_EXACT ✓
//  /documents                    → USER_EXACT ✓
//  /messages                     → USER_EXACT ✓
//  /billing                      → USER_EXACT ✓
//  /notifications                → USER_EXACT ✓
//  /help                         → USER_EXACT ✓

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserNav       from "./UserNav";
import UserDashboard from "./UserDashboard";
import GetService    from "./service/GetService";
import MyService     from "./my-service/MyService";
import "@src/App.css"

const UserPage = () => (
  <>
    <UserNav />

    {/* Offset content from fixed sidebar (collapsed = 80px wide) */}
    <div className="ml-20">
      <Routes>
        <Route path="/user-dashboard"  element={<UserDashboard />} />
        <Route path="/services"        element={<GetService />} />
        <Route path="/my-services"     element={<MyService />} />
        <Route path="/profile"         element={<div className="p-8">Profile Page</div>} />
        <Route path="/settings"        element={<div className="p-8">Settings Page</div>} />
        <Route path="/documents"       element={<div className="p-8">Documents</div>} />
        <Route path="/messages"        element={<div className="p-8">Messages</div>} />
        <Route path="/billing"         element={<div className="p-8">Billing</div>} />
        <Route path="/notifications"   element={<div className="p-8">Notifications</div>} />
        <Route path="/help"            element={<div className="p-8">Help</div>} />
      </Routes>
    </div>
  </>
);

export default UserPage;