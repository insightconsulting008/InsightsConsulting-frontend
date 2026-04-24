// UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../providers/api";

/* ─── Icons ─────────────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════ */
export default function UserLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form, { withCredentials: true });
      const { success, token, userId, message } = res.data;

      if (!success) {
        setError(message || "Invalid email or password");
        return;
      }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userId);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Server error. Please try again later.");
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="w-11 h-11 bg-[#f13c20] rounded-xl flex items-center justify-center mb-4 mx-auto shadow-sm">
            <UserIcon />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Welcome back</h1>
          <p className="text-sm text-neutral-500 mt-1.5">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">

          {/* Global error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={`w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border ${
                    errors.email ? "border-red-300 bg-red-50" : "border-neutral-200 bg-white"
                  } text-neutral-800 outline-none focus:border-[#f13c20] focus:ring-2 focus:ring-[#f13c20]/10 transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-8 pr-10 py-2.5 text-sm rounded-xl border ${
                    errors.password ? "border-red-300 bg-red-50" : "border-neutral-200 bg-white"
                  } text-neutral-800 outline-none focus:border-[#f13c20] focus:ring-2 focus:ring-[#f13c20]/10 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs text-[#f13c20] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#f13c20] text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm hover:shadow-md mt-2"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}