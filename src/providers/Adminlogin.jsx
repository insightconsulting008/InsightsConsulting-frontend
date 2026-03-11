// AdminLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { useAuth } from "./AuthContext";

/* ─── Icons ───────────────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
)
const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    <path d="M17 11l2 2 4-4"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

/* ─── Input Field Component ─────────────────────────────────────────── */
function InputField({ icon: Icon, label, type = 'text', name, value, onChange, error, required = true }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

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
          className={`w-full pl-10 pr-${isPassword ? '10' : '4'} py-3 rounded-xl border ${
            error ? 'border-error-300 bg-error-50' : 'border-neutral-200 bg-white'
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
  )
}

/* ─── Alert Component ───────────────────────────────────────────────── */
function Alert({ type, message }) {
  if (!message) return null
  
  const styles = {
    error: 'bg-error-50 border-error-200 text-error-700',
    success: 'bg-success-50 border-success-200 text-success-700',
    info: 'bg-info-50 border-info-200 text-info-700'
  }

  const icons = {
    error: '⚠️',
    success: '✓',
    info: 'ℹ️'
  }

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${styles[type]}`}>
      <span className="font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminLogin() {
  const navigate = useNavigate()
  const { loginEmployee } = useAuth()

  // Form state
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) setError('')
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!form.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle email/password login
  const handleLogin = async (e) => {
    e?.preventDefault()
    if (!validateForm()) return

    setError("")
    setLoading(true)

    try {
      const res = await axiosInstance.post("/staff/login", form, {
        withCredentials: true
      })
      
      const { accessToken, role, employeeId } = res.data

      // Store credentials
      localStorage.setItem('accessToken', accessToken)
      if (employeeId) localStorage.setItem('employeeId', employeeId)
      
      // Update auth context
      loginEmployee(accessToken, role, employeeId)

      // Navigate based on role
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin-dashboard")
        } else if (role === "STAFF") {
          navigate("/staff/dashboard")
        } else {
          setError("Unrecognized role. Please contact support.")
        }
      }, 500)
      
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Invalid email or password")
            break
          case 404:
            setError("Staff account not found")
            break
          case 500:
            setError("Server error. Please try again later.")
            break
          default:
            setError(err?.response?.data?.message || "Invalid staff/admin credentials")
        }
      } else if (err.request) {
        setError("Network error. Please check your internet connection.")
      } else {
        setError("An unexpected error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  // ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .welcome-text {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <div className="login-card w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <AdminIcon />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Admin Portal</h1>
          <p className="text-sm text-neutral-500 mt-2">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 md:p-8">
          
          {/* Error Alert */}
          <Alert type="error" message={error} />

          {/* Loading States */}
          {loading && (
            <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
              <SpinnerIcon />
              <span>Signing you in...</span>
            </div>
          )}
          {googleLoading && (
            <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
              <SpinnerIcon />
              <span>Signing in with Google...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 mt-3">
            {/* Email Field */}
            <InputField
              icon={MailIcon}
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password Field */}
            <InputField
              icon={LockIcon}
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/admin-forgot-password" 
                className="text-xs text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Forgot Password?
              </Link>
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
                  Signing In...
                </>
              ) : (
                'Sign In to Admin'
              )}
            </button>

          
          </form>
        </div>
      </div>
    </div>
  )
}