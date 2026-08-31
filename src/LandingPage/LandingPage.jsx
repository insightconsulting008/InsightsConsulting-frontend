// LandingPage.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./Nav";
import Blog from "./Blog";
import Blogdesc from "./Blogdesc";
import Home from "./Home";
import ServiceInfo from "./ServiceInfo";
import Contact from "./Contact";
import About from "./Company";
import Footer from "./Footer";
import ServiceInfoSection from "./ServiceInfo";
import Terms from "./Terms";
import WhatsAppButton from "./reusable/WhatsAppButton";
import PageSeo from "./PageSeo";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <PageSeo />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resource" element={<Blog />} />
        <Route path="/resource/:slug" element={<Blogdesc />} />
        <Route
          path="/our-services/:categoryId/:subCategoryId"
          element={<ServiceInfoSection />}
        />
        <Route
          path="/our-services/:categoryId/:subCategoryId/:serviceId"
          element={<ServiceInfoSection />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms-conditions" element={<Terms />} />
        {/* Redirect unknown PUBLIC routes to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;
