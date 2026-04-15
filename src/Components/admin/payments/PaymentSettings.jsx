import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@src/providers/axiosInstance";

const API_BASE = "/api";
const WEBHOOK_SUFFIX = "/razorpay/webhook";

// ─── Icons ───────────────────────────────────────────────────
const CardIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const PlusIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const XIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
  </svg>
);
const EyeIcon = ({ size = 14, off = false }) => off ? (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const TrashIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);
const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const AlertIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const LockIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const SpinIcon = ({ size = 14 }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);
const GlobeIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const KeyIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const MailIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const ZapIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ─── Toggle ──────────────────────────────────────────────────
function Toggle({ value, onChange, size = "sm", disabled = false }) {
  const lg = size === "lg";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        background: value ? "#e53e3e" : "#e5e7eb",
        width: lg ? 44 : 36,
        height: lg ? 24 : 20,
      }}
    >
      <span
        className="inline-block rounded-full bg-white shadow transition-transform duration-200"
        style={{
          width: lg ? 20 : 16,
          height: lg ? 20 : 16,
          transform: value ? `translateX(${lg ? 20 : 16}px)` : "translateX(0px)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      />
    </button>
  );
}

// ─── Badge ───────────────────────────────────────────────────
function Badge({ children, color = "gray" }) {
  const styles = {
    gray: "bg-gray-100 text-gray-500 border border-gray-200",
    red: "bg-red-50 text-red-600 border border-red-200",
    green: "bg-green-50 text-green-700 border border-green-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[color]}`}>
      {color === "red" && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
      )}
      {children}
    </span>
  );
}

