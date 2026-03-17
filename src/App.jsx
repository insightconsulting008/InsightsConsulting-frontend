// App.jsx
// src/App.jsx
//
// ─── CRITICAL ORDER ────────────────────────────────────────────────────────
// RoleRouter checks ROLE routes BEFORE LANDING routes.
// Reason: both admin and landing share the /services/ prefix.
// If landing were checked first, /services/add (admin) would incorrectly
// render LandingPage for a logged-in admin.
//
// Resolution order:
//   1. Role-specific routes  → correct portal shell
//   2. Landing routes        → LandingPage (accessible to everyone, any role)
//   3. No match              → bare <NotFound>, zero nav, zero footer
// ───────────────────────────────────────────────────────────────────────────

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './providers/AuthContext';

import LandingPage from './LandingPage/LandingPage';
import AdminPage   from './Components/admin/AdminPage';
import StaffPage   from './Components/staff/StaffPage';
import UserPage    from './Components/user/UserPage';
import AdminLogin  from './providers/Adminlogin';
import UserLogin   from './providers/Userlogin';
import NotFound    from './Components/NotFound';
import UserRegister from './providers/UserRegister';
import { GoogleOAuthProvider } from "@react-oauth/google";

/* ═══════════════════════════════════════════════════════════════════════════
   KNOWN ROUTE REGISTRY — audit every Route in every shell page here
   ═══════════════════════════════════════════════════════════════════════════

   RULE: every <Route path="X"> in a shell must appear as either:
     • an exact entry  → full pathname match
     • a prefix entry  → pathname.startsWith(prefix) catches dynamic segments

   ─── ADMIN (AdminPage.jsx) ──────────────────────────────────────────────── */
const ADMIN_EXACT = [
  '/admin-dashboard',
  '/employees',
  '/services-hub',           // list
  '/orders',             // list
  '/settings',           // payment settings
  '/customers',
  '/reports',
  '/amendment',
  '/profile',
  '/users',
  '/payment-history',
  '/email-config'
];
const ADMIN_PREFIX = [
  '/services/',   // /services/add  /services/bundle/add
                  // /services/:serviceId  /services/edit/:serviceId
  '/orders/',     // /orders/:applicationId
  '/settings/',   // /settings/general
  '/services/edit/',
  '/reports/'
];

/* ─── STAFF (StaffPage.jsx) ─────────────────────────────────────────────── */
const STAFF_EXACT = [
  '/staff/dashboard',
  '/tasks',
  '/schedule',
  '/compliance',
  '/documents',
  '/profile',
  '/settings',
  '/amendment'
];
const STAFF_PREFIX = [
  '/services/',   // /services/:applicationId
  '/staff/',      // /staff/dashboard (also covered by exact, belt-and-braces)
  '/tasks/'
];

/* ─── USER (UserPage.jsx) ───────────────────────────────────────────────── */
const USER_EXACT = [
  '/user-dashboard',
  '/services',           // browse
  '/my-services',
  '/profile',
  '/documents',
];

const USER_PREFIX = [
  '/my-service/view/',   // /my-service/:id
];

/* ─── LANDING (LandingPage.jsx) ─────────────────────────────────────────── */
// Checked AFTER role routes so /services/add doesn't land here for an admin
const LANDING_EXACT = [
  '/',
  '/resource',
  '/add-blog',
  '/contact',
  '/company',
  '/servicehub',
];
const LANDING_PREFIX = [
  '/resource/',   // /resource/:slug
  '/our-services/',   // /services/:catId/:subId  and  /services/:catId/:subId/:serviceId
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
const matches = (pathname, exact = [], prefixes = []) =>
  exact.includes(pathname) ||
  prefixes.some((p) => pathname.startsWith(p));

/* ═══════════════════════════════════════════════════════════════════════════
   ROLE ROUTER
   ═══════════════════════════════════════════════════════════════════════════ */
const RoleRouter = () => {
  const { role }     = useAuth();
  const { pathname } = useLocation();

  // ── 1. Role-specific routes first ──────────────────────────────────────
  if (role === 'ADMIN' && matches(pathname, ADMIN_EXACT, ADMIN_PREFIX)) {
    return <AdminPage />;
  }
  if (role === 'STAFF' && matches(pathname, STAFF_EXACT, STAFF_PREFIX)) {
    return <StaffPage />;
  }
  if (role === 'USER' && matches(pathname, USER_EXACT, USER_PREFIX)) {
    return <UserPage />;
  }

  // ── 2. Landing page routes — accessible to everyone ────────────────────
  if (matches(pathname, LANDING_EXACT, LANDING_PREFIX)) {
    return <LandingPage />;
  }

  // ── 3. Nothing matched → bare 404 ──────────────────────────────────────
  const dashboardPath =
    role === 'ADMIN' ? '/admin-dashboard' :
    role === 'STAFF' ? '/staff/dashboard' :
    role === 'USER'  ? '/user-dashboard'  : '/';

  return (
    <NotFound
      dashboardPath={dashboardPath}
      dashboardLabel={role ? 'Dashboard' : 'Home'}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL TO TOP
   ═══════════════════════════════════════════════════════════════════════════ */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

/* ═══════════════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════════════ */
const App = () => (
<GoogleOAuthProvider clientId="659480152734-ilobqi94v9q57uu17vna6vmbmrgpb85t.apps.googleusercontent.com">
  
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* Standalone auth pages — no shell, no role required */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/login"       element={<UserLogin />} />
      <Route path="/register"       element={<UserRegister/>} />

      {/* Everything else → RoleRouter decides */}
      <Route path="/*" element={<RoleRouter />} />
    </Routes>
  </BrowserRouter>
 </GoogleOAuthProvider>
);

export default App;