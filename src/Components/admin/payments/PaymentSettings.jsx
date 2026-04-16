import { useEffect, useState } from "react";
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from '../page-header/PageHeader';
import {
  FiCreditCard, FiEye, FiEyeOff, FiSave, FiEdit2, FiTrash2,
  FiX, FiCheck, FiAlertCircle, FiKey, FiLock, FiMail,
  FiShield, FiSettings, FiPlusCircle,
} from "react-icons/fi";

/* ─────────────────────────── Spinner ─────────────────────────── */
const Spinner = ({ sm }) => (
  <span
    className={`inline-block rounded-full border-2 border-white/30 border-t-white animate-spin ${sm ? "w-3.5 h-3.5" : "w-5 h-5"}`}
  />
);

/* ─────────────────────────── StatusBadge ─────────────────────── */
const StatusBadge = ({ enabled }) =>
  enabled ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 5px #10b981" }} />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-400 border border-neutral-200">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
      Inactive
    </span>
  );

/* ─────────────────────── Field Component ─────────────────────── */
const Field = ({ label, labelSuffix, icon: Icon, type, placeholder, value, onChange, hint, showToggle, toggleState, onToggle, required }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
      {label}
      {required && <span className="text-red-400 text-[10px] normal-case font-normal tracking-normal">*required</span>}
      {labelSuffix && <span className="text-[10px] font-normal text-neutral-400 normal-case tracking-normal">{labelSuffix}</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors duration-150 pointer-events-none">
        <Icon className="w-[15px] h-[15px]" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 pl-10 pr-10 border border-neutral-200 rounded-xl bg-neutral-50 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white"
        style={{ fontFamily: "inherit" }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          {toggleState ? <FiEyeOff className="w-[15px] h-[15px]" /> : <FiEye className="w-[15px] h-[15px]" />}
        </button>
      )}
    </div>
    {hint && <p className="text-[11px] text-neutral-400 leading-relaxed">{hint}</p>}
  </div>
);

