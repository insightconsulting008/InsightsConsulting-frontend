import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@src/providers/axiosInstance";
import {
  ClipboardList, CheckCircle2, Clock, AlertCircle,
  TrendingUp, Activity, ChevronRight,
  FileText, UserCircle, Layers, BarChart3,
  ArrowRight, Briefcase, ShieldCheck,
  CalendarDays, Zap, Ban, PauseCircle,
  CircleCheck, Timer, FilePen, LayoutGrid, Inbox,
} from "lucide-react";
import PageHeader from "../page-header/PageHeader";

/* ─── helpers ─────────────────────────────────────────────────────── */
const staffId  = localStorage.getItem("employeeId");
const fmt      = (n) => (n ?? 0).toLocaleString("en-IN");
const pct      = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const fmtDate  = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
const fmtFull  = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
    className={`rounded-xl ${className}`}
    style={{
      background: "linear-gradient(90deg,#f1f5f9 25%,#e9eef4 50%,#f1f5f9 75%)",
      backgroundSize: "400% 100%",
      animation: "shimmer 1.4s infinite ease",
    }}
  />
);

/* ─── donut ───────────────────────────────────────────────────────── */
const Donut = ({ segments, size = 130 }) => {
  const r = 46, cx = 60, cy = 60, circ = 2 * Math.PI * r;
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
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="8.5" fill="#9ca3af" fontWeight="700" letterSpacing="1.2">TASKS</text>
    </svg>
  );
};

/* ─── bar sparkline ───────────────────────────────────────────────── */
const Sparkline = ({ data }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-14 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t"
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
const APP_STATUS = {
  IN_PROGRESS:    { label: "In Progress",     color: "#0ea5e9", bg: "bg-sky-50",    text: "text-sky-600",    Icon: Activity     },
  NOT_STARTED:    { label: "Not Started",     color: "#94a3b8", bg: "bg-slate-50",  text: "text-slate-500",  Icon: Clock        },
  COMPLETED:      { label: "Completed",       color: "#22c55e", bg: "bg-green-50",  text: "text-green-600",  Icon: CheckCircle2 },
  CANCELLED:      { label: "Cancelled",       color: "#ef4444", bg: "bg-red-50",    text: "text-red-500",    Icon: Ban          },
  ON_HOLD:        { label: "On Hold",         color: "#f59e0b", bg: "bg-amber-50",  text: "text-amber-600",  Icon: PauseCircle  },
  PENDING_REVIEW: { label: "Pending Review",  color: "#8b5cf6", bg: "bg-violet-50", text: "text-violet-600", Icon: Timer        },
};

/* ─── task row ────────────────────────────────────────────────────── */
const TaskRow = ({ task, onClick }) => {
  const status = task.status ?? task.applicationStatus ?? "NOT_STARTED";
  const cfg    = APP_STATUS[status] ?? APP_STATUS.NOT_STARTED;
  const name   = task.service?.name ?? task.serviceName ?? "Unnamed Task";
  const client = task.user
    ? `${task.user.firstName ?? ""} ${task.user.lastName ?? ""}`.trim() || task.user.email
    : task.clientName ?? "—";
  const date   = fmtDate(task.updatedAt ?? task.createdAt);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 cursor-pointer group hover:bg-gray-50/60 -mx-2 px-2 rounded-xl transition-colors"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}18` }}>
        <cfg.Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-gray-900">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <UserCircle size={9} /> {client}
          <span className="text-gray-200">·</span>
          <CalendarDays size={9} /> {date}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
          <cfg.Icon size={9}/> {cfg.label}
        </span>
        <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </div>
  );
};

/* ─── step progress row ───────────────────────────────────────────── */
const StepProgressRow = ({ task }) => {
  const steps   = task.application?.applicationTrackStep ?? [];
  const total   = steps.length;
  const done    = steps.filter((s) => s.status === "COMPLETED").length;
  const pctDone = pct(done, total || 1);
  const name    = task.service?.name ?? task.serviceName ?? "Task";

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--primary-50)', color: 'var(--color-primary)' }}>
        <Layers size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 truncate">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pctDone}%`, background: "var(--color-primary)" }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">{done}/{total}</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   STAFF DASHBOARD
