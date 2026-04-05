import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, Calendar, User, Mail, Phone,
  FileText, CheckCircle, Clock, AlertCircle, Download,
  RefreshCw, ShieldCheck, UserCheck, ExternalLink,
  ChevronDown, ChevronUp, Hash, Type, Activity,
  IndianRupee, Tag, Layers, Lock, Unlock, BarChart2,
  XCircle, Loader2
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';
import PageHeader from '../page-header/PageHeader';

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const fmt = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtShort = (d) => {
  if (!d) return { time: '', day: '' };
  const dt = new Date(d);
  return {
    time: dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    day:  dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
};

const getFieldType = (v) => {
  if (typeof v === 'object' && v !== null) return v.url && v.sizeInMb ? 'file' : 'object';
  if (typeof v === 'string') {
    if (v.includes('@') && v.includes('.')) return 'email';
    if (v.match(/^\d{10}$/)) return 'phone';
    if (v.match(/^\d{12}$/)) return 'aadhar';
    if (v.match(/^[A-Z]{5}\d{4}[A-Z]$/)) return 'pan';
    if (v.match(/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d][Z][A-Z\d]$/)) return 'gst';
    if (!isNaN(v) && v.trim() !== '') return 'number';
    return 'text';
  }
  if (typeof v === 'boolean') return 'boolean';
  return 'text';
};

