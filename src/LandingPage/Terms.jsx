import React, { useState, useRef, useEffect, useCallback } from "react";

const Terms = () => {
  const [activeSection, setActiveSection] = useState("confidentiality");
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);

  const confidentialityRef = useRef(null);
  const privacyRef = useRef(null);

  const sectionRefs = {
    confidentiality: confidentialityRef,
    privacy: privacyRef,
  };

  // Function to determine active section based on scroll position
  const updateActiveSection = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    const sections = [
      { key: "confidentiality", ref: confidentialityRef },
      { key: "privacy", ref: privacyRef },
    ];

    // Get the offset of the sticky header (the nav bar)
    const stickyHeader = document.querySelector(".sticky-nav");
    const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().bottom : 200;

    let closestSection = "confidentiality";
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
    { key: "confidentiality", label: "Confidentiality Statement" },
    { key: "privacy", label: "Privacy Policy" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <div className="text-center pt-20 pb-4 max-w-3xl mx-auto px-6">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
          Legal Information
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-black mb-6 leading-tight">
          We care about your privacy
        </h1>
        <p className="text-black text-lg leading-relaxed">
          Insight Consulting is committed to maintaining the highest standards of
          confidentiality and information security in all client engagements.
          Protecting client information is a core principle of our professional
          practice.
        </p>
      </div>

      {/* STICKY NAVIGATION */}
      <div className="sticky-nav sticky top-[108px] z-20 bg-white border-b border-gray-300">
        <div className="flex justify-center py-4">
          <div className="bg-gray-200 rounded-xl p-1 flex gap-1 shadow-sm m-3 md:m-0">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleMenuClick(key)}
                className={`px-5 py-2.5 rounded-lg text-xl md:text-base font-medium transition ${
                  activeSection === key
                    ? "bg-primary text-white"
                    : "text-black hover:text-primary hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="space-y-24">
          {/* CONFIDENTIALITY STATEMENT */}
          <div ref={confidentialityRef} data-section="confidentiality" className="scroll-mt-56 space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-black">
              Confidentiality Statement
            </h2>
            <div className="bg-white p-6 rounded-xl border-2 border-primary space-y-6">
              <p className="text-black text-lg leading-relaxed">
                Insight Consulting is committed to maintaining the highest standards of
                confidentiality and information security in all client engagements.
                Protecting client information is a core principle of our professional
                practice.
              </p>
              <p className="text-black text-lg leading-relaxed font-medium">
                The following confidentiality commitments apply to all our clients:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black text-lg">
                <li>We do <strong>not disclose client information</strong> to any third parties except where required by law or with explicit client authorization.</li>
                <li>We do <strong>not use client names, logos, or brand references</strong> for marketing or promotional purposes without prior written consent.</li>
                <li>We do <strong>not share client identity or engagement details</strong> with prospective clients for business development purposes.</li>
                <li>We do <strong>not sell, distribute, or publish client lists</strong> or confidential information under any circumstances.</li>
              </ul>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-black">Confidentiality Agreement</h2>

            {/* Confidentiality Agreement */}
            <div className="bg-white p-6 rounded-xl border-2 border-primary space-y-6">
              <p className="text-black text-lg leading-relaxed">
                It is understood that clients of Insight Consulting may share sensitive
                financial, operational, technical, strategic, and proprietary
                information during the course of professional engagements. Insight
                Consulting agrees to protect such information in accordance with the
                following terms:
              </p>

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">1. Definition of Confidential Information</h4>
                <p className="text-black text-lg leading-relaxed mb-2">
                  Confidential Information includes, but is not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg">
                  <li>Business plans and strategies</li>
                  <li>Financial data and projections</li>
                  <li>Accounting records and tax information</li>
                  <li>Client and customer data</li>
                  <li>Proprietary processes and methodologies</li>
                  <li>Product or service concepts</li>
                  <li>Research and development information</li>
                  <li>Trade secrets and intellectual property</li>
                  <li>Operational and internal management information</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  This applies whether or not such information is explicitly marked as "Confidential".
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">2. Internal Access Control</h4>
                <p className="text-black text-lg leading-relaxed mb-2">
                  Confidential Information will be shared internally only with partners,
                  directors, employees, or authorized professionals of Insight Consulting
                  who require access for service delivery purposes.
                </p>
                <p className="text-black text-lg leading-relaxed mb-2">
                  Such individuals are bound by professional confidentiality obligations.
                </p>
                <p className="text-black text-lg leading-relaxed">
                  Confidential Information will not be disclosed externally unless:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg mt-1">
                  <li>Required under applicable law or regulatory authority</li>
                  <li>Required for professional service delivery with client consent</li>
                  <li>Authorized in writing by the client</li>
                </ul>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">3. Exclusions from Confidentiality Obligations</h4>
                <p className="text-black text-lg leading-relaxed">
                  Confidentiality obligations do not apply to information that:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg mt-1">
                  <li>Was already lawfully in possession of Insight Consulting prior to disclosure</li>
                  <li>Becomes publicly available without breach of this agreement</li>
                  <li>Is received from a third party without confidentiality restriction</li>
                  <li>Is independently developed without use of confidential information</li>
                  <li>Is disclosed with written approval of the client</li>
                  <li>Is required to be disclosed under legal or regulatory obligation</li>
                </ul>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">4. Use of Confidential Information</h4>
                <p className="text-black text-lg leading-relaxed">
                  Confidential Information will be used strictly for the purpose of
                  delivering agreed professional services and will not be used for any
                  unrelated purpose.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">5. Duration of Confidentiality Obligations</h4>
                <p className="text-black text-lg leading-relaxed">
                  Confidentiality obligations continue during the engagement period and
                  remain in effect even after completion or termination of services,
                  unless disclosure is required by law.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">6. Entire Agreement</h4>
                <p className="text-black text-lg leading-relaxed">
                  This Confidentiality Statement represents the understanding between
                  Insight Consulting and its clients regarding protection of confidential
                  information. Any modification must be made in writing and mutually
                  agreed.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">7. Severability</h4>
                <p className="text-black text-lg leading-relaxed">
                  If any provision of this statement is held to be unenforceable, the
                  remaining provisions shall continue in full force and effect.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">8. Client Responsibilities</h4>
                <p className="text-black text-lg leading-relaxed">
                  Clients are responsible for ensuring that information shared with
                  Insight Consulting is accurate and authorized for disclosure. Insight
                  Consulting shall not be liable for consequences arising from inaccurate,
                  incomplete, or unauthorized information provided by clients.
                </p>
              </div>
            </div>
          </div>

          {/* PRIVACY POLICY */}
          <div ref={privacyRef} data-section="privacy" className="scroll-mt-56 space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-black">
              Privacy Policy
            </h2>
            <div className="bg-white p-6 rounded-xl border-2 border-primary space-y-6">
              <p className="text-black text-lg leading-relaxed">
                Insight Consulting ("we", "our", or "us") is committed to protecting the
                privacy of visitors and users ("Users") of our website and services.
                This Privacy Policy explains how we collect, use, store, and safeguard
                your information when you interact with our website and services.
              </p>
              <p className="text-black text-lg leading-relaxed">
                This policy applies to the website of Insight Consulting and all
                services offered by us.
              </p>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">1. Personal Identification Information</h4>
                <p className="text-black text-lg leading-relaxed mb-2">
                  We may collect personal identification information from Users in various
                  ways, including when Users:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg">
                  <li>Visit our website</li>
                  <li>Fill out contact forms</li>
                  <li>Register on our website</li>
                  <li>Request services or information</li>
                  <li>Subscribe to newsletters or updates</li>
                  <li>Engage with us through emails or consultations</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  The information collected may include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Mailing address</li>
                  <li>Business details (including company name, incorporation details, GST details, etc.)</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  Users may visit our website anonymously. Personal identification
                  information is collected only when voluntarily provided. However,
                  refusal to provide certain information may prevent access to some
                  services.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">2. Non-Personal Identification Information</h4>
                <p className="text-black text-lg leading-relaxed">
                  We may collect non-personal identification information whenever Users
                  interact with our website. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg mt-1">
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Operating system</li>
                  <li>Internet service provider details</li>
                  <li>Technical usage information</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  This information helps us improve website functionality and user
                  experience.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">3. Cookies and Tracking Technologies</h4>
                <p className="text-black text-lg leading-relaxed">
                  Our website may use cookies to enhance user experience. Cookies help us:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg mt-1">
                  <li>Understand user preferences</li>
                  <li>Improve website performance</li>
                  <li>Analyze website traffic</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  Users may configure their browser to refuse cookies or alert them when
                  cookies are being used. Some parts of the website may not function
                  properly if cookies are disabled.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">4. How We Use Collected Information</h4>
                <p className="text-black text-lg leading-relaxed">
                  Insight Consulting may collect and use Users' information for the
                  following purposes:
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="font-semibold text-black text-lg">a. To improve customer service</p>
                    <p className="text-black text-lg">Information helps us respond more efficiently to service requests and support needs.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black text-lg">b. To personalize user experience</p>
                    <p className="text-black text-lg">We analyze aggregated data to understand how Users interact with our services.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black text-lg">c. To improve our website and services</p>
                    <p className="text-black text-lg">Feedback helps us enhance service quality and website usability.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black text-lg">d. To process service requests</p>
                    <p className="text-black text-lg">Information is used only to deliver the requested services.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black text-lg">e. To communicate updates and relevant information</p>
                    <p className="text-black text-lg">We may send updates related to services, regulatory changes, newsletters, or offerings that may be relevant to Users.</p>
                  </div>
                </div>
                <p className="text-black text-lg leading-relaxed mt-2">
                  Users may unsubscribe from marketing communications at any time.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">5. How We Protect Your Information</h4>
                <p className="text-black text-lg leading-relaxed">
                  We adopt appropriate data collection, storage, and processing practices
                  to safeguard personal information against unauthorized access,
                  alteration, disclosure, or destruction.
                </p>
                <p className="text-black text-lg leading-relaxed mt-2">
                  Security measures include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg">
                  <li>Secure server environments</li>
                  <li>Access controls</li>
                  <li>Encryption-enabled communication channels (SSL)</li>
                  <li>Periodic internal security reviews</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  While we follow industry-standard safeguards, no transmission over the
                  internet is completely secure.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">6. Sharing Your Personal Information</h4>
                <p className="text-black text-lg leading-relaxed">
                  We do <strong>not sell, trade, or rent</strong> Users' personal identification
                  information to others.
                </p>
                <p className="text-black text-lg leading-relaxed mt-2">
                  We may share limited information with:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black text-lg">
                  <li>Trusted service providers assisting in website operation</li>
                  <li>Technology partners supporting communication systems</li>
                  <li>Regulatory or legal authorities where required by law</li>
                </ul>
                <p className="text-black text-lg leading-relaxed mt-2">
                  Such sharing is strictly limited to the purpose of delivering services
                  or complying with legal obligations.
                </p>
                <p className="text-black text-lg leading-relaxed mt-2">
                  If Insight Consulting undergoes restructuring, merger, acquisition, or
                  business transfer, user information may be transferred as part of the
                  transaction, subject to confidentiality safeguards.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">7. Third-Party Websites</h4>
                <p className="text-black text-lg leading-relaxed">
                  Our website may contain links to external websites. Insight Consulting
                  is not responsible for the privacy practices of those websites. Users
                  are encouraged to review the privacy policies of third-party platforms
                  before sharing personal information.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">8. Children's Information</h4>
                <p className="text-black text-lg leading-relaxed">
                  Our services are intended for professionals, businesses, and individuals
                  above the age of 18. We do not knowingly collect personal information
                  from children.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">9. Changes to This Privacy Policy</h4>
                <p className="text-black text-lg leading-relaxed">
                  Insight Consulting may update this Privacy Policy from time to time.
                  Updates will be posted on this page with a revised effective date.
                </p>
                <p className="text-black text-lg leading-relaxed mt-2">
                  Continued use of our website after updates constitutes acceptance of the
                  revised policy.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">10. Your Consent</h4>
                <p className="text-black text-lg leading-relaxed">
                  By using our website and services, you consent to this Privacy Policy.
                </p>
              </div>

              <hr className="border-primary" />

              <div>
                <h4 className="text-lg font-semibold text-black mb-3">11. Contact Us</h4>
                <p className="text-black text-lg leading-relaxed">
                  If you have any questions about this Privacy Policy or how your
                  information is handled, please contact:
                </p>
                <div className="mt-2 text-black text-lg">
                  <p><strong>Insight Consulting</strong></p>
                  <p>Flat No 6, Door No 6, Block 14</p>
                  <p>2nd Floor, Welcome Colony</p>
                  <p>Anna Nagar West Extension</p>
                  <p>Chennai -- 600101</p>
                  <p>Email: revathyb@insightconsulting.info</p>
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