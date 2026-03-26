import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  CreditCard,
  Banknote,
  RefreshCw,
  User,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  Receipt,
  Landmark,
  Hash,
  CalendarDays,
  Zap,
  UserCircle
} from 'lucide-react';
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from '../page-header/PageHeader';

const PaymentHistory = () => {
  const [viewType, setViewType] = useState('all');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    type: '',
    startDate: '',
    endDate: ''
  });

  const [response, setResponse] = useState({
    data: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);


  useEffect(() => {
    if (viewType === 'orders') handleFilterChange('type', 'ORDER');
    else if (viewType === 'amendments') handleFilterChange('type', 'AMENDMENT');
    else handleFilterChange('type', '');
  }, [viewType]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          ...(filters.search && { search: filters.search }),
          ...(filters.type && { type: filters.type }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate })
        };
        const { data } = await axiosInstance.get('/payments', params);
        setResponse(data);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err?.response?.data?.message || err.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      type: viewType === 'orders' ? 'ORDER' : viewType === 'amendments' ? 'AMENDMENT' : '',
      startDate: '',
      endDate: ''
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      PAID: {
        Icon: CheckCircle,
        bg: 'bg-[var(--success-50)]',
        text: 'text-[var(--success-700)]',
        border: 'border-[var(--success-100)]',
        label: 'Paid'
      },
      PENDING: {
        Icon: Clock,
        bg: 'bg-[var(--warning-50)]',
        text: 'text-[var(--warning-700)]',
        border: 'border-[var(--warning-100)]',
        label: 'Pending'
      },
      FAILED: {
        Icon: AlertCircle,
        bg: 'bg-[var(--error-50)]',
        text: 'text-[var(--error-700)]',
        border: 'border-[var(--error-100)]',
        label: 'Failed'
      },
      REFUNDED: {
        Icon: Receipt,
        bg: 'bg-[var(--neutral-100)]',
        text: 'text-[var(--neutral-600)]',
        border: 'border-[var(--neutral-200)]',
        label: 'Refunded'
      },
      PARTIALLY_PAID: {
        Icon: Landmark,
        bg: 'bg-[var(--info-50)]',
        text: 'text-[var(--info-700)]',
        border: 'border-[var(--info-100)]',
        label: 'Partial'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString())
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    if (date.toDateString() === yesterday.toDateString())
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    { bg: 'bg-[var(--info-100)]', text: 'text-[var(--info-700)]' },
    { bg: 'bg-[var(--success-100)]', text: 'text-[var(--success-700)]' },
    { bg: 'bg-[var(--warning-100)]', text: 'text-[var(--warning-700)]' },
    { bg: 'bg-[var(--error-100)]', text: 'text-[var(--error-700)]' },
    { bg: 'bg-[var(--primary-100)]', text: 'text-[var(--primary-700)]' },
    { bg: 'bg-[var(--neutral-200)]', text: 'text-[var(--neutral-700)]' },
  ];
  const getAvatarColor = (str) => {
    const idx = str.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length;
    return avatarColors[idx];
  };

  const summaryStats = {
    total: response.data.reduce((sum, p) => sum + (p.amount || 0), 0),
    paid: response.data.filter(p => p.status === 'PAID').length,
    pending: response.data.filter(p => p.status === 'PENDING').length,
    failed: response.data.filter(p => p.status === 'FAILED').length
  };

  /* ── Error State ─────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neutral-50)' }}>
        <div className="bg-white rounded-2xl shadow-md border p-10 text-center max-w-sm w-full"
          style={{ borderColor: 'var(--error-100)' }}>
          <div className="rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--error-50)' }}>
            <AlertCircle className="h-8 w-8" style={{ color: 'var(--error-500)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--neutral-900)' }}>
            Unable to load payments
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--neutral-500)' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Main Render ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: 'var(--neutral-50)', fontFamily: 'var(--font-sans)' }}>

      <PageHeader
        title="Payments Dashboard"
        subtitle="Monitor and manage all transactions"
      />

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Volume', value: formatAmount(summaryStats.total), bg: 'var(--primary-50)', color: 'var(--color-primary)', valColor: 'var(--primary-800)', skeletonBg: 'var(--primary-100)' },
            { label: 'Successful',   value: summaryStats.paid,                bg: 'var(--success-50)', color: 'var(--success-600)', valColor: 'var(--success-700)', skeletonBg: 'var(--success-100)' },
            { label: 'Pending',      value: summaryStats.pending,             bg: 'var(--warning-50)', color: 'var(--warning-700)', valColor: 'var(--warning-700)', skeletonBg: 'var(--warning-100)' },
            { label: 'Failed',       value: summaryStats.failed,              bg: 'var(--error-50)',   color: 'var(--error-600)',   valColor: 'var(--error-700)',   skeletonBg: 'var(--error-100)' },
          ].map(({ label, value, bg, color, valColor, skeletonBg }) => (
            <div key={label} className="rounded-xl p-4" style={{ background: bg }}>
              <p className="text-xs font-medium mb-2" style={{ color }}>{label}</p>
              {loading ? (
                <>
                  <div className="animate-pulse h-7 rounded-lg mb-1" style={{ background: skeletonBg, width: '60%' }} />
                  <div className="animate-pulse h-3 rounded" style={{ background: skeletonBg, width: '40%', opacity: 0.6 }} />
                </>
              ) : (
                <p className="text-xl font-bold" style={{ color: valColor }}>{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Tab bar + limit */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl border bg-white"
            style={{ borderColor: 'var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
            {[
              { id: 'all', label: 'All', Icon: Banknote },
              { id: 'orders', label: 'Orders', Icon: CreditCard },
              { id: 'amendments', label: 'Amendments', Icon: RefreshCw },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setViewType(id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: viewType === id ? 'var(--color-primary)' : 'transparent',
                  color: viewType === id ? '#fff' : 'var(--neutral-600)'
                }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <select
            value={filters.limit}
            onChange={e => handleFilterChange('limit', Number(e.target.value))}
            className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
            style={{ borderColor: 'var(--neutral-200)', color: 'var(--neutral-700)', boxShadow: 'var(--shadow-sm)' }}
          >
            {[10, 20, 30].map(n => <option key={n} value={n}>Show {n}</option>)}
          </select>
        </div>

        {/* Filters panel */}
          <div className="mb-6 bg-white rounded-xl border p-4"
            style={{ borderColor: 'var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--neutral-500)' }}>
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: 'var(--neutral-400)' }} />
                  <input
                    type="text"
                    placeholder="Search by ID or order ID..."
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                    className="pl-9 pr-4 py-2 w-full rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: 'var(--neutral-200)', color: 'var(--neutral-800)' }}
                  />
                </div>
              </div>
              {[
                { key: 'startDate', label: 'From' },
                { key: 'endDate', label: 'To' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--neutral-500)' }}>
                    {label}
                  </label>
                  <input
                    type="date"
                    value={filters[key]}
                    onChange={e => handleFilterChange(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: 'var(--neutral-200)', color: 'var(--neutral-800)' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={clearFilters}
                className="text-sm px-3 py-1.5 rounded-lg transition-all hover:bg-[var(--neutral-100)]"
                style={{ color: 'var(--neutral-500)' }}
              >
                Clear all
              </button>
            </div>
          </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>
            Showing{' '}
            <span className="font-medium" style={{ color: 'var(--neutral-900)' }}>{response.data.length}</span>{' '}
            of{' '}
            <span className="font-medium" style={{ color: 'var(--neutral-900)' }}>{response.pagination.total}</span>{' '}
            payments
          </p>
        </div>

        {/* ── Loading Skeleton ────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: filters.limit }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border animate-pulse"
                style={{ borderColor: 'var(--neutral-200)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 rounded w-1/3" style={{ background: 'var(--neutral-200)' }} />
                    <div className="h-3 rounded w-1/2" style={{ background: 'var(--neutral-100)' }} />
                  </div>
                  <div className="h-6 w-16 rounded-full" style={{ background: 'var(--neutral-200)' }} />
                </div>
                <div className="h-8 rounded w-1/4 mb-4" style={{ background: 'var(--neutral-200)' }} />
                <div className="h-12 rounded-lg" style={{ background: 'var(--neutral-100)' }} />
              </div>
            ))}
          </div>

        /* ── Empty State ──────────────────────────────────────────── */
        ) : response.data.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border"
            style={{ borderColor: 'var(--neutral-200)' }}>
            <div className="rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--neutral-100)' }}>
              <Calendar className="h-8 w-8" style={{ color: 'var(--neutral-400)' }} />
            </div>
            <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--neutral-900)' }}>
              No payments found
            </h3>
            <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>
              {viewType === 'orders'
                ? 'No order payments match your criteria'
                : viewType === 'amendments'
                ? 'No amendment payments match your criteria'
                : 'Try adjusting your filters'}
            </p>
          </div>

        /* ── Cards Grid ───────────────────────────────────────────── */
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {response.data.map((payment) => {
                const { Icon: StatusIcon, bg, text, border, label } = getStatusConfig(payment.status);
                const isExpanded = selectedPayment === (payment.id || payment.paymentId);
                const avatarColor = payment.user ? getAvatarColor(payment.user.name) : avatarColors[0];

                return (
                  <div
                    key={payment.id || payment.paymentId}
                    className="bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{
                      borderColor: isExpanded ? 'var(--color-primary)' : 'var(--neutral-200)',
                      boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                    }}
                    onClick={() => setSelectedPayment(isExpanded ? null : (payment.id || payment.paymentId))}
                  >
                    {/* Left accent bar when expanded */}
                    <div className="flex">
                      <div
                        className="w-1 flex-shrink-0 transition-all duration-200"
                        style={{ background: isExpanded ? 'var(--color-primary)' : 'transparent' }}
                      />

                      <div className="flex-1 p-5">
                        {/* ID row + badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" style={{ color: 'var(--neutral-400)' }} />
                            <span className="text-sm font-mono" style={{ color: 'var(--neutral-900)' }}>
                              {payment.paymentId || payment.id}
                            </span>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {label}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                          <span className="text-2xl font-bold" style={{ color: 'var(--neutral-900)' }}>
                            {formatAmount(payment.amount)}
                          </span>
                        </div>

                        {/* User row */}
                        {payment.user && (
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm ${avatarColor.bg} ${avatarColor.text}`}>
                              {getInitials(payment.user.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--neutral-900)' }}>
                                {payment.user.name}
                              </p>
                              <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>
                                {payment.user.phoneNumber}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Footer meta */}
                        <div className="flex items-center justify-between text-xs pt-3 border-t"
                          style={{ borderColor: 'var(--neutral-100)', color: 'var(--neutral-500)' }}>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(payment.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            {payment.type === 'ORDER' ? (
                              <>
                                <Zap className="h-3.5 w-3.5" />
                                <span>System</span>
                              </>
                            ) : payment.createdBy ? (
                              <>
                                <UserCircle className="h-3.5 w-3.5" />
                                <span>{payment.createdBy.name}</span>
                              </>
                            ) : null}
                          </div>
                        </div>

                        {/* Expandable details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t space-y-3"
                            style={{ borderColor: 'var(--neutral-100)' }}>
                            {payment.razorpayOrderId && (
                              <div className="rounded-lg p-3" style={{ background: 'var(--neutral-50)' }}>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--neutral-500)' }}>
                                  Razorpay Order ID
                                </p>
                                <p className="text-xs font-mono break-all" style={{ color: 'var(--neutral-700)' }}>
                                  {payment.razorpayOrderId}
                                </p>
                              </div>
                            )}

                            {payment.type === 'AMENDMENT' && payment.createdBy && (
                              <div className="rounded-lg p-3" style={{ background: 'var(--neutral-50)' }}>
                                <p className="text-xs font-medium mb-2" style={{ color: 'var(--neutral-500)' }}>
                                  Created By
                                </p>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" style={{ color: 'var(--neutral-400)' }} />
                                    <span className="text-xs" style={{ color: 'var(--neutral-700)' }}>
                                      {payment.createdBy.name}
                                    </span>
                                  </div>
                                  {payment.createdBy.email && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-3.5 w-3.5" style={{ color: 'var(--neutral-400)' }} />
                                      <span className="text-xs" style={{ color: 'var(--neutral-700)' }}>
                                        {payment.createdBy.email}
                                      </span>
                                    </div>
                                  )}
                                  {payment.createdBy.mobileNumber && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-3.5 w-3.5" style={{ color: 'var(--neutral-400)' }} />
                                      <span className="text-xs" style={{ color: 'var(--neutral-700)' }}>
                                        {payment.createdBy.mobileNumber}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {payment.user?.email && (
                              <div className="rounded-lg p-3" style={{ background: 'var(--neutral-50)' }}>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--neutral-500)' }}>
                                  User Email
                                </p>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5" style={{ color: 'var(--neutral-400)' }} />
                                  <span className="text-xs" style={{ color: 'var(--neutral-700)' }}>
                                    {payment.user.email}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {response.pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>
                  Page{' '}
                  <span className="font-medium" style={{ color: 'var(--neutral-900)' }}>
                    {filters.page}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium" style={{ color: 'var(--neutral-900)' }}>
                    {response.pagination.totalPages}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-lg border bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--neutral-50)]"
                    style={{ borderColor: 'var(--neutral-200)', color: 'var(--neutral-600)' }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span
                    className="px-4 py-2 border rounded-lg text-sm font-medium"
                    style={{
                      borderColor: 'var(--color-primary)',
                      color: 'var(--color-primary)',
                      background: 'var(--primary-50)'
                    }}
                  >
                    {filters.page}
                  </span>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === response.pagination.totalPages}
                    className="p-2 rounded-lg border bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--neutral-50)]"
                    style={{ borderColor: 'var(--neutral-200)', color: 'var(--neutral-600)' }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;