// ─── Field ───────────────────────────────────────────────────
function Field({ label, required, icon, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5">
        {icon && <span className="mr-1 inline-block align-middle opacity-60">{icon}</span>}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Input styles (shared) ────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none transition-all duration-150 bg-white text-gray-800 placeholder-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100";
const monoCls = "font-mono text-[13px]";

// ─── Add Account Drawer ───────────────────────────────────────
function AddDrawer({ onCancel, onSuccess }) {
  const [form, setForm] = useState({
    razorpayKeyId: "",
    razorpaySecret: "",
    alertEmail: "",
    webhookDomain: "",
  });
  const [error, setError] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const getMode = (k) =>
    k.startsWith("rzp_live_") ? "LIVE" : k.startsWith("rzp_test_") ? "TEST" : null;
  const mode = getMode(form.razorpayKeyId);

  const handleReview = () => {
    setError("");
    if (!form.razorpayKeyId.trim()) { setError("Key ID is required."); return; }
    if (!form.razorpaySecret.trim()) { setError("Secret key is required."); return; }
    if (!form.alertEmail.trim()) { setError("Alert email is required."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.alertEmail.trim())) { setError("Please enter a valid email address."); return; }
    if (!form.webhookDomain.trim()) { setError("Webhook domain is required."); return; }
    setPendingSubmit(true);
  };

  const handleConfirm = async (profilePassword) => {
    setPwError("");
    const webhookUrl = `https://${form.webhookDomain.trim()}${WEBHOOK_SUFFIX}`;
    setPwLoading(true);
    try {
      await axiosInstance.post(`/settings/payment`, {
        razorpayKeyId: form.razorpayKeyId.trim(),
        razorpaySecret: form.razorpaySecret.trim(),
        alertEmail: form.alertEmail.trim(),
        webhookUrl,
        profilePassword,
      });
      setPendingSubmit(false);
      onSuccess("Payment account added and activated successfully.");
    } catch (e) {
      const msg = e.response?.data?.message || "Something went wrong. Please try again.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
        <div className="absolute inset-0" onClick={onCancel} />
        <div className="relative z-10 flex flex-col bg-white w-full max-w-lg h-full shadow-2xl animate-slide-in-right overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                <PlusIcon size={14} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">New Razorpay Account</p>
                <p className="text-xs text-gray-400">Activates immediately on save</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-800 cursor-pointer transition-colors p-1">
              <XIcon size={15} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 animate-fade-in">
                <AlertIcon size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <Field label="Key ID" required icon={<KeyIcon />}>
                <div className="relative">
                  <input
                    value={form.razorpayKeyId}
                    onChange={(e) => set("razorpayKeyId", e.target.value)}
                    placeholder="rzp_live_xxxx or rzp_test_xxxx"
                    className={`${inputCls} ${monoCls} ${mode ? "pr-14" : ""}`}
                  />
                  {mode && (
                    <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded font-mono ${mode === "LIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {mode}
                    </span>
                  )}
                </div>
              </Field>

              <Field label="Secret key" required icon={<LockIcon />}>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={form.razorpaySecret}
                    onChange={(e) => set("razorpaySecret", e.target.value)}
                    placeholder="Your Razorpay secret key"
                    className={`${inputCls} ${monoCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon off={showSecret} />
                  </button>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Alert email" required icon={<MailIcon />}>
                <input
                  type="email"
                  value={form.alertEmail}
                  onChange={(e) => set("alertEmail", e.target.value)}
                  placeholder="alerts@yourcompany.com"
                  className={inputCls}
                />
              </Field>
            </div>

            <div>
              <Field label="Webhook domain" required icon={<GlobeIcon />}>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                  <span className="flex items-center px-3 bg-gray-50 text-xs font-mono text-gray-400 border-r border-gray-100 whitespace-nowrap select-none">
                    https://
                  </span>
                  <input
                    type="text"
                    value={form.webhookDomain}
                    onChange={(e) => set("webhookDomain", e.target.value)}
                    placeholder="yourdomain.com"
                    className="flex-1 px-3 py-2.5 text-sm font-mono border-none outline-none bg-white text-gray-700 min-w-0"
                  />
                  <span className="hidden sm:flex items-center px-2.5 bg-gray-50 text-[11px] font-mono text-red-400 font-semibold border-l border-gray-100 whitespace-nowrap select-none">
                    {WEBHOOK_SUFFIX}
                  </span>
                </div>
                {form.webhookDomain ? (
                  <p className="text-xs font-mono text-red-400 mt-1.5">
                    ↳ https://{form.webhookDomain}{WEBHOOK_SUFFIX}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Enter your domain — webhook path is added automatically.</p>
                )}
              </Field>
            </div>

            {/* Info banner */}
            <div className="flex gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <ZapIcon size={13} />
              <div>
                <p className="font-bold mb-0.5">This account activates immediately</p>
                <p className="leading-relaxed">
                  Once saved, this becomes your <strong>active payment gateway</strong>. Any currently active account will be automatically switched off.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <LockIcon size={10} /> Credentials stored encrypted
            </p>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
              >
                <CheckIcon size={13} /> Review & save
              </button>
            </div>
          </div>
        </div>
      </div>

      {pendingSubmit && (
        <PasswordModal
          title="Confirm your identity"
          subtitle="Enter your profile password to save and activate this payment account."
          danger={false}
          loading={pwLoading}
          error={pwError}
          onConfirm={handleConfirm}
          onCancel={() => { setPendingSubmit(false); setPwError(""); }}
        />
      )}
    </>
  );
}

// ─── Password Confirm Modal ───────────────────────────────────
function PasswordModal({ title, subtitle, danger = false, loading, error, onConfirm, onCancel }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex gap-3 items-start p-5 pb-4 border-b border-gray-100">
          <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${danger ? "bg-red-50" : "bg-green-50"}`}>
            <LockIcon size={16} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-800">{title}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1 leading-snug">{subtitle}</p>}
          </div>
          <button onClick={onCancel} className="text-gray-300 hover:text-gray-500 p-0.5">
            <XIcon />
          </button>
        </div>

        <div className="p-5">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            Profile password
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              autoFocus
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pw && !loading && onConfirm(pw)}
              placeholder="Enter your password"
              className={`${inputCls} pr-10 ${error ? "border-red-400 ring-2 ring-red-100" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeIcon off={show} />
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600 animate-fade-in">
              <AlertIcon size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end px-5 pb-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!pw || loading}
            onClick={() => onConfirm(pw)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${danger ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? <><SpinIcon size={13} /> Verifying…</> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Account Row ─────────────────────────────────────────────
function AccountRow({ setting, onToggle, onDelete, isLast }) {
  const isActive = setting.isRazorpayEnabled;
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleToggleConfirm = async (pw) => {
    setPwError("");
    setPwLoading(true);
    try {
      await onToggle(setting.paymentSettingId, !isActive, pw);
      setConfirmToggle(false);
    } catch (e) {
      setPwError(e?.message || "Incorrect password. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteConfirm = async (pw) => {
    setPwError("");
    setPwLoading(true);
    try {
      await onDelete(setting.paymentSettingId, pw);
      setConfirmDelete(false);
    } catch (e) {
      setPwError(e?.message || "Incorrect password. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const keyId = setting.razorpayKeyId || "";
  const shortKeyId = keyId.length > 22 ? keyId.slice(0, 22) + "…" : keyId;
  const mode = keyId.startsWith("rzp_live_") ? "LIVE" : keyId.startsWith("rzp_test_") ? "TEST" : null;

  return (
    <>
      <tr className={`group hover:bg-gray-50 transition-colors ${!isLast ? "border-b border-gray-100" : ""}`}>
        {/* Account */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${isActive ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
              <CardIcon size={13} color={isActive ? "#e53e3e" : "#9ca3af"} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-mono text-xs font-medium text-gray-700">{shortKeyId}</p>
                {mode && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${mode === "LIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {mode}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-300">Payment account</p>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="px-3 py-3.5">
          <Badge color={isActive ? "red" : "gray"}>{isActive ? "Active" : "Inactive"}</Badge>
        </td>

        {/* Email */}
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-1.5 text-gray-500">
            <MailIcon size={11} />
            <span className="font-mono text-xs">{setting.alertEmail || "—"}</span>
          </div>
        </td>

        {/* Webhook URL */}
        <td className="px-3 py-3.5 max-w-[220px]">
          {setting.webhookUrl ? (
            <div className="flex items-center gap-1.5 text-gray-400">
              <GlobeIcon size={11} />
              <span
                className="font-mono text-xs truncate block max-w-[190px]"
                title={setting.webhookUrl}
              >
                {setting.webhookUrl.replace("https://", "")}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300">Not configured</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5 justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 w-5">{isActive ? "On" : "Off"}</span>
              <Toggle value={isActive} onChange={() => { setPwError(""); setConfirmToggle(true); }} />
            </div>
            {!isActive && (
              <button
                onClick={() => { setPwError(""); setConfirmDelete(true); }}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete account"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </td>
      </tr>

      {confirmToggle && (
        <PasswordModal
          title={isActive ? "Disable this account?" : "Enable this account?"}
          subtitle={
            !isActive
              ? "This account will become your active gateway. The current active account will be switched off."
              : "Payments through this account will be paused. Make sure you have another account ready."
          }
          danger={isActive}
          loading={pwLoading}
          error={pwError}
          onConfirm={handleToggleConfirm}
          onCancel={() => { setConfirmToggle(false); setPwError(""); }}
        />
      )}
      {confirmDelete && (
        <PasswordModal
          title="Delete this account?"
          subtitle="This will permanently remove the API credentials and unregister the Razorpay webhook. This cannot be undone."
          danger
          loading={pwLoading}
          error={pwError}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setConfirmDelete(false); setPwError(""); }}
        />
      )}
    </>
  );
}

// ─── Empty State ─────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center py-14 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
            <CardIcon size={22} color="#d1d5db" />
          </div>
          <p className="font-bold text-gray-700 text-sm mb-1.5">No payment accounts yet</p>
          <p className="text-sm text-gray-400 mb-5 max-w-xs leading-relaxed">
            Add your first Razorpay account to start accepting payments on your platform.
          </p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
          >
            <PlusIcon size={14} /> Add first account
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function PaymentSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const gatewayEnabled = settings.some((s) => s.isRazorpayEnabled);
  const slots = 3 - settings.length;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await axiosInstance.get("/settings/payment");
      setSettings(res.data.data || []);
    } catch (e) {
      setFetchError(e.response?.data?.message || "Failed to load payment accounts. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleToggle = async (id, newState, pw) => {
    try {
      await axiosInstance.put(`/settings/payment/${id}`, { isRazorpayEnabled: newState, profilePassword: pw });
      showToast(`Account ${newState ? "enabled and set as active gateway" : "disabled"}.`);
      fetchSettings();
    } catch (e) {
      const msg = e.response?.data?.message || "Update failed.";
      showToast(msg, "error");
      throw new Error(msg);
    }
  };

  const handleDelete = async (id, pw) => {
    try {
      await axiosInstance.delete(`/settings/payment/${id}`, { data: { profilePassword: pw } });
      showToast("Account deleted successfully.");
      fetchSettings();
    } catch (e) {
      const msg = e.response?.data?.message || "Delete failed.";
      showToast(msg, "error");
      throw new Error(msg);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fade-in    { animation: fadeIn 0.2s ease both }
        .animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(.16,1,.3,1) both }
        .animate-scale-in   { animation: scaleIn 0.22s cubic-bezier(.16,1,.3,1) both }
        .animate-toast-in   { animation: toastIn 0.28s cubic-bezier(.16,1,.3,1) both }
        .z-60 { z-index: 60 }
      `}</style>

      <div className="min-h-screen bg-gray-100">

        {/* ── Header ── */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div>
                <h1 className="text-md font-bold text-gray-900">Payment Settings</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure your Razorpay gateway. Add up to 3 accounts and switch between them anytime.
                </p>
              </div>
            </div>
            {slots > 0 ? (
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200 whitespace-nowrap"
              >
                <PlusIcon size={14} /> Add account
                {slots < 3 && <span className="text-[11px] opacity-70 ml-1">({slots} left)</span>}
              </button>
            ) : (
              <Badge color="amber">Limit reached · 3/3</Badge>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">

          {/* Status + Slots cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  background: gatewayEnabled ? "linear-gradient(135deg,#e53e3e,#c53030)" : "#f3f4f6",
                  boxShadow: gatewayEnabled ? "0 4px 14px rgba(229,62,62,.25)" : "none",
                }}
              >
                <CardIcon size={18} color={gatewayEnabled ? "#fff" : "#9ca3af"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-bold text-sm text-gray-800">Razorpay Gateway</span>
                  <Badge color={gatewayEnabled ? "red" : "gray"}>
                    {gatewayEnabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {gatewayEnabled
                    ? "✓ Payments are live and processing successfully."
                    : "No active account — toggle an account below to activate."}
                </p>
              </div>
              <Toggle value={gatewayEnabled} onChange={() => {}} size="lg" disabled />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account slots</p>
              <div className="flex gap-2 mb-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full transition-colors duration-300"
                    style={{ background: i < settings.length ? "#e53e3e" : "#f0f0f4" }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700">
                <strong className={`text-lg ${slots > 0 ? "text-green-600" : "text-red-500"}`}>{slots}</strong>
                <span className="text-gray-400 text-xs ml-1">slot{slots !== 1 ? "s" : ""} available</span>
              </p>
              <p className="text-xs text-gray-300 mt-0.5">Max 3 accounts total</p>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className={`animate-toast-in flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                {toast.type === "success" ? <CheckIcon size={11} /> : <AlertIcon size={11} />}
              </div>
              {toast.msg}
            </div>
          )}

          {fetchError && (
            <div className="animate-fade-in flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertIcon size={14} /> {fetchError}
            </div>
          )}

          {/* Accounts table card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold text-sm text-gray-800">Razorpay Accounts</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {settings.length === 0
                    ? "No accounts configured yet"
                    : `${settings.length} account${settings.length !== 1 ? "s" : ""} · ${settings.filter((s) => s.isRazorpayEnabled).length} active`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <SpinIcon size={22} />
                <p className="text-sm">Loading accounts…</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth: 560 }}>
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {[
                        { label: "Account", cls: "pl-5 pr-3" },
                        { label: "Status", cls: "px-3" },
                        { label: "Alert email", cls: "px-3" },
                        { label: "Webhook URL", cls: "px-3" },
                        { label: "Actions", cls: "pl-3 pr-5 text-right" },
                      ].map((h) => (
                        <th key={h.label} className={`py-2.5 text-[10.5px] font-bold text-gray-400 uppercase tracking-widest ${h.cls}`}>
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {settings.length === 0 ? (
                      <EmptyState onAdd={() => setShowAdd(true)} />
                    ) : (
                      settings.map((s, i) => (
                        <AccountRow
                          key={s.paymentSettingId}
                          setting={s}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          isLast={i === settings.length - 1}
                        />
                      ))
                    )}
                  </tbody>
                  {settings.length > 0 && (
                    <tfoot>
                      <tr className="border-t border-gray-100 bg-gray-50">
                        <td colSpan={5} className="px-5 py-2.5">
                          <p className="text-xs text-gray-300">
                            Showing {settings.length} of {settings.length} account{settings.length !== 1 ? "s" : ""}
                          </p>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-center gap-1.5 pb-2">
            <LockIcon size={11} />
            <p className="text-xs text-gray-300">
              All credentials are encrypted at rest. Only one account can be active at a time.
            </p>
          </div>
        </main>
      </div>

      {/* Add Drawer */}
      {showAdd && (
        <AddDrawer
          onCancel={() => setShowAdd(false)}
          onSuccess={(msg) => {
            showToast(msg);
            setShowAdd(false);
            fetchSettings();
          }}
        />
      )}
    </>
  );
}

