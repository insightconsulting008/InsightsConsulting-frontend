// EmployeeResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

/* ─── Icons ───────────────────────────────────────────────────────────── */
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
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const ShieldOffIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"/><path d="M4.73 4.73 4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
)

/* ─── Input Field Component ─────────────────────────────────────────── */
function InputField({ icon: Icon, label, value, onChange, error, name }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700">
        {label} <span className="text-error-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon />
        </div>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
            error ? 'border-error-300 bg-error-50' : 'border-neutral-200 bg-white'
          } text-neutral-800 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary-100`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-error-600 flex items-center gap-1 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

/* ─── Alert Component ───────────────────────────────────────────────── */
function Alert({ type, message }) {
  if (!message) return null
  const styles = {
    error: 'bg-error-50 border-error-200 text-error-700',
    success: 'bg-success-50 border-success-200 text-success-700',
  }
  const icons = { error: '⚠️', success: '✓' }
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${styles[type]}`}>
      <span className="font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
    </div>
  )
}

/* ─── Invalid Token Page ────────────────────────────────────────────── */
function InvalidTokenPage({ redirectTo, redirectLabel, icon: Icon }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .reset-card { animation: fadeIn 0.4s ease-out; }
      `}</style>
      <div className="reset-card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <Icon />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Reset Password</h1>
          <p className="text-sm text-neutral-500 mt-2">Password reset verification</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 md:p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-50 text-error-500 mb-4">
            <ShieldOffIcon />
          </div>
          <h3 className="text-base font-semibold text-neutral-800 mb-2">Invalid or Expired Link</h3>
          <p className="text-sm text-neutral-500 mb-6">
            This password reset link is invalid or has already expired. Please request a new reset link from the login page.
          </p>
          <button
            onClick={() => navigate(redirectTo)}
            className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {redirectLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Password requirement row ───────────────────────────────────────── */
function Requirement({ met, label }) {
  return (
    <li className={`flex items-center gap-1.5 transition-colors ${met ? 'text-success-600' : 'text-neutral-400'}`}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {met ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
      </svg>
      {label}
    </li>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
function EmployeeResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get("token")

  const [form, setForm] = useState({ password: "", confirm: "" })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ── Invalid token guard ──
  if (!token) {
    return <InvalidTokenPage redirectTo="/admin/login" redirectLabel="Back to Admin Sign In" icon={AdminIcon} />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (error) setError('')
  }

  const validate = () => {
    const newErrors = {}
    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 8) {
      newErrors.password = 'Must be at least 8 characters'
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Must contain at least one uppercase letter'
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Must contain at least one number'
    }
    if (!form.confirm) {
      newErrors.confirm = 'Please confirm your password'
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReset = async (e) => {
    e?.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      await axiosInstance.post("/staff/reset-password", { token, newPassword: form.password })
      setSuccess(true)
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400: setError('Reset link is invalid or has expired.'); break
          case 404: setError('Staff account not found.'); break
          case 500: setError('Server error. Please try again later.'); break
          default: setError(err.response?.data?.message || 'Something went wrong. Please try again.')
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .reset-card { animation: fadeIn 0.4s ease-out; }
      `}</style>

      <div className="reset-card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <AdminIcon />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Set New Password</h1>
          <p className="text-sm text-neutral-500 mt-2">Choose a strong password for your staff account</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 md:p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 text-success-600 mb-4">
                <CheckIcon />
              </div>
              <h3 className="text-base font-semibold text-neutral-800 mb-2">Password Reset Successful!</h3>
              <p className="text-sm text-neutral-500 mb-6">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Go to Admin Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <Alert type="error" message={error} />

              {loading && (
                <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                  <SpinnerIcon />
                  <span>Updating your password...</span>
                </div>
              )}

              <InputField
                icon={LockIcon}
                label="New Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              {/* Live requirements checklist */}
              <ul className="text-xs space-y-1.5 pl-0.5 -mt-2">
                <Requirement met={form.password.length >= 8} label="At least 8 characters" />
                <Requirement met={/[A-Z]/.test(form.password)} label="One uppercase letter (A–Z)" />
                <Requirement met={/[0-9]/.test(form.password)} label="One number (0–9)" />
              </ul>

              <InputField
                icon={LockIcon}
                label="Confirm Password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                error={errors.confirm}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? <><SpinnerIcon />Resetting...</> : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeResetPassword;