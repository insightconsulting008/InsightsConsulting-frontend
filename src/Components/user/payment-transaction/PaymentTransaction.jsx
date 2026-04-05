import axiosInstance from '@src/providers/axiosInstance';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  IndianRupee, Search, Filter, RefreshCw, CheckCircle,
  Clock, AlertCircle, ExternalLink, Copy, ChevronLeft,
  ChevronRight, X, TrendingUp, CreditCard, ArrowUpRight,
  Hash, Calendar, User, Package, Link2, Receipt,
} from 'lucide-react';

const userId = localStorage.getItem('userId');

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const fmtAmount = (n) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(n);

const copyToClipboard = (text) => {
  navigator.clipboard?.writeText(text).catch(() => {});
};

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const statusConfig = {
  PAID: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot:   'bg-emerald-500',
    icon:  CheckCircle,
    label: 'Paid',
  },
  CREATED: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot:   'bg-amber-400',
    icon:  Clock,
    label: 'Pending',
  },
  FAILED: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot:   'bg-rose-500',
    icon:  AlertCircle,
    label: 'Failed',
  },
};

const typeConfig = {
  ORDER: {
    badge: 'bg-primary-50 text-primary border-primary-200',
    icon:  Package,
    label: 'Order',
  },
  AMENDMENT: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    icon:  Receipt,
    label: 'Amendment',
  },
};

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = (e) => {
    e.stopPropagation();
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handle}
      className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
      title="Copy"
    >
      {copied
        ? <CheckCircle size={11} className="text-emerald-500" />
        : <Copy size={11} className="text-gray-400" />}
    </button>
  );
};

