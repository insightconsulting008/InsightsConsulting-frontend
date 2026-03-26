import { useEffect, useState } from "react";
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from '../page-header/PageHeader';
import {
  FiCreditCard, FiEye, FiEyeOff, FiSave, FiEdit2, FiTrash2,
  FiX, FiCheck, FiRefreshCw, FiAlertCircle, FiClock,
  FiKey, FiLock, FiMail, FiShield, FiZap, FiSettings,
} from "react-icons/fi";

/* ─────────────────────────── helpers ─────────────────────────── */

const Spinner = ({ sm }) => (
  <span className={`inline-block rounded-full border-2 border-primary-200 border-t-primary animate-spin ${sm ? "w-3.5 h-3.5" : "w-5 h-5"}`} />
);

const StatusBadge = ({ enabled }) =>
  enabled ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-success-50 text-success-700 border border-success-100">
      <span className="w-1.5 h-1.5 rounded-full bg-success-500 shadow-sm" style={{ boxShadow: "0 0 4px #10b981" }} />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-500 border border-neutral-200">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
      Inactive
    </span>
  );

/* ─────────────────── Password Confirm Modal ───────────────────── */
const ACTION_CONFIG = {
  save: {
    title:     "Confirm Your Identity",
    desc:      "Enter your profile password to save the new payment settings.",
    btn:       "Save Settings",
    btnCls:    "bg-primary hover:bg-primary-hover",
    accentCls: "from-primary to-primary-hover",
    iconCls:   "bg-primary/10 text-primary",
  },
  update: {
    title:     "Confirm Your Identity",
    desc:      "Enter your profile password to update the payment settings.",
    btn:       "Update Settings",
    btnCls:    "bg-primary hover:bg-primary-hover",
    accentCls: "from-primary to-primary-hover",
    iconCls:   "bg-primary/10 text-primary",
  },
  delete: {
    title:     "Confirm Deletion",
    desc:      "This action is irreversible. Enter your profile password to permanently delete this configuration.",
    btn:       "Delete",
    btnCls:    "bg-error-600 hover:bg-error-700",
    accentCls: "from-error-500 to-error-600",
    iconCls:   "bg-error-50 text-error-600",
  },
};

