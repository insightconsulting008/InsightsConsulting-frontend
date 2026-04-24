import React from 'react'
import LandingPage from './LandingPage/LandingPage'
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './Dashboard/Login';
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import AdminNav from './Dashboard/AdminNav';
import ProtectedRoute from './providers/ProtectedRoute';
import AdminBlogList from './Dashboard/BlogList';
import ViewEditBlog from './Dashboard/ViewEditBlog';
import AddBlog from './Dashboard/Addblog';

export default function App() {
  const location = useLocation();

  const hideNavRoutes = ['/', '/login', '/register'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      {showNav && (
        <ProtectedRoute>
          <AdminNav />
        </ProtectedRoute>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
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
          <AddBlog/>
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