import axiosInstance from "@src/providers/axiosInstance";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertCircle } from "lucide-react";
import PageHeader from '../page-header/PageHeader';

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const SERVICE_TYPE_MAP = {
  ONLINE:  "bg-primary-50 text-primary-700 border border-primary-200",
  OFFLINE: "bg-green-50 text-green-700 border border-green-200",
  HYBRID:  "bg-primary-100 text-primary-800 border border-primary-300",
};
const getServiceTypeClass = (t) =>
  SERVICE_TYPE_MAP[t?.toUpperCase()] || "bg-gray-100 text-gray-500 border border-gray-200";

function SkeletonRow() {
  return (
    <tr>
      {[130, 180, 150, 120, 100].map((w, i) => (
        <td key={i} className="px-4 py-3.5 first:pl-6 last:pr-6">
          <div className="h-3.5 bg-primary-50 rounded animate-pulse" style={{ width: w }} />
          {i === 1 && <div className="h-3 bg-primary-50 rounded animate-pulse mt-1.5 w-28" />}
        </td>
      ))}
      <td className="px-4 py-3.5 pr-6" />
    </tr>
  );
}

export default function Report() {
  const navigate = useNavigate();

  const [data,        setData]        = useState([]);
  const [pagination,  setPagination]  = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page,        setPage]        = useState(1);

  const fetchData = useCallback(() => {
    setLoading(true); setError(null);
    const params = new URLSearchParams({ page, limit: 10, ...(search ? { search } : {}) });
    axiosInstance.get(`/admin/application-history`, { params })
      .then(res => {
        if (res.data.success) { setData(res.data.applications); setPagination(res.data.pagination); }
        else setError(res.data.message || "Something went wrong.");
      })
      .catch(err => {
        setError(err.response?.data?.message || "Unable to connect. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); setSearch(searchInput); };
  const handleClear  = () => { setSearchInput(""); setSearch(""); setPage(1); };

  const pageNums = Array.from(
    { length: Math.min(5, pagination.totalPages) },
    (_, i) => Math.max(1, Math.min(pagination.totalPages - 4, page - 2)) + i
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <PageHeader
        title="Application History"
        subtitle={`${pagination.total} total application${pagination.total !== 1 ? "s" : ""}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <div className={`flex items-center gap-2 h-9 px-3 rounded-lg border bg-white text-sm transition-all ${
              searchInput ? "border-primary ring-2 ring-primary/20" : "border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            }`}>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                className="outline-none bg-transparent text-gray-800 placeholder-gray-400 w-52"
                placeholder="Search by name, email, service…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className="h-9 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-50 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-primary-50 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm leading-none">All Applications</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {search ? `Showing results for "${search}"` : "Showing all submitted applications"}
              </p>
            </div>
            {search && (
              <span className="text-xs text-primary bg-white border border-primary-200 px-2.5 py-1 rounded-full font-medium">
                {pagination.total} result{pagination.total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50 border-b border-primary-100">
                  {["Application ID", "Applicant", "Service", "Assigned To", "Submitted", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-[11px] font-semibold text-primary-700 uppercase tracking-wider whitespace-nowrap first:pl-6 last:pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                ) : !data.length ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="py-16 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                          <Search className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          {search ? `No results for "${search}"` : "No applications yet."}
                        </p>
                        {search && (
                          <button type="button" onClick={handleClear} className="mt-2 text-xs text-primary hover:text-primary-hover font-medium underline">
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map(app => (
                    <tr
                      key={app.applicationId}
                      onClick={() => navigate(`/reports/${app.applicationId}`)}
                      className="hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3.5 pl-6">
                        <span className="font-mono text-xs text-gray-500">{app.applicationId?.slice(0, 14)}…</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-900">{app.user?.name || "—"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{app.user?.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-900 mb-1">{app.service?.name || "—"}</p>
                        {app.service?.serviceType && (
                          <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${getServiceTypeClass(app.service.serviceType)}`}>
                            {app.service.serviceType}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3.5 text-sm font-medium ${app.employee?.name ? "text-primary" : "text-gray-400"}`}>
                        {app.employee?.name || "Unassigned"}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 pr-6 text-right">
                        <span className="text-gray-300 text-base">→</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="h-3.5 bg-primary-50 rounded w-1/2" />
                  <div className="h-3 bg-primary-50 rounded w-3/4" />
                  <div className="h-3 bg-primary-50 rounded w-2/5" />
                </div>
              ))
            ) : !data.length ? (
              <div className="py-14 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                  <Search className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {search ? `No results for "${search}"` : "No applications yet."}
                </p>
                {search && (
                  <button type="button" onClick={handleClear} className="mt-2 text-xs text-primary font-medium underline block mx-auto">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              data.map(app => (
                <div
                  key={app.applicationId}
                  onClick={() => navigate(`/reports/${app.applicationId}`)}
                  className="p-4 hover:bg-primary-50/40 active:bg-primary-50 cursor-pointer transition-colors"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{app.user?.name || "—"}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{app.user?.email}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">{formatDate(app.createdAt)}</span>
                  </div>
                  {/* Service row */}
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-gray-700 font-medium truncate flex-1">{app.service?.name || "—"}</p>
                    {app.service?.serviceType && (
                      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${getServiceTypeClass(app.service.serviceType)}`}>
                        {app.service.serviceType}
                      </span>
                    )}
                  </div>
                  {/* Footer row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">Assigned to:</span>
                      <span className={`text-xs font-medium ${app.employee?.name ? "text-primary" : "text-gray-400"}`}>
                        {app.employee?.name || "Unassigned"}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-300">{app.applicationId?.slice(0, 10)}…</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs text-gray-400">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} results
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {pageNums.map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(pagination.totalPages)}
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}