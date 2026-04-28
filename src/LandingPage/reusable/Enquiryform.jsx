import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { servicesData } from "../data/servicesData";
import { Headphones } from "lucide-react";
import api from "@src/providers/api";

/* 
  Safely build flat list of all services – skip any missing subcategories, 
  services arrays, or invalid service objects.
*/
const today = new Date();
const schemeEndDate = new Date("2026-07-15");

// This service will be included ONLY if today < schemeEndDate
const SCHEME_SERVICE = {
  serviceId: "scheme-2026",
  name: "Companies Compliance Facilitation Scheme, 2026",
};

// ✅ New service to be added under "GST Return Filing Services in India"
const GSTR_2B_SERVICE = {
  serviceId: "gstr-2b-recon",
  name: "GSTR 2B Reconciliation",
};

const GST_REFUND_SERVICE = {
  serviceId: "gst-refund",
  name: "GST Refund",
};

// Build base flat list – conditionally include SCHEME_SERVICE
let baseServices = [
  ...(today < schemeEndDate ? [SCHEME_SERVICE] : []),
  ...(servicesData || [])
    .flatMap((cat) => cat?.subcategories ?? [])
    .flatMap((sub) => sub?.services ?? [])
    .filter((service) => service && typeof service.name === "string"),
];

// ✅ Insert GSTR_2B_SERVICE right after "GST Return Filing Services in India"
const TARGET_SERVICE_NAME = "GST Return Filing Services in India";
const targetIndex = baseServices.findIndex(
  (s) => s.name === TARGET_SERVICE_NAME
);

const ALL_SERVICES = [...baseServices];
if (targetIndex !== -1) {
  ALL_SERVICES.splice(targetIndex + 1, 0, GSTR_2B_SERVICE,  GST_REFUND_SERVICE);
} else {
  ALL_SERVICES.push(GSTR_2B_SERVICE);
}

const Enquiryform = ({ initialService = "" }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceRequired: initialService,
    comments: "",
  });

  /* Sync if initialService changes (e.g., popup re-opened on a different page) */
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, serviceRequired: initialService }));
    }
  }, [initialService]);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dropdownRef = useRef();

  /*
  ─────────────────────────────────
  CLOSE DROPDOWN ON OUTSIDE CLICK
  ─────────────────────────────────
  */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
  ─────────────────────────────────
  HANDLE CHANGE
  ─────────────────────────────────
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*
  ─────────────────────────────────
  SUBMIT FORM
  ─────────────────────────────────
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const res = await api.post(
        "/forms/enquiry",
        formData
      );
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          serviceRequired: "",
          comments: "",
        });

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || "Failed to submit enquiry"
      );
      setTimeout(() => {
        setErrorMsg("");
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  /*
  ─────────────────────────────────
  FILTER SERVICES BY SEARCH (safe)
  ─────────────────────────────────
  */
  const filteredServices = ALL_SERVICES.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-auto justify-center mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white relative rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-primary px-6 rounded-t-2xl py-4 flex items-center gap-3">
         <Headphones className="w-8 h-8 text-white" />
          <div>
            <h3 className="font-semibold text-white">
              Get Your Compliance Support
            </h3>
            <p className="text-sm text-gray-200">
              We’re here to assist you quickly ⚡
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              className="mt-1 w-full bg-gray-100 text-gray-600 border border-gray-200 placeholder:text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3">
            {/* Email */}
            <div className="w-full">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="mt-1 w-full bg-gray-100 text-gray-600 border placeholder:text-gray-700 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Phone */}
            <div className="w-full">
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Your Phone No"
                className="mt-1 w-full bg-gray-100 text-gray-600 border placeholder:text-gray-700 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Custom Service Dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="text-sm text-gray-600">Service Required</label>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="mt-1 w-full bg-gray-100 border border-gray-200 placeholder:text-gray-700 rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center"
            >
              <span
                className={
                  formData.serviceRequired ? "text-gray-900" : "text-gray-700"
                }
              >
                {formData.serviceRequired || "Select a Service"}
              </span>
              <span>
                <MdKeyboardArrowDown />
              </span>
            </div>

            {showDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border placeholder:text-gray-700 border-gray-200 rounded-lg shadow-lg">
                {/* Search */}
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md placeholder:text-gray-700 text-sm focus:outline-none"
                  />
                </div>

                {/* Services List */}
                <div className="lg:max-h-70 h-52 overflow-y-auto">
                  {filteredServices.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No services found
                    </div>
                  )}
                  {filteredServices.map((service) => (
                    <div
                      key={service.serviceId}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          serviceRequired: service.name,
                        });
                        setShowDropdown(false);
                        setSearch("");
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-gray-600 cursor-pointer text-sm"
                    >
                      {service.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="text-sm text-gray-600">Comments</label>
            <textarea
              rows="3"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter Your Comments Here"
              className="mt-1 w-full border text-gray-600 border-gray-200 bg-gray-100 placeholder:text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-sm transition
            ${
              loading
                ? "bg-gray-400"
                : success
                ? "bg-green-600"
                : "bg-primary hover:bg-primary/90"
            } text-white`}
          >
            {loading
              ? "Submitting..."
              : success
              ? "Submitted Successfully ✓"
              : "Enquire Now"}
          </button>

          {/* Messages */}
          {success && (
            <p className="text-green-600 text-sm text-center">
              Your enquiry was submitted successfully.
            </p>
          )}
          {errorMsg && (
            <p className="text-primary text-sm text-center">{errorMsg}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Enquiryform;