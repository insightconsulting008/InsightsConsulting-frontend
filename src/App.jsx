import React from 'react'
import './App.css'
import LandingPage from './LandingPage/LandingPage'
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './Dashboard/Login';
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import AdminNav from './Dashboard/AdminNav';
import ProtectedRoute from './providers/ProtectedRoute';
import AdminBlogList from './Dashboard/BlogList';
import ViewEditBlog from './Dashboard/ViewEditBlog';
import CreateBlog from './Dashboard/CreateBlog';
import ForgotPassword from './Dashboard/ForgotPassword'
import ResetPassword from './Dashboard/ResetPassword';

export default function App() {
  const location = useLocation();

  const adminPrefixes = ['/dashboard', '/profile', '/blogs', '/view-blogs'];
  const showNav = adminPrefixes.some(prefix => location.pathname.startsWith(prefix));

  return (
    <>
      {showNav && (
        <ProtectedRoute>
          <AdminNav />
        </ProtectedRoute>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      
        <Route path="/blogs/list" element={
          <ProtectedRoute>
         <AdminBlogList/>
          </ProtectedRoute>
        } />
        <Route path="/blogs/add-blogs" element={
          <ProtectedRoute>
          <CreateBlog/>
          </ProtectedRoute>
        } />
        <Route path="/view-blogs/:slug" element={
          <ProtectedRoute>
          <ViewEditBlog/>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}