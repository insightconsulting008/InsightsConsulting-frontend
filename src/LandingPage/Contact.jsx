import React from "react";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnquiryPopup from "./reusable/Popup";
import api from "@src/providers/api";


const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();

  const cards = [
    {
      title: "Book a Consultation",
      description:
        "Have questions about GST registration, filings, or compliance? Speak directly with our team and get clear, practical guidance tailored to your business.",
      buttonText: "Schedule a Call",
      action: () => setPopupOpen(true),
    },
    {
      title: "Learn More About Us",
      description:
        "Discover who we are, our experience in GST and business compliance, and how we help businesses stay legally compliant and financially organized.",
      buttonText: "About Us",
      action: () => navigate("/about"),
    },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      await api.post("/forms/contact", formData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong. Please try again.");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={20} />,
      label: "Address",
      value:
        "Flat No 6, Door No 6, Block 14, 2nd Floor,\nWelcome Colony, Anna Nagar West Ext,\nChennai 600101",
      href: "https://maps.google.com/?q=Anna+Nagar+West+Ext+Chennai+600101",
    },
    {
      icon: <Mail size={20} />,
      label: "Email", // combined label
      enquiryEmail: "enquiry@insightconsulting.info", // first email
      helpdeskEmail: "support@insightconsulting.info", // second email
      isCombinedEmail: true, // flag for special rendering
    },
    {
      icon: <Phone size={20} />,
      label: "Mobile",
      value: "+91 73390 09906",
      href: "tel:+917339009906",
    },
  ];

  return (
<>
    <div className="flex flex-col items-center w-full overflow-x-hidden bg-white">
      {/* SECTION ONE: Contact Header */}
      <section className="mt-[60px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative bg-bright border-[4px] md:border-[6px] flex flex-col lg:flex-row justify-around border-black/5 rounded-[16px] p-8 md:p-14 gap-10">
          <img
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design.png"
            className="absolute top-0 left-0 w-16"
            alt=""
          />

          <div className="flex flex-col items-center lg:items-start relative shrink-0">
            <div className="bg-primary px-6 py-3 mt-5 lg:mt-0 rounded-[14px] text-white font-semibold text-[18px] md:text-4xl whitespace-nowrap shadow-sm">
              we would love to hear
            </div>
            <div className="bg-primary px-6 py-2 rounded-[10px] text-white font-semibold text-[18px] md:text-4xl mt-[-10px] shadow-sm self-center lg:self-start">
              from you
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-[30px] flex-1 max-w-[639px]">
            <p className="text-[15px] md:text-[16px] text-textlight text-center lg:text-left leading-relaxed">
              Whether you are setting up a new venture, managing GST and tax
              compliance, or strengthening your finance and regulatory processes
              for the next stage of growth, our team is here to support you. At
              Insight Consulting, we partner with businesses to provide
              practical guidance and dependable solutions that enable confident
              decisions and sustainable growth. Reach out to us — we look
              forward to connecting with you.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION TWO: Form + Info Cards */}
      <section className="w-full bg-gray-50 mt-[60px] py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-12 shadow-sm border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* LEFT SIDE - Two email cards stacked */}
              <div className="flex flex-col gap-6">
                {/* Image */}
                <div className="rounded-2xl overflow-hidden h-[220px] sm:h-[260px] lg:h-[300px]">
                  <img
                    src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Image%20(3).png"
                    className="w-full h-full object-cover"
                    alt="contact"
                  />
                </div>

                {/* Enquiry Card */}
                <a
                  href="mailto:enquiry@insightconsulting.info"
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Enquiry</p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      enquiry@insightconsulting.info
                    </p>
                  </div>
                  <div className="bg-primary p-3 rounded-full text-white">
                    <ArrowUpRight size={18} />
                  </div>
                </a>

                {/* Help-desk Card */}
                <a
                  href="mailto:support@insightconsulting.info"
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Help-desk
                    </p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      support@insightconsulting.info
                    </p>
                  </div>
                  <div className="bg-primary p-3 rounded-full text-white">
                    <ArrowUpRight size={18} />
                  </div>
                </a>
              </div>

              {/* RIGHT SIDE (FORM) */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">
                  Send us a message
                </h2>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm md:text-lg font-semibold text-gray-800 mb-1 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        required
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm md:text-lg font-semibold text-gray-800 mb-1 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        required
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold md:text-lg text-gray-800 mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        required
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm md:text-lg font-semibold text-gray-800 mb-1 block">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        required
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm md:text-lg font-semibold text-gray-800 mb-1 block">
                      Tell us about your requirement
                    </label>
                    <textarea
                      rows="5"
                      name="message"
                      value={formData.message}
                      required
                      onChange={handleChange}
                      placeholder="Your Message"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                    />
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <div className="bg-primary/5 border border-primary/20 text-primary text-sm md:text-base px-4 py-2 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full lg:w-fit px-8 py-3 rounded-xl font-semibold transition
                      ${
                        success
                          ? "bg-green-600 text-white"
                          : loading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90"
                      }`}
                  >
                    {loading
                      ? "Requesting..."
                      : success
                        ? "Sent Successfully ✓"
                        : "Request Consultation"}
                  </button>
                </form>
              </div>
            </div>

            {/* CONTACT CARDS (Address, Combined Email, Mobile) - Improved Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {contactInfo.map((item, index) =>
                item.isCombinedEmail ? (
                  // Combined email card - enhanced with better spacing and visual separation
                  <div
                    key={index}
                    className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon with circle background */}
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs md:text-base font-semibold text-primary uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <div className="mt-3 space-y-3">
                          {/* Enquiry */}
                          <a
                            href={`mailto:${item.enquiryEmail}`}
                            className="flex flex-col items-baseline gap-2 text-sm hover:translate-x-1 transition-transform duration-200"
                          >
                            <span className="text-gray-500 font-medium min-w-[70px]">
                              Enquiry:
                            </span>
                            <p className="text-gray-900 font-semibold hover:text-primary break-all">
                              {item.enquiryEmail}
                            </p>
                          </a>
                          {/* Help-desk */}
                          <a
                            href={`mailto:${item.helpdeskEmail}`}
                            className="flex-col items-baseline gap-2 text-sm hover:translate-x-1 transition-transform duration-200"
                          >
                            <span className="text-gray-500 font-medium min-w-[70px]">
                              Help-desk:
                            </span>
                            <p className="text-gray-900 font-semibold hover:text-primary break-all">
                              {item.helpdeskEmail}
                            </p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular card for Address and Mobile - improved with icon circle and better typography
                  <a
                    key={index}
                    href={item.href}
                    target={item.label === "Address" ? "_blank" : undefined}
                    rel={
                      item.label === "Address"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                  >
                    {/* Icon with circle background */}
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs md:text-base font-semibold text-primary uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-gray-900 font-semibold text-base leading-relaxed whitespace-pre-line group-hover:text-primary transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION THREE: Volunteer & Donation Cards */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 lg:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-bright w-full rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-12 border-[2px] border-black/5 flex flex-col items-start justify-between min-h-fit"
            >
              <div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-dark mb-4">
                  {card.title}
                </h3>
                <p className="text-muted text-[0.85rem] md:text-base leading-relaxed mb-8">
                  {card.description}
                </p>
              </div>
              <button
                onClick={card.action}
                className="flex items-center gap-4 bg-primary hover:bg-black text-white pl-6 pr-2 py-2 rounded-full transition-all group cursor-pointer"
              >
                <span className="text-[0.8rem] md:text-base font-medium">
                  {card.buttonText}
                </span>
                <div className="bg-primary p-2 rounded-full flex items-center justify-center group-hover:bg-dark">
                  <ArrowUpRight size={18} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION FOUR: Final CTA */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-[60px]">
        <div className="relative w-full min-h-[400px] rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 text-center border border-gray-100 bg-gradient-to-br from-secondary via-secondary to-secondary">
          <div className="absolute -bottom-33 right-0 w-32 h-32 md:w-96 md:h-96 opacity-80 pointer-events-none hidden sm:block">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design%20(2).png"
              alt=""
            />
          </div>
          <div className="absolute -bottom-36 left-0 w-32 h-32 md:w-96 md:h-96 opacity-80 pointer-events-none hidden sm:block">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design%20(3).png"
              alt=""
            />
          </div>

          <div className="relative z-10  flex flex-col gap-6 justify-center items-center">
            <h2 className="text-2xl lg:text-3xl font-semibold text-dark leading-tight">
              From compliance to strategy — strengthen your finance function
              end-to-end
            </h2>
            <p className="text-textlight text-[15px] md:text-lg max-w-2xl">
              Our experts ensure a smooth, accurate, and hassle-free
              process{" "}
            </p>
            <span className="font-semibold text-2xl md:text-3xl text-dark">
              where CLARITY meets GROWTH
            </span>

            <div className="md:bg-white rounded-full md:p-2 flex items-center justify-center lg:justify-between shadow-xl border border-white w-auto lg:max-w-2xl">
              <span className="text-[13px] md:text-base px-4 font-medium text-dark hidden md:block">
                Get started with professional assistance
              </span>
              <button
                onClick={() => setPopupOpen(true)}
                className="flex items-center gap-3 bg-primary hover:bg-black text-white px-5 md:pl-8 py-3 rounded-full transition-all cursor-pointer"
              >
                <span className="text-[14px]">Get Your Assistance</span>
                <ArrowUpRight
                  className="bg-white text-black rounded-full p-1"
                  size={25}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <EnquiryPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        initialService={""}
      />
    </div>
    </>
  );
};

export default Contact;