// ─── PAYMENT ROW (desktop) ────────────────────────────────────────────────────
const PaymentRow = ({ payment }) => {
  const sc       = statusConfig[payment.status] || statusConfig.CREATED;
  const tc       = typeConfig[payment.type]     || typeConfig.AMENDMENT;
  const TypeIcon = tc.icon;
  const isPaid    = payment.status === 'PAID';
  const isPending = payment.status === 'CREATED';

  return (
    <div className="grid grid-cols-[2fr_1fr_1.4fr_1.4fr_1fr] gap-4 items-center
                    px-5 py-4 border-b border-gray-100 last:border-0
                    hover:bg-gray-50/50 transition-colors">

      {/* Transaction — type badge + payment link (no ID) */}
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <TypeIcon size={11} className={tc.badge.split(' ')[1]} />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.badge}`}>
            {tc.label}
          </span>
        </div>
        {payment.razorpayPaymentLink ? (
          <div className="flex items-center gap-1.5">
            <Link2 size={11} className="text-primary flex-shrink-0" />
            <a
              href={payment.razorpayPaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              Payment link
            </a>
            <CopyButton text={payment.razorpayPaymentLink} />
          </div>
        ) : (
          <span className="text-xs text-gray-300">No link</span>
        )}
      </div>

      {/* Amount */}
      <div className="flex items-center gap-0.5">
        <IndianRupee size={13} className="text-gray-500 flex-shrink-0" />
        <span className="text-sm font-bold text-gray-900">{fmtAmount(payment.amount)}</span>
      </div>

      {/* Created */}
      <div className="text-xs text-gray-500 leading-relaxed">{fmtDate(payment.createdAt)}</div>

      {/* Paid At */}
      <div className="text-xs leading-relaxed">
        {payment.paidAt
          ? <span className="text-emerald-600 font-medium">{fmtDate(payment.paidAt)}</span>
          : <span className="text-gray-300">—</span>}
      </div>

      {/* Action — full width in column, consistent height */}
      <div className="flex justify-end">
        {isPaid ? (
          <span className="inline-flex items-center justify-center gap-1.5 w-full
                           text-xs font-semibold px-3 py-2 rounded-lg
                           bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={13} /> Paid
          </span>
        ) : isPending && payment.razorpayPaymentLink ? (
          <a
            href={payment.razorpayPaymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full
                       text-xs font-semibold px-3 py-2 rounded-lg
                       bg-primary hover:bg-primary-hover text-white transition-colors shadow-sm"
          >
            <Link2 size={13} /> Pay Now
          </a>
        ) : (
          <span className={`inline-flex items-center justify-center gap-1.5 w-full
                            text-xs font-semibold px-3 py-2 rounded-lg border ${sc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
            {sc.label}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── PAYMENT CARD (mobile) ────────────────────────────────────────────────────
const PaymentCard = ({ payment }) => {
  const sc       = statusConfig[payment.status] || statusConfig.CREATED;
  const tc       = typeConfig[payment.type]     || typeConfig.AMENDMENT;
  const TypeIcon = tc.icon;
  const isPaid    = payment.status === 'PAID';
  const isPending = payment.status === 'CREATED';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${tc.badge.split(' ')[0]}`}>
            <TypeIcon size={13} className={tc.badge.split(' ')[1]} />
          </div>
          <div className="min-w-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.badge}`}>
              {tc.label}
            </span>
            {payment.razorpayPaymentLink && (
              <div className="flex items-center gap-1 mt-0.5">
                <Link2 size={10} className="text-primary flex-shrink-0" />
                <a
                  href={payment.razorpayPaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary font-medium hover:underline"
                >
                  Payment link
                </a>
                <CopyButton text={payment.razorpayPaymentLink} />
              </div>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1
                          rounded-full border flex-shrink-0 ${sc.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
          {sc.label}
        </span>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Amount */}
        <div className="flex items-center gap-1">
          <IndianRupee size={18} className="text-gray-700 flex-shrink-0" />
          <span className="text-2xl font-bold text-gray-900 leading-none">{fmtAmount(payment.amount)}</span>
        </div>

        {/* Dates — 2-col */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Created</p>
            <p className="text-xs text-gray-600">{fmtDate(payment.createdAt)}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Paid At</p>
            {payment.paidAt
              ? <p className="text-xs text-emerald-600 font-medium">{fmtDate(payment.paidAt)}</p>
              : <p className="text-xs text-gray-300">—</p>}
          </div>
        </div>

        {/* Action button */}
        {isPaid ? (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                          bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
            <CheckCircle size={14} /> Payment Complete
          </div>
        ) : isPending && payment.razorpayPaymentLink ? (
          <a
            href={payment.razorpayPaymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold
                       bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors"
          >
            <Link2 size={14} /> Pay Now <ArrowUpRight size={14} />
          </a>
        ) : null}
      </div>
    </div>
  );
};

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon size={16} className={iconColor} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-0.5 leading-none">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PaymentTransaction() {
  const [payments,    setPayments]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter,  setTypeFilter]  = useState('');
  const [statusFilter,setStatusFilter]= useState('');
  const [page,        setPage]        = useState(1);
  const [pagination,  setPagination]  = useState({ total: 0, totalPages: 1, limit: 10 });
  const debounceRef = useRef(null);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchPayments = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (typeFilter)      params.set('type',   typeFilter);
      if (statusFilter)    params.set('status', statusFilter);

      const res = await axiosInstance.get(`/payments/user/${userId}?${params}`);
      if (res.data.success) {
        setPayments(res.data.data || []);
        setPagination(res.data.pagination || { total: 0, totalPages: 1, limit: 10 });
      } else {
        setError('Failed to load transactions.');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Error loading transactions.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, typeFilter, statusFilter, page]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // Derived stats from current page data
  const totalPaid       = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0);
  const totalPending    = payments.filter(p => p.status === 'CREATED').reduce((s, p) => s + p.amount, 0);
  const paidCount       = payments.filter(p => p.status === 'PAID').length;
  const pendingCount    = payments.filter(p => p.status === 'CREATED').length;

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const hasActiveFilters = search || typeFilter || statusFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-7 space-y-5">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Payment Transactions</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {pagination.total} transaction{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
                       bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={CreditCard}
            iconBg="bg-primary-50"
            iconColor="text-primary"
            label="Total Records"
            value={pagination.total}
            sub={`Page ${page} of ${pagination.totalPages}`}
          />
          <StatCard
            icon={CheckCircle}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Paid (this page)"
            value={`₹${fmtAmount(totalPaid)}`}
            sub={`${paidCount} transaction${paidCount !== 1 ? 's' : ''}`}
          />
          <StatCard
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            label="Pending (this page)"
            value={`₹${fmtAmount(totalPending)}`}
            sub={`${pendingCount} awaiting payment`}
          />
          <StatCard
            icon={TrendingUp}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            label="This Page"
            value={payments.length}
            sub={`of ${pagination.total} total`}
          />
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-2.5">

            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by amount, payment ID, order ID…"
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                           text-sm placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-primary focus:border-transparent transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                         text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary
                         focus:border-transparent cursor-pointer min-w-[130px]"
            >
              <option value="">All Types</option>
              <option value="ORDER">Order</option>
              <option value="AMENDMENT">Amendment</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                         text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary
                         focus:border-transparent cursor-pointer min-w-[130px]"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="CREATED">Pending</option>
            </select>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold
                           text-primary bg-primary-50 border border-primary-200 rounded-xl
                           hover:bg-primary-100 transition-colors whitespace-nowrap"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Active:</span>
              {search && (
                <span className="flex items-center gap-1 text-[11px] font-medium bg-primary-50 text-primary border border-primary-200 px-2 py-0.5 rounded-full">
                  Search: "{search}"
                  <button onClick={() => setSearch('')}><X size={9} /></button>
                </span>
              )}
              {typeFilter && (
                <span className="flex items-center gap-1 text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                  {typeFilter}
                  <button onClick={() => setTypeFilter('')}><X size={9} /></button>
                </span>
              )}
              {statusFilter && (
                <span className="flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  {statusFilter}
                  <button onClick={() => setStatusFilter('')}><X size={9} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Table / Cards ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Desktop table header */}
          <div className="hidden lg:grid grid-cols-[2fr_1fr_1.4fr_1.4fr_1fr] gap-4
                          px-5 py-3 bg-gray-50 border-b border-gray-200">
            {['Transaction', 'Amount', 'Created', 'Paid At', 'Action'].map(h => (
              <p key={h} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
              <p className="text-sm text-gray-400">Loading transactions…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center py-12 gap-3 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertCircle size={20} className="text-rose-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">{error}</p>
              <button onClick={fetchPayments}
                className="text-sm text-primary font-medium hover:underline">
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && payments.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <CreditCard size={22} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No transactions found</p>
              <p className="text-xs text-gray-400 max-w-xs">
                {hasActiveFilters
                  ? 'Try adjusting your filters or search term.'
                  : 'No payment records available yet.'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters}
                  className="text-sm text-primary font-medium hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Desktop rows */}
          {!loading && !error && payments.length > 0 && (
            <>
              <div className="hidden lg:block">
                {payments.map(p => <PaymentRow key={p.paymentId} payment={p} />)}
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden p-3 space-y-2">
                {payments.map(p => <PaymentCard key={p.paymentId} payment={p} />)}
              </div>
            </>
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-800">
                {(page - 1) * pagination.limit + 1}–{Math.min(page * pagination.limit, pagination.total)}
              </span> of <span className="font-semibold text-gray-800">{pagination.total}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
                           hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} className="text-gray-600" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === pagination.totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '…' ? (
                    <span key={`ellipsis-${i}`} className="text-xs text-gray-400 px-1">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        page === n
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
                           hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}