const PasswordConfirmModal = ({ open, action, targetLabel, onConfirm, onCancel, loading, error }) => {
  const [profilePassword, setProfilePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) { setProfilePassword(""); setShowPassword(false); }
  }, [open]);

  if (!open) return null;

  const cfg = ACTION_CONFIG[action] ?? ACTION_CONFIG.save;
  const isDelete = action === "delete";

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
        {/* Gradient accent top bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${cfg.accentCls}`} />

        {/* Header */}
        <div
          className="px-6 pt-5 pb-4"
          style={{
            borderBottom: "1px solid var(--primary-50)",
            background: "linear-gradient(to bottom, var(--primary-50), #fff)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconCls}`}
                style={{ boxShadow: isDelete ? "0 2px 8px rgba(225,29,72,0.15)" : "0 2px 8px rgb(239 68 68 / 0.15)" }}
              >
                {isDelete ? <FiTrash2 className="w-5 h-5" /> : <FiShield className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base leading-tight">{cfg.title}</h3>
                {targetLabel && <p className="text-xs text-neutral-400 mt-0.5 font-mono">{targetLabel}</p>}
              </div>
            </div>
            <button onClick={!loading ? onCancel : undefined} disabled={loading}
              className="text-neutral-400 hover:text-neutral-700 transition-colors mt-0.5 disabled:opacity-40">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-neutral-600 leading-relaxed">{cfg.desc}</p>

          {isDelete && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-error-50 border border-error-100 text-error-700 text-xs">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Once deleted, this configuration cannot be recovered.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest">Profile Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <FiLock className="w-4 h-4" />
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
                className="w-full h-11 pl-9 pr-10 border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-primary focus:ring-2 focus:bg-white"
              />
              <button onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button onClick={onCancel} disabled={loading}
            style={{ borderRadius: 10 }}
            className="flex-1 h-11 border border-neutral-200 text-neutral-600 font-semibold text-sm hover:bg-neutral-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => onConfirm(profilePassword)} disabled={loading || !profilePassword.trim()}
            style={{ borderRadius: 10 }}
            className={`flex-1 h-11 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${cfg.btnCls}`}>
            {loading
              ? <><Spinner sm /> Verifying...</>
              : <>{isDelete ? <FiTrash2 className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}{cfg.btn}</>}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ──────────────────────── Main Component ─────────────────────── */

const PaymentSettings = () => {
  const [isRazorpayEnabled, setIsRazorpayEnabled]   = useState(false);
  const [razorpayKeyId, setRazorpayKeyId]           = useState("");
  const [razorpaySecret, setRazorpaySecret]         = useState("");
  const [alertEmail, setAlertEmail]                 = useState("");
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [editingId, setEditingId]                   = useState(null);
  const [paymentMethods, setPaymentMethods]         = useState([]);
  const [refreshing, setRefreshing]                 = useState(false);
  const [error, setError]                           = useState("");
  const [success, setSuccess]                       = useState("");
  const [modal, setModal] = useState({
    open: false, action: "save", targetLabel: "", pendingPayload: null, pendingId: null, loading: false, error: "",
  });

  const fetchPaymentMethods = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await axiosInstance.get("settings/payment");
      if (res.data?.success) setPaymentMethods(res.data.data);
    } catch (err) { console.error("Failed to fetch payment methods", err); }
    finally { if (showRefresh) setRefreshing(false); }
  };

  useEffect(() => { fetchPaymentMethods(); }, []);

  const resetForm = () => {
    setEditingId(null); setIsRazorpayEnabled(false);
    setRazorpayKeyId(""); setRazorpaySecret(""); setAlertEmail("");
    setShowRazorpaySecret(false); setError("");
  };

  const handleEdit = (item) => {
    setEditingId(item.paymentSettingId);
    setIsRazorpayEnabled(item.isRazorpayEnabled);
    setRazorpayKeyId(item.razorpayKeyId || "");
    setAlertEmail(item.alertEmail || "");
    setRazorpaySecret(""); setError(""); setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = (action, pendingPayload = null, pendingId = null, targetLabel = "") =>
    setModal({ open: true, action, targetLabel, pendingPayload, pendingId, loading: false, error: "" });

  const closeModal = () => setModal((m) => ({ ...m, open: false, loading: false, error: "" }));

  const handleSubmit = () => {
    setError(""); setSuccess("");
    if (!razorpayKeyId.trim())                           { setError("Razorpay Key ID is required"); return; }
    if (!editingId && !razorpaySecret.trim())            { setError("Razorpay Secret Key is required"); return; }
    if (!alertEmail.trim())                              { setError("Alert Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) { setError("Please enter a valid email address"); return; }
    const payload = { isRazorpayEnabled, razorpayKeyId, alertEmail, ...(razorpaySecret.trim() && { razorpaySecret }) };
    openModal(editingId ? "update" : "save", payload, editingId, editingId ? `${razorpayKeyId.slice(0, 12)}••••` : "");
  };

  const handleDeleteClick = (item) =>
    openModal("delete", null, item.paymentSettingId, `${item.razorpayKeyId.slice(0, 12)}••••`);

  const handlePasswordConfirm = async (profilePassword) => {
    if (!profilePassword.trim()) { setModal((m) => ({ ...m, error: "Profile password is required" })); return; }
    setModal((m) => ({ ...m, loading: true, error: "" }));
    const safeConfig = { headers: { "Content-Type": "application/json" }, skipAuthInterceptor: true };
    try {
      if (modal.action === "delete") {
        await axiosInstance.delete(`settings/payment/${modal.pendingId}`, { ...safeConfig, data: { profilePassword } });
        setSuccess("Payment configuration deleted successfully");
      } else if (modal.action === "update") {
        await axiosInstance.put(`settings/payment/${modal.pendingId}`, { ...modal.pendingPayload, profilePassword }, safeConfig);
        setSuccess("Payment settings updated successfully");
      } else {
        await axiosInstance.post("settings/payment", { ...modal.pendingPayload, profilePassword }, safeConfig);
        setSuccess("Payment settings saved successfully");
      }
      closeModal(); resetForm(); fetchPaymentMethods();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || (
        modal.action === "delete"
          ? "Failed to delete — check your password and try again"
          : modal.action === "update"
            ? "Failed to update payment settings"
            : "Failed to save payment settings"
      );
      setModal((m) => ({ ...m, loading: false, error: msg }));
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const enabledCount  = paymentMethods.filter((p) => p.isRazorpayEnabled).length;
  const disabledCount = paymentMethods.filter((p) => !p.isRazorpayEnabled).length;

  /* ───────────────────── JSX ───────────────────── */
  return (
    <div
      className="font-sans"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, var(--primary-50) 0%, var(--color-primary-subtle) 40%, #f8faff 100%)",
      }}
    >
      <PasswordConfirmModal
        open={modal.open} action={modal.action} targetLabel={modal.targetLabel}
        onConfirm={handlePasswordConfirm} onCancel={closeModal}
        loading={modal.loading} error={modal.error}
      />

      <PageHeader
        title="Payment Settings"
        subtitle="Configure your Razorpay payment gateway"
      />

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Total Configs", value: paymentMethods.length,  color: "#1a1a2e",                  sub: "all configurations" },
            { label: "Active",        value: enabledCount,            color: "var(--success-600)",        sub: "enabled now" },
            { label: "Inactive",      value: disabledCount,           color: "var(--neutral-500)",        sub: "disabled" },
            { label: "Latest Key",    value: paymentMethods[0]?.razorpayKeyId?.slice(0, 8) || "—", color: "var(--primary-700)", sub: "most recent", small: true },
          ].map(({ label, value, color, sub, small }) => (
            <div key={label} style={{
              background: "#fff",
              border: "1px solid var(--primary-100)",
              borderRadius: 16,
              padding: "1rem 1.125rem",
              boxShadow: "0 1px 4px rgb(239 68 68 / 0.06), 0 6px 20px -6px rgb(239 68 68 / 0.08)",
              position: "relative", overflow: "hidden",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgb(239 68 68 / 0.1), 0 12px 32px -8px rgb(239 68 68 / 0.14)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgb(239 68 68 / 0.06), 0 6px 20px -6px rgb(239 68 68 / 0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#a8a8c0", marginBottom: 6 }}>{label}</p>
              <p style={{ fontSize: small ? "0.95rem" : "1.75rem", fontWeight: 800, color, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-mono, monospace)" }}>{value}</p>
              <p style={{ fontSize: "0.7rem", color: "#a8a8c0", marginTop: 4, fontWeight: 500 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ── FORM CARD ── */}
          <div className="lg:col-span-5" style={{
            background: "#fff",
            border: "1px solid var(--primary-200)",
            borderRadius: 20,
            boxShadow: "0 2px 8px rgb(239 68 68 / 0.06), 0 12px 40px -8px rgb(239 68 68 / 0.1)",
            overflow: "hidden",
          }}>
            {/* Card header */}
            <div style={{ padding: "1.125rem 1.375rem", borderBottom: "1px solid var(--primary-50)", background: "linear-gradient(to right, var(--primary-50), #fff)" }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                  boxShadow: "0 3px 10px rgb(239 68 68 / 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {editingId ? <FiEdit2 className="w-4 h-4 text-white" /> : <FiSettings className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="font-bold text-neutral-900 leading-none" style={{ fontSize: "0.9375rem" }}>
                    {editingId ? "Edit Configuration" : "New Configuration"}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#a8a8c0", marginTop: 3 }}>
                    {editingId ? "Update existing payment settings" : "Add Razorpay credentials"}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.375rem" }} className="space-y-5">

              {/* Edit mode banner */}
              {editingId && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "linear-gradient(to right, var(--primary-50), var(--color-primary-subtle))",
                  border: "1px solid var(--primary-200)",
                  borderRadius: 12, padding: "0.625rem 0.875rem",
                }}>
                  <span className="flex items-center gap-2 text-primary-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    <FiEdit2 className="w-3.5 h-3.5" /> Editing existing setting
                  </span>
                  <button onClick={resetForm} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--primary-700)",
                    background: "var(--primary-100)",
                    border: "1px solid var(--primary-200)",
                    borderRadius: 7, padding: "0.25rem 0.625rem",
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <FiX className="w-3 h-3" /> Cancel
                  </button>
                </div>
              )}

              {/* Toggle */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "linear-gradient(to right, var(--primary-50), #fffffe)",
                border: "1px solid var(--primary-100)",
                borderRadius: 14, padding: "0.875rem 1rem",
              }}>
                <div>
                  <p className="font-semibold text-neutral-800" style={{ fontSize: "0.875rem" }}>Enable Razorpay</p>
                  <p style={{ fontSize: "0.75rem", color: "#a8a8c0", marginTop: 2 }}>Activate Razorpay payment processing</p>
                </div>
                <button
                  onClick={() => setIsRazorpayEnabled((v) => !v)}
                  style={{
                    position: "relative", width: 48, height: 26,
                    borderRadius: 9999, border: "none", cursor: "pointer",
                    background: isRazorpayEnabled
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))"
                      : "#e4e4ec",
                    boxShadow: isRazorpayEnabled
                      ? "0 0 0 3px rgb(239 68 68 / 0.2), inset 0 1px 2px rgba(0,0,0,0.1)"
                      : "inset 0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.25s",
                    flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 3,
                    left: isRazorpayEnabled ? "calc(100% - 23px)" : 3,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  }} />
                </button>
              </div>

              {/* Input fields */}
              {[
                {
                  label: "Razorpay Key ID", icon: FiKey,
                  type: "text", placeholder: "rzp_live_xxxxxxxxxxxx",
                  value: razorpayKeyId, onChange: (e) => setRazorpayKeyId(e.target.value),
                  hint: null, showToggle: false,
                },
                {
                  label: "Razorpay Secret Key",
                  labelSuffix: editingId ? "(leave blank to keep existing)" : null,
                  icon: FiLock,
                  type: showRazorpaySecret ? "text" : "password",
                  placeholder: editingId ? "Enter new secret to update" : "Enter secret key",
                  value: razorpaySecret, onChange: (e) => setRazorpaySecret(e.target.value),
                  hint: editingId ? "Enter new secret only if you want to change it" : "Your secret key will be encrypted",
                  showToggle: true,
                  toggleState: showRazorpaySecret,
                  onToggle: () => setShowRazorpaySecret((v) => !v),
                },
                {
                  label: "Alert Email", icon: FiMail,
                  type: "email", placeholder: "admin@example.com",
                  value: alertEmail, onChange: (e) => setAlertEmail(e.target.value),
                  hint: "Receives payment notifications and alerts",
                  showToggle: false,
                },
              ].map(({ label, labelSuffix, icon: Icon, type, placeholder, value, onChange, hint, showToggle, toggleState, onToggle }) => (
                <div key={label} className="space-y-1.5">
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#7878a0" }}>
                    {label}
                    {labelSuffix && <span style={{ fontWeight: 500, fontSize: "0.65rem", color: "#a8a8c0", textTransform: "none", letterSpacing: 0 }}>{labelSuffix}</span>}
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#a8a8c0", pointerEvents: "none" }}>
                      <Icon style={{ width: 15, height: 15 }} />
                    </div>
                    <input
                      type={type} placeholder={placeholder} value={value} onChange={onChange}
                      style={{
                        width: "100%", height: 42, paddingLeft: 36, paddingRight: showToggle ? 40 : 12,
                        border: "1.5px solid #e4e4ec", borderRadius: 10,
                        background: "#f8f8fa", fontSize: "0.875rem",
                        color: "#1a1a2e", outline: "none",
                        transition: "all 0.15s",
                        fontFamily: "var(--font-sans)",
                        boxSizing: "border-box",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = "var(--color-primary)";
                        e.target.style.boxShadow = "0 0 0 3px rgb(239 68 68 / 0.12)";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "#e4e4ec";
                        e.target.style.boxShadow = "none";
                        e.target.style.background = "#f8f8fa";
                      }}
                    />
                    {showToggle && (
                      <button type="button" onClick={onToggle} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#a8a8c0", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        {toggleState ? <FiEyeOff style={{ width: 15, height: 15 }} /> : <FiEye style={{ width: 15, height: 15 }} />}
                      </button>
                    )}
                  </div>
                  {hint && <p style={{ fontSize: "0.7rem", color: "#a8a8c0", marginTop: 4 }}>{hint}</p>}
                </div>
              ))}

              {/* Form error */}
              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "0.625rem 0.875rem", borderRadius: 10, background: "#fff1f2", border: "1px solid #ffe4e6", color: "#be123c", fontSize: "0.8125rem" }}>
                  <FiAlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />{error}
                </div>
              )}

              {/* Form success */}
              {success && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "0.625rem 0.875rem", borderRadius: 10, background: "#ecfdf5", border: "1px solid #d1fae5", color: "#047857", fontSize: "0.8125rem" }}>
                  <FiCheck style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />{success}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                style={{
                  width: "100%", height: 44, borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                  color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgb(239 68 68 / 0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                  transition: "all 0.15s", position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, var(--color-primary-hover), var(--color-primary-active))";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgb(239 68 68 / 0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgb(239 68 68 / 0.3), inset 0 1px 0 rgba(255,255,255,0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onMouseDown={e => { e.currentTarget.style.transform = "translateY(0) scale(0.99)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px) scale(1)"; }}
              >
                <FiSave style={{ width: 15, height: 15 }} />
                {editingId ? "Update Settings" : "Save Settings"}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-7">
            <div style={{
              background: "#fff",
              border: "1px solid var(--primary-100)",
              borderRadius: 20,
              boxShadow: "0 2px 8px rgb(239 68 68 / 0.05), 0 12px 40px -8px rgb(239 68 68 / 0.09)",
              overflow: "hidden",
            }}>

              {/* Card header */}
              <div style={{
                padding: "1rem 1.375rem",
                borderBottom: "1px solid var(--primary-50)",
                background: "linear-gradient(to right, var(--primary-50), #fff)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
              }}>
                <div>
                  <h2 className="font-bold text-neutral-900" style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>
                    Payment Methods
                  </h2>
                  <p style={{ fontSize: "0.75rem", color: "#a8a8c0", marginTop: 2 }}>
                    {paymentMethods.length === 0
                      ? "No payment methods added yet"
                      : `${paymentMethods.length} configuration${paymentMethods.length !== 1 ? "s" : ""} found`}
                  </p>
                </div>
              </div>

              {/* ── Desktop Table ── */}
              <div className="hidden md:block">
                {refreshing ? (
                  <div style={{ padding: "1.5rem" }} className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ height: 14, borderRadius: 8, background: "linear-gradient(90deg, var(--primary-50), var(--primary-100), var(--primary-50))", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                    ))}
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      border: "2px dashed var(--primary-200)",
                      background: "var(--primary-50)",
                      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
                    }}>
                      <FiCreditCard style={{ width: 22, height: 22, color: "var(--primary-300)" }} />
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#7878a0", fontWeight: 600, marginBottom: 4 }}>No payment methods yet</p>
                    <p style={{ fontSize: "0.75rem", color: "#a8a8c0" }}>Add your first configuration on the left</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{
                        background: "linear-gradient(to right, var(--primary-50), var(--color-primary-subtle))",
                        borderBottom: "2px solid var(--primary-100)",
                      }}>
                        {["Status", "Key ID", "Email", "Updated", "Action"].map((h) => (
                          <th key={h}
                            className="first:pl-5 last:pr-5"
                            style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary-700)", whiteSpace: "nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paymentMethods.map((item, i) => (
                        <tr
                          key={item.paymentSettingId}
                          style={{ borderBottom: i < paymentMethods.length - 1 ? "1px solid var(--primary-50)" : "none", transition: "background 0.12s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--primary-50)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "0.9375rem 1rem" }} className="pl-5">
                            <StatusBadge enabled={item.isRazorpayEnabled} />
                          </td>
                          <td style={{ padding: "0.9375rem 1rem" }}>
                            <span style={{
                              fontFamily: "monospace", fontSize: "0.75rem",
                              background: "var(--primary-50)",
                              padding: "0.25rem 0.5rem", borderRadius: 6,
                              color: "#424260",
                              border: "1px solid var(--primary-100)",
                            }}>
                              {item.razorpayKeyId.slice(0, 6)}••••
                            </span>
                          </td>
                          <td style={{ padding: "0.9375rem 1rem" }}>
                            <span style={{ fontSize: "0.75rem", color: "#424260" }}>
                              {item.alertEmail.split("@")[0]}@…
                            </span>
                          </td>
                          <td style={{ padding: "0.9375rem 1rem" }}>
                            <span style={{ fontSize: "0.7rem", color: "#7878a0" }}>{formatDate(item.updatedAt)}</span>
                          </td>
                          <td style={{ padding: "0.9375rem 1rem" }} className="pr-5">
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => handleEdit(item)} style={{
                                padding: "0.375rem 0.75rem", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
                                border: "1.5px solid var(--primary-200)",
                                color: "var(--primary-700)",
                                background: "linear-gradient(to bottom, #fff, var(--primary-50))",
                                cursor: "pointer",
                              }}>
                                <FiEdit2 style={{ width: 12, height: 12 }} />
                              </button>
                              <button onClick={() => handleDeleteClick(item)} style={{
                                padding: "0.375rem 0.75rem", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
                                border: "1.5px solid #ffe4e6", color: "#e11d48",
                                background: "linear-gradient(to bottom, #fff, #fff1f2)", cursor: "pointer",
                              }}>
                                <FiTrash2 style={{ width: 12, height: 12 }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ── Mobile Cards ── */}
              <div className="block md:hidden">
                {refreshing ? (
                  <div style={{ padding: "1rem" }} className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ borderRadius: 14, border: "1px solid var(--primary-100)", padding: "1rem" }} className="space-y-2">
                        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg, var(--primary-50), var(--primary-100), var(--primary-50))", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", width: "60%" }} />
                      </div>
                    ))}
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                    <p style={{ fontSize: "0.875rem", color: "#7878a0" }}>No payment methods yet</p>
                  </div>
                ) : (
                  <div style={{ padding: "0.875rem" }} className="space-y-2">
                    {paymentMethods.map((item) => (
                      <div key={item.paymentSettingId} style={{
                        borderRadius: 16,
                        border: "1px solid var(--primary-100)",
                        background: "#ffffff", padding: "1rem",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <StatusBadge enabled={item.isRazorpayEnabled} />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleEdit(item)} style={{
                              padding: "0.375rem", borderRadius: 8,
                              border: "1.5px solid var(--primary-200)",
                              color: "var(--primary-700)",
                              background: "var(--primary-50)",
                            }}>
                              <FiEdit2 style={{ width: 14, height: 14 }} />
                            </button>
                            <button onClick={() => handleDeleteClick(item)} style={{ padding: "0.375rem", borderRadius: 8, border: "1.5px solid #ffe4e6", color: "#e11d48", background: "#fff1f2" }}>
                              <FiTrash2 style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: "0.7rem", color: "#a8a8c0", display: "block", marginBottom: 2 }}>Key ID</span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", background: "var(--primary-50)", padding: "0.25rem 0.5rem", borderRadius: 6, border: "1px solid var(--primary-100)" }}>
                            {item.razorpayKeyId.slice(0, 6)}••••
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.7rem", color: "#424260" }}>{item.alertEmail.split("@")[0]}@…</span>
                          <span style={{ fontSize: "0.6rem", color: "#a8a8c0" }}>{formatDate(item.updatedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSettings;