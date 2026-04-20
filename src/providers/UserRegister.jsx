import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "@src/providers/axiosInstance";

/* ─── Icons ───────────────────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2 .18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ─── Input Field Component ─────────────────────────────────────────── */
function InputField({ icon: Icon, label, type = "text", name, value, onChange, error, required = true }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          {Icon && <Icon />}
        </div>
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full pl-10 pr-${isPassword ? "10" : "4"} py-3 rounded-xl border ${
            error ? "border-error-300 bg-error-50" : "border-neutral-200 bg-white"
          } text-neutral-800 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary-100`}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-error-600 mt-1">{error}</p>}
    </div>
  );
}

/* ─── Alert Component ───────────────────────────────────────────────── */
function Alert({ type, message }) {
  if (!message) return null;

  const styles = {
    error: "bg-error-50 border-error-200 text-error-700",
    success: "bg-success-50 border-success-200 text-success-700",
    info: "bg-info-50 border-info-200 text-info-700",
  };

  const icons = { error: "⚠️", success: "✓", info: "ℹ️" };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${styles[type]}`}>
      <span className="font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function UserRegister() {
  const navigate = useNavigate();
   

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email/password registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setApiError("");

    try {
      const utmData = JSON.parse(localStorage.getItem('utmData')) || {};
      const payload = {
      ...formData,
      ...utmData,
    };
      const response = await axiosInstance.post("/auth/user/register", payload, {
      withCredentials: true,
    });

      if (response.data.success) {
        localStorage.removeItem('utmData');
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        window.location.href = "/user-dashboard";
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setApiError(err.response.data.message || "All fields are required");
            break;
          case 409:
            setApiError("This email is already registered. Please use a different email or login.");
            break;
          case 500:
            setApiError("Server error. Please try again later.");
            break;
          default:
            setApiError(err.response.data.message || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        setApiError("Network error. Please check your internet connection.");
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
  setApiError("");
  setGoogleLoading(true);
  try {
    // Read UTM data directly from localStorage
    const utmData = JSON.parse(localStorage.getItem('utmData')) || {};

    const payload = {
      token: credentialResponse.credential,
      ...utmData,
    };

    const res = await axiosInstance.post("/google/google-auth", payload);

    // Clear after successful Google registration
    localStorage.removeItem('utmData');

    const { accessToken, role, userId } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("role", role);
    if (userId) localStorage.setItem("userId", userId);

    window.location.href = "/user-dashboard";
  } catch (err) {
    console.error("Google Login Error", err);
    setApiError(
      err?.response?.data?.message ||
      "Google sign-up failed. Please try again."
    );
  } finally {
    setGoogleLoading(false);
  }
};

  const handleGoogleError = () => {
    setApiError("Google sign-up was unsuccessful. Please try again.");
  };
  // ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-neutral-50 flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .register-card {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      <div className="register-card w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Create an Account</h1>
          <p className="text-sm text-neutral-500 mt-2">Join us today! Fill in your details to get started.</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 md:p-8">
          {/* API Error Alert */}
          <Alert type="error" message={apiError} />

          {/* Loading States */}
          {!apiError && loading && (
            <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
              <SpinnerIcon />
              <span>Creating your account...</span>
            </div>
          )}
          {googleLoading && (
            <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
              <SpinnerIcon />
              <span>Signing up with Google...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <InputField icon={UserIcon} label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />

            {/* Email Field */}
            <InputField icon={MailIcon} label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />

            {/* Phone Field */}
            <InputField icon={PhoneIcon} label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} placeholder="10-digit mobile number" />

            {/* Password Field */}
            <InputField icon={LockIcon} label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} />

            {/* Password Requirements */}
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
              <p className="text-xs font-medium text-neutral-600 mb-2">Password must contain:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? "bg-success-500" : "bg-neutral-300"}`}></span>
                  <span className={formData.password.length >= 6 ? "text-success-600" : "text-neutral-500"}>At least 6 characters</span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*[A-Za-z])/.test(formData.password) ? "bg-success-500" : "bg-neutral-300"}`}></span>
                  <span className={/(?=.*[A-Za-z])/.test(formData.password) ? "text-success-600" : "text-neutral-500"}>At least one letter</span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*\d)/.test(formData.password) ? "bg-success-500" : "bg-neutral-300"}`}></span>
                  <span className={/(?=.*\d)/.test(formData.password) ? "text-success-600" : "text-neutral-500"}>At least one number</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

             {/* ─── Google Sign-Up ───────────────────────────────────── */}
            <div className={`flex justify-center transition-opacity ${googleLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="400"
                size="large"
                theme="outline"
                type="standard"
                text="signup_with"
              />
            </div>

             {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-neutral-400">or sign up with</span>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-neutral-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-hover font-semibold">
                Sign in
              </Link>
            </p>

           

           
          </form>
        </div>
      </div>
    </div>
  );
}