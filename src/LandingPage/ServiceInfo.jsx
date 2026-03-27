import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";

import Enquiryform from "./reusable/Enquiryform";
import EnquiryPopup from "./reusable/Popup";
import ServiceContent from "./ServiceContent";
import { findService, findSubcategory, servicesData } from "./data/servicesData";

/* ─────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────── */
const ServiceInfoSection = () => {
  const { categoryId, subCategoryId, serviceId } = useParams();

  const selectedService = serviceId
    ? findService(categoryId, subCategoryId, serviceId)
    : null;

  const subCategory     = findSubcategory(categoryId, subCategoryId);
  const category        = servicesData.find((c) => c.categoryId === categoryId);
  const categoryName    = category?.categoryName;
  const subCategoryName = subCategory?.subCategoryName;

  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  const process = selectedService?.process ?? [];

  return (
    <main className="bg-white">

      {/* ════════════════════════════════════════════════════
          HERO — title · form · process strip
      ════════════════════════════════════════════════════ */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/92" />

        <div className="relative container mx-auto px-4 lg:px-12 pt-12 lg:pt-20 pb-10">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-10">
            Home
            {categoryName    && <span> / {categoryName}</span>}
            {subCategoryName && <span> / {subCategoryName}</span>}
            {selectedService && (
              <span className="text-gray-700 font-medium"> / {selectedService.name}</span>
            )}
          </nav>

          {/* ── Two-column: content + form ── */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* LEFT */}
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {selectedService?.name || subCategoryName}
              </h1>

              {selectedService?.tagline && (
                <p className="text-red font-semibold text-base lg:text-lg mb-4 leading-snug">
                  {selectedService.tagline}
                </p>
              )}

              <div className="w-12 h-0.5 bg-red rounded-full mb-8" />

              {selectedService?.whyChoose && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    {selectedService.whyChoose.heading}
                  </h2>
                  <div className="space-y-3">
                    {selectedService.whyChoose.paragraphs.map((para, i) => (
                      <p key={i} className="text-gray-600 text-base leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Our End-to-End Process — replaces "Ideal For" */}
              {process.length > 0 && (
                <div className="mb-10">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Our End-to-End Process
                  </p>
                  <ol className="space-y-3">
                    {process.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-base">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white shadow-sm">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">4.8 Rating</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["men/32", "women/44", "men/45"].map((p, i) => (
                      <img
                        key={i}
                        src={`https://randomuser.me/api/portraits/${p}.jpg`}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        alt=""
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                      +
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">1,64,739 Happy Clients</span>
                </div>
              </div>
            </div>

            {/* RIGHT — enquiry form */}
            <div className="w-full">
              <Enquiryform initialService={selectedService?.name || ""} />
            </div>

          </div>

        </div>

        {/* ── Full-width red summary bar — outside container ── */}
        {selectedService?.processSummary && (
          <div className="relative bg-red py-4">
            <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between gap-4">
              <p className="text-white font-semibold text-base lg:text-lg">
                {selectedService.processSummary}
              </p>
              <button
                onClick={() => setPopupOpen(true)}
                className="flex-shrink-0 bg-white text-[#D11C16] text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#e8e8e8] hover:text-[#D11C16] transition-all duration-300 whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

      </section>

      {/* ── Enquiry Popup ── */}
      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} initialService={selectedService?.name || ""} />

      {/* ── SERVICE DETAIL CONTENT ── */}
      <ServiceContent />

    </main>
  );
};

export default ServiceInfoSection;
