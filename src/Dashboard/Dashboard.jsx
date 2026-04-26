import { useState, useEffect, useCallback, useRef } from "react";
import api from "@src/providers/api";

// ── API ────────────────────────────────────────────────────────────────────────
const fetchData = async (type, params) => {
  const endpoint = type === "enquiry" ? "/forms/enquiry" : "/forms/contact";
  const res = await api.get(endpoint, { params });
  return res.data;
};

// ── Icons ──────────────────────────────────────────────────────────────────────
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
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
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
const BriefcaseIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" strokeWidth="2" />
    <path d="M2 12h20" strokeWidth="2" />
  </svg>
);
const MessageIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" />
  </svg>
);

// ── Spinner ────────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#f13c20" strokeWidth="4" />
    <path className="opacity-75" fill="#f13c20" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ── Empty State ────────────────────────────────────────────────────────────────
const EmptyState = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-24" style={{ color: "#b45a3a" }}>
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fde8e3" }}>
      {tab === "enquiry" ? <MailIcon /> : <PhoneIcon />}
    </div>
    <p className="text-lg font-semibold" style={{ color: "#7a2a14" }}>
      No {tab === "enquiry" ? "enquiries" : "contacts"} found
    </p>
    <p className="text-sm mt-1" style={{ color: "#b45a3a" }}>Try adjusting your filters or search query</p>
  </div>
);

