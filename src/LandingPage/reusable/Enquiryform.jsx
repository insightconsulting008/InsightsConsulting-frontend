import React, { useState } from "react";
import axios from "axios";

const Enquiryform = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceRequired: "",
    comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(false);
  setErrorMsg("");

  try {
    const res = await axios.post(
      "https://insightsconsult-backend.onrender.com/enquiry",
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

      // ✅ Reset success message after 4 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  } catch (error) {
    console.error(error);

    setErrorMsg(
      error.response?.data?.message || "Failed to submit enquiry"
    );

    // ❌ Reset error message after 4 seconds
    setTimeout(() => {
      setErrorMsg("");
    }, 4000);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex w-auto justify-center lg:justify-end">
      <form
        onSubmit={handleSubmit}
        className="bg-white relative rounded-2xl shadow-xl overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-blue-100 px-6 py-4 flex items-center gap-3">
          <img
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/call.png"
            className="w-12"
            alt=""
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              Get Expert Compliance Support
            </h3>
            <p className="text-sm text-gray-600">
              We’re here to assist you quickly ⚡
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              className="mt-1 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email Address"
              className="mt-1 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Your Phone Number"
              className="mt-1 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Service Required</label>
            <input
              type="text"
              name="serviceRequired"
              required
              value={formData.serviceRequired}
              onChange={handleChange}
              placeholder="Enter the service you need"
              className="mt-1 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Comments</label>
            <textarea
              rows="3"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter Your Comments Here"
              className="mt-1 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-sm transition
              ${
                loading
                  ? "bg-gray-400"
                  : success
                  ? "bg-green-600"
                  : "bg-red hover:bg-red-700"
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
            <p className="text-red-600 text-sm text-center">
              {errorMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Enquiryform;