// UserPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserNav from "./UserNav";
import UserDashboard from "./UserDashboard";
import GetService from "./service/GetService";
import MyService from "./my-service/MyService";

const UserPage = () => {
  return (
    <>
      <UserNav />
      <Routes>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/services" element={<GetService />} /> {/* Changed from /user/service-hub */}
        <Route path="/my-services" element={<MyService />} />
        {/* Add these for completeness */}
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </>
  );
};

export default UserPage;