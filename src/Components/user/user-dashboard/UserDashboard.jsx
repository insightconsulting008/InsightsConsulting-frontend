import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@src/providers/axiosInstance";
import {
  Zap, Clock, CheckCircle2, FolderOpen,
  TrendingUp, Activity, Bell, CalendarDays,
  FileText, LayoutGrid, ArrowRight, RefreshCw,
  Briefcase, Package, UserCircle, ChevronRight,
  AlertTriangle, BarChart3, Layers, ShieldCheck,
  Upload, CircleCheck, Ban, PauseCircle, Search,
} from "lucide-react";
import PageHeader from "../page-header/PageHeader";

/* ─── helpers ─────────────────────────────────────────────────────── */
const userId  = localStorage.getItem("userId");
const fmt     = (n) => (n ?? 0).toLocaleString("en-IN");
const pct     = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ─── primitives ─────────────────────────────────────────────────── */
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white border border-gray-100 ${className}`}
    style={{ boxShadow: "0 1px 4px rgb(0 0 0/.05), 0 4px 20px rgb(0 0 0/.04)" }}
  >
    {children}
  </div>
);

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl ${className}`}
    style={{ background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s infinite ease" }}
  />
);

/* ─── donut chart (pure SVG) ─────────────────────────────────────── */
const DonutChart = ({ segments, size = 130 }) => {
  const r    = 46, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, g) => s + g.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset + circ * 0.25}
            style={{ transition: "stroke-dasharray .8s ease" }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 7}  textAnchor="middle" fontSize="20" fontWeight="800" fill="#111827">{total}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="8.5" fill="#9ca3af" fontWeight="700" letterSpacing="1.2">TOTAL</text>
    </svg>
  );
};

