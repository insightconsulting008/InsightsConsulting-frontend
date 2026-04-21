import { useState, useEffect } from "react";
import axiosInstance from "@src/providers/axiosInstance";

function PhonePopup({ onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Fetch user name when popup opens
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/user/settings/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(res.data.data.name || "User");
      } catch (error) {
        setUserName("User");
      }
    };
    fetchUserName();
  }, []);

  const handleSave = async () => {
    // Clear previous error
    setError("");

    // Validation
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      const res = await axiosInstance.post(
        "/user/settings/complete-profile",
        { phoneNumber },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Show success message
      setShowSuccess(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onClose(); // close popup
      }, 2000);
      
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Complete Your Profile
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-lg font-medium text-neutral-700 mb-2">
            Welcome{userName ? ` ${userName}` : ""} 👋
          </p>
          
          <div className="flex items-start gap-3 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-amber-500 text-xl shrink-0">⚠️</span>
            <p className="text-amber-700 text-sm leading-relaxed">
              Please add your phone number to complete your profile and access all features
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-600">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError(""); // Clear error when user types
                }}
                className={`w-full px-4 py-3 border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 
                         transition-all text-neutral-800 placeholder-neutral-400
                         ${error 
                           ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                           : 'border-neutral-200 focus:border-primary'
                         }`}
              />
              {/* Inline error message in red */}
              {error && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500 text-base">ⓘ</span>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={loading || showSuccess}
              className="w-full bg-primary hover:bg-primary-hover text-white 
                       font-medium py-3.5 px-4 rounded-xl transition-all 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl active:scale-[0.98]
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                "Save Phone Number"
              )}
            </button>

            <p className="text-xs text-neutral-400 text-center">
              We'll never share your phone number with anyone else
            </p>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Success!
              </h3>
              <p className="text-neutral-600">
                Your phone number has been saved successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhonePopup;