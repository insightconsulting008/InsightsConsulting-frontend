import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Package, CreditCard, Briefcase,
  TrendingUp, TrendingDown, UserCheck, Building2, Layers,
  ArrowRight, Activity, Star,
  BarChart3, PieChart, Zap, DollarSign,
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';
import PageHeader from '../page-header/PageHeader';

/* ─── helpers ─────────────────────────────────────────────────────── */
const fmtINR = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const fmtTime = d => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/* ─── MiniBar ─────────────────────────────────────────────────────── */
function MiniBar({ pct = 0, color = 'var(--color-primary)', height = 6 }) {
  return (
    <div className="w-full rounded-full bg-gray-100 overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          background: color,
          transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
    </div>
  );
}

/* ─── StatCard ────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color, bg, border, pct, trend, loading }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-3.5 border shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-default"
      style={{ borderColor: border || '#e4e4ec' }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: bg || 'var(--primary-50)', color: color || 'var(--color-primary)' }}
        >
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
            trend >= 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'
          }`}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div>
        {loading ? (
          <>
            <div className="h-7 w-1/2 rounded-lg bg-gray-100 animate-pulse mb-1.5" />
            <div className="h-3 w-2/3 rounded-md bg-gray-100 animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-[28px] font-black text-gray-900 tracking-tight leading-none">{value ?? '—'}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
            {sub && <p className="text-[11px] text-gray-300 mt-0.5">{sub}</p>}
          </>
        )}
      </div>

      {pct !== undefined && <MiniBar pct={pct} color={color || 'var(--color-primary)'} />}
    </div>
  );
}

/* ─── SectionTitle ────────────────────────────────────────────────── */
function SectionTitle({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-[9px] flex-shrink-0 flex items-center justify-center"
          style={{ background: 'var(--primary-100)', color: 'var(--color-primary)' }}
        >
          <Icon size={15} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
          {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ─── Status pill ─────────────────────────────────────────────────── */
const STATUS_COLORS = {
  PENDING:   { bg: '#fffbeb', color: '#b45309', border: '#fef3c7' },
  ASSIGNED:  { bg: 'var(--primary-50)', color: 'var(--color-primary)', border: 'var(--primary-200)' },
  COMPLETED: { bg: '#ecfdf5', color: '#047857', border: '#d1fae5' },
  PAID:      { bg: '#ecfdf5', color: '#047857', border: '#d1fae5' },
  FAILED:    { bg: '#fff1f2', color: '#be123c', border: '#ffe4e6' },
  ACTIVE:    { bg: '#ecfdf5', color: '#047857', border: '#d1fae5' },
};
function Pill({ status }) {
  const cfg = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap border"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {status}
    </span>
  );
}

/* ─── Donut chart (SVG) ───────────────────────────────────────────── */
function DonutSlice({ segments, size = 100 }) {
  const r = 32, cx = 50, cy = 50, strokeW = 14;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circumference;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circumference}`}
            strokeDashoffset={-(offset / 100) * circumference}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += s.pct;
        return el;
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AdminDashboard
══════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [stats,        setStats]        = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPays,   setRecentPays]   = useState([]);
  const [employees,    setEmployees]    = useState([]);
  const [departments,  setDepartments]  = useState([]);
  const [services,     setServices]     = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments,     setPayments]     = useState([]);
  const [users,        setUsers]        = useState({ total: 0, google: 0, email: 0 });
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const safe = async fn => { try { return await fn(); } catch { return null; } };

    const [statsRes, empRes, deptRes, appRes, payRes, usersRes, serviceRes] = await Promise.all([
      safe(() => axiosInstance.get('/dashboard/stats')),
      safe(() => axiosInstance.get('/employee', { params: { page: 1, limit: 5 } })),
      safe(() => axiosInstance.get('/department', { params: { page: 1, limit: 100 } })),
      safe(() => axiosInstance.get('/applications')),
      safe(() => axiosInstance.get('/payments', { params: { page: 1, limit: 5 } })),
      safe(() => axiosInstance.get('/users', { params: { page: 1, limit: 100 } })),
      safe(() => axiosInstance.get('/service', { params: { page: 1, limit: 100 } })),
    ]);

    if (statsRes?.data?.data || statsRes?.data) setStats(statsRes.data?.data ?? statsRes.data);
    if (empRes?.data?.data) setEmployees(empRes.data.data);
    if (deptRes?.data?.data || deptRes?.data?.departments) setDepartments(deptRes.data.data || deptRes.data.departments || []);
    if (appRes?.data?.applications) {
      const apps = appRes.data.applications;
      setApplications(apps);
      setRecentOrders(apps.slice(0, 5));
    }
    if (payRes?.data?.data) {
      setPayments(payRes.data.data);
      setRecentPays(payRes.data.data.slice(0, 5));
    }
    if (usersRes?.data?.users) {
      const all = usersRes.data.users;
      setUsers({
        total:  usersRes.data.pagination?.total ?? all.length,
        google: all.filter(u => u.provider === 'GOOGLE').length,
        email:  all.filter(u => u.provider === 'EMAIL').length,
      });
    }
    if (serviceRes?.data?.data || serviceRes?.data?.services) setServices(serviceRes.data.data || serviceRes.data.services || []);

    setLastUpdated(new Date());
    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* derived */
  const totalEmployees    = stats?.totalEmployees   ?? employees.length;
  const activeEmployees   = stats?.activeEmployees  ?? employees.filter(e => e.status === 'ACTIVE').length;
  const inactiveEmployees = stats?.inactiveEmployees ?? (totalEmployees - activeEmployees);
  const totalDepts        = stats?.totalDepartments ?? departments.length;
  const totalApps         = applications.length;
  const pendingApps       = applications.filter(a => a.status === 'PENDING').length;
  const assignedApps      = applications.filter(a => a.status === 'ASSIGNED').length;
  const completedApps     = applications.filter(a => a.status === 'COMPLETED').length;
  const totalRevenue      = payments.reduce((s, p) => p.status === 'PAID' ? s + (p.amount || 0) : s, 0);
  const paidCount         = payments.filter(p => p.status === 'PAID').length;
  const failedCount       = payments.filter(p => p.status === 'FAILED').length;
  const assignmentRate    = totalApps ? Math.round(((assignedApps + completedApps) / totalApps) * 100) : 0;
  const activeRate        = totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
  const completionRate    = totalApps ? Math.round((completedApps / totalApps) * 100) : 0;

  const orderDonut = [
    { label: 'Unassigned', pct: totalApps ? Math.round((pendingApps  / totalApps) * 100) : 0, color: '#f59e0b' },
    { label: 'Assigned',   pct: totalApps ? Math.round((assignedApps / totalApps) * 100) : 0, color: 'var(--color-primary)' },
    { label: 'Completed',  pct: totalApps ? Math.round((completedApps / totalApps) * 100) : 0, color: '#10b981' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--neutral-50, #f8f8fa)' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .dash-card { animation: fadeUp .35s ease both; }
        .dash-row { transition: background 150ms; }
        .dash-row:hover { background: var(--primary-50, #fef2f2) !important; }
      `}</style>

      {/* Shared page header with notification bell */}
      <PageHeader
        title="Dashboard"
        subtitle={lastUpdated ? `Last updated ${fmtTime(lastUpdated)}` : 'Loading…'}
        onRefresh={() => fetchAll(true)}
        refreshing={refreshing}
      />

      <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-7">

        {/* ── Welcome banner ── */}
        <div
          className="dash-card rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--primary-600, #dc2626) 100%)' }}
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/[.08]" />
          <div className="absolute right-14 -bottom-14 w-36 h-36 rounded-full bg-white/[.05]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-1.5">
              <Activity size={18} className="opacity-80" />
              <span className="text-xs font-bold opacity-80 tracking-[.08em] uppercase">Overview</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-1">Admin Dashboard</h2>
            <p className="text-sm opacity-75">
              A real-time snapshot of your platform — employees, orders, payments, and more.
            </p>
          </div>
        </div>

        {/* ── KPI stat cards ── */}
        <div>
          <SectionTitle icon={BarChart3} title="Key Metrics" sub="Platform-wide at a glance" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
            <StatCard
              icon={Users} label="Total Employees" value={totalEmployees}
              sub={`${activeEmployees} active · ${inactiveEmployees} inactive`}
              color="var(--color-primary)" bg="var(--primary-50,#fef2f2)"
              pct={activeRate} loading={loading}
            />
            <StatCard
              icon={Building2} label="Departments" value={totalDepts}
              sub="Active departments" color="#7c3aed" bg="#f5f3ff" loading={loading}
            />
            <StatCard
              icon={Package} label="Total Orders" value={totalApps}
              sub={`${pendingApps} awaiting · ${completedApps} done`}
              color="#d97706" bg="#fffbeb" pct={assignmentRate} loading={loading}
            />
            <StatCard
              icon={DollarSign} label="Total Revenue" value={fmtINR(totalRevenue)}
              sub={`${paidCount} paid · ${failedCount} failed`}
              color="#059669" bg="#ecfdf5"
              pct={paidCount + failedCount ? Math.round((paidCount / (paidCount + failedCount)) * 100) : 0}
              loading={loading}
            />
            <StatCard
              icon={UserCheck} label="Registered Users" value={users.total}
              sub={`${users.google} via Google · ${users.email} via Email`}
              color="#2563eb" bg="#eff6ff" loading={loading}
            />
            <StatCard
              icon={Briefcase} label="Services" value={services.length}
              sub="Available service items" color="#db2777" bg="#fdf4ff" loading={loading}
            />
          </div>
        </div>

        {/* ── Order distribution + Workforce health ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Order distribution */}
          <div className="dash-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm" style={{ animationDelay: '.05s' }}>
            <SectionTitle icon={PieChart} title="Order Distribution" sub="By current status" />
            <div className="flex items-center gap-7">
              <div className="flex-shrink-0">
                <DonutSlice segments={loading ? [] : orderDonut} size={110} />
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                {orderDonut.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                        <span className="w-2 h-2 rounded-[2px] flex-shrink-0" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{loading ? '—' : `${s.pct}%`}</span>
                    </div>
                    <MiniBar pct={loading ? 0 : s.pct} color={s.color} height={5} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2.5 mt-4">
              {[
                { label: 'Unassigned', val: pendingApps,   color: '#f59e0b',                bg: '#fffbeb' },
                { label: 'Assigned',   val: assignedApps,  color: 'var(--color-primary)',   bg: 'var(--primary-50)' },
                { label: 'Completed',  val: completedApps, color: '#059669',                bg: '#ecfdf5' },
              ].map(c => (
                <div key={c.label} className="flex-1 text-center rounded-xl py-2.5" style={{ background: c.bg }}>
                  <p className="text-xl font-black" style={{ color: c.color }}>{loading ? '—' : c.val}</p>
                  <p className="text-[10px] font-semibold opacity-80" style={{ color: c.color }}>{c.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workforce health */}
          <div className="dash-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm" style={{ animationDelay: '.1s' }}>
            <SectionTitle icon={Activity} title="Workforce Health" sub="Employee status breakdown" />
            <div className="flex flex-col gap-3.5">
              {[
                { label: 'Active',   val: activeEmployees,   total: totalEmployees, color: '#059669' },
                { label: 'Inactive', val: inactiveEmployees, total: totalEmployees, color: '#dc2626' },
                { label: 'Depts',    val: totalDepts,        total: 20,             color: '#7c3aed' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{r.label}</span>
                    <span className="text-sm font-black text-gray-900">{loading ? '—' : r.val}</span>
                  </div>
                  <MiniBar
                    pct={loading ? 0 : r.total ? Math.round((r.val / r.total) * 100) : 0}
                    color={r.color} height={8}
                  />
                </div>
              ))}

              {/* completion rate callout */}
              <div
                className="mt-1.5 rounded-xl p-3.5 border-2"
                style={{ background: 'linear-gradient(135deg,var(--primary-50),#fff)', borderColor: 'var(--primary-200)' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[.07em]">Order Completion Rate</p>
                    <p className="text-2xl font-black mt-0.5" style={{ color: 'var(--color-primary)' }}>
                      {loading ? '—' : `${completionRate}%`}
                    </p>
                  </div>
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg width="60" height="60" className="absolute inset-[-4px]" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="22" fill="none" stroke="var(--primary-200)" strokeWidth="4" />
                      <circle cx="26" cy="26" r="22" fill="none" stroke="var(--color-primary)" strokeWidth="4"
                        strokeDasharray={`${loading ? 0 : (completionRate / 100) * 138.2} 138.2`}
                        strokeLinecap="round" transform="rotate(-90 26 26)"
                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                      />
                    </svg>
                    <Zap size={18} style={{ color: 'var(--color-primary)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent orders + recent payments ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Recent orders */}
          <div className="dash-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animationDelay: '.15s' }}>
            <div className="p-5 pb-3">
              <SectionTitle
                icon={Package} title="Recent Orders" sub="Latest 5 service requests"
                action={
                  <a href="/orders" className="flex items-center gap-1 text-[11px] font-bold no-underline"
                    style={{ color: 'var(--color-primary)' }}>
                    View all <ArrowRight size={11} />
                  </a>
                }
              />
            </div>
            {loading ? (
              <div className="px-5 pb-5 space-y-0">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 py-3 border-b border-gray-50">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 w-3/5 rounded-md bg-gray-100 animate-pulse mb-1.5" />
                      <div className="h-2.5 w-2/5 rounded-md bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div>
                {recentOrders.map(order => (
                  <div key={order.applicationId}
                    className="dash-row flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: 'var(--primary-50)', color: 'var(--color-primary)' }}>
                      {order.servicePhoto
                        ? <img src={order.servicePhoto} alt="" className="w-full h-full object-cover"
                            onError={e => e.target.style.display = 'none'} />
                        : <Package size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{order.serviceName}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{order.userName || '—'} · {fmtDate(order.createdAt)}</p>
                    </div>
                    <Pill status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent payments */}
          <div className="dash-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animationDelay: '.2s' }}>
            <div className="p-5 pb-3">
              <SectionTitle
                icon={CreditCard} title="Recent Payments" sub="Latest transactions"
                action={
                  <a href="/payment-history" className="flex items-center gap-1 text-[11px] font-bold no-underline"
                    style={{ color: 'var(--color-primary)' }}>
                    View all <ArrowRight size={11} />
                  </a>
                }
              />
            </div>
            {loading ? (
              <div className="px-5 pb-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 py-3 border-b border-gray-50">
                    <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 w-3/5 rounded-md bg-gray-100 animate-pulse mb-1.5" />
                      <div className="h-2.5 w-2/5 rounded-md bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentPays.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No payments yet</p>
              </div>
            ) : (
              <div>
                {recentPays.map(pay => (
                  <div key={pay.paymentId || pay.id}
                    className="dash-row flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-emerald-700 bg-emerald-50">
                      {pay.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{pay.user?.name || '—'}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(pay.createdAt)} · {pay.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-black ${pay.status === 'PAID' ? 'text-emerald-600' : 'text-gray-700'}`}>
                        {fmtINR(pay.amount)}
                      </p>
                      <Pill status={pay.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="dash-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm" style={{ animationDelay: '.25s' }}>
          <SectionTitle icon={Zap} title="Quick Actions" sub="Jump to any section" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Employees',    href: '/employees',      icon: Users,      color: 'var(--color-primary)', bg: 'var(--primary-50)' },
              { label: 'Orders',       href: '/orders',          icon: Package,    color: '#d97706', bg: '#fffbeb' },
              { label: 'Payments',     href: '/payment-history', icon: CreditCard, color: '#059669', bg: '#ecfdf5' },
              { label: 'Users',        href: '/users',           icon: UserCheck,  color: '#2563eb', bg: '#eff6ff' },
              { label: 'Services',     href: '/services-hub',    icon: Briefcase,  color: '#db2777', bg: '#fdf4ff' },
              { label: 'Reports',      href: '/reports',         icon: BarChart3,  color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Amendments',   href: '/amendment',       icon: Layers,     color: '#0891b2', bg: '#ecfeff' },
              { label: 'Email Config', href: '/email-config',    icon: Star,       color: '#ca8a04', bg: '#fefce8' },
            ].map(q => (
              <a key={q.label} href={q.href}
                className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl no-underline border transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: q.bg, borderColor: `${q.color}20` }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${q.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <q.icon size={18} style={{ color: q.color, flexShrink: 0 }} />
                <span className="text-sm font-bold" style={{ color: q.color }}>{q.label}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-300 pb-2">Admin Dashboard · Data refreshes on page load</p>
      </div>
    </div>
  );
}