/* Activity dot colour — works for ANY action string */
const dotStyle = (action = '') => {
  const a = action.toUpperCase();
  if (a.includes('COMPLETED') || a.includes('APPROVED') || a.includes('VERIFIED') || a.includes('ISSUED'))
    return { bg: 'bg-emerald-500', ring: 'ring-emerald-100', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (a.includes('REJECT') || a.includes('FAIL') || a.includes('CANCEL') || a.includes('ERROR'))
    return { bg: 'bg-rose-500', ring: 'ring-rose-100', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
  if (a.includes('ASSIGNED') || a.includes('CREATED') || a.includes('SUBMITTED') || a.includes('UPLOADED'))
    return { bg: 'bg-blue-500', ring: 'ring-blue-100', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (a.includes('PENDING') || a.includes('REVIEW'))
    return { bg: 'bg-amber-400', ring: 'ring-amber-100', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { bg: 'bg-gray-400', ring: 'ring-gray-100', badge: 'bg-gray-100 text-gray-600 border-gray-200' };
};

const roleChip = (role = '') => {
  const map = { ADMIN: 'bg-purple-50 text-purple-700', USER: 'bg-teal-50 text-teal-700', EMPLOYEE: 'bg-orange-50 text-orange-700', STAFF: 'bg-orange-50 text-orange-700' };
  return map[role] || 'bg-gray-100 text-gray-600';
};

const statusCls = (s = '') => {
  const map = {
    COMPLETED:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    ASSIGNED:    'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PROCESSING:  'bg-indigo-50 text-indigo-700 border-indigo-200',
    REJECTED:    'bg-rose-50 text-rose-700 border-rose-200',
    CANCELLED:   'bg-rose-50 text-rose-700 border-rose-200',
    ERROR:       'bg-rose-50 text-rose-700 border-rose-200',
  };
  return map[s] || 'bg-amber-50 text-amber-700 border-amber-200';
};

/* Step status → dot background/border colour */
const stepDot = (s = '') => {
  if (s === 'COMPLETED')                              return 'bg-emerald-500 border-emerald-500';
  if (s === 'PROCESSING' || s === 'IN_PROGRESS')      return 'bg-indigo-500 border-indigo-500';
  if (s === 'ERROR')                                  return 'bg-rose-500 border-rose-500';
  return 'bg-white border-gray-300';
};

/* Number text colour inside the dot — white when filled, gray when empty */
const stepNumCls = (s = '') => {
  if (s === 'COMPLETED' || s === 'PROCESSING' || s === 'IN_PROGRESS' || s === 'ERROR')
    return 'text-white';
  return 'text-gray-400';
};

/* ══════════════════════════════════════════
   SHARED UI ATOMS
══════════════════════════════════════════ */
function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icon size={14} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 mb-0.5 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words leading-snug">{value || '—'}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children, noPad = false, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className={noPad ? '' : 'p-4 sm:p-6'}>{children}</div>
    </div>
  );
}

function Badge({ label, cls }) {
  return <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cls}`}>{label}</span>;
}

/* ══════════════════════════════════════════
   PERIOD CARD  (for Recurring service)
══════════════════════════════════════════ */
function PeriodCard({ period }) {
  const [open, setOpen] = useState(false);
  const steps = period.periodStep || [];
  const isActive = !period.isLocked;

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${isActive ? 'border-primary-200 shadow-sm' : 'border-gray-200'}`}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isActive ? 'bg-primary-50 hover:bg-primary-100' : 'bg-gray-50 hover:bg-gray-100'}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* lock icon */}
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            {isActive ? <Unlock size={13} /> : <Lock size={13} />}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-gray-700'}`}>{period.periodLabel}</p>
            <p className="text-[10px] text-gray-400">{fmtDate(period.startDate)} – {fmtDate(period.endDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {/* progress bar */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${period.completionPercent || 0}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{period.completionPercent || 0}%</span>
          </div>
          <Badge label={period.status} cls={statusCls(period.status)} />
          {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded steps */}
      {open && (
        <div className="px-4 pb-4 pt-3 bg-white">
          {/* mobile progress bar */}
          <div className="flex sm:hidden items-center gap-2 mb-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${period.completionPercent || 0}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{period.completionPercent || 0}% complete</span>
          </div>

          {steps.length === 0 && <p className="text-xs text-gray-400">No steps defined.</p>}

          <div className="space-y-0">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <div key={step.periodStepId} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${stepDot(step.status)}`}>
                      <span className={`text-[9px] font-bold leading-none ${stepNumCls(step.status)}`}>{step.order}</span>
                    </div>
                    {!isLast && <div className="w-0.5 flex-1 min-h-[16px] bg-gray-200 my-1" />}
                  </div>
                  <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-3'}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                      <Badge label={step.status} cls={statusCls(step.status)} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                    {step.remarks && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mt-1.5">
                        ⚠ {step.remarks}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ViewOrder() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [order,           setOrder]           = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');
  const [expandedFields,  setExpandedFields]  = useState({});
  const [activeTab,       setActiveTab]       = useState('details');
  const [activityData,    setActivityData]    = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError,   setActivityError]   = useState('');

  useEffect(() => { fetchOrderDetails(); }, [applicationId]);
  useEffect(() => { if (activeTab === 'activity') fetchActivityLog(); }, [activeTab]);

  async function fetchOrderDetails() {
    try {
      setLoading(true); setError('');
      const res = await axiosInstance.get(`/application/${applicationId}`);
      if (res.data.success) setOrder(res.data.application);
      else setError('Failed to load order details');
    } catch { setError('Error loading order details. Please try again.'); }
    finally { setLoading(false); }
  }

  async function fetchActivityLog() {
    try {
      setActivityLoading(true); setActivityError('');
      const res = await axiosInstance.get(
        `https://insightsconsult-backend.onrender.com/application-history/${applicationId}`
      );
      if (res.data.success) setActivityData(res.data.application);
      else setActivityError('Failed to load activity log');
    } catch { setActivityError('Error loading activity log. Please try again.'); }
    finally { setActivityLoading(false); }
  }

  /* ── field value renderer ── */
  function FieldValue({ v }) {
    const type = getFieldType(v);
    if (type === 'file') return (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <a href={v.url} target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View File <ExternalLink size={11} />
          </a>
          <p className="text-xs text-gray-400 mt-0.5">{(parseFloat(v.sizeInMb) || 0).toFixed(2)} MB</p>
        </div>
        <a href={v.url} download className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
          <Download size={15} className="text-gray-500" />
        </a>
      </div>
    );
    if (type === 'email') return <a href={`mailto:${v}`} className="flex items-center gap-2 text-primary hover:underline text-sm"><Mail size={13} className="text-gray-400 flex-shrink-0" />{v}</a>;
    if (type === 'phone') return <a href={`tel:${v}`} className="flex items-center gap-2 text-gray-700 text-sm"><Phone size={13} className="text-gray-400 flex-shrink-0" />{v}</a>;
    if (['pan','aadhar','gst'].includes(type)) return <span className="font-mono text-sm bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">{v}</span>;
    if (type === 'number') return <div className="flex items-center gap-2 text-sm"><Hash size={13} className="text-gray-400 flex-shrink-0" /><span className="font-medium">{v}</span></div>;
    if (type === 'boolean') return <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${v ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{v ? <CheckCircle size={11}/> : <AlertCircle size={11}/>}{v ? 'Yes' : 'No'}</span>;
    return <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{v}</p>;
  }

  /* ── derived ── */
  const isRecurring    = order?.serviceType === 'RECURRING';
  const formFieldCount = Object.keys(order?.formData || {}).length;
  const periodsCount   = order?.servicePeriod?.length || 0;
  const trackSteps     = order?.applicationTrackStep || [];

  const TABS = [
    { key: 'details',  label: 'Details' },
    { key: 'form',     label: `Form (${formFieldCount})` },
    ...(isRecurring
      ? [{ key: 'periods', label: `Periods (${periodsCount})` }]
      : trackSteps.length > 0 ? [] : []),
    { key: 'activity', label: 'Activity' },
  ];

  /* ── global states ── */
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
      <p className="text-sm text-gray-400">Loading order details…</p>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-5 text-sm">{error || 'Order not found.'}</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors text-sm">← Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Order Details"
        subtitle={`#${(order.applicationId || '').slice(-8).toUpperCase()}`}
        onBack={() => navigate(-1)}
        onRefresh={fetchOrderDetails}
        refreshing={loading}
        actions={
          <button className="px-3 py-2 sm:px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm">
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ── App ID + Status Banner ── */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Package size={16} className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Application ID</p>
              <p className="text-xs font-mono font-semibold text-gray-700 truncate">{order.applicationId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={order.serviceType} cls="bg-gray-100 text-gray-600 border-gray-200" />
            <Badge label={order.status} cls={statusCls(order.status)} />
            <span className="text-xs text-gray-400">{fmt(order.createdAt)}</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-4 bg-white rounded-2xl border border-gray-200 p-1.5">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 min-w-max py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === t.key ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════
            DETAILS TAB
        ════════════════════════════════════ */}
        {activeTab === 'details' && (
          <div className="space-y-4">

            {/* Service hero */}
            <SectionCard>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <div className="w-full sm:w-48 lg:w-56 h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {order.servicePhoto
                    ? <img src={order.servicePhoto} alt={order.serviceName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-gray-300" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">{order.serviceName}</h2>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{order.serviceDescription}</p>
                    </div>
                    <Badge label={order.status} cls={statusCls(order.status)} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <InfoTile icon={Layers}    label="Service Type" value={order.serviceType} />
                    <InfoTile icon={RefreshCw} label="Frequency"    value={order.frequency || 'One-time'} />
                    <InfoTile icon={Clock}     label="Duration"     value={order.duration ? `${order.duration} ${order.durationUnit}` : 'N/A'} />
                    <InfoTile icon={ShieldCheck} label="GST"        value={order.isGstApplicable === 'true' ? `${order.gstPercentage || 18}%` : 'None'} />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Two-col layout on large screens: Pricing + Assignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Pricing */}
              <SectionCard title="Pricing">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Offer Price</span>
                    <span className="font-medium text-gray-700">₹{order.offerPrice || '0'}</span>
                  </div>
                  {order.isGstApplicable === 'true' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">GST ({order.gstPercentage || 18}%)</span>
                      <span className="font-medium text-gray-700">
                        +₹{(parseFloat(order.offerPrice || 0) * parseFloat(order.gstPercentage || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">Total Payable</span>
                    <div className="flex items-center gap-0.5 font-bold text-primary text-base">
                      <IndianRupee size={14} />
                      {order.finalPrice || '0'}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Assignment */}
              <SectionCard title="Assignment">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Assigned Employee</p>
                    {order.employee ? (
                      <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-100 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{order.employee.name}</p>
                          <p className="text-xs text-gray-400 truncate">{order.employee.employeeId}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center">
                        <p className="text-xs text-gray-400">Not assigned yet</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Admin Note</p>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl min-h-[44px]">
                      <p className="text-sm text-amber-800">{order.adminNote || 'No notes provided.'}</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── Progress Tracker (ONE_TIME / applicationTrackStep) ── */}
            {trackSteps.length > 0 && (
              <SectionCard title="Progress Tracker">
                {/* Mobile: vertical dot-line */}
                <div className="flex flex-col sm:hidden gap-0">
                  {trackSteps.map((step, idx) => {
                    const done = step.status === 'COMPLETED';
                    const prog = step.status === 'IN_PROGRESS' || step.status === 'PROCESSING';
                    const err  = step.status === 'ERROR';
                    const last = idx === trackSteps.length - 1;
                    return (
                      <div key={step.applicationTrackStepId} className="flex gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            done ? 'bg-emerald-500 border-emerald-500' :
                            prog ? 'bg-indigo-500 border-indigo-500' :
                            err  ? 'bg-rose-500 border-rose-500' :
                            'bg-white border-gray-300'
                          }`}>
                            <span className={`text-[10px] font-bold leading-none ${
                              done || prog || err ? 'text-white' : 'text-gray-400'
                            }`}>{step.order}</span>
                          </div>
                          {!last && <div className="w-0.5 flex-1 min-h-[18px] bg-gray-200 my-1" />}
                        </div>
                        <div className="pb-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                            <Badge label={step.status} cls={statusCls(step.status)} />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                          {step.remarks && <p className="text-xs text-amber-700 mt-1 bg-amber-50 border border-amber-200 rounded px-2 py-1">⚠ {step.remarks}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: horizontal stepper */}
                <div className="hidden sm:block">
                  <div className="relative flex items-start">
                    {/* connector line */}
                    <div className="absolute top-[18px] left-[28px] right-[28px] h-0.5 bg-gray-200 z-0" />
                    {trackSteps.map((step) => {
                      const done = step.status === 'COMPLETED';
                      const prog = step.status === 'IN_PROGRESS' || step.status === 'PROCESSING';
                      const err  = step.status === 'ERROR';
                      return (
                        <div key={step.applicationTrackStepId} className="flex-1 flex flex-col items-center z-10 px-2">
                          {/* ── dot bubble ── */}
                          <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center mb-3 ${
                            done ? 'bg-emerald-500 border-emerald-500' :
                            prog ? 'bg-indigo-500 border-indigo-500' :
                            err  ? 'bg-rose-500 border-rose-500' :
                            'bg-white border-gray-300'
                          }`}>
                            <span className={`text-xs font-bold leading-none ${
                              done || prog || err ? 'text-white' : 'text-gray-400'
                            }`}>{step.order}</span>
                          </div>
                          <p className="text-xs font-semibold text-gray-900 text-center leading-tight">{step.title}</p>
                          <p className="text-[10px] text-gray-400 text-center mt-0.5 line-clamp-2 px-1">{step.description}</p>
                          {step.remarks && (
                            <p className="text-[10px] text-amber-700 text-center mt-0.5 italic line-clamp-1">{step.remarks}</p>
                          )}
                          <Badge label={step.status} cls={`mt-1.5 ${statusCls(step.status)}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── Timeline ── */}
            <SectionCard title="Timeline">
              <div>
                {[
                  { label: 'Order Placed',  sub: 'Application submitted successfully', date: order.createdAt, color: 'bg-emerald-500' },
                  ...(order.updatedAt && order.updatedAt !== order.createdAt
                    ? [{ label: 'Last Updated', sub: 'Order details were modified', date: order.updatedAt, color: 'bg-blue-500' }]
                    : []),
                  ...(order.employee
                    ? [{ label: 'Assigned', sub: `Handed to ${order.employee.name}`, date: order.updatedAt, color: 'bg-primary' }]
                    : []),
                ].map((ev, idx, arr) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${ev.color}`} />
                      {idx < arr.length - 1 && <div className="w-0.5 flex-1 min-h-[24px] bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-4 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                        <p className="text-sm font-semibold text-gray-900">{ev.label}</p>
                        <p className="text-xs text-gray-400">{fmt(ev.date)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{ev.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ════════════════════════════════════
            FORM DATA TAB
        ════════════════════════════════════ */}
        {activeTab === 'form' && (
          <SectionCard title={`Form Data · ${formFieldCount} field${formFieldCount !== 1 ? 's' : ''}`}>
            {!formFieldCount
              ? <p className="text-sm text-gray-400 text-center py-8">No form data submitted.</p>
              : (
                <div className="space-y-2">
                  {Object.entries(order.formData).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFields(p => ({ ...p, [key]: !p[key] }))}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {getFieldType(value) === 'file'   ? <FileText size={13} className="text-gray-500" /> :
                             getFieldType(value) === 'email'  ? <Mail     size={13} className="text-gray-500" /> :
                             getFieldType(value) === 'phone'  ? <Phone    size={13} className="text-gray-500" /> :
                             getFieldType(value) === 'number' ? <Hash     size={13} className="text-gray-500" /> :
                             <Type size={13} className="text-gray-500" />}
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{key}</p>
                            <p className="text-[10px] text-gray-400 capitalize">{getFieldType(value)}</p>
                          </div>
                        </div>
                        {expandedFields[key]
                          ? <ChevronUp   size={15} className="text-primary flex-shrink-0" />
                          : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />}
                      </button>
                      {expandedFields[key] && (
                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                          <FieldValue v={value} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════
            SERVICE PERIODS TAB  (RECURRING only)
        ════════════════════════════════════ */}
        {activeTab === 'periods' && (
          <SectionCard title={`Service Periods · ${periodsCount} period${periodsCount !== 1 ? 's' : ''}`}>
            {!periodsCount ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">No Service Periods</p>
                <p className="text-xs text-gray-400">No periods have been created yet.</p>
              </div>
            ) : (
              <>
                {/* Summary strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Total',      value: periodsCount,                                                       color: 'text-gray-800' },
                    { label: 'Active',     value: order.servicePeriod.filter(p => !p.isLocked).length,                color: 'text-primary' },
                    { label: 'Completed',  value: order.servicePeriod.filter(p => p.status === 'COMPLETED').length,   color: 'text-emerald-700' },
                    { label: 'Pending',    value: order.servicePeriod.filter(p => p.status === 'PENDING').length,     color: 'text-amber-700' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <p className={`text-xl font-bold ${color}`}>{value}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[...order.servicePeriod]
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                    .map(period => <PeriodCard key={period.servicePeriodId} period={period} />)
                  }
                </div>
              </>
            )}
          </SectionCard>
        )}

        {/* ════════════════════════════════════
            ACTIVITY LOG TAB
        ════════════════════════════════════ */}
        {activeTab === 'activity' && (
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Activity Log</h3>
                <p className="text-xs text-gray-400 mt-0.5">Complete history of this application</p>
              </div>
              <button onClick={fetchActivityLog} disabled={activityLoading}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40">
                <RefreshCw size={15} className={`text-gray-500 ${activityLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {activityLoading && (
              <div className="flex flex-col items-center py-12 gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
                <p className="text-xs text-gray-400">Loading activity…</p>
              </div>
            )}

            {activityError && !activityLoading && (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={20} className="text-rose-500" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Couldn't load activity</p>
                <p className="text-xs text-gray-400 mb-4">{activityError}</p>
                <button onClick={fetchActivityLog} className="text-sm text-primary font-medium hover:underline">Try again</button>
              </div>
            )}

            {!activityLoading && !activityError && activityData && (() => {
              const { user, service, employee, applicationHistory = [] } = activityData;
              return (
                <div className="space-y-5">
                  {/* Participants */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { label: 'Customer',    icon: User,      data: user     && { title: user.name,     sub: user.email,     sub2: user.phoneNumber }, color: 'bg-teal-100 text-teal-600' },
                      { label: 'Service',     icon: Tag,       data: service  && { title: service.name,  sub: service.serviceType },                    color: 'bg-primary-100 text-primary' },
                      { label: 'Assigned To', icon: UserCheck, data: employee && { title: employee.name, sub: employee.email },                         color: 'bg-purple-100 text-purple-600' },
                    ].filter(p => p.data).map(({ label, icon: Icon, data, color }) => (
                      <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-semibold text-gray-800 truncate leading-tight mt-0.5">{data.title}</p>
                          <p className="text-xs text-gray-400 truncate">{data.sub}</p>
                          {data.sub2 && <p className="text-xs text-gray-400">{data.sub2}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {applicationHistory.length} Event{applicationHistory.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Dot + connector timeline */}
                  {!applicationHistory.length
                    ? <p className="text-sm text-gray-400 text-center py-6">No history entries yet.</p>
                    : (
                      <div className="space-y-0">
                        {applicationHistory.map((ev, idx) => {
                          const style  = dotStyle(ev.action);
                          const isLast = idx === applicationHistory.length - 1;
                          const ts     = fmtShort(ev.createdAt);
                          return (
                            <div key={ev.historyId} className="flex gap-3">
                              {/* dot + line */}
                              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
                                <div className={`w-3 h-3 rounded-full mt-3 flex-shrink-0 ring-4 ${style.bg} ${style.ring}`} />
                                {!isLast && <div className="w-0.5 flex-1 min-h-[24px] bg-gray-200 my-1" />}
                              </div>
                              {/* card */}
                              <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-3'}`}>
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-3.5">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                                      {ev.action.replace(/_/g, ' ')}
                                    </span>
                                    {ev.doneByRole && (
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleChip(ev.doneByRole)}`}>
                                        {ev.doneByRole}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">{ev.message}</p>
                                  {(ev.oldValue || ev.newValue) && (
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                      {ev.oldValue && (
                                        <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-mono border border-rose-100 max-w-[140px] truncate">
                                          {ev.oldValue}
                                        </span>
                                      )}
                                      {ev.oldValue && ev.newValue && <span className="text-gray-300 text-xs">→</span>}
                                      {ev.newValue && (
                                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-mono border border-emerald-100 max-w-[140px] truncate">
                                          {ev.newValue}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <p className="text-[10px] text-gray-400 mt-2">{ts.time} · {ts.day}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  }
                </div>
              );
            })()}

            {!activityLoading && !activityError && !activityData && (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Activity size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No activity data available.</p>
              </div>
            )}
          </SectionCard>
        )}

      </div>
    </div>
  );
}