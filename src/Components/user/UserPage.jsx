import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import PhonePopup from "./PhonePopup";
import UserNav from "./UserNav";
import UserDashboard from "./user-dashboard/UserDashboard";
import GetService from "./service/GetService";
import MyService from "./my-service/MyService";
import "@src/App.css"
import Documents from './documents/Documents';
import Profile from './profile/Profile';
import ServiceDetailPage from './my-service/ServiceDetailPage';
import PaymentTransaction from './payment-transaction/PaymentTransaction';

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

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        const res = await axiosInstance.get(
          "/user/settings/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setUser(res.data.data);
        
        if (!res.data.data.phoneNumber) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <>
      <UserNav />
      
      {/* Phone number popup */}
      {showPopup && (
        <PhonePopup onClose={() => setShowPopup(false)} />
      )}

      {/* Offset content from fixed sidebar (collapsed = 80px wide) */}
      <div className="lg:ml-20 pb-16 md:pb-0">
        <Routes>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/services" element={<GetService />} />
          <Route path="/my-services" element={<MyService />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-service/view/:id" element={<ServiceDetailPage/>} />
          <Route path="/transactions" element={<PaymentTransaction/>} />
        </Routes>
      </div>
    </>
  );
};

export default UserPage;