═══════════════════════════════════════════════════════════════════ */
export default function StaffDashboard() {
  const navigate = useNavigate();

  const [profile,    setProfile]    = useState(null);
  const [tasks,      setTasks]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const now      = new Date();
  const greeting = now.getHours() < 12 ? "Good morning"
                 : now.getHours() < 17 ? "Good afternoon"
                 : "Good evening";
  const dateStr  = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);

    const [profileRes, tasksRes] = await Promise.allSettled([
      axiosInstance.get("/staff/profile"),
      axiosInstance.get(`/staff/tasks/${staffId}`),
    ]);

    if (profileRes.status === "fulfilled") {
      setProfile(profileRes.value.data?.data ?? null);
    }
    if (tasksRes.status === "fulfilled" && tasksRes.value.data?.success) {
      setTasks(tasksRes.value.data.data ?? []);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* derived */
  const inProgress    = tasks.filter((t) => (t.status ?? t.applicationStatus) === "IN_PROGRESS").length;
  const notStarted    = tasks.filter((t) => (t.status ?? t.applicationStatus) === "NOT_STARTED").length;
  const completed     = tasks.filter((t) => (t.status ?? t.applicationStatus) === "COMPLETED").length;
  const onHold        = tasks.filter((t) => (t.status ?? t.applicationStatus) === "ON_HOLD").length;
  const pendingReview = tasks.filter((t) => (t.status ?? t.applicationStatus) === "PENDING_REVIEW").length;
  const total         = tasks.length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt) - new Date(a.updatedAt ?? a.createdAt))
    .slice(0, 6);

  const inProgressTasks = tasks
    .filter((t) => (t.status ?? t.applicationStatus) === "IN_PROGRESS")
    .slice(0, 5);

  const monthlyData = (() => {
    const buckets = {};
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = { label: MONTHS[d.getMonth()], count: 0 };
    }
    tasks.forEach((t) => {
      if (!t.createdAt) return;
      const d   = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].count++;
    });
    return Object.values(buckets);
  })();

  const needsAction = tasks.filter(
    (t) =>
      (t.status ?? t.applicationStatus) === "ON_HOLD" ||
      t.application?.applicationTrackStep?.some((s) => s.status === "ERROR")
  );

  const donutSegments = [
    { label: "In Progress",    value: inProgress,    color: "#0ea5e9" },
    { label: "Not Started",    value: notStarted,    color: "#94a3b8" },
    { label: "Completed",      value: completed,     color: "#22c55e" },
    { label: "On Hold",        value: onHold,        color: "#f59e0b" },
    { label: "Pending Review", value: pendingReview, color: "#8b5cf6" },
  ].filter((s) => s.value > 0);

  const displayName = profile?.firstName ?? profile?.name?.split(" ")?.[0] ?? "there";
  const fullName    = profile
    ? profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.name ?? "Staff"
    : "—";

  const STAT_CARDS = [
    {
      label: "In Progress",    value: inProgress,  sub: "Actively working on",
      Icon: Activity,          accent: { bg: "bg-sky-50",    ring: "ring-sky-100",    icon: "text-sky-500",    bar: "#0ea5e9" },
    },
    {
      label: "Not Started",    value: notStarted,  sub: "Awaiting your action",
      Icon: Inbox,             accent: { bg: "bg-slate-50",  ring: "ring-slate-100",  icon: "text-slate-400",  bar: "#94a3b8" },
    },
    {
      label: "Completed",      value: completed,   sub: `${pct(completed, total || 1)}% completion rate`,
      Icon: CheckCircle2,      accent: { bg: "bg-green-50",  ring: "ring-green-100",  icon: "text-green-500",  bar: "#22c55e" },
    },
    {
      label: "Total Assigned", value: total,       sub: "All assigned tasks",
      Icon: ClipboardList,     accent: { bg: "bg-violet-50", ring: "ring-violet-100", icon: "text-violet-500", bar: "#8b5cf6" },
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
          <button
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "var(--color-primary)", boxShadow: "0 4px 14px rgb(239 68 68 / .28)" }}
          >
            <ClipboardList size={14} /> View All Tasks
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5">

        {/* ── needs action alert ── */}
        {!loading && needsAction.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-800 flex-1">
              <strong>{needsAction.length} task{needsAction.length > 1 ? "s" : ""}</strong> need your attention — on hold or step errors.
            </p>
            <button onClick={() => navigate("/tasks")} className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
              View <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, sub, Icon, accent }) => (
            <Card key={label} className="p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200">
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
                    width: loading ? "0%" : `${value > 0 ? Math.max(10, pct(value, Math.max(total, 1))) : 0}%`,
                    background: accent.bar,
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* ── row 2: donut + sparkline + progress ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* donut */}
          <Card className="p-5">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
              <BarChart3 size={11} /> Task Overview
            </p>
            {loading ? (
              <div className="flex gap-4 items-center">
                <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2.5">{[1,2,3].map(i => <Skeleton key={i} className="h-4" />)}</div>
              </div>
            ) : total === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-3">
                  <Briefcase size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">No tasks assigned yet</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Donut segments={donutSegments} size={130} />
                <div className="space-y-1.5 flex-1 min-w-0">
                  {[
                    { label: "In Progress",    v: inProgress,    color: "#0ea5e9" },
                    { label: "Not Started",    v: notStarted,    color: "#94a3b8" },
                    { label: "Completed",      v: completed,     color: "#22c55e" },
                    { label: "On Hold",        v: onHold,        color: "#f59e0b" },
                    { label: "Pending Review", v: pendingReview, color: "#8b5cf6" },
                  ].filter(s => s.v > 0).map(({ label, v, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-xs text-gray-400 flex-1 leading-none">{label}</span>
                      <span className="text-xs font-bold text-gray-800 tabular-nums">{v}</span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-gray-100 flex items-center gap-2">
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
                <TrendingUp size={11} /> Monthly Tasks
              </p>
              <span className="text-[10px] text-gray-300 font-medium">Last 6 months</span>
            </div>
            {loading ? (
              <><Skeleton className="flex-1 w-full h-14" /><Skeleton className="h-3 w-full mt-2" /></>
            ) : (
              <>
                <div className="flex-1 flex flex-col justify-end">
                  <Sparkline data={monthlyData} />
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-gray-400">This month</p>
                    <p className="text-xl font-black text-gray-800 tabular-nums">
                      {monthlyData[monthlyData.length - 1]?.count ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Last 6 months</p>
                    <p className="text-xl font-black text-gray-800 tabular-nums">
                      {monthlyData.reduce((s, d) => s + d.count, 0)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* active task progress */}
          <Card className="p-5 flex flex-col">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <Layers size={11} /> Active Task Progress
            </p>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12" />)}</div>
            ) : inProgressTasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-5">
                <CircleCheck size={32} className="text-green-400 mb-2" />
                <p className="text-sm font-semibold text-gray-500">No active tasks</p>
                <p className="text-xs text-gray-300 mt-0.5">All tasks are up to date!</p>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                {inProgressTasks.map((t, i) => (
                  <StepProgressRow key={t.applicationId ?? i} task={t} />
                ))}
                {inProgress > 5 && (
                  <button
                    onClick={() => navigate("/tasks")}
                    className="flex items-center justify-center gap-1 mt-3 text-xs font-bold hover:underline w-full"
                    style={{ color: "var(--color-primary)" }}
                  >
                    +{inProgress - 5} more <ArrowRight size={11} />
                  </button>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* ── row 3: recent tasks + profile + quick links ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* recent tasks (spans 2 cols) */}
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                <ClipboardList size={11} /> Recent Tasks
              </p>
              <button
                onClick={() => navigate("/tasks")}
                className="text-xs font-bold flex items-center gap-1 hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                All tasks <ChevronRight size={12} />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14" />)}</div>
            ) : recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Briefcase size={36} className="text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No tasks assigned yet</p>
              </div>
            ) : (
              recentTasks.map((t, i) => (
                <TaskRow
                  key={t.applicationId ?? i}
                  task={t}
                  onClick={() => navigate(`/tasks/${t.applicationId}`)}
                />
              ))
            )}
          </Card>

          {/* right col */}
          <div className="flex flex-col gap-4">

            {/* staff profile card */}
            <Card className="p-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                <UserCircle size={11} /> My Account
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
                        {(profile?.firstName?.[0] ?? profile?.name?.[0] ?? "S").toUpperCase()}
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
                      { label: "Assigned", value: total,      Icon: ClipboardList },
                      { label: "Active",   value: inProgress, Icon: Activity      },
                      { label: "Done",     value: completed,  Icon: CheckCircle2  },
                    ].map(({ label, value: v, Icon }) => (
                      <div key={label} className="text-center">
                        <Icon size={12} className="text-gray-300 mx-auto mb-0.5" />
                        <p className="text-base font-black text-gray-800 tabular-nums">{fmt(v)}</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                    style={{ background: "var(--primary-50)", color: "var(--color-primary)" }}
                  >
                    <UserCircle size={12} /> Edit Profile
                  </button>
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
                  { Icon: ClipboardList, label: "My Tasks",   sub: "View all tasks",   path: "/tasks"     },
                  { Icon: FilePen,       label: "Amendment",  sub: "Create link",      path: "/amendment" },
                  { Icon: FileText,      label: "Documents",  sub: "Browse files",     path: "/documents" },
                  { Icon: UserCircle,    label: "Profile",    sub: "Update your info", path: "/profile"   },
                ].map(({ Icon, label, sub, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="group flex flex-col gap-1 p-3 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-150 hover:-translate-y-0.5 text-left"
                  >
                    <Icon size={15} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-red-500 transition-colors leading-tight">{label}</span>
                    <span className="text-[10px] text-gray-300 leading-tight">{sub}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-300 pb-2">
          Live data from your assigned tasks · {dateStr}
        </p>
      </div>
    </div>
  );
}
