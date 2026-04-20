import axiosInstance from "@src/providers/axiosInstance";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import PageHeader from '../page-header/PageHeader';

const ACTION_MAP = {
  STATUS_CHANGED:    { badge: "bg-primary-50 text-primary-700 border border-primary-200",  dot: "bg-primary"    },
  DOCUMENT_UPLOADED: { badge: "bg-green-50 text-green-700 border border-green-200",         dot: "bg-green-500"  },
  COMMENT_ADDED:     { badge: "bg-yellow-50 text-yellow-700 border border-yellow-200",      dot: "bg-yellow-500" },
  CREATED:           { badge: "bg-primary-50 text-primary-700 border border-primary-200",  dot: "bg-primary"    },
  DELETED:           { badge: "bg-red-50 text-red-700 border border-red-200",               dot: "bg-red-500"    },
};
const ROLE_MAP = {
  ADMIN:  "bg-primary-50 text-primary-700 border border-primary-200",
  STAFF:  "bg-green-50 text-green-700 border border-green-200",
  USER:   "bg-primary-100 text-primary-800 border border-primary-300",
  SYSTEM: "bg-gray-100 text-gray-500 border border-gray-200",
};

const getAction = (a) => ACTION_MAP[a] || { badge: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" };
const getRole   = (r) => ROLE_MAP[r]   || "bg-gray-100 text-gray-500 border border-gray-200";

const fmt   = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const fmtDT = (d) => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

function SkeletonRow({ cols = 1 }) {
  return (
    <div className={`grid gap-0 ${cols === 4 ? "grid-cols-4" : cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="p-4 border-r border-gray-100 last:border-r-0">
          <div className="h-2.5 w-14 bg-primary-50 rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-primary-50 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function InfoCell({ label, value, mono = false }) {
  return (
    <div className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-medium text-gray-900 break-all ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-gray-300">—</span>}
      </p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="px-4 pt-3 pb-0 text-[11px] font-semibold uppercase tracking-wide text-primary-400">
      {children}
    </p>
  );
}

export default function DetailReport() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!applicationId) return;
    setLoading(true); setError(null);
    axiosInstance.get(`/admin/application-history/${applicationId}`)
      .then(res => {
        if (res.data.success) setData(res.data.application);
        else setError(res.data.message || "Application not found.");
      })
      .catch(err => {
        if (err.response?.status === 404) setError("Application not found.");
        else setError(err.response?.data?.message || "Unable to connect. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [applicationId]);

  const histories    = data?.applicationHistory || [];
  const latestHistory = histories[0];

  return (
    <div className="min-h-screen bg-gray-50">

      <PageHeader
        title="Application Detail"
        subtitle={applicationId ? applicationId : ''}
        onBack={() => navigate("/reports")}
        breadcrumbs={[{ label: "Application History", href: "/reports" }, { label: "Detail" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Application Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-primary-50 flex items-center justify-between gap-4">
            <span className="font-semibold text-gray-900 text-sm">Application Information</span>
            {!loading && data && (
              <code className="text-[11px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded font-mono">
                {data.applicationId?.slice(0, 20)}…
              </code>
            )}
          </div>

          {loading ? (
            <div className="divide-y divide-gray-100">
              <SkeletonRow cols={4} />
              <SkeletonRow cols={4} />
            </div>
          ) : data ? (
            <>
              {/* Applicant */}
              <div className="border-b border-gray-100">
                <SectionLabel>Applicant</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
                  <InfoCell label="Name"      value={data.user?.name} />
                  <InfoCell label="Email"     value={data.user?.email} />
                  <InfoCell label="Phone"     value={data.user?.phoneNumber} />
                  <InfoCell label="Submitted" value={fmt(data.createdAt)} />
                </div>
              </div>

              {/* Service + Employee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-gray-100">
                <div className="border-b sm:border-b-0 border-gray-100">
                  <SectionLabel>Service</SectionLabel>
                  <div className="grid grid-cols-2 divide-x divide-gray-100">
                    <InfoCell label="Service Name" value={data.service?.name} />
                    <InfoCell label="Type"         value={data.service?.serviceType} />
                  </div>
                </div>
                <div>
                  <SectionLabel>Assigned Employee</SectionLabel>
                  <div className="grid grid-cols-2 divide-x divide-gray-100">
                    <InfoCell label="Name"  value={data.employee?.name} />
                    <InfoCell label="Email" value={data.employee?.email} />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Stats */}
        {!loading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Total Events",  value: histories.length, big: true },
              { label: "Latest Action", value: latestHistory?.action?.replace(/_/g, " ") || "—" },
              { label: "Last Updated",  value: latestHistory ? fmt(latestHistory.createdAt) : "—" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 border-l-[3px] border-l-primary">
                <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
                <p className={`font-bold text-gray-900 ${s.big ? "text-3xl" : "text-base"}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-primary-50 flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">Activity Timeline</span>
            {!loading && data && (
              <span className="text-xs text-gray-500 bg-white border border-primary-200 px-2.5 py-0.5 rounded-full font-medium">
                {histories.length} event{histories.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="p-5">
            {loading ? (
              <div className="space-y-5">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary-100 animate-pulse mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-primary-50 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-primary-50 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !histories.length ? (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500 font-medium">No events yet</p>
                <p className="text-xs text-gray-400 mt-1">Events will appear once the application is processed.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline spine */}
                <div className="absolute left-[5px] top-3 bottom-3 w-px bg-primary-100" />

                <div className="space-y-4">
                  {histories.map((h, i) => {
                    const act  = getAction(h.action);
                    const role = getRole(h.doneByRole);
                    return (
                      <div key={h.historyId || i} className="flex gap-4">
                        {/* Dot */}
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 relative z-10 border-2 ${
                            i === 0 ? "bg-primary border-primary" : "bg-primary-200 border-primary-200"
                          }`}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="border border-gray-200 rounded-lg bg-gray-50 p-3.5">
                            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${act.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${act.dot}`} />
                                  {h.action?.replace(/_/g, " ")}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${role}`}>
                                  {h.doneByRole}
                                </span>
                              </div>
                              <time className="text-[11px] text-gray-400 whitespace-nowrap">{fmtDT(h.createdAt)}</time>
                            </div>

                            {h.message && (
                              <p className="text-sm text-gray-600 leading-relaxed mb-2">{h.message}</p>
                            )}

                            {(h.oldValue || h.newValue) && (
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                {h.oldValue && (
                                  <code className="text-[11px] bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded font-mono">{h.oldValue}</code>
                                )}
                                {h.oldValue && h.newValue && <span className="text-gray-400 text-sm">→</span>}
                                {h.newValue && (
                                  <code className="text-[11px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded font-mono">{h.newValue}</code>
                                )}
                              </div>
                            )}

                            {h.doneById && (
                              <p className="text-[11px] text-gray-400">
                                By <span className="text-primary font-medium">{h.doneById}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}