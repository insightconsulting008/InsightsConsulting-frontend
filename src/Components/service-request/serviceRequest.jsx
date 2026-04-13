import { useState, useEffect, useCallback } from "react";
import axiosInstance from '@src/providers/axiosInstance';

const ADMIN_ID = localStorage.getItem("employeeId");

const statusConfig = {
  PENDING:  { bg: "#fef9ec", color: "#b45309", border: "#fde68a", dot: "#f59e0b",  label: "Pending"  },
  APPROVED: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", dot: "#22c55e",  label: "Approved" },
  REJECTED: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca", dot: "#ef4444",  label: "Rejected" },
};

const avatar_colors = [
  ["#fee2e2","#b91c1c"],["#fecaca","#991b1b"],["#fef2f2","#dc2626"],
  ["#fff1f2","#be123c"],["#fee2e2","#7f1d1d"],["#fca5a5","#450a0a"],
];
const getAvatar = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % avatar_colors.length;
  return avatar_colors[idx];
};

const Skeleton = () => (
  <div className="divide-y" style={{ borderColor: "#fee2e2" }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="px-4 sm:px-6 py-4 flex items-center gap-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: "#fecaca" }} />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3.5 rounded w-2/5" style={{ background: "#fecaca" }} />
          <div className="h-3 rounded w-3/5" style={{ background: "#fee2e2" }} />
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="h-8 w-20 rounded-xl" style={{ background: "#fee2e2" }} />
          <div className="h-8 w-20 rounded-xl" style={{ background: "#fee2e2" }} />
        </div>
      </div>
    ))}
  </div>
);

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50">
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white min-w-[240px] sm:min-w-0"
        style={{ background: type === "success" ? "#15803d" : "#dc2626" }}
      >
        <span className="text-base">{type === "success" ? "✓" : "✕"}</span>
        <span className="flex-1">{msg}</span>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ request, action, onConfirm, onCancel, loading }) => {
  const isApprove = action === "APPROVE";
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: isApprove ? "#22c55e" : "#ef4444" }} />
        <div className="p-7">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mx-auto text-3xl"
            style={{ background: isApprove ? "#f0fdf4" : "#fef2f2" }}
          >
            {isApprove ? "✓" : "✕"}
          </div>
          <h2 className="text-xl font-bold text-center mb-2" style={{ color: "#7f1d1d" }}>
            {isApprove ? "Approve Request?" : "Reject Request?"}
          </h2>
          <p className="text-center text-sm mb-1" style={{ color: "#b91c1c" }}>
            <span className="font-semibold" style={{ color: "#7f1d1d" }}>{request?.user?.name}</span>
            {" · "}
            <span className="font-medium">{request?.service?.name || request?.bundle?.name || "—"}</span>
          </p>
          <p className="text-center text-xs mb-7" style={{ color: "#f87171" }}>This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel} disabled={loading}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50"
              style={{ border: "1.5px solid #fecaca", color: "#b91c1c", background: "#fef2f2" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
              onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
            >Cancel</button>
            <button
              onClick={onConfirm} disabled={loading}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60"
              style={{
                background: isApprove ? "#16a34a" : "#dc2626",
                boxShadow: isApprove ? "0 4px 14px #16a34a40" : "0 4px 14px #dc262640"
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : isApprove ? "Yes, Approve" : "Yes, Reject"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailPanel = ({ req }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 pb-4 pt-2">
    {[
      { label: "Request ID",      value: req.requestId,         mono: true },
      { label: "Phone",           value: req.user?.phoneNumber             },
      { label: "Created At",      value: req.createdAt ? new Date(req.createdAt).toLocaleString() : null },
      { label: "UTM Campaign ID", value: req.user?.utmCampaignId           },
    ].map(({ label, value, mono }) => (
      <div key={label} className="rounded-2xl px-4 py-3" style={{ background: "white", border: "1px solid #fecaca" }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#f87171" }}>{label}</p>
        <p className={`text-xs ${mono ? "font-mono break-all" : "font-medium"}`} style={{ color: "#7f1d1d" }}>
          {value || <span style={{ color: "#fca5a5" }}>—</span>}
        </p>
      </div>
    ))}
  </div>
);

export default function ServiceRequests() {
  const [requests, setRequests]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [total, setTotal]                 = useState(0);
  const [sort, setSort]                   = useState("desc");
  const [limit]                           = useState(10);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal]                 = useState(null);
  const [toast, setToast]                 = useState(null);
  const [expandedId, setExpandedId]       = useState(null);
  const [statusFilter, setStatusFilter]   = useState("ALL");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data: json } = await axiosInstance.get(`/admin/service-requests`, {
        params: { page, limit, sort },
      });
      if (json.success) {
        setRequests(json.data);
        setTotalPages(json.totalPages);
        setTotal(json.total);
      }
    } catch {
      setToast({ msg: "Failed to load requests", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAction = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      const { data: json } = await axiosInstance.post(`/admin/service-requests/action`, {
        requestId: modal.request.requestId,
        adminId:   ADMIN_ID,
        action:    modal.action,
      });
      if (json.success) {
        setToast({ msg: json.message, type: "success" });
        setModal(null);
        fetchRequests();
      } else {
        setToast({ msg: json.message || "Action failed", type: "error" });
      }
    } catch {
      setToast({ msg: "Network error", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = statusFilter === "ALL"
    ? requests
    : requests.filter(r => r.status === statusFilter);

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <style>{`
        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: #fef2f2 !important; }
        .btn-action { transition: all 0.15s; }
        .btn-action:active { transform: scale(0.95); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#fef2f2", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="bg-white sticky top-0 z-30" style={{ borderBottom: "1.5px solid #fecaca", boxShadow: "0 1px 8px #fca5a520" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#dc2626", boxShadow: "0 4px 12px #dc262640" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-base sm:text-lg leading-tight truncate" style={{ color: "#7f1d1d" }}>Service Requests</h1>
                <p className="text-xs hidden sm:block" style={{ color: "#f87171" }}>{total} requests total</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="text-xs sm:text-sm rounded-xl px-2.5 sm:px-3 py-2 bg-white focus:outline-none cursor-pointer"
                style={{ border: "1.5px solid #fecaca", color: "#7f1d1d" }}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
              <button
                onClick={fetchRequests}
                title="Refresh"
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                style={{ border: "1.5px solid #fecaca", color: "#ef4444", background: "white" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">

          {/* ── Stats ──────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total",    value: total,                      icon: "📋", iconBg: "#fee2e2", color: "#b91c1c" },
              { label: "Pending",  value: statusCounts.PENDING  || 0, icon: "⏳", iconBg: "#fef9ec", color: "#b45309" },
              { label: "Approved", value: statusCounts.APPROVED || 0, icon: "✅", iconBg: "#f0fdf4", color: "#15803d" },
              { label: "Rejected", value: statusCounts.REJECTED || 0, icon: "❌", iconBg: "#fef2f2", color: "#dc2626" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 flex items-center gap-3.5 transition-shadow hover:shadow-md"
                style={{ background: "white", border: "1px solid #fecaca", boxShadow: "0 1px 4px #fca5a515" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: s.iconBg }}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold leading-none" style={{ color: "#7f1d1d" }}>{s.value}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

        

          {/* ── Table ───────────────────────────────────────────────────────── */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "white", border: "1.5px solid #fecaca", boxShadow: "0 2px 12px #fca5a520" }}>

            {/* Desktop Head */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5" style={{ background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
              {[
                { label: "User & Email",     cls: "col-span-4" },
                { label: "Service / Bundle", cls: "col-span-3" },
                { label: "Campaign",         cls: "col-span-2" },
                { label: "Status",           cls: "col-span-1" },
                { label: "",                 cls: "col-span-2 text-right" },
              ].map(({ label, cls }) => (
                <div key={cls} className={`text-[11px] font-bold uppercase tracking-widest ${cls}`} style={{ color: "#f87171" }}>{label}</div>
              ))}
            </div>

            {loading ? <Skeleton /> : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="text-6xl">📭</span>
                <p className="font-semibold" style={{ color: "#b91c1c" }}>No requests found</p>
                <p className="text-sm" style={{ color: "#f87171" }}>
                  {statusFilter !== "ALL" ? `No ${statusFilter.toLowerCase()} requests.` : "All caught up!"}
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((req) => {
                  const isExpanded = expandedId === req.requestId;
                  const badge = statusConfig[req.status] || statusConfig.PENDING;
                  const [avatarBg, avatarFg] = getAvatar(req.user?.name);
                  return (
                    <div
                      key={req.requestId}
                      className="row-hover border-b"
                      style={{
                        borderColor: "#fee2e2",
                        background: isExpanded ? "#fef2f2" : "white",
                      }}
                    >
                      {/* Desktop row */}
                      <div
                        className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : req.requestId)}
                      >
                        {/* User */}
                        <div className="col-span-4 flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: avatarBg, color: avatarFg }}>
                            {req.user?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: "#7f1d1d" }}>{req.user?.name || "—"}</p>
                            <p className="text-xs truncate" style={{ color: "#f87171" }}>{req.user?.email || "—"}</p>
                          </div>
                        </div>

                        {/* Service */}
                        <div className="col-span-3">
                          {req.service ? (
                            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-semibold" style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                              ⚙ {req.service.name}
                            </span>
                          ) : req.bundle ? (
                            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-semibold" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}>
                              📦 {req.bundle.name}
                            </span>
                          ) : <span className="text-xs" style={{ color: "#fca5a5" }}>—</span>}
                        </div>

                        {/* Campaign */}
                        <div className="col-span-2">
                          {req.user?.utmCampaignName ? (
                            <span className="text-xs px-2.5 py-1.5 rounded-xl block truncate font-medium" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                              {req.user.utmCampaignName}
                            </span>
                          ) : <span className="text-xs" style={{ color: "#fca5a5" }}>—</span>}
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border"
                            style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.dot }} />
                            <span className="hidden lg:inline">{badge.label}</span>
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex gap-2 justify-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); setModal({ request: req, action: "APPROVE" }); }}
                            className="btn-action px-3.5 py-2 rounded-xl text-white text-xs font-bold"
                            style={{ background: "#16a34a", boxShadow: "0 2px 8px #16a34a30" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
                            onMouseLeave={e => e.currentTarget.style.background = "#16a34a"}
                          >Approve</button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setModal({ request: req, action: "REJECT" }); }}
                            className="btn-action px-3.5 py-2 rounded-xl text-xs font-bold"
                            style={{ background: "#fef2f2", color: "#b91c1c", border: "1.5px solid #fecaca" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#dc2626"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#b91c1c"; e.currentTarget.style.borderColor = "#fecaca"; }}
                          >Reject</button>
                        </div>
                      </div>

                      {/* Mobile card */}
                      <div className="flex md:hidden px-4 py-4 gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : req.requestId)}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5" style={{ background: avatarBg, color: avatarFg }}>
                          {req.user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: "#7f1d1d" }}>{req.user?.name || "—"}</p>
                              <p className="text-xs truncate" style={{ color: "#f87171" }}>{req.user?.email || "—"}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0"
                              style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.dot }} />
                              {badge.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {req.service && (
                              <span className="text-[11px] px-2 py-1 rounded-lg font-semibold" style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>⚙ {req.service.name}</span>
                            )}
                            {req.bundle && (
                              <span className="text-[11px] px-2 py-1 rounded-lg font-semibold" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}>📦 {req.bundle.name}</span>
                            )}
                            {req.user?.utmCampaignName && (
                              <span className="text-[11px] px-2 py-1 rounded-lg" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>📣 {req.user.utmCampaignName}</span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); setModal({ request: req, action: "APPROVE" }); }}
                              className="btn-action flex-1 py-2 rounded-xl text-white text-xs font-bold"
                              style={{ background: "#16a34a" }}
                            >Approve</button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setModal({ request: req, action: "REJECT" }); }}
                              className="btn-action flex-1 py-2 rounded-xl text-xs font-bold"
                              style={{ background: "#fef2f2", color: "#b91c1c", border: "1.5px solid #fecaca" }}
                            >Reject</button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && <DetailPanel req={req} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs font-medium" style={{ color: "#f87171" }}>
                Page <span className="font-bold" style={{ color: "#b91c1c" }}>{page}</span> of <span className="font-bold" style={{ color: "#b91c1c" }}>{totalPages}</span>
              </p>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "«", action: () => setPage(1),                             disabled: page === 1,          w: "w-9" },
                  { label: "‹ Prev", action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1,          w: "px-4" },
                ].map(({ label, action, disabled, w }) => (
                  <button key={label} onClick={action} disabled={disabled}
                    className={`h-9 ${w} rounded-xl text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                    style={{ border: "1.5px solid #fecaca", color: "#dc2626", background: "white" }}
                    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#fef2f2"; }}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >{label}</button>
                ))}

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    const active = page === p;
                    if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                      if (p === 2 || p === totalPages - 1) return <span key={p} className="px-1 py-2 text-sm" style={{ color: "#fca5a5" }}>…</span>;
                      return null;
                    }
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: active ? "#dc2626" : "transparent",
                          color:      active ? "#fff"    : "#f87171",
                          boxShadow:  active ? "0 3px 10px #dc262640" : "none",
                        }}
                      >{p}</button>
                    );
                  })}
                </div>

                {[
                  { label: "Next ›", action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages, w: "px-4" },
                  { label: "»",      action: () => setPage(totalPages),                        disabled: page === totalPages, w: "w-9" },
                ].map(({ label, action, disabled, w }) => (
                  <button key={label} onClick={action} disabled={disabled}
                    className={`h-9 ${w} rounded-xl text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                    style={{ border: "1.5px solid #fecaca", color: "#dc2626", background: "white" }}
                    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#fef2f2"; }}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >{label}</button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {modal && <ConfirmModal request={modal.request} action={modal.action} onConfirm={handleAction} onCancel={() => setModal(null)} loading={actionLoading} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}