// UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const InboxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
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

/* ─── Forgot Password Modal ─────────────────────────────────────────── */
function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (emailError) setEmailError('')
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      await axiosInstance.post('/user/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('No account found with this email address.')
            break
          case 429:
            setError('Too many requests. Please try again later.')
            break
          case 500:
            setError('Server error. Please try again later.')
            break
          default:
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        .modal-card { animation: modalIn 0.25s ease-out; }
      `}</style>

      <div className="modal-card w-full max-w-sm bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Reset Password</h2>
            <p className="text-xs text-neutral-500 mt-0.5">We'll send a reset link to your email</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg p-1.5 transition-all"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Success State */}
          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 text-success-600 mb-4">
                <InboxIcon />
              </div>
              <h3 className="text-base font-semibold text-neutral-800 mb-2">Check your Mail!</h3>
              <p className="text-sm text-neutral-500 mb-1">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-primary mb-4 break-all">{email}</p>
              <p className="text-xs text-neutral-400 mb-6">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => { setSuccess(false); setEmail('') }}
                  className="text-primary hover:text-primary-hover font-medium underline underline-offset-2 transition-colors"
                >
                  try again
                </button>
                .
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert type="error" message={error} />

              <InputField
                icon={MailIcon}
                label="Email Address"
                type="email"
                name="forgot-email"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
              />

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-neutral-200 text-neutral-600 rounded-xl font-semibold text-sm hover:bg-neutral-50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function UserLogin() {
  const navigate = useNavigate()
  const { loginUser } = useAuth()

  // Form state
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false)

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
      const res = await axiosInstance.post("/user/login", form, {
        withCredentials: true
      })
      
      const { accessToken, role, userId } = res.data

      if (role === "USER") {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('userId', userId)
        loginUser(accessToken, role, userId)
        setTimeout(() => {
          navigate("/user-dashboard")
        }, 500)
      } else {
        setError("Access denied. Use the admin login portal.")
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Invalid email or password")
            break
          case 404:
            setError("User not found")
            break
          case 500:
            setError("Server error. Please try again later.")
            break
          default:
            setError(err?.response?.data?.message || "Invalid email or password")
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

  // ─── Google Auth Handlers ──────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("")
    setGoogleLoading(true)
    try {
      const res = await axiosInstance.post(
        "/user/google-auth",
        { token: credentialResponse.credential }
      )

      const { accessToken, role, userId } = res.data

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("role", role)
      if (userId) localStorage.setItem("userId", userId)

      loginUser(accessToken, role, userId)
      navigate("/user-dashboard")
    } catch (err) {
      console.error("Google Login Error", err)
      setError(
        err?.response?.data?.message ||
        "Google sign-in failed. Please try again."
      )
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError("Google sign-in was unsuccessful. Please try again.")
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}

      <div className="login-card w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <UserIcon />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Welcome Back!</h1>
          <p className="text-sm text-neutral-500 mt-2">Sign in to continue to your account</p>
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

          <form onSubmit={handleLogin} className="space-y-5">
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

            {/* Forgot Password Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Forgot Password?
              </button>
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
                'Sign In'
              )}
            </button>

            {/* ─── Google Login Button ──────────────────────────────────── */}
            <div className="w-full flex justify-center">
              <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>iframe]:w-full [&>div>div>div]:!w-full [&>div>div>div>div]:!w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  logo_alignment="left"
                  width="100%"
                  locale="en"
                />
              </div>
            </div>

            {/* Register Link */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-neutral-500">New to our platform?</span>
              </div>
            </div>

            <Link
              to="/register"
              className="w-full py-3.5 px-4 bg-white text-primary rounded-xl font-semibold text-sm border-2 border-primary hover:bg-primary-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <UserIcon />
              Create New Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}