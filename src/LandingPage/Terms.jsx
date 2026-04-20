import React, { useState, useRef, useEffect, useCallback } from "react";

const Terms = () => {
  const [activeSection, setActiveSection] = useState("terms");
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);

  const termsRef = useRef(null);
  const privacyRef = useRef(null);
  const refundRef = useRef(null);

  const sectionRefs = {
    terms: termsRef,
    privacy: privacyRef,
    refund: refundRef,
  };

  // Function to determine active section based on scroll position
  const updateActiveSection = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    const sections = [
      { key: "terms", ref: termsRef },
      { key: "privacy", ref: privacyRef },
      { key: "refund", ref: refundRef },
    ];

    // Get the offset of the sticky header (the nav bar)
    const stickyHeader = document.querySelector(".sticky-nav");
    const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().bottom : 200;

    let closestSection = "terms";
    let closestDistance = Infinity;

    sections.forEach(({ key, ref }) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Distance from the top of the section to the header bottom
      const distance = Math.abs(rect.top - headerOffset);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = key;
      }
    });

    setActiveSection(closestSection);
  }, []);

  // Scroll listener with RAF and debounce
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial call to set correct active section
    updateActiveSection();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateActiveSection]);

  const handleMenuClick = (section) => {
    // Disable scroll listener during programmatic scroll
    isProgrammaticScroll.current = true;

    // Immediately update active button
    setActiveSection(section);

    // Scroll to the section
    const element = sectionRefs[section].current;
    if (element) {
      const stickyHeader = document.querySelector(".sticky-nav");
      const headerHeight = stickyHeader ? stickyHeader.offsetHeight : 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 130; // 20px extra padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Re-enable scroll listener after scrolling ends
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
      // Force a final update to ensure correct section
      updateActiveSection();
    }, 800); // Slightly longer than smooth scroll duration
  };

  const navItems = [
    { key: "terms", label: "Terms & Conditions" },
    { key: "privacy", label: "Privacy Policy" },
    { key: "refund", label: "Cancellation / Refund" },
  ];

  const termsSections = [
    {
      title: "Service Engagement",
      body:
        "When you purchase or request a service from Insight Consulting, you agree to provide accurate information and the necessary documents required for the completion of the service.",
    },
    {
      title: "Processing Timeline",
      body:
        "Service timelines depend on the type of service requested, government processing times, and submission of required documents by the client. Insight Consulting will make every effort to complete services within the estimated timeframe.",
    },
    {
      title: "Client Responsibilities",
      body:
        "Clients are responsible for submitting accurate documents, identity details, and information required for filings or registrations. Any delay in providing documents may delay the completion of the service.",
    },
    {
      title: "Government Fees",
      body:
        "Certain services may include statutory or government fees which are separate from professional service charges. These fees are determined by government authorities and may change without prior notice.",
    },
    {
      title: "Service Completion",
      body:
        "Insight Consulting is responsible for preparing and submitting applications or documents as required. Final approvals, registrations, or certificates are subject to review and approval by the respective government authorities.",
    },
  ];

  const privacySections = [
    {
      title: "Information We Collect",
      body:
        "We may collect personal and business information such as name, email address, phone number, PAN, Aadhaar, company details, and documents required for regulatory compliance and registrations.",
    },
    {
      title: "How We Use Your Information",
      body:
        "The information collected is used to provide consulting services, prepare government filings, communicate service updates, and improve the overall customer experience.",
    },
    {
      title: "Data Security",
      body:
        "We implement appropriate security measures to protect your personal data and documents from unauthorized access, misuse, or disclosure.",
    },
    {
      title: "Third Party Sharing",
      body:
        "Information may be shared with authorized government portals, regulatory authorities, or trusted service partners only when required to complete your requested services.",
    },
  ];

  const refundSections = [
    {
      title: "Service Cancellation",
      body:
        "Clients may request cancellation of a service before the submission of documents or application filing with government authorities.",
    },
    {
      title: "Refund Eligibility",
      body:
        "Refunds may be considered if the service has not yet been initiated. Administrative or payment gateway charges may be deducted from the refund amount.",
    },
    {
      title: "Non-Refundable Services",
      body:
        "Once documentation has been processed, applications have been submitted, or work has started, refunds cannot be provided due to the professional time and effort invested.",
    },
    {
      title: "Refund Processing",
      body:
        "Approved refunds will be processed within 5–7 business days through the original payment method where possible.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="text-center pt-20 pb-12 max-w-3xl mx-auto px-6">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
          Legal Information
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
          We care about your privacy
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          At Insight Consulting, your privacy is important to us. We respect your
          personal and business information and are committed to protecting any data
          collected while providing our services such as GST registration, company
          incorporation, trademark filing, and compliance management.
        </p>
      </div>

      {/* STICKY NAVIGATION - added class "sticky-nav" for targeting */}
      <div className="sticky-nav sticky top-[108px] z-20 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-center py-4">
          <div className="bg-gray-200 rounded-xl p-1 flex gap-1 shadow-sm m-3 md:m-0">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleMenuClick(key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeSection === key
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-24">
          {/* TERMS */}
          <div ref={termsRef} data-section="terms" className="scroll-mt-56 space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Terms and Conditions
            </h2>
            {termsSections.map(({ title, body }) => (
              <div key={title} className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mt-2">{body}</p>
              </div>
            ))}
          </div>

          {/* PRIVACY */}
          <div ref={privacyRef} data-section="privacy" className="scroll-mt-56 space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Privacy Policy
            </h2>
            {privacySections.map(({ title, body }) => (
              <div key={title} className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mt-2">{body}</p>
              </div>
            ))}
          </div>

          {/* REFUND */}
          <div ref={refundRef} data-section="refund" className="scroll-mt-56 space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Cancellation / Refund Policy
            </h2>
            {refundSections.map(({ title, body }) => (
              <div key={title} className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mt-2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;