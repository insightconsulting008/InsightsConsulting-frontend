// LandingPage.jsx
// Route audit — every path here must have a matching entry in App.jsx LANDING_EXACT or LANDING_PREFIX
//
//  /                             → LANDING_EXACT ✓
//  /resource                     → LANDING_EXACT ✓
//  /resource/:slug               → LANDING_PREFIX /resource/ ✓
//  /add-blog                     → LANDING_EXACT ✓
//  /services/:catId/:subId       → LANDING_PREFIX /services/ ✓  (only reached if no role match came first)
//  /services/:catId/:subId/:svcId→ LANDING_PREFIX /services/ ✓
//  /contact                      → LANDING_EXACT ✓
//  /company                      → LANDING_EXACT ✓
//  /servicehub                   → LANDING_EXACT ✓

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav                from "./Nav";
import Footer             from "./Footer";
import Home               from "./Home";
import Blog               from "./Blog";
import Blogdesc           from "./Blogdesc";
import Addblog            from "./Addblog";
import ServiceInfoSection from "./ServiceInfo";
import Contact            from "./Contact";
import About              from "./Company";
import Servicehub         from "./Servicehub";

const LandingPage = () => (
  <>
    <Nav />
    <Routes>
      <Route path="/"                                               element={<Home />} />
      <Route path="/resource"                                       element={<Blog />} />
      <Route path="/resource/:slug"                                 element={<Blogdesc />} />
      <Route path="/add-blog"                                       element={<Addblog />} />
      <Route path="/services/:categoryId/:subCategoryId"            element={<ServiceInfoSection />} />
      <Route path="/services/:categoryId/:subCategoryId/:serviceId" element={<ServiceInfoSection />} />
      <Route path="/contact"                                        element={<Contact />} />
      <Route path="/company"                                        element={<About />} />
      <Route path="/servicehub"                                     element={<Servicehub />} />
    </Routes>
    <Footer />
  </>
);

export default LandingPage;