// ── Badge ──────────────────────────────────────────────────────────────────────
const Badge = ({ children, type }) => {
  const styles =
    type === "enquiry"
      ? { background: "#fde8e3", color: "#c0321a", border: "1px solid #f8b4a3" }
      : { background: "#fef3e2", color: "#b56a00", border: "1px solid #f8d89a" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={styles}>
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
  const isEnquiry = type === "enquiry";

  const displayName    = isEnquiry ? (item.fullName || "—") : ([item.firstName, item.lastName].filter(Boolean).join(" ") || "—");
  const displayEmail   = item.email || null;
  const displayPhone   = item.phone || null;
  const displayService = isEnquiry ? (item.serviceRequired || null) : null;
  const displayComment = isEnquiry ? (item.comments || null) : (item.message || null);

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
      <div className="px-5 py-4 flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: isEnquiry ? "#fde8e3" : "#fef3e2", color: accentColor }}
        >
          {displayName?.charAt(0)?.toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate" style={{ color: "#2d1308" }}>{displayName}</span>
              <Badge type={type}>{type}</Badge>
            </div>
            <span className="text-xs shrink-0" style={{ color: "#b45a3a" }}>{formattedDate} · {formattedTime}</span>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-sm" style={{ color: "#8a4a34" }}>
            {displayEmail && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
                  <polyline points="22,6 12,13 2,6" strokeWidth="2" />
                </svg>
                <span className="truncate max-w-[200px]">{displayEmail}</span>
              </span>
            )}
            {displayPhone && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" />
                </svg>
                {displayPhone}
              </span>
            )}
          </div>

          {!expanded && displayService && (
            <p className="mt-2 text-sm line-clamp-1 flex items-center gap-1.5" style={{ color: "#b45a3a" }}>
              <BriefcaseIcon />{displayService}
            </p>
          )}
          {!expanded && !displayService && displayComment && (
            <p className="mt-2 text-sm line-clamp-1 flex items-center gap-1.5" style={{ color: "#b45a3a" }}>
              <MessageIcon />{displayComment}
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

      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t" style={{ borderColor: "#f0d5cc" }}>
          {displayService && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider mb-1.5 font-semibold" style={{ color: "#c06040" }}>Service Required</p>
              <p className="text-sm leading-relaxed px-3 py-2 rounded-lg" style={{ color: "#5a2a14", background: "#fdf5f2", border: "1px solid #f0d5cc" }}>
                {displayService}
              </p>
            </div>
          )}
          {displayComment && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider mb-1.5 font-semibold" style={{ color: "#c06040" }}>
                {isEnquiry ? "Comments" : "Message"}
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap px-3 py-2 rounded-lg" style={{ color: "#5a2a14", background: "#fdf5f2", border: "1px solid #f0d5cc" }}>
                {displayComment}
              </p>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayEmail && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: "#c06040" }}>Email</p>
                <a href={`mailto:${displayEmail}`} onClick={(e) => e.stopPropagation()} className="text-sm underline underline-offset-2" style={{ color: "#f13c20" }}>
                  {displayEmail}
                </a>
              </div>
            )}
            {displayPhone && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: "#c06040" }}>Phone</p>
                <a href={`tel:${displayPhone}`} onClick={(e) => e.stopPropagation()} className="text-sm underline underline-offset-2" style={{ color: "#f13c20" }}>
                  {displayPhone}
                </a>
              </div>
            )}
          </div>
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
  const btnBase = "w-9 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: "1.5px solid #f0d5cc", color: "#c06040" }}>
        <ChevronIcon dir="left" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={btnBase} style={{ color: "#8a4a34" }}>1</button>
          {pages[0] > 2 && <span style={{ color: "#d0a090" }} className="px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={btnBase}
          style={p === page ? { background: "#f13c20", color: "#fff", fontWeight: 700 } : { color: "#8a4a34" }}>
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span style={{ color: "#d0a090" }} className="px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className={btnBase} style={{ color: "#8a4a34" }}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages || totalPages === 0}
        className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: "1.5px solid #f0d5cc", color: "#c06040" }}>
        <ChevronIcon dir="right" />
      </button>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab]     = useState("enquiry");
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [limit]                       = useState(8);
  const [data, setData]               = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading]         = useState(false);  // full skeleton: tab / page change
  const [searching, setSearching]     = useState(false);  // subtle spinner: search only
  const [searchInput, setSearchInput] = useState("");
  const searchTriggered               = useRef(false);    // flag to know what caused the load

  // ── Debounce: 500 ms after user stops typing → update `search` state ──
  useEffect(() => {
    const timer = setTimeout(() => {
      searchTriggered.current = true;
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);
  

  // ── Fetch ──
  const load = useCallback(async () => {
    const isSearch = searchTriggered.current;
    searchTriggered.current = false;

    // Search → subtle spinner; tab / page change → full skeleton
    if (isSearch) setSearching(true);
    else          setLoading(true);

    try {
      const params = { page, limit };
      if (search) params.search = search;

      const res   = await fetchData(activeTab, params);
      const items = (activeTab === "enquiry" ? res.enquiries : res.contacts) || [];

      setData({
        items,
        total:      res.total      != null ? res.total      : items.length,
        totalPages: res.totalPages != null ? res.totalPages : (Math.ceil(items.length / limit) || 1),
      });
    } catch {
      setData({ items: [], total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [activeTab, search, page, limit]);

  useEffect(() => { load(); }, [load]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="min-h-screen font-sans">

      {/* ── Header ── */}
      <header className="w-full border-b" style={{ background: "#fff", borderColor: "#f0d5cc" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fde8e3" }}>
            <SunburstIcon />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: "#f13c20" }}>Insight Consulting</p>
            <h1 className="text-md font-bold leading-tight" style={{ color: "#2d1308" }}>Form Submissions</h1>
            <p className="text-sm mt-0.5" style={{ color: "#8a4a34" }}>Manage and review all incoming enquiries and contact forms.</p>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs + total count */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex p-1 rounded-xl" style={{ background: "#fde8e3", border: "1.5px solid #f8b4a3" }}>
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
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: activeTab === "enquiry" ? "#f13c20" : "#e8a000" }} />
              <span><span className="font-bold" style={{ color: "#2d1308" }}>{data.total}</span> total records</span>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="rounded-xl p-4 mb-6" style={{ background: "#fff", border: "1.5px solid #f0d5cc", boxShadow: "0 1px 8px rgba(241,60,32,0.06)" }}>
          <div className="relative">
            {/* Icon slot: spinner while searching, magnifier otherwise */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#c06040" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                activeTab === "enquiry"
                  ? "Search by name, email, phone, service…"
                  : "Search by name, email, phone, comments…"
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{ background: "#fdf5f2", border: "1.5px solid #f0d5cc", color: "#2d1308" }}
              onFocus={e => (e.target.style.borderColor = "#f13c20")}
              onBlur={e => (e.target.style.borderColor = "#f0d5cc")}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          // Full skeleton only on tab / page change
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "#fde8e3", border: "1.5px solid #f8b4a3" }} />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          // Cards fade slightly while a search is in-flight
          <div className={`space-y-2.5 transition-opacity duration-200 ${searching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            {data.items.map((item) => (
              <SubmissionCard key={item.formSubmissionId || item.id} item={item} type={activeTab} />
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

        {/* Footer record count */}
        {!loading && data.items.length > 0 && (
          <p className="text-center text-xs mt-4" style={{ color: "#c06040" }}>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total} records
          </p>
        )}
      </main>
    </div>
  );
}