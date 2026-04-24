import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = "/forms";

const fetchData = async (type, params) => {
  const res = await axios.get(`${API_BASE}/${type}`, {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ── Icons ──────────────────────────────────────────────────────────────────────
const DateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeWidth="2" />
    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const ChevronIcon = ({ dir }) => (
  <svg
    className={`w-4 h-4 transition-transform ${dir === "left" ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path d="m9 18 6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
    <polyline points="22,6 12,13 2,6" strokeWidth="2" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" />
  </svg>
);
const SunburstIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <circle cx="20" cy="20" r="8" fill="#f13c20" />
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <line
        key={i}
        x1="20" y1="20"
        x2={20 + 14 * Math.cos((deg * Math.PI) / 180)}
        y2={20 + 14 * Math.sin((deg * Math.PI) / 180)}
        stroke="#f13c20"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

// ── Empty State ────────────────────────────────────────────────────────────────
const EmptyState = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24" style={{ color: "#b45a3a" }}>
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: "#fde8e3" }}
    >
      {tab === "enquiry" ? <MailIcon /> : <PhoneIcon />}
    </div>
    <p className="text-lg font-semibold" style={{ color: "#7a2a14" }}>
      No {tab === "enquiry" ? "enquiries" : "contacts"} found
    </p>
    <p className="text-sm mt-1" style={{ color: "#b45a3a" }}>
      Try adjusting your filters or search query
    </p>
  </div>
);

// ── Badge ──────────────────────────────────────────────────────────────────────
const Badge = ({ children, type }) => {
  const styles =
    type === "enquiry"
      ? { background: "#fde8e3", color: "#c0321a", border: "1px solid #f8b4a3" }
      : { background: "#fef3e2", color: "#b56a00", border: "1px solid #f8d89a" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={styles}
    >
      {children}
    </span>
  );
};

// ── Submission Card ────────────────────────────────────────────────────────────
const SubmissionCard = ({ item, type }) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(item.createdAt);
  const formattedDate = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formattedTime = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const accentColor = type === "enquiry" ? "#f13c20" : "#e8a000";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
      style={{
        background: "#fff",
        border: "1.5px solid #f0d5cc",
        boxShadow: expanded ? "0 4px 24px rgba(241,60,32,0.10)" : "0 1px 4px rgba(180,90,58,0.07)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 rounded-l-xl"
        style={{
          background: accentColor,
          opacity: expanded ? 1 : 0,
        }}
      />

      <div className="px-5 py-4 flex items-start gap-4">
        {/* Avatar */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: type === "enquiry" ? "#fde8e3" : "#fef3e2",
            color: accentColor,
          }}
        >
          {item.name?.charAt(0)?.toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate" style={{ color: "#2d1308" }}>
                {item.name || "—"}
              </span>
              <Badge type={type}>{type}</Badge>
            </div>
            <span className="text-xs shrink-0" style={{ color: "#b45a3a" }}>
              {formattedDate} · {formattedTime}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-sm" style={{ color: "#8a4a34" }}>
            {item.email && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
                  <polyline points="22,6 12,13 2,6" strokeWidth="2" />
                </svg>
                <span className="truncate max-w-[200px]">{item.email}</span>
              </span>
            )}
            {item.phone && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" />
                </svg>
                {item.phone}
              </span>
            )}
          </div>

          {item.message && !expanded && (
            <p className="mt-2 text-sm line-clamp-1" style={{ color: "#b45a3a" }}>
              {item.message}
            </p>
          )}
        </div>

        <svg
          className={`shrink-0 w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="#b45a3a" viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {expanded && item.message && (
        <div
          className="px-5 pb-4 pt-0 mt-1 border-t"
          style={{ borderColor: "#f0d5cc" }}
        >
          <p className="text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "#c06040" }}>
            Message
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#5a2a14" }}>
            {item.message}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Pagination ─────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i);

  const btnBase =
    "w-9 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: "1.5px solid #f0d5cc", color: "#c06040" }}
      >
        <ChevronIcon dir="left" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={btnBase} style={{ color: "#8a4a34" }}>1</button>
          {pages[0] > 2 && <span style={{ color: "#d0a090" }} className="px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={btnBase}
          style={
            p === page
              ? { background: "#f13c20", color: "#fff", fontWeight: 700 }
              : { color: "#8a4a34" }
          }
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span style={{ color: "#d0a090" }} className="px-1">…</span>
          )}
          <button onClick={() => onPageChange(totalPages)} className={btnBase} style={{ color: "#8a4a34" }}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || totalPages === 0}
        className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: "1.5px solid #f0d5cc", color: "#c06040" }}
      >
        <ChevronIcon dir="right" />
      </button>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("enquiry");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, page, limit };
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      const res = await fetchData(activeTab, params);
      const items = res.enquiries || res.contacts || [];
      setData({ items, total: res.total || 0, totalPages: res.totalPages || 0 });
    } catch {
      setData({ items: [], total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, fromDate, toDate, page, limit]);

  useEffect(() => { load(); }, [load]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSearchInput("");
    setFromDate("");
    setToDate("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const hasFilters = search || fromDate || toDate;

  return (
    <div className="min-h-screen font-sans">

      {/* ── Top banner (brand color) ── */}


      {/* ── Header ── */}
      <header
        className="w-full border-b"
        style={{ background: "#fff", borderColor: "#f0d5cc" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#fde8e3" }}
          >
            <SunburstIcon />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: "#f13c20" }}>
              Insight Consulting
            </p>
            <h1 className="text-2xl font-bold leading-tight" style={{ color: "#2d1308" }}>
              Form Submissions
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#8a4a34" }}>
              Manage and review all incoming enquiries and contact forms.
            </p>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs + Stats */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div
            className="flex p-1 rounded-xl"
            style={{ background: "#fde8e3", border: "1.5px solid #f8b4a3" }}
          >
            {["enquiry", "contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                style={
                  activeTab === tab
                    ? { background: "#f13c20", color: "#fff", boxShadow: "0 2px 10px rgba(241,60,32,0.25)" }
                    : { color: "#b45a3a" }
                }
              >
                {tab === "enquiry" ? "Enquiries" : "Contacts"}
              </button>
            ))}
          </div>

          {!loading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#8a4a34" }}>
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: activeTab === "enquiry" ? "#f13c20" : "#e8a000" }}
              />
              <span>
                <span className="font-bold" style={{ color: "#2d1308" }}>{data.total}</span> total records
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div
          className="rounded-xl p-4 mb-6 space-y-3"
          style={{ background: "#fff", border: "1.5px solid #f0d5cc", boxShadow: "0 1px 8px rgba(241,60,32,0.06)" }}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#c06040" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, phone, message…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "#fdf5f2",
                  border: "1.5px solid #f0d5cc",
                  color: "#2d1308",
                }}
                onFocus={e => (e.target.style.borderColor = "#f13c20")}
                onBlur={e => (e.target.style.borderColor = "#f0d5cc")}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold shrink-0 transition-all"
              style={{ background: "#f13c20", color: "#fff" }}
              onMouseEnter={e => (e.target.style.background = "#c0321a")}
              onMouseLeave={e => (e.target.style.background = "#f13c20")}
            >
              Search
            </button>
          </form>

          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#c06040" }}>
                <DateIcon />
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all [color-scheme:light]"
                style={{ background: "#fdf5f2", border: "1.5px solid #f0d5cc", color: "#5a2a14" }}
                onFocus={e => (e.target.style.borderColor = "#f13c20")}
                onBlur={e => (e.target.style.borderColor = "#f0d5cc")}
              />
            </div>
            <span className="text-sm shrink-0" style={{ color: "#c06040" }}>to</span>
            <div className="relative flex-1 min-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#c06040" }}>
                <DateIcon />
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all [color-scheme:light]"
                style={{ background: "#fdf5f2", border: "1.5px solid #f0d5cc", color: "#5a2a14" }}
                onFocus={e => (e.target.style.borderColor = "#f13c20")}
                onBlur={e => (e.target.style.borderColor = "#f0d5cc")}
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-sm rounded-lg shrink-0 transition-all"
                style={{ border: "1.5px solid #f0d5cc", color: "#b45a3a" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#f13c20")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#f0d5cc")}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl animate-pulse"
                style={{ background: "#fde8e3", border: "1.5px solid #f8b4a3" }}
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-2.5">
            {data.items.map((item) => (
              <SubmissionCard key={item.id} item={item} type={activeTab} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* Footer info */}
        {!loading && data.items.length > 0 && (
          <p className="text-center text-xs mt-4" style={{ color: "#c06040" }}>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total} records
          </p>
        )}
      </main>
    </div>
  );
}