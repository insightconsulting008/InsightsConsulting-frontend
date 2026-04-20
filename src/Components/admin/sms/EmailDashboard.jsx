import axiosInstance from "@src/providers/axiosInstance";
import { useState, useEffect, useCallback } from "react";
import PageHeader from '../page-header/PageHeader';
import {
  Lock, Eye, EyeOff, X, Check, ShieldCheck, AlertCircle,
  Mail, RefreshCw, Send, Settings, Zap, FlaskConical,
  CloudLightning, Cloud, ArrowRight, Loader2, TriangleAlert,
  Info, CircleCheck, CircleX, KeyRound, AtSign,
} from "lucide-react";

/* ─── Toast ─────────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  return { toasts, success: (m) => add(m, "success"), error: (m) => add(m, "error") };
}

/* ─── Success Modal ──────────────────────────────────────────────────── */
function SuccessModal({ onClose, onGoToTest }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(10,15,28,0.55)" }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm bg-white overflow-hidden flex flex-col"
        style={{
          borderRadius: 24,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 24px 64px -12px rgba(0,0,0,0.22)",
          animation: "successIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Green top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #10b981, #34d399)" }} />

        {/* Body */}
        <div className="px-7 pt-7 pb-6 flex flex-col items-center text-center">
          {/* Animated check circle */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              animation: "popIn 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
              opacity: 0,
            }}
          >
            <svg viewBox="0 0 52 52" width="34" height="34" fill="none">
              <circle cx="26" cy="26" r="24" stroke="#10b981" strokeWidth="3" opacity="0.25" />
              <path
                d="M14 26 L22 34 L38 18"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 40,
                  strokeDashoffset: 40,
                  animation: "drawCheck 0.4s 0.35s ease-out forwards",
                }}
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-1">Configuration Saved!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-1">
            Your email provider is now active and ready to send.
          </p>
          <p className="text-sm font-medium text-emerald-600 mb-6">
            Ready to verify it works? Send a quick test email.
          </p>

          {/* Primary CTA — go to test tab */}
          <button
            onClick={onGoToTest}
            className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 mb-3 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <Send className="w-4 h-4" />
            Send a Test Email
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Maybe later
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: "#f3f4f6" }}>
          <div
            className="h-full"
            style={{
              background: "linear-gradient(to right, #10b981, #34d399)",
              animation: "progressBar 5s linear forwards",
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <style>{`
        @keyframes successIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes progressBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Password Confirm Modal ─────────────────────────────────────────── */
function PasswordModal({ onConfirm, onCancel, loading, modalError }) {
  const [profilePassword, setProfilePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(10,15,28,0.6)" }}
        onClick={!loading ? onCancel : undefined}
      />

      <div
        className="relative w-full max-w-sm bg-white overflow-hidden"
        style={{
          borderRadius: 20,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px -4px rgba(0,0,0,0.18), 0 32px 64px -16px rgba(0,0,0,0.14)",
          animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Accent bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--primary-500), var(--primary-400))" }} />

        {/* Header */}
        <div
          className="px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid var(--primary-50)", background: "linear-gradient(to bottom, var(--primary-50), #fff)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--primary-100)", color: "var(--primary-600)", boxShadow: "0 2px 8px rgba(239,68,68,0.15)" }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-tight">Confirm Save</h3>
                <p className="text-xs text-gray-400 mt-0.5">Authenticate to update email configuration</p>
              </div>
            </div>
            <button
              onClick={!loading ? onCancel : undefined}
              disabled={loading}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40 mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Enter your profile password to save the email configuration.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
              Profile Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your profile password"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && profilePassword.trim()) onConfirm(profilePassword);
                  if (e.key === "Escape" && !loading) onCancel();
                }}
                autoFocus
                style={{ borderRadius: 10 }}
                className="w-full h-11 pl-9 pr-10 border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:bg-white"
              />
              <button
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {modalError && (
            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={{ background: "var(--error-50)", border: "1px solid var(--error-100)", color: "var(--error-700)" }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {modalError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            style={{ borderRadius: 10 }}
            className="flex-1 h-11 border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(profilePassword)}
            disabled={loading || !profilePassword.trim()}
            style={{ borderRadius: 10, background: "var(--primary-500)" }}
            className="flex-1 h-11 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:opacity-90"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : (
              <><Check className="w-4 h-4" /> Save</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────── */
export default function EmailDashboard() {
  const [tab, setTab] = useState("config");
  const { toasts, success, error } = useToast();

  const employeeId = localStorage.getItem("employeeId");

  const [provider, setProvider] = useState("resend");
  const [cfg, setCfg] = useState({
    apiKey: "", accessKey: "", secretKey: "",
    region: "", fromEmail: "",
  });

  // Lifted show/hide state for sensitive fields — prevents focus loss on remount
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Inline validation error
  const [validationError, setValidationError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const [testEmail, setTestEmail] = useState("");
  const [testLoading, setTestLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/email/event`);
      if (response.data.success) setEvents(response.data.data);
    } catch (err) {
      if (err.response) error(err.response.data.message || "Failed to load events");
      else if (err.request) error("Network error: No response received");
      else error("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "events") fetchEvents();
  }, [tab]);

  const handleSaveClick = () => {
    setValidationError("");
    if (provider === "resend") {
      if (!cfg.apiKey.trim()) return setValidationError("API Key is required.");
    } else {
      if (!cfg.accessKey.trim()) return setValidationError("Access Key is required.");
      if (!cfg.secretKey.trim()) return setValidationError("Secret Key is required.");
      if (!cfg.region.trim()) return setValidationError("Region is required.");
    }
    if (!cfg.fromEmail.trim()) return setValidationError("From Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.fromEmail))
      return setValidationError("Please enter a valid From Email address.");
    setModalError("");
    setShowPasswordModal(true);
  };

 const handleConfirmSave = async (profilePassword) => {
  setModalLoading(true);
  setModalError("");
  try {
    const response = await axiosInstance.post(`/admin/email/config`, {
      ...cfg, provider, employeeId, profilePassword,
    });
    if (response.data.success) {
      setShowPasswordModal(false);
      setShowSuccessModal(true);
      
      // Clear only specific fields after successful save
      if (provider === "resend") {
        setCfg(prev => ({
          ...prev,
          apiKey: "", // Clear only API key, keep fromEmail
        }));
      } else {
        setCfg(prev => ({
          ...prev,
          accessKey: "",
          secretKey: "",
          region: "",
          // Keep fromEmail
        }));
      }
    } else {
      setModalError(response.data.message || "Failed to save");
    }
  } catch (err) {
    if (err.response) setModalError(err.response.data.message || "Failed to save");
    else if (err.request) setModalError("Network error: No response received");
    else setModalError("Network error");
  } finally {
    setModalLoading(false);
  }
};

  const handleTestEmail = async () => {
    setTestLoading(true);
    try {
      const response = await axiosInstance.post(`/admin/email/test`, { email: testEmail });
      response.data.success
        ? success("Test email sent!")
        : error(response.data.message || "Failed to send");
    } catch (err) {
      if (err.response) error(err.response.data.message || "Failed to send");
      else if (err.request) error("Network error: No response received");
      else error("Network error");
    } finally {
      setTestLoading(false);
    }
  };

  const handleToggleEvent = async (name, enabled) => {
    setEvents((ev) => ev.map((e) => (e.name === name ? { ...e, enabled } : e)));
    try {
      await axiosInstance.post(`/email/event/toggle`, { name, enabled });
      success(`${name} ${enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      if (err.response) error(err.response.data.message || "Toggle failed");
      else if (err.request) error("Network error: No response received");
      else error("Toggle failed");
      fetchEvents();
    }
  };

  const tabs = [
    { id: "config", label: "Config",  icon: Settings     },
    { id: "events", label: "Events",  icon: Zap          },
    { id: "test",   label: "Test",    icon: FlaskConical  },
  ];

  const primary = "var(--primary-500)";
  const primaryHover = "var(--primary-600)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800 font-sans">
      <PageHeader
        title="Email Configuration"
        subtitle="Manage your email provider, events, and sending settings"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-5 sm:mb-7 shadow-sm w-full sm:w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2 rounded-[9px] text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              style={
                tab === id
                  ? { background: primary, color: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.1)" }
                  : { color: "#6b7280" }
              }
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── CONFIG ── */}
        {tab === "config" && (
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-7 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 sm:mb-5">
                Provider
              </p>

              {/* Provider selector */}
              <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
                {[
                  { id: "resend", label: "Resend",  Icon: CloudLightning },
                  { id: "ses",    label: "AWS SES", Icon: Cloud          },
                ].map(({ id: p, label, Icon }) => (
                  <button
                    key={p}
                    onClick={() => { setProvider(p); setValidationError(""); }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2"
                    style={
                      provider === p
                        ? { borderColor: "var(--primary-300)", background: "var(--primary-50)", color: "var(--primary-700)" }
                        : { borderColor: "#e5e7eb", background: "#fff", color: "#6b7280" }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                {/* Resend */}
                {provider === "resend" && (
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-gray-400" /> API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        placeholder="re_xxxxxxxxxxxx"
                        value={cfg.apiKey}
                        onChange={(e) => { setCfg((p) => ({ ...p, apiKey: e.target.value })); setValidationError(""); }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* SES */}
                {provider === "ses" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-gray-400" /> Access Key
                      </label>
                      <input
                        type="text"
                        placeholder="AKIA..."
                        value={cfg.accessKey}
                        onChange={(e) => { setCfg((p) => ({ ...p, accessKey: e.target.value })); setValidationError(""); }}
                        className="bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-gray-400" /> Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showSecretKey ? "text" : "password"}
                          placeholder="Secret access key"
                          value={cfg.secretKey}
                          onChange={(e) => { setCfg((p) => ({ ...p, secretKey: e.target.value })); setValidationError(""); }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretKey((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5 text-gray-400" /> Region
                      </label>
                      <input
                        type="text"
                        placeholder="us-east-1"
                        value={cfg.region}
                        onChange={(e) => { setCfg((p) => ({ ...p, region: e.target.value })); setValidationError(""); }}
                        className="bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400 transition-all"
                      />
                    </div>
                  </>
                )}

                {/* From Email — always shown */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-gray-400" /> From Email
                  </label>
                  <input
                    type="email"
                    placeholder="noreply@yourdomain.com"
                    value={cfg.fromEmail}
                    onChange={(e) => { setCfg((p) => ({ ...p, fromEmail: e.target.value })); setValidationError(""); }}
                    className="bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Inline validation error */}
              {validationError && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm mt-4"
                  style={{ background: "var(--error-50)", border: "1px solid var(--error-100)", color: "var(--error-700)" }}
                >
                  <TriangleAlert className="w-4 h-4 flex-shrink-0" />
                  {validationError}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setCfg({ apiKey: "", accessKey: "", secretKey: "", region: "", fromEmail: "" });
                  setValidationError("");
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300 transition-colors shadow-sm"
              >
                Reset
              </button>
              <button
                onClick={handleSaveClick}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: primary }}
              >
                <Check className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </div>
        )}

        {/* ── EVENTS ── */}
        {tab === "events" && (
          <div>
            <div
              className="rounded-xl px-3 sm:px-4 py-3 text-sm mb-4 sm:mb-5 flex items-start sm:items-center gap-2"
              style={{ background: "var(--primary-50)", border: "1px solid var(--primary-100)", color: "var(--primary-700)" }}
            >
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Events are created when you save a configuration. Toggle to control active notifications.</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Email Events ({events.length})
                </p>
                <button
                  onClick={fetchEvents}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>

              {eventsLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading events…
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-gray-400 text-sm gap-2">
                  <Mail className="w-8 h-8 text-gray-200" />
                  No events found. Save a configuration first.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {events.map((ev) => (
                    <div key={ev.name} className="flex items-center justify-between py-3 sm:py-3.5 gap-2">
                      <span className="font-mono text-xs sm:text-sm text-gray-700 truncate mr-2">{ev.name}</span>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span
                          className="text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium hidden sm:inline-flex items-center gap-1"
                          style={
                            ev.enabled
                              ? { background: "var(--success-50)", color: "var(--success-700)", border: "1px solid var(--success-100)" }
                              : { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" }
                          }
                        >
                          {ev.enabled
                            ? <><CircleCheck className="w-3 h-3" /> Active</>
                            : <><CircleX className="w-3 h-3" /> Off</>
                          }
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ev.enabled}
                            onChange={(e) => handleToggleEvent(ev.name, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div
                            className="w-10 h-5 rounded-full transition-colors relative"
                            style={{ background: ev.enabled ? "var(--primary-200)" : "#e5e7eb" }}
                          >
                            <div
                              className="absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-sm"
                              style={{
                                left: ev.enabled ? "1.25rem" : "0.125rem",
                                background: ev.enabled ? "var(--primary-500)" : "#fff",
                                border: ev.enabled ? "none" : "1px solid #d1d5db",
                              }}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TEST ── */}
        {tab === "test" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-7 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Send Test Email</p>
            <p className="text-sm text-gray-500 mb-5 sm:mb-6">
              Verify your email configuration is working correctly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-gray-400" />
                  Recipient Email
                </label>
                <input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400 transition-all"
                />
              </div>
              <button
                onClick={handleTestEmail}
                disabled={testLoading || !testEmail}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60 shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: primary }}
              >
                {testLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  : <><Send className="w-4 h-4" /> Send Test</>
                }
              </button>
            </div>
          </div>
        )}

        {/* Toast notifications */}
        <div className="fixed bottom-4 sm:bottom-7 left-4 right-4 sm:left-auto sm:right-7 flex flex-col gap-2 z-50 items-stretch sm:items-end">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm"
              style={
                t.type === "success"
                  ? { background: "#fff", border: "1px solid var(--success-100)", color: "var(--success-700)" }
                  : { background: "#fff", border: "1px solid var(--error-100)", color: "var(--error-700)" }
              }
            >
              {t.type === "success"
                ? <CircleCheck className="w-4 h-4 flex-shrink-0" style={{ color: "var(--success-600)" }} />
                : <CircleX className="w-4 h-4 flex-shrink-0" style={{ color: "var(--error-600)" }} />
              }
              {t.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <PasswordModal
          onConfirm={handleConfirmSave}
          onCancel={() => { setShowPasswordModal(false); setModalError(""); }}
          loading={modalLoading}
          modalError={modalError}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          onGoToTest={() => {
            setShowSuccessModal(false);
            setTab("test");
          }}
        />
      )}
    </div>
  );
}