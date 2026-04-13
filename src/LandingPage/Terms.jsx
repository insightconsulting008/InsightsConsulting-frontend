import React, { useState, useRef, useEffect } from "react";

const Terms = () => {
  const [activeSection, setActiveSection] = useState("terms");
  const [mode, setMode] = useState("human");
  
  // Create refs for each section
  const termsRef = useRef(null);
  const privacyRef = useRef(null);
  const refundRef = useRef(null);
  
  // Map section names to their refs
  const sectionRefs = {
    terms: termsRef,
    privacy: privacyRef,
    refund: refundRef
  };

  // Function to handle menu click and scroll to section
  const handleMenuClick = (section) => {
    setActiveSection(section);
    sectionRefs[section].current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Intersection Observer to highlight active section while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '-80px 0px -80px 0px' // Offset for better timing
      }
    );

    // Observe all sections
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Cleanup observer
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      {/* HERO SECTION */}
      <div className="text-center py-16 max-w-3xl px-6">
        <p className="text-primary font-medium text-sm mb-3">
          Privacy Policy
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6">
          We care about your privacy
        </h1>

        <p className="text-gray-500 text-lg leading-relaxed">
          At Insight Consulting, your privacy is important to us. We respect
          your personal and business information and are committed to
          protecting any data collected while providing our services such as
          GST registration, company incorporation, trademark filing, and
          compliance management.
        </p>

        {/* TOGGLE BUTTONS */}
        <div className="flex justify-center mt-8 bg-gray-200 rounded-lg p-1 w-fit mx-auto">
          <button
            onClick={() => setMode("human")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === "human"
                ? "bg-white shadow text-gray-800"
                : "text-gray-600"
            }`}
          >
            Human-friendly
          </button>

          <button
            onClick={() => setMode("legal")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === "legal"
                ? "bg-white shadow text-gray-800"
                : "text-gray-600"
            }`}
          >
            Legal version
          </button>
        </div>
      </div>
      
      <div className="container mx-auto ">
        <div className="flex flex-col md:flex-row md:w-[80%] my-10 justify-center pl-10 md:p-0 text-textdark">
          {/* LEFT SIDE MENU - STICKY */}
          <div className="md:w-[40%] md:flex flex-col items-center md:space-y-7 space-y-5 md:sticky md:top-34 md:self-start">
            <div className="space-y-5 text-xl flex flex-col font-semibold">
              <h1
                className={`cursor-pointer transition-opacity duration-300 ${
                  activeSection === "terms" ? "opacity-100" : "opacity-65 hover:opacity-80"
                }`}
                onClick={() => handleMenuClick("terms")}
              >
                Terms and Conditions
              </h1>

              <h1
                className={`cursor-pointer transition-opacity duration-300 ${
                  activeSection === "privacy" ? "opacity-100" : "opacity-65 hover:opacity-80"
                }`}
                onClick={() => handleMenuClick("privacy")}
              >
                Privacy Policy
              </h1>

              <h1
                className={`cursor-pointer transition-opacity duration-300 ${
                  activeSection === "refund" ? "opacity-100" : "opacity-65 hover:opacity-80"
                }`}
                onClick={() => handleMenuClick("refund")}
              >
                Cancellation / Refund Policy
              </h1>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT - ALL SECTIONS VISIBLE */}
          <div className="md:w-[60%] w-[80%] space-y-16 flex flex-col items-center">
            {/* TERMS AND CONDITIONS SECTION */}
            <div ref={termsRef} data-section="terms" className="space-y-5 scroll-mt-32 w-full">
              <div className="text-2xl space-y-2">
                <h1 className="font-medium">Terms and Conditions</h1>
                <hr className="border-[0.2rem] border-textdark w-[10%] ml-1" />

                <p className="opacity-75 text-base">
                  Welcome to Insight Consulting. By accessing or using our
                  services including business registration, GST services,
                  compliance management, trademark registration, and related
                  consulting services, you agree to the following terms and
                  conditions.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Service Engagement</h1>
                  <p className="text-base opacity-75">
                    When you purchase or request a service from Insight
                    Consulting, you agree to provide accurate information and
                    the necessary documents required for the completion of the
                    service.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Processing Timeline</h1>
                  <p className="text-base opacity-75">
                    Service timelines depend on the type of service requested,
                    government processing times, and submission of required
                    documents by the client. Insight Consulting will make every
                    effort to complete services within the estimated timeframe.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Client Responsibilities</h1>
                  <p className="text-base opacity-75">
                    Clients are responsible for submitting accurate documents,
                    identity details, and information required for filings or
                    registrations. Any delay in providing documents may delay
                    the completion of the service.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Government Fees</h1>
                  <p className="text-base opacity-75">
                    Certain services may include statutory or government fees
                    which are separate from professional service charges.
                    These fees are determined by government authorities and may
                    change without prior notice.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Service Completion</h1>
                  <p className="text-base opacity-75">
                    Insight Consulting is responsible for preparing and
                    submitting applications or documents as required. Final
                    approvals, registrations, or certificates are subject to
                    review and approval by the respective government
                    authorities.
                  </p>
                </div>
              </div>
            </div>

            {/* PRIVACY POLICY SECTION */}
            <div ref={privacyRef} data-section="privacy" className="space-y-5 scroll-mt-32 w-full">
              <div className="text-2xl space-y-2">
                <h1 className="font-medium">Privacy Policy</h1>
                <hr className="border-[0.2rem] border-textdark w-[10%] ml-1" />

                <p className="opacity-75 text-base">
                  Insight Consulting values your privacy and is committed to
                  protecting your personal and business information. This
                  policy explains how we collect, use, and safeguard your data.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Information We Collect</h1>
                  <p className="text-base opacity-75">
                    We may collect personal and business information such as
                    name, email address, phone number, PAN, Aadhaar, company
                    details, and documents required for regulatory compliance
                    and registrations.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">How We Use Your Information</h1>
                  <p className="text-base opacity-75">
                    The information collected is used to provide consulting
                    services, prepare government filings, communicate service
                    updates, and improve the overall customer experience.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Data Security</h1>
                  <p className="text-base opacity-75">
                    We implement appropriate security measures to protect your
                    personal data and documents from unauthorized access,
                    misuse, or disclosure.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Third Party Sharing</h1>
                  <p className="text-base opacity-75">
                    Information may be shared with authorized government
                    portals, regulatory authorities, or trusted service
                    partners only when required to complete your requested
                    services.
                  </p>
                </div>
              </div>
            </div>

            {/* REFUND POLICY SECTION */}
            <div ref={refundRef} data-section="refund" className="space-y-5 scroll-mt-32 w-full">
              <div className="text-2xl space-y-2">
                <h1 className="font-medium">Cancellation / Refund Policy</h1>
                <hr className="border-[0.2rem] border-textdark w-[10%] ml-1" />

                <p className="opacity-75 text-base">
                  Insight Consulting aims to provide professional and reliable
                  consulting services. However, cancellation or refund requests
                  may be considered under certain circumstances.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Service Cancellation</h1>
                  <p className="text-base opacity-75">
                    Clients may request cancellation of a service before the
                    submission of documents or application filing with
                    government authorities.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Refund Eligibility</h1>
                  <p className="text-base opacity-75">
                    Refunds may be considered if the service has not yet been
                    initiated. Administrative or payment gateway charges may
                    be deducted from the refund amount.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Non-Refundable Services</h1>
                  <p className="text-base opacity-75">
                    Once documentation has been processed, applications have
                    been submitted, or work has started, refunds cannot be
                    provided due to the professional time and effort invested.
                  </p>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-medium">Refund Processing</h1>
                  <p className="text-base opacity-75">
                    Approved refunds will be processed within 5–7 business
                    days through the original payment method where possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;