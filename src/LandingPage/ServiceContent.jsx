import React, { useState, useMemo, useCallback } from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { findService } from "./data/servicesData";
import EnquiryPopup from "./reusable/Popup";

/* ─────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: "Arun Kumar",
    role: "Startup Founder",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The registration process was handled smoothly and professionally. Everything was completed faster than expected.",
  },
  {
    name: "Priya Sharma",
    role: "Finance Consultant",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Excellent support and clear guidance throughout the compliance process. Highly reliable service.",
  },
  {
    name: "Rahul Mehta",
    role: "Business Owner",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "Very responsive team. They simplified what initially felt like a complicated registration process.",
  },
  {
    name: "Sneha Iyer",
    role: "Independent Professional",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Professional service with great attention to detail. The entire experience was stress-free.",
  },
];

/* ─────────────────────────────────────────────────────────
   SECTION LABEL COMPONENT
───────────────────────────────────────────────────────── */
const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="w-5 h-0.5 bg-red rounded-full inline-block" />
    <span className="text-xs font-bold tracking-widest uppercase text-red">{label}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
const ServiceContent = () => {
  const { categoryId, subCategoryId, serviceId } = useParams();
  const service = findService(categoryId, subCategoryId, serviceId);

  const [slideIndex, setSlideIndex] = useState(0);
  const [popupOpen, setPopupOpen]   = useState(false);


  const nextSlide = useCallback(() => setSlideIndex((p) => (p + 1) % testimonials.length), []);
  const prevSlide = useCallback(() => setSlideIndex((p) => (p - 1 + testimonials.length) % testimonials.length), []);

  const visibleTestimonials = useMemo(() =>
    [0, 1, 2].map((offset) => testimonials[(slideIndex + offset) % testimonials.length]),
    [slideIndex]
  );

  if (!service) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm">
        Service details not available.
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════
          CONTENT SECTIONS
      ═══════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 lg:px-12">

        {/* ────────────────────────────────────────────────
            SECTION 0 — OVERVIEW (Ideal For only)
        ──────────────────────────────────────────────── */}
        <section
          id="overview"
          className="py-14 lg:py-20 border-b border-gray-100"
        >
          <div className="grid lg:grid-cols-2 gap-6">

            {service.idealFor?.length > 0 && (
              <div className="bg-secondary rounded-2xl p-8 lg:p-10">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-5">
                  {service.idealForHeading || "Ideal For"}
                </p>
                <ul className="space-y-3">
                  {service.idealFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-base lg:text-[17px]">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.formsHandled && (
              <div className="bg-secondary rounded-2xl p-8 lg:p-10">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-5">
                  {service.formsHandled.heading}
                </p>
                <ul className="space-y-3">
                  {service.formsHandled.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-base lg:text-[17px]">
                      <span className="mt-[9px] flex-shrink-0 text-[11px] font-bold text-red w-5">{String(i + 1).padStart(2, "0")}</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {service.formsHandled.note && (
                  <p className="mt-5 text-gray-500 text-sm font-medium border-t border-gray-200 pt-4">{service.formsHandled.note}</p>
                )}
              </div>
            )}

          </div>
        </section>

        {/* ────────────────────────────────────────────────
            SECTION 1 — REQUIREMENTS
        ──────────────────────────────────────────────── */}
        <section
          id="requirements"
          className="py-14 lg:py-20 border-b border-gray-100"
        >
          <SectionLabel label="Requirements" />
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-10">
            What You Need to Get Started
          </h2>

          <div className={`grid gap-6 ${
            service.requirements.eligibility &&
            service.requirements.eligibility.heading !== "ITR Forms We Handle"
              ? "sm:grid-cols-2"
              : "grid-cols-1"
          }`}>

            {service.requirements.eligibility &&
              service.requirements.eligibility.heading !== "ITR Forms We Handle" && (
              <div className="bg-secondary rounded-2xl p-8">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-5">
                  {service.requirements.eligibility.heading}
                </p>
                <ul className="space-y-4">
                  {service.requirements.eligibility.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-700 text-base leading-relaxed">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-secondary rounded-2xl p-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-5">
                Documents Required
              </p>
              <ul className="space-y-3">
                {service.requirements.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
                    <span className="flex-shrink-0 min-w-[28px] h-6 rounded-md bg-red/10 text-red text-[11px] font-bold flex items-center justify-center mt-[2px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════════════════
          THE INSIGHT CONSULTING ADVANTAGE — full-width dark
      ═══════════════════════════════════════════════════ */}
      <section
        id="insight"
        className="bg-gray-950 py-16 lg:py-24"
      >
        <div className="container mx-auto px-4 lg:px-12">
           <SectionLabel label="Why Insight Consulting" />

          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-12">
            The Insight Consulting Advantage
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* Box 1 — Insight Advantage */}
            {service.insightAdvantage && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-5">
                  {service.insightAdvantage.intro}
                </p>
                <ul className="space-y-3">
                  {service.insightAdvantage.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-white text-base">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Box 2 — Post Support (title varies per service) */}
            {service.postSupport?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-6">
                  {service.postSupportTitle || "Post-Filing Support"}
                </p>
                <ul className="space-y-4">
                  {service.postSupport.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex-shrink-0 text-[11px] font-bold text-red w-5 mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Box 3 — Common Mistakes We Help You Avoid */}
            {service.commonMistakes?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-6">
                  Common Mistakes We Help You Avoid
                </p>
                <ul className="space-y-4">
                  {service.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red/60 flex-shrink-0" />
                      <span className="text-white text-base leading-relaxed">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Box 4 — Strategic Insight */}
            {service.growthInsight && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-4">
                  {service.growthInsight.heading}
                </p>
                <p className="text-white text-base lg:text-[17px] leading-relaxed">
                  {service.growthInsight.description}
                </p>
                {service.growthInsight.weHelpYou?.length > 0 && (
                  <>
                    {(service.growthInsight.listPrefix ?? "We help you:") && (
                      <p className="text-white text-sm font-semibold mt-5 mb-3">
                        {service.growthInsight.listPrefix ?? "We help you:"}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {service.growthInsight.weHelpYou.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-white text-base">
                          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red/60 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    {service.growthInsight.closing && (
                      <p className="text-white text-sm leading-relaxed mt-4">
                        {service.growthInsight.closing}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS — full-viewport-width ── */}
      <section className="bg-secondary border-y border-gray-100 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <SectionLabel label="Testimonials" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                What Our Clients Say
              </h2>
              <p className="text-gray-500 text-base max-w-lg leading-relaxed">
                Businesses across industries trust our expertise for registrations, compliance,
                and financial processes.
              </p>
            </div>
            <button
              onClick={() => setPopupOpen(true)}
              className="flex-shrink-0 bg-red hover:bg-[#b01712] text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Get Started Today
            </button>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden">
              <AnimatePresence mode="wait">
                {visibleTestimonials.map((t, i) => (
                  <motion.div
                    key={`${t.name}-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-5"
                  >
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, si) => (
                        <FaStar key={si} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed flex-1">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={prevSlide}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:border-[#D11C16] hover:text-red flex items-center justify-center text-gray-500 transition-all"
              >
                <FaArrowLeft className="text-sm" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === slideIndex ? "w-6 h-2 bg-red" : "w-2 h-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="w-11 h-11 rounded-full bg-red hover:bg-[#b01712] text-white flex items-center justify-center transition-all"
              >
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 py-16 lg:py-20">

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-red/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-red/15 blur-3xl" />
        {/* top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/60 to-transparent" />

        <div className="relative container mx-auto px-4 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">

            {/* eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-red/15 border border-red/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
              <span className="text-red text-[11px] font-bold tracking-widest uppercase">
                Ready to get started?
              </span>
            </div>

            {/* main headline — from PDF */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              {service.cta.headline || service.cta.tagline}
            </h2>

            {/* tagline subtitle — from PDF */}
            {service.cta.headline && service.cta.tagline && (
              <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-10">
                {service.cta.tagline}
              </p>
            )}

            {/* CTA button */}
            <button
              onClick={() => setPopupOpen(true)}
              className="inline-flex items-center gap-2.5 bg-red hover:bg-[#b01712] text-white font-bold text-base px-9 py-3.5 rounded-xl transition-all shadow-xl"
            >
              {service.cta.buttonText}
            </button>

         

          </div>
        </div>
      </section>

      {/* ── Enquiry Popup ── */}
      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} initialService={service?.name || ""} />

    </div>
  );
};

export default ServiceContent;
