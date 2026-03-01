// UserProtectedRoutes.jsx
// Improved: checks both token AND role so a STAFF user can't access /user/* pages

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @param {string|string[]} allowedRoles - role(s) that can access this route
 * @param {React.ReactNode} children
 * @param {string} redirectTo - where to send unauthorized users (default: "/login")
 */
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const token = localStorage.getItem('accessToken');
  const role  = localStorage.getItem('role');

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Token exists but wrong role — send to their correct dashboard
    if (role === 'ADMIN')  return <Navigate to="/admin-dashboard"  replace />;
    if (role === 'STAFF')  return <Navigate to="/staff/dashboard"  replace />;
    if (role === 'USER')   return <Navigate to="/user-dashboard"   replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

/* ─── Usage examples ────────────────────────────────────────────────

  // In AdminPage.jsx — wrap sensitive admin routes:
  <Route path="/employees" element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Employe />
    </ProtectedRoute>
  } />

  // In UserPage.jsx:
  <Route path="/my-services" element={
    <ProtectedRoute allowedRoles={['USER']}>
      <MyService />
    </ProtectedRoute>
  } />

  // In StaffPage.jsx:
  <Route path="/services" element={
    <ProtectedRoute allowedRoles={['STAFF']}>
      <StaffMyService />
    </ProtectedRoute>
  } />

──────────────────────────────────────────────────────────────────── */