/* ──────────────────── Password Confirm Modal ─────────────────── */
const ACTION_CONFIG = {
  save: {
    title: "Confirm & Save",
    desc: "Enter your profile password to save the new payment configuration.",
    btn: "Save",
    btnCls: "bg-primary hover:bg-primary-hover",
    accentCls: "from-primary to-primary-hover",
    iconCls: "bg-primary/10 text-primary",
    Icon: FiShield,
  },
  update: {
    title: "Confirm & Update",
    desc: "Enter your profile password to apply the changes to this payment configuration.",
    btn: "Update Configuration",
    btnCls: "bg-primary hover:bg-primary-hover",
    accentCls: "from-primary to-primary-hover",
    iconCls: "bg-primary/10 text-primary",
    Icon: FiShield,
  },
  delete: {
    title: "Confirm Deletion",
    desc: "This action is permanent and cannot be undone. Enter your profile password to proceed.",
    btn: "Delete",
    btnCls: "bg-red-600 hover:bg-red-700",
    accentCls: "from-red-500 to-red-600",
    iconCls: "bg-red-50 text-red-600",
    Icon: FiTrash2,
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
  const { Icon } = cfg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.15s ease" }}>
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(8,12,24,0.55)" }}
        onClick={!loading ? onCancel : undefined}
      />
      <div
        className="relative w-full max-w-[380px] bg-white overflow-hidden"
        style={{
          borderRadius: 22,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 24px 64px -12px rgba(0,0,0,0.22)",
          animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Top accent */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${cfg.accentCls}`} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconCls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-[15px] leading-tight">{cfg.title}</h3>
                {targetLabel && <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">{targetLabel}</p>}
              </div>
            </div>
            <button
              onClick={!loading ? onCancel : undefined}
              disabled={loading}
              className="text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-40 mt-0.5"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-neutral-500 leading-relaxed">{cfg.desc}</p>

          {isDelete && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs leading-relaxed">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              This configuration will be permanently removed from your account.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Profile Password</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <FiLock className="w-[15px] h-[15px]" />
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
                className="w-full h-11 pl-10 pr-10 border border-neutral-200 rounded-xl bg-neutral-50 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white"
              />
              <button
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-[15px] h-[15px]" /> : <FiEye className="w-[15px] h-[15px]" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 min-w-0 h-11 rounded-xl border border-neutral-200 text-neutral-600 font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(profilePassword)}
            disabled={loading || !profilePassword.trim()}
            className={`flex-1 min-w-0 h-11 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${cfg.btnCls}`}
          >
            {loading ? (
              <><Spinner sm /><span className="truncate">Verifying…</span></>
            ) : (
              <><Icon className="w-4 h-4 flex-shrink-0" /><span className="truncate">{cfg.btn}</span></>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ──────────────────────── Main Component ─────────────────────── */
const PaymentSettings = () => {
  const [isRazorpayEnabled, setIsRazorpayEnabled] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId]         = useState("");
  const [razorpaySecret, setRazorpaySecret]       = useState("");
  const [alertEmail, setAlertEmail]               = useState("");
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [editingId, setEditingId]                 = useState(null);
  const [paymentMethods, setPaymentMethods]       = useState([]);
  const [refreshing, setRefreshing]               = useState(false);
  const [error, setError]                         = useState("");
  const [success, setSuccess]                     = useState("");
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
    setShowRazorpaySecret(false); setError(""); setSuccess("");
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
    if (!razorpayKeyId.trim()) { setError("Razorpay Key ID is required."); return; }
    if (!razorpaySecret.trim()) { setError("Razorpay Secret Key is required."); return; }
    if (!alertEmail.trim()) { setError("Alert Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) { setError("Please enter a valid email address."); return; }
    const payload = {
      isRazorpayEnabled,
      razorpayKeyId,
      alertEmail,
      ...(razorpaySecret.trim() && { razorpaySecret }),
    };
    openModal(
      editingId ? "update" : "save",
      payload,
      editingId,
      editingId ? `${razorpayKeyId.slice(0, 12)}••••` : "",
    );
  };

  const handleDeleteClick = (item) =>
    openModal("delete", null, item.paymentSettingId, `${item.razorpayKeyId.slice(0, 12)}••••`);

  const handlePasswordConfirm = async (profilePassword) => {
    if (!profilePassword.trim()) { setModal((m) => ({ ...m, error: "Profile password is required." })); return; }
    setModal((m) => ({ ...m, loading: true, error: "" }));
    const safeConfig = { headers: { "Content-Type": "application/json" }, skipAuthInterceptor: true };
    try {
      if (modal.action === "delete") {
        await axiosInstance.delete(`settings/payment/${modal.pendingId}`, { ...safeConfig, data: { profilePassword } });
        setSuccess("Payment configuration deleted.");
      } else if (modal.action === "update") {
        await axiosInstance.put(`settings/payment/${modal.pendingId}`, { ...modal.pendingPayload, profilePassword }, safeConfig);
        setSuccess("Payment settings updated successfully.");
      } else {
        await axiosInstance.post("settings/payment", { ...modal.pendingPayload, profilePassword }, safeConfig);
        setSuccess("Payment settings saved successfully.");
      }
      closeModal(); resetForm(); fetchPaymentMethods();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const msg = err?.response?.data?.message || (
        modal.action === "delete"
          ? "Deletion failed — check your password and try again."
          : modal.action === "update"
            ? "Update failed — please try again."
            : "Save failed — please try again."
      );
      setModal((m) => ({ ...m, loading: false, error: msg }));
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const enabledCount  = paymentMethods.filter((p) => p.isRazorpayEnabled).length;
  const disabledCount = paymentMethods.filter((p) => !p.isRazorpayEnabled).length;

  /* ──── JSX ──── */
  return (
    <div className="font-sans min-h-screen" style={{ background: "linear-gradient(150deg, var(--primary-50) 0%, #f5f7ff 50%, #f8f9fc 100%)" }}>
      <PasswordConfirmModal
        open={modal.open} action={modal.action} targetLabel={modal.targetLabel}
        onConfirm={handlePasswordConfirm} onCancel={closeModal}
        loading={modal.loading} error={modal.error}
      />

      <PageHeader title="Payment Settings" subtitle="Configure your Razorpay payment gateway" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",    value: paymentMethods.length,                                     note: "configurations" },
            { label: "Active",   value: enabledCount,                                               note: "enabled",   accent: "text-emerald-600" },
            { label: "Inactive", value: disabledCount,                                              note: "disabled",  accent: "text-neutral-400" },
            { label: "Latest",   value: paymentMethods[0]?.razorpayKeyId?.slice(0, 8) || "—", note: "most recent", mono: true },
          ].map(({ label, value, note, accent, mono }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-neutral-100 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">{label}</p>
              <p className={`font-extrabold leading-none tracking-tight mb-1 ${mono ? "text-base font-mono text-neutral-700" : "text-3xl text-neutral-900"} ${accent || ""}`}>
                {value}
              </p>
              <p className="text-[11px] text-neutral-400">{note}</p>
            </div>
          ))}
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ── FORM CARD ── */}
          <div
            className="lg:col-span-5 bg-white rounded-2xl border border-neutral-100 overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.08)" }}
          >
            {/* Card header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", boxShadow: "0 3px 10px rgb(239 68 68 / 0.25)" }}>
                {editingId ? <FiEdit2 className="w-3.5 h-3.5 text-white" /> : <FiPlusCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-neutral-900 text-sm leading-tight">
                  {editingId ? "Edit Configuration" : "New Configuration"}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {editingId ? "Update your Razorpay credentials" : "Connect your Razorpay account"}
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg px-2.5 py-1.5 transition-all"
                >
                  <FiX className="w-3 h-3" /> Cancel
                </button>
              )}
            </div>

            <div className="p-5 space-y-5">

              {/* Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Enable Razorpay</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Accept payments via Razorpay gateway</p>
                </div>
                <button
                  onClick={() => setIsRazorpayEnabled((v) => !v)}
                  className="relative flex-shrink-0 w-11 h-6 rounded-full border-none cursor-pointer transition-all duration-250 focus:outline-none"
                  style={{
                    background: isRazorpayEnabled
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))"
                      : "#d1d5db",
                    boxShadow: isRazorpayEnabled ? "0 0 0 3px rgb(239 68 68 / 0.15)" : "none",
                  }}
                >
                  <span
                    className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-250"
                    style={{
                      left: isRazorpayEnabled ? "calc(100% - 21px)" : "3px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  />
                </button>
              </div>

              {/* Key ID */}
              <Field
                label="Razorpay Key ID"
                icon={FiKey}
                type="text"
                placeholder="rzp_live_xxxxxxxxxxxx"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                required={true}
              />

              {/* Secret Key — always required */}
              <Field
                label="Razorpay Secret Key"
                icon={FiLock}
                type={showRazorpaySecret ? "text" : "password"}
                placeholder={editingId ? "Enter your secret key" : "Enter your secret key"}
                value={razorpaySecret}
                onChange={(e) => setRazorpaySecret(e.target.value)}
                hint={editingId ? null : "Stored securely with encryption"}
                showToggle
                toggleState={showRazorpaySecret}
                onToggle={() => setShowRazorpaySecret((v) => !v)}
                required={true}
              />

              {/* Alert Email */}
              <Field
                label="Alert Email"
                icon={FiMail}
                type="email"
                placeholder="admin@example.com"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                hint="Receives payment failure alerts and notifications"
                required={true}
              />

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                  <FiCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full h-11 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                  boxShadow: "0 2px 12px rgb(239 68 68 / 0.3)",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgb(239 68 68 / 0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgb(239 68 68 / 0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {editingId
                  ? <><FiSave className="w-4 h-4" /> Update </>
                  : <><FiPlusCircle className="w-4 h-4" /> Save Configuration</>}
              </button>
            </div>
          </div>

          {/* ── LIST CARD ── */}
          <div
            className="lg:col-span-7 bg-white rounded-2xl border border-neutral-100 overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.07)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-neutral-900 text-sm">Payment Methods</h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {paymentMethods.length === 0
                    ? "No configurations yet"
                    : `${paymentMethods.length} configuration${paymentMethods.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={() => fetchPaymentMethods(true)}
                disabled={refreshing}
                className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg px-3 py-1.5 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className={refreshing ? "animate-spin" : ""}>↻</span> Refresh
              </button>
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden md:block overflow-x-auto">
              {refreshing ? (
                <div className="p-5 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 rounded-lg bg-neutral-100 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                  ))}
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 border-2 border-dashed border-neutral-200 flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-neutral-500">No configurations</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Add your first configuration using the form</p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      {["Status", "Key ID", "Email", "Updated", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400 first:pl-5 last:pr-5"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((item, i) => (
                      <tr
                        key={item.paymentSettingId}
                        className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors duration-100"
                      >
                        <td className="px-4 py-3.5 pl-5">
                          <StatusBadge enabled={item.isRazorpayEnabled} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200">
                            {item.razorpayKeyId.slice(0, 6)}••••
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-neutral-500">{item.alertEmail.split("@")[0]}@…</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[11px] text-neutral-400">{formatDate(item.updatedAt)}</span>
                        </td>
                        <td className="px-4 py-3.5 pr-5">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(item)}
                              className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-lg px-2.5 py-1.5 transition-all"
                            >
                              <FiEdit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 hover:text-red-700 bg-white hover:bg-red-50 border border-red-100 hover:border-red-200 rounded-lg px-2.5 py-1.5 transition-all"
                            >
                              <FiTrash2 className="w-3 h-3" /> Delete
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
                <div className="p-4 space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl border border-neutral-100 p-4 space-y-2 animate-pulse">
                      <div className="h-3 rounded bg-neutral-100 w-1/3" />
                      <div className="h-3 rounded bg-neutral-100 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-2">
                  <FiCreditCard className="w-8 h-8 text-neutral-300" />
                  <p className="text-sm text-neutral-400">No configurations yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {paymentMethods.map((item) => (
                    <div
                      key={item.paymentSettingId}
                      className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <StatusBadge enabled={item.isRazorpayEnabled} />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 transition-all hover:bg-neutral-50"
                          >
                            <FiEdit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-white border border-red-100 rounded-lg px-2.5 py-1.5 transition-all hover:bg-red-50"
                          >
                            <FiTrash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Key ID</p>
                          <span className="font-mono text-xs bg-white border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-lg">
                            {item.razorpayKeyId.slice(0, 6)}••••
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Email</p>
                          <p className="text-xs text-neutral-600">{item.alertEmail.split("@")[0]}@…</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Updated</p>
                          <p className="text-[11px] text-neutral-500">{formatDate(item.updatedAt)}</p>
                        </div>
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
  );
};

export default PaymentSettings;