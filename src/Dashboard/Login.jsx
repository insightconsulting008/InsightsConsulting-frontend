import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../providers/api";

/* ─── Icons ───────────────────────────────────────── */
const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-10-7-10-7a21.77 21.77 0 0 1 5.06-6.94"/>
    <path d="M1 1l22 22"/>
  </svg>
);

/* ═══════════════════════════════════════════════════ */
export default function UserLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | forgot
  const [showPassword, setShowPassword] = useState(false);

  /* ─── Input Change ─────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  /* ─── Validation ─────────────────────────────── */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (mode === "login" && !form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ─── LOGIN ─────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/login", form);

      const { success, message } = res.data;

      if (!success) {
        setError(message || "Invalid credentials");
        return;
      }

      // ✅ Cookie handles auth — no localStorage

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ─── FORGOT PASSWORD ─────────────────────────────── */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email: form.email,
      });

      setSuccess(
        res.data.message ||
        "If the email exists, a reset link has been sent."
      );

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ─── UI ─────────────────────────────── */
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-800">
            {mode === "login" ? "Welcome back" : "Forgot Password"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {mode === "login"
              ? "Sign in to your account"
              : "Enter your email to receive reset link"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">

          {/* SUCCESS */}
          {success && (
            <div className="mb-3 text-sm text-green-600 bg-green-50 border border-green-100 p-3 rounded">
              {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={mode === "login" ? handleLogin : handleForgotPassword}
            className="space-y-4"
          >

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            {mode === "login" && (
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}

                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-[#f13c20]"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f13c20] text-white py-2 rounded flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Processing...
                </>
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* Back */}
            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-gray-500 w-full mt-2"
              >
                Back to login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}