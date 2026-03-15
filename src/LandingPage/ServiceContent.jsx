
import React, { useState, useRef, useEffect } from "react";
import {
  FaInfoCircle,
  FaFileAlt,
  FaListOl,
  FaQuestionCircle,
} from "react-icons/fa";
import { FaStar, FaArrowLeft, FaArrowRight, FaQuoteRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServiceContent = () => {
  const navigate = useNavigate()
  const [isStickyActive, setIsStickyActive] = useState(true);

 const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: <FaInfoCircle />,
    tag: "Overview",

    items: [
      {
        title: "Professional Business Support",
        desc1:
          "We provide end-to-end support for essential business compliance, registrations, and financial processes required for smooth operations.",
        desc2:
          "Our approach focuses on simplifying complex procedures so businesses can stay compliant while focusing on growth.",
      },
      {
        title: "Reliable Documentation Handling",
        desc1:
          "Accurate documentation and structured record management are critical for maintaining regulatory compliance and financial transparency.",
        desc2:
          "Our team ensures that all required documents are organized and prepared according to official requirements.",
      },
      {
        title: "Compliance & Filing Services",
        desc1:
          "Businesses must regularly submit filings and maintain statutory records as per regulatory guidelines.",
        desc2:
          "Timely filings help prevent penalties, ensure operational continuity, and maintain credibility with authorities.",
      },
      {
        title: "Our Guidance & Assistance",
        desc1:
          "Our professionals guide businesses through every step of compliance, registration, and reporting procedures.",
        desc2:
          "This ensures faster processing, reduced errors, and a smoother overall experience.",
      },
    ],
  },

  {
    id: "documents",
    label: "Documents Required",
    icon: <FaFileAlt />,
    tag: "Documents Required",

    items: [
      {
        title: "Basic Identity Documents",
        desc1:
          "Identity proof, address proof, and PAN/Aadhaar details are commonly required for most registrations.",
        desc2:
          "Additional identification documents may be required depending on the business structure.",
      },
      {
        title: "Business Information",
        desc1:
          "Basic business details such as address, bank information, and operational information are required.",
        desc2:
          "These details help authorities verify the authenticity and nature of business operations.",
      },
      {
        title: "Financial Records",
        desc1:
          "Invoices, transaction details, bank statements, and financial records are required for compliance and filing purposes.",
        desc2:
          "Maintaining accurate records helps ensure smooth filings and audit readiness.",
      },
      {
        title: "Additional Supporting Documents",
        desc1:
          "Depending on the service, supporting documents like agreements, ownership proof, or licenses may be required.",
        desc2:
          "Our team will guide you on the exact documents required for your specific case.",
      },
    ],
  },

  {
    id: "process",
    label: "Registration Process",
    icon: <FaListOl />,
    tag: "Process",

    items: [
      {
        title: "Step 1 – Initial Consultation",
        desc1:
          "We begin by understanding your business needs and identifying the compliance or registration requirements.",
        desc2:
          "This helps us recommend the correct process and required documentation.",
      },
      {
        title: "Step 2 – Document Collection",
        desc1:
          "Required documents and business information are collected and verified for accuracy.",
        desc2:
          "Proper documentation significantly reduces processing delays.",
      },
      {
        title: "Step 3 – Application & Processing",
        desc1:
          "Applications are prepared and submitted through the appropriate government or regulatory portals.",
        desc2:
          "Our team carefully monitors the progress and manages communication if additional information is required.",
      },
      {
        title: "Step 4 – Completion & Compliance Support",
        desc1:
          "Once the process is completed, confirmation and required certificates or approvals are provided.",
        desc2:
          "We also guide businesses on maintaining ongoing compliance when required.",
      },
    ],
  },

  {
    id: "faq",
    label: "FAQ",
    icon: <FaQuestionCircle />,
    tag: "FAQ",
    title: "Frequently Asked Questions",
  },
];

  const tabs = [
  "ALL",
  "REGISTRATION",
  "DOCUMENTS",
  "PROCESS",
  "SUPPORT",
];

  const faqData = [
  {
    service: "REGISTRATION",
    q: "Why is business registration important?",
    a: "Business registration establishes legal identity and enables businesses to operate within regulatory frameworks.",
  },
  {
    service: "REGISTRATION",
    q: "How long does a registration process usually take?",
    a: "Processing time varies depending on the type of registration and verification requirements.",
  },

  {
    service: "DOCUMENTS",
    q: "What documents are generally required?",
    a: "Most processes require identity proof, address proof, PAN details, and basic business information.",
  },
  {
    service: "DOCUMENTS",
    q: "Do document requirements change based on business type?",
    a: "Yes. The required documents may vary depending on whether the business is a proprietorship, partnership, or company.",
  },

  {
    service: "PROCESS",
    q: "What steps are involved in the process?",
    a: "The process typically includes consultation, document collection, application submission, and verification.",
  },
  {
    service: "PROCESS",
    q: "Will I receive updates during the process?",
    a: "Yes. Our team keeps clients informed about the progress and any additional requirements.",
  },

  {
    service: "SUPPORT",
    q: "Do you provide assistance after completion?",
    a: "Yes. We provide guidance for maintaining ongoing compliance and handling future filings when required.",
  },
  {
    service: "SUPPORT",
    q: "Can I get help if I am unsure about the right service?",
    a: "Absolutely. Our team helps identify the correct solution based on your business needs.",
  },
];

  const testimonials = [
    {
      name: "Arun Kumar",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "The GST registration process was handled smoothly and professionally. Everything was completed faster than expected.",
    },
    {
      name: "Priya Sharma",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Excellent support and clear guidance throughout the compliance process. Highly reliable service.",
    },
    {
      name: "Rahul Mehta",
      img: "https://randomuser.me/api/portraits/men/75.jpg",
      text: "Very responsive team. They simplified what initially felt like a complicated registration process.",
    },
    {
      name: "Sneha Iyer",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Professional service with great attention to detail. The entire experience was stress-free.",
    },
  ];

  const [active, setActive] = useState("overview");
  const [tab, setTab] = useState("ALL");
  const [open, setOpen] = useState(null);
  const [index, setIndex] = useState(0);

  const sectionRefs = useRef({});
  const tabsRef = useRef(null);
  const contentContainerRef = useRef(null);

  const filteredFaq =
    tab === "ALL"
      ? faqData
      : faqData.filter((f) => f.service === tab);

  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !contentContainerRef.current) return;

      const TAB_HEIGHT = tabsRef.current.offsetHeight;
      const OFFSET = 150;

      const lastSection = sections[sections.length - 1];
      const lastSectionEl = sectionRefs.current[lastSection.id];

      if (!lastSectionEl) return;

      const lastSectionRect = lastSectionEl.getBoundingClientRect();
      const contentContainerRect =
        contentContainerRef.current.getBoundingClientRect();

      const isAtEnd = contentContainerRect.bottom <= window.innerHeight;
      const isInLastSection =
        lastSectionRect.top - TAB_HEIGHT <= OFFSET;

      setIsStickyActive(!isAtEnd);

      if (isInLastSection || isAtEnd) {
        setActive(lastSection.id);
        return;
      }

      let current = sections[0].id;

      sections.forEach((sec) => {
        const el = sectionRefs.current[sec.id];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top - TAB_HEIGHT <= OFFSET) {
          current = sec.id;
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (!el || !tabsRef.current) return;

    const TAB_HEIGHT = tabsRef.current.offsetHeight;
    const top =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      TAB_HEIGHT -
      2;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

const getVisibleCards = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 768) {
      // Mobile
      return [testimonials[index]];
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      // Medium screens
      return [
        testimonials[index],
        testimonials[(index + 1) % testimonials.length],
      ];
    } else {
      // Large screens
      return [
        testimonials[index],
        testimonials[(index + 1) % testimonials.length],
        testimonials[(index + 2) % testimonials.length],
      ];
    }
  }
  return [testimonials[index]];
};

  const visibleCards = getVisibleCards();



  return (
    <div className="">
      <div className="px-4 container  flex md:flex-row flex-col justify-between lg:px-12 mx-auto py-4  lg:pt-12 p-5   lg:pb-5">
          <h2 className="text-2xl lg:text-4xl font-semibold mb-2 lg:mb-4">
            PROFESSIONAL BUSINESS SERVICES  <br className="hidden lg:block" />
            EVERYTHING YOU NEED TO KNOW
          </h2>

          <div>
            <p className="lg:text-lg font-semibold">
              Simplifying Compliance & Financial Processes
            </p>

            <p className="text-gray-500 lg:max-w-md">
              Explore detailed insights into our services, including key benefits,
              documentation requirements, processes, and frequently asked questions —
              designed to help you make informed decisions with confidence.
            </p>
          </div>
        </div>
      {/* Sticky Navigation - Now with conditional sticky class */}
      <div
        ref={tabsRef}
       className={`${isStickyActive ? 'md:sticky md:top-26' : ''} z-30 hidden md:block bg-white py-6`}
      >
        

        <div className="px-4 lg:px-12  ">
          <div className="flex flex-wrap container mx-auto md:flex-nowrap border-[#EEF3F6] md:border-20 border-14  rounded-lg gap-2 py-2 md:overflow-x-auto">
            {sections.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => scrollTo(tabItem.id)}
                className={`flex items-center uppercase gap-2 px-2  md:px-5 py-2.5 border-r text-xs md:text-sm md:font-medium whitespace-nowrap transition-all duration-200
                  ${active === tabItem.id
                    ? ""
                    : "text-[#98989A] hover:bg-gray-100 hover:text-gray-800"
                  }`}
              >
                <span className="text-base">{tabItem.icon}</span>
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div ref={contentContainerRef} className="px-4 container  lg:px-12  mx-auto  md:py-8">
        {sections.map((sec) => (
          <div
            key={sec.id}
            ref={(el) => (sectionRefs.current[sec.id] = el)}
            className="min-h-[40vh] pt-10 pb-6 md:scroll-mt-14"
          >
            {sec.id !== "faq" && (
              <div className="lg:bg-gray-50 border border-gray-200 rounded-2xl px-4 py-6 lg:p-8 shadow-sm">

                <span className="inline-block text-xs font-bold tracking-widest text-yellow uppercase mb-6 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  {sec.tag}
                </span>

                <div className="grid md:grid-cols-2 gap-6">
                  {sec.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-3 lg:p-6 border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {item.title}
                      </h3>

                      <div className="w-10 h-1 bg-black rounded mb-4" />

                      <p className="text-gray-600 leading-relaxed">
                        {item.desc1}
                      </p>

                      <p className="text-gray-600 leading-relaxed mt-3">
                        {item.desc2}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sec.id === "faq" && (
              <div className="lg:bg-gray-100  rounded-2xl   lg:p-8">
                <p className="text-xs text-red-500 font-semibold mb-2">FAQ</p>
                <h3 className="text-2xl font-semibold mb-8">
                  FREQUENTLY ASKED QUESTIONS
                </h3>

                <div className="flex flex-wrap gap-3 mb-8">
                  {tabs.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setTab(category);
                        setOpen(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${tab === category
                          ? "bg-yellow text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 items-center gap-4">
                  {filteredFaq.map((item, index) => {
                    const isOpen = open === index;

                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpen(isOpen ? null : index)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-800 pr-8">
                            {item.q}
                          </span>
                          <span className="text-2xl text-gray-500">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-600">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="bg-gray-50 py-10 lg:py-16 ">
        <div className="lg:px-12 px-4 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div>
              <p className="text-xs tracking-widest text-gray-400 mb-2">
                TESTIMONIALS
              </p>
              <h2 className="text-4xl font-semibold mb-3">
                WHAT OUR CLIENTS SAY.
              </h2>
              <p className="text-gray-500 max-w-xl">
                Businesses across industries trust our expertise for registrations,
                compliance, and financial processes. Here’s what our clients say about
                working with us.
              </p>
            </div>

            <button onClick={() => navigate("/contact")} className="bg-red text-white px-6 py-3 rounded-full hover:bg-red-700 transition whitespace-nowrap">
              Get Started Today
            </button>
          </div>

          <div className="relative bg-[#FCFCFD] rounded-2xl border border-gray-200 p-3 lg:p-8">
            <button
              onClick={prev}
              className="absolute lg:-left-5 -left-4 top-1/2 -translate-y-1/2 bg-white border rounded-full p-3 shadow hover:bg-gray-100 z-10"
            >
              <FaArrowLeft />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {visibleCards.map((t, i) => (
                  <motion.div
                    key={t.name + i}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-3 lg:p-6 border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={t.img}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{t.name}</h4>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                      <FaQuoteRight className="ml-auto text-red-600 text-2xl" />
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={next}
              className="absolute md:-right-5 -right-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-3 shadow hover:bg-gray-800 z-10"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceContent