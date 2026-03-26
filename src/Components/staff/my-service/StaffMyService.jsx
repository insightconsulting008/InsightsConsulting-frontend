import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from '../page-header/PageHeader';
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  User,
  X,
} from 'lucide-react';

const LIMIT = 8;

export default function MyService() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const employeeId = localStorage.getItem('employeeId');

  const fetchApplications = useCallback(async (pg, q) => {
    if (!employeeId) return;
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: pg, limit: LIMIT });
      if (q) params.set('search', q);
      const res = await axiosInstance.get(`staff/${employeeId}/applications?${params}`);
      if (res.data.success) {
        setApplications(res.data.applications ?? []);
        setPagination({
          total: res.data.pagination?.total ?? 0,
          totalPages: res.data.pagination?.totalPages ?? 1,
        });
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchApplications(page, search);
  }, [page, search, fetchApplications]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return { bg: 'bg-primary-50', text: 'text-primary-800', border: 'border-primary-200', icon: UserCheck, iconColor: 'text-primary', label: 'Assigned' };
      case 'IN_PROGRESS':
        return { bg: 'bg-warning-50', text: 'text-warning-800', border: 'border-warning-200', icon: RefreshCw, iconColor: 'text-warning-600', label: 'In Progress' };
      case 'COMPLETED':
        return { bg: 'bg-success-50', text: 'text-success-800', border: 'border-success-200', icon: CheckCircle, iconColor: 'text-success-600', label: 'Completed' };
      case 'PENDING':
        return { bg: 'bg-neutral-100', text: 'text-neutral-800', border: 'border-neutral-200', icon: Clock, iconColor: 'text-neutral-600', label: 'Pending' };
      default:
        return { bg: 'bg-neutral-100', text: 'text-neutral-800', border: 'border-neutral-200', icon: AlertCircle, iconColor: 'text-neutral-600', label: status };
    }
  };

  const getServiceTypeConfig = (type) => {
    if (type === 'RECURRING') return { bg: 'bg-primary-50', text: 'text-primary-800', border: 'border-primary-200', label: 'Recurring' };
    if (type === 'ONE_TIME') return { bg: 'bg-info-50', text: 'text-info-800', border: 'border-info-200', label: 'One Time' };
    return { bg: 'bg-neutral-100', text: 'text-neutral-800', border: 'border-neutral-200', label: type };
  };

  /* ── Skeleton ── */
  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 font-sans">
        <PageHeader title="My Services" subtitle="Manage and track all your assigned service applications" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-3 bg-neutral-100 rounded w-1/4" />
                </div>
                <div className="h-8 w-24 bg-neutral-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-14 h-14 text-error-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Something went wrong</h2>
          <p className="text-neutral-500 mb-6 text-sm">{error}</p>
          <button onClick={() => fetchApplications(page, search)} className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 mx-auto text-sm">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <PageHeader
        title="My Services"
        subtitle="Manage and track all your assigned service applications"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Total Services</p>
                <h3 className="text-2xl font-bold text-neutral-900">{pagination.total}</h3>
                <p className="text-xs text-neutral-400 mt-1">All assigned services</p>
              </div>
              <div className="p-2.5 bg-primary-50 rounded-lg">
                <Package className="text-primary" size={22} />
              </div>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Assigned</p>
                <h3 className="text-2xl font-bold text-neutral-900">
                  {applications.filter(a => a.status === 'ASSIGNED').length}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Currently assigned</p>
              </div>
              <div className="p-2.5 bg-primary-50 rounded-lg">
                <UserCheck className="text-primary" size={22} />
              </div>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-500 mb-1">In Progress</p>
                <h3 className="text-2xl font-bold text-neutral-900">
                  {applications.filter(a => a.status === 'IN_PROGRESS').length}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Currently in progress</p>
              </div>
              <div className="p-2.5 bg-warning-50 rounded-lg">
                <RefreshCw className="text-warning-600" size={22} />
              </div>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Recurring</p>
                <h3 className="text-2xl font-bold text-neutral-900">
                  {applications.filter(a => a.serviceType === 'RECURRING').length}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Monthly/Yearly services</p>
              </div>
              <div className="p-2.5 bg-primary-50 rounded-lg">
                <Package className="text-primary" size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search by service name or client…"
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchInput && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Total count */}
          <p className="text-sm text-neutral-500 shrink-0">
            {pagination.total} application{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── List ── */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 py-20 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-neutral-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">No applications found</h3>
            <p className="text-sm text-neutral-500">
              {search ? 'Try a different search term.' : 'No applications assigned yet.'}
            </p>
            {search && (
              <button onClick={clearSearch} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const statusCfg = getStatusConfig(app.status);
              const StatusIcon = statusCfg.icon;
              const typeCfg = getServiceTypeConfig(app.serviceType);

              return (
                <div key={app.applicationId} className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Service photo + name */}
                    <div className="flex items-center gap-3 sm:w-56 lg:w-64 shrink-0">
                      {app.servicePhotoUrl ? (
                        <img
                          src={app.servicePhotoUrl}
                          alt={app.serviceName}
                          className="w-24 h-full rounded-xl object-cover border border-neutral-100 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                          <Package className="text-primary" size={20} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 text-sm truncate">{app.serviceName}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}>
                          {typeCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs text-neutral-400 mb-1">User Name</p>
                        <div className="flex items-center gap-1 min-w-0">
                          <User size={14} className="text-neutral-400 shrink-0" />
                          <span className="font-medium text-neutral-900 text-sm truncate">{app.name || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-neutral-400 mb-1">Email</p>
                        <div className="flex items-center gap-1 min-w-0">
                          <Mail size={14} className="text-neutral-400 shrink-0" />
                          <span className="font-medium text-neutral-900 text-sm truncate">{app.email || 'N/A'}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Phone Number</p>
                        <div className="flex items-center gap-1">
                          <Phone size={14} className="text-neutral-400 shrink-0" />
                          <span className="font-medium text-neutral-900 text-sm">{app.phoneNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status + date + action */}
                    <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 sm:gap-2 lg:gap-3 shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                        <StatusIcon size={13} className={statusCfg.iconColor} />
                        {statusCfg.label}
                      </div>
                      <span className="text-xs text-neutral-400 whitespace-nowrap">{formatDate(app.createdAt)}</span>
                      <button
                        onClick={() => navigate(`/tasks/${app.applicationId}`)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition whitespace-nowrap"
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <p className="text-sm text-neutral-500">
              Page {page} of {pagination.totalPages} · {pagination.total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-neutral-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          item === page
                            ? 'bg-primary text-white shadow-sm'
                            : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
