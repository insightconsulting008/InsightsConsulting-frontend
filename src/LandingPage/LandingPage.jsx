// LandingPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from "./Nav";
import Blog from "./Blog";
import Blogdesc from "./Blogdesc";
import Addblog from "./Addblog";
import Home from "./Home";
import ServiceInfo from "./ServiceInfo";
import Contact from "./Contact";
import About from "./Company";
import Servicehub from "./Servicehub";
import Footer from "./Footer";
import ServiceInfoSection from "./ServiceInfo";

const LandingPage = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resource" element={<Blog />} />
        <Route path="/resource/:slug" element={<Blogdesc />} />
        <Route path="/add-blog" element={<Addblog />} />
        <Route path="/services/:categoryId/:subCategoryId" element={<ServiceInfoSection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/company" element={<About />} />
        <Route path="/servicehub" element={<Servicehub />} />
      </Routes>
      <Footer />
    </>
  );
};

export default LandingPage;