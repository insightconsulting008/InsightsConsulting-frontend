import React, { useState,u } from "react";
import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";

import Login from "./Components/auth/Login";
import LandingPage from "./LandingPage/LandingPage";
import AdminPage from "./Components/admin/AdminPage";
import StaffPage from "./Components/staff/StaffPage";
import UserPage from "./Components/user/UserPage";

 const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth"
    });
  }, [pathname]);

  return null;
};

const App = () => {
  const [refreshDepartmentsTrigger, setRefreshDepartmentsTrigger] = useState(false);
  const role = sessionStorage.getItem("role");

  return (
    <BrowserRouter>
     <ScrollToTop />
      <Routes>
       
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Role-based routing */}
        <Route 
          path="/*" 
          element={
            !role ? (
              <LandingPage />
            ) : role === "ADMIN" ? (
              <AdminPage setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />
            ) : role === "STAFF" ? (
              <StaffPage />
            ) : role === "USER" ? (
              <UserPage />
            ) : (
              <LandingPage />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;