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
        <Route path="/service-hub" element={<GetService />} />
        <Route path="/my-services" element={<MyService />} />
      </Routes>
    </>
  );
};

export default UserPage;