/* ─── bar sparkline ───────────────────────────────────────────────── */
const Sparkline = ({ data }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-16 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm"
            style={{
              height: `${Math.max(8, pct(d.count, max))}%`,
              background: "var(--color-primary)",
              opacity: 0.18 + (i / data.length) * 0.82,
              transition: "height .6s ease",
            }}
            title={`${d.label}: ${d.count}`}
          />
          <span className="text-[9px] text-gray-300 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── status config ───────────────────────────────────────────────── */
const SVC = {
  IN_PROGRESS: { label: "In Progress",  color: "#0ea5e9", bg: "bg-sky-50",   text: "text-sky-600",   Icon: Activity     },
  NOT_STARTED: { label: "Not Started",  color: "#94a3b8", bg: "bg-slate-50", text: "text-slate-500", Icon: Clock        },
  COMPLETED:   { label: "Completed",    color: "#22c55e", bg: "bg-green-50", text: "text-green-600", Icon: CheckCircle2 },
  CANCELLED:   { label: "Cancelled",    color: "#ef4444", bg: "bg-red-50",   text: "text-red-500",   Icon: Ban          },
  ON_HOLD:     { label: "On Hold",      color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600", Icon: PauseCircle  },
};

/* ─── service row ─────────────────────────────────────────────────── */
const ServiceRow = ({ svc }) => {
  const name   = svc.service?.name ?? "Untitled";
  const status = svc.status ?? "NOT_STARTED";
  const cfg    = SVC[status] ?? SVC.NOT_STARTED;
  const isRec  = svc.service?.serviceType === "RECURRING";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}18` }}>
        <cfg.Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          {isRec ? <><RefreshCw size={9} /> Recurring</> : <><Zap size={9} /> One-Time</>}
          <span className="text-gray-200">·</span>
          <CalendarDays size={9} /> {fmtDate(svc.createdAt)}
        </p>
      </div>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
        <cfg.Icon size={9} /> {cfg.label}
      </span>
    </div>
  );
};

/* ─── doc alert row ───────────────────────────────────────────────── */
const DocAlertRow = ({ doc }) => {
  const rejected = doc.status === "REJECTED";
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${rejected ? "bg-red-50" : "bg-amber-50"}`}>
        {rejected ? <AlertTriangle size={13} className="text-red-500" /> : <Upload size={13} className="text-amber-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 truncate">{doc.documentType ?? "Document"}</p>
        <p className="text-[11px] text-gray-400">{rejected ? "Re-upload required" : "Upload needed"}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rejected ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
        {rejected ? "Rejected" : "Pending"}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   USER DASHBOARD
═══════════════════════════════════════════════════════════════════ */
export default function UserDashboard() {
  const [profile,     setProfile]     = useState(null);
  const [services,    setServices]    = useState([]);
  const [docCount,    setDocCount]    = useState(0);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  const now      = new Date();
  const greeting = now.getHours() < 12 ? "Good morning"
                 : now.getHours() < 17 ? "Good afternoon"
                 : "Good evening";
  const dateStr  = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);

    const [profileRes, servicesRes, myDocsRes, coDocsRes] = await Promise.allSettled([
      axiosInstance.get("/user/settings/profile"),
      axiosInstance.get(`/user/my-service/${userId}`),
      axiosInstance.get(`/user/mydocuments/documents/user/${userId}?page=1&limit=1`),
      axiosInstance.get(`/user/mycompany/documents/user/${userId}?page=1&limit=1`),
    ]);

    if (profileRes.status === "fulfilled") {
      setProfile(profileRes.value.data?.data ?? null);
    }

    if (servicesRes.status === "fulfilled" && servicesRes.value.data?.success) {
      const list = servicesRes.value.data.data ?? [];
      setServices(list);

      const actionDocs = [];
      list.forEach((ms) => {
        const app = ms.application;
        if (!app) return;
        (app.applicationTrackStep || []).forEach((s) =>
          (s.serviceDocument || []).forEach((d) => {
            if (d.status === "PENDING" || d.status === "REJECTED") actionDocs.push(d);
          })
        );
        (app.servicePeriod || []).forEach((p) => {
          (p.serviceDocument || []).forEach((d) => {
            if (d.status === "PENDING" || d.status === "REJECTED") actionDocs.push(d);
          });
          (p.periodStep || []).forEach((s) =>
            (s.serviceDocument || []).forEach((d) => {
              if (d.status === "PENDING" || d.status === "REJECTED") actionDocs.push(d);
            })
          );
        });
      });
      setPendingDocs(actionDocs);
    }

    let total = 0;
    if (myDocsRes.status === "fulfilled") total += myDocsRes.value.data?.total ?? myDocsRes.value.data?.totalCount ?? 0;
    if (coDocsRes.status === "fulfilled") total += coDocsRes.value.data?.total ?? coDocsRes.value.data?.totalCount ?? 0;
    setDocCount(total);

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* derived */
  const active    = services.filter((s) => s.status === "IN_PROGRESS").length;
  const pending   = services.filter((s) => s.status === "NOT_STARTED" || s.status === "ON_HOLD").length;
  const completed = services.filter((s) => s.status === "COMPLETED").length;
  const cancelled = services.filter((s) => s.status === "CANCELLED").length;
  const total     = services.length;

  const recentServices = [...services]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const monthlyData = (() => {
    const buckets = {};
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = { label: MONTHS_SHORT[d.getMonth()], count: 0 };
    }
    services.forEach((s) => {
      if (!s.createdAt) return;
      const d   = new Date(s.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].count++;
    });
    return Object.values(buckets);
  })();

  const needsAttention = services.filter(
    (s) =>
      s.status === "ON_HOLD" ||
      s.application?.applicationTrackStep?.some((st) => st.status === "ERROR") ||
      s.application?.servicePeriod?.some((p) =>
        p.periodStep?.some((st) => st.status === "ERROR")
      )
  );

  const donutSegments = [
    { label: "Active",    value: active,    color: "#0ea5e9" },
    { label: "Pending",   value: pending,   color: "#f59e0b" },
    { label: "Completed", value: completed, color: "#22c55e" },
    { label: "Cancelled", value: cancelled, color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const displayName = profile?.firstName ?? profile?.name?.split(" ")?.[0] ?? "there";
  const fullName    = profile
    ? profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.name ?? "User"
    : "—";

  const STAT_CARDS = [
    {
      label: "Active Services",   value: active,    sub: "Currently in progress",
      Icon: Activity,    accent: { bg: "bg-sky-50",    ring: "ring-sky-100",    icon: "text-sky-500",    bar: "#0ea5e9" },
    },
    {
      label: "Pending / On Hold", value: pending,   sub: "Awaiting start or paused",
      Icon: Clock,       accent: { bg: "bg-amber-50",  ring: "ring-amber-100",  icon: "text-amber-500",  bar: "#f59e0b" },
    },
    {
      label: "Completed",         value: completed, sub: `${pct(completed, total || 1)}% completion rate`,
      Icon: CheckCircle2,accent: { bg: "bg-green-50",  ring: "ring-green-100",  icon: "text-green-500",  bar: "#22c55e" },
    },
    {
      label: "Total Documents",   value: docCount,  sub: "Across all folders",
      Icon: FolderOpen,  accent: { bg: "bg-violet-50", ring: "ring-violet-100", icon: "text-violet-500", bar: "#8b5cf6" },
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#f8fafc 0%,#f1f5f9 100%)" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Shared page header with notification bell */}
      <PageHeader
        title={`${greeting}, ${loading ? "…" : displayName}`}
        subtitle={dateStr}
        onRefresh={() => load(true)}
        refreshing={refreshing}
        actions={
          <a
            href="/services"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all no-underline"
            style={{ background: "var(--color-primary)", boxShadow: "0 4px 14px rgb(239 68 68 / .28)" }}
          >
            <Search size={14} /> Browse Services
          </a>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">

        {/* ── pending docs alert ── */}
        {!loading && pendingDocs.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50">
            <Bell size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-800 flex-1">
              <strong>{pendingDocs.length} document{pendingDocs.length > 1 ? "s" : ""}</strong> need your attention — upload or re-upload required.
            </p>
            <a href="/my-services" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
              View <ArrowRight size={12} />
            </a>
          </div>
        )}

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, sub, Icon, accent }) => (
            <div
              key={label}
              className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200"
              style={{ boxShadow: "0 1px 4px rgb(0 0 0/.05), 0 4px 20px rgb(0 0 0/.04)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase leading-tight pr-1">{label}</span>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ring-2 flex-shrink-0 ${accent.bg} ${accent.ring}`}>
                  <Icon size={16} className={accent.icon} />
                </span>
              </div>
              {loading
                ? <Skeleton className="h-8 w-14" />
                : <p className="text-3xl font-black text-gray-900 leading-none tabular-nums">{fmt(value)}</p>
              }
              {loading
                ? <Skeleton className="h-3 w-28" />
                : <p className="text-xs text-gray-400">{sub}</p>
              }
              <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: loading ? "0%" : `${value > 0 ? Math.max(12, pct(value, Math.max(total, docCount, 1))) : 0}%`,
                    background: accent.bar,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── row 2: donut + sparkline + attention ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* donut */}
          <Card className="p-5">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
              <BarChart3 size={11} /> Service Overview
            </p>
            {loading ? (
              <div className="flex gap-4 items-center">
                <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2.5">{[1,2,3].map(i => <Skeleton key={i} className="h-4" />)}</div>
              </div>
            ) : total === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 border border-dashed border-gray-200">
                  <Package size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">No services yet</p>
                <a href="/services" className="text-xs font-bold mt-1 hover:underline" style={{ color: "var(--color-primary)" }}>
                  Browse services →
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <DonutChart segments={donutSegments} size={130} />
                <div className="space-y-2 flex-1 min-w-0">
                  {[
                    { label: "Active",    v: active,    color: "#0ea5e9" },
                    { label: "Pending",   v: pending,   color: "#f59e0b" },
                    { label: "Completed", v: completed, color: "#22c55e" },
                    { label: "Cancelled", v: cancelled, color: "#ef4444" },
                  ].map(({ label, v, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-xs text-gray-400 flex-1 leading-none">{label}</span>
                      <span className="text-xs font-bold text-gray-800 tabular-nums">{v}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <ShieldCheck size={10} className="text-green-500" />
                    <span className="text-xs text-gray-400 flex-1">Done rate</span>
                    <span className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>
                      {pct(completed, total)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* monthly sparkline */}
          <Card className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                <TrendingUp size={11} /> Monthly Activity
              </p>
              <span className="text-[10px] text-gray-300 font-medium">Last 6 months</span>
            </div>
            {loading ? (
              <>
                <Skeleton className="flex-1 w-full h-16" />
                <Skeleton className="h-3 w-full mt-2" />
              </>
            ) : (
              <>
                <div className="flex-1 flex flex-col justify-end">
                  <Sparkline data={monthlyData} />
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[11px] text-gray-400">This month</p>
                    <p className="text-xl font-black text-gray-800 tabular-nums">
                      {monthlyData[monthlyData.length - 1]?.count ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Total (6 mo)</p>
                    <p className="text-xl font-black text-gray-800 tabular-nums">
                      {monthlyData.reduce((s, d) => s + d.count, 0)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* needs attention */}
          <Card className="p-5 flex flex-col">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <AlertTriangle size={11} /> Needs Attention
            </p>
            {loading ? (
              <div className="space-y-2.5">{[1,2,3].map(i => <Skeleton key={i} className="h-12" />)}</div>
            ) : pendingDocs.length === 0 && needsAttention.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-5">
                <CircleCheck size={32} className="text-green-400 mb-2" />
                <p className="text-sm font-semibold text-gray-500">All clear!</p>
                <p className="text-xs text-gray-300 mt-0.5">Nothing needs your action.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                {pendingDocs.slice(0, 3).map((doc, i) => (
                  <DocAlertRow key={`doc-${i}`} doc={doc} />
                ))}
                {needsAttention
                  .slice(0, Math.max(0, 3 - pendingDocs.slice(0, 3).length))
                  .map((s, i) => (
                    <div key={`svc-${i}`} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <PauseCircle size={13} className="text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{s.service?.name ?? "Service"}</p>
                        <p className="text-[11px] text-gray-400">On hold / Step error</p>
                      </div>
                    </div>
                  ))}
                {(pendingDocs.length + needsAttention.length) > 3 && (
                  <a href="/my-services" className="flex items-center justify-center gap-1 mt-3 text-xs font-bold hover:underline"
                    style={{ color: "var(--color-primary)" }}>
                    +{pendingDocs.length + needsAttention.length - 3} more <ArrowRight size={11} />
                  </a>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* ── row 3: recent services + profile + quick links ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* recent services (2 cols on lg) */}
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                <Layers size={11} /> Recent Services
              </p>
              <a href="/my-services" className="text-xs font-bold flex items-center gap-1 hover:underline"
                style={{ color: "var(--color-primary)" }}>
                All services <ChevronRight size={12} />
              </a>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14" />)}</div>
            ) : recentServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Briefcase size={36} className="text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No services purchased yet</p>
                <a href="/services" className="mt-2 text-xs font-bold flex items-center gap-1 hover:underline"
                  style={{ color: "var(--color-primary)" }}>
                  Browse services <ArrowRight size={11} />
                </a>
              </div>
            ) : (
              recentServices.map((s) => <ServiceRow key={s.myServiceId} svc={s} />)
            )}
          </Card>

          {/* right col */}
          <div className="flex flex-col gap-4">

            {/* profile summary */}
            <Card className="p-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                <UserCircle size={11} /> Account
              </p>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-36" /></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    {profile?.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={fullName}
                        className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 border-2 border-white"
                        style={{ boxShadow: "0 4px 12px rgb(239 68 68 / .18)" }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,var(--color-primary),var(--primary-600,#dc2626))", boxShadow: "0 4px 12px rgb(239 68 68 / .22)" }}
                      >
                        {(profile?.firstName?.[0] ?? profile?.name?.[0] ?? "U").toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{profile?.email ?? "—"}</p>
                      {profile?.role && (
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 capitalize"
                          style={{ background: "var(--primary-50)", color: "var(--color-primary)" }}>
                          {profile.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    {[
                      { label: "Services", value: total,    Icon: Package   },
                      { label: "Active",   value: active,   Icon: Activity  },
                      { label: "Docs",     value: docCount, Icon: FileText  },
                    ].map(({ label, value: v, Icon }) => (
                      <div key={label} className="text-center">
                        <Icon size={12} className="text-gray-300 mx-auto mb-0.5" />
                        <p className="text-base font-black text-gray-800 tabular-nums">{fmt(v)}</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                  <a
                    href="/profile"
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 no-underline"
                    style={{ background: "var(--primary-50)", color: "var(--color-primary)" }}
                  >
                    <UserCircle size={12} /> Edit Profile
                  </a>
                </>
              )}
            </Card>

            {/* quick links */}
            <Card className="p-4 flex-1">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                <LayoutGrid size={11} /> Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/services",    Icon: Search,     label: "Browse",      sub: "Find services"  },
                  { href: "/my-services", Icon: Briefcase,  label: "My Services", sub: "Track requests" },
                  { href: "/documents",   Icon: FolderOpen, label: "Documents",   sub: "Manage files"   },
                  { href: "/profile",     Icon: UserCircle, label: "Profile",     sub: "Update info"    },
                ].map(({ href, Icon, label, sub }) => (
                  <a
                    key={href}
                    href={href}
                    className="group flex flex-col gap-1 p-3 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-150 hover:-translate-y-0.5 no-underline"
                  >
                    <Icon size={15} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-red-500 transition-colors leading-tight">{label}</span>
                    <span className="text-[10px] text-gray-300 leading-tight">{sub}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-300 pb-2">
          Live data from your account · {dateStr}
        </p>
      </div>
    </div>
  );
}
