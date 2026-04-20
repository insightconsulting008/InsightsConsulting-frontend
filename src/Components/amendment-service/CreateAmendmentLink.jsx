import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@src/providers/axiosInstance";

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPLOYEE_ID = localStorage.getItem("employeeId");

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  !d ? null : new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (d) =>
  !d ? "" : new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const timeAgo = (d) => {
  if (!d) return "";
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
const initials = (n) =>
  !n ? "?" : n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

const AVATAR_COLORS = [
  ["#dc2626", "#fef2f2"], ["#7c3aed", "#f5f3ff"], ["#059669", "#ecfdf5"],
  ["#2563eb", "#eff6ff"], ["#d97706", "#fffbeb"], ["#db2777", "#fdf4ff"],
];
const avatarStyle = (name) => AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS = {
  PAID:    { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100", dot: "bg-green-500",  label: "Paid",    pulse: false },
  CREATED: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-100", dot: "bg-amber-500",  label: "Pending", pulse: true  },
  FAILED:  { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-100",  dot: "bg-rose-500",   label: "Failed",  pulse: false },
  EXPIRED: { bg: "bg-slate-50",  text: "text-slate-500",  border: "border-slate-200", dot: "bg-slate-400",  label: "Expired", pulse: false },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, sw = 2, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  link:     ["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"],
  search:   ["M11 3a8 8 0 100 16A8 8 0 0011 3z", "M21 21l-4.35-4.35"],
  user:     ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"],
  chevron:  "M6 9l6 6 6-6",
  check:    "M20 6L9 17l-5-5",
  copy:     ["M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866", "M10 21h8c1.105 0 2-.911 2-2.036V9.107c0-1.124-.895-2.036-2-2.036H10c-1.105 0-2 .912-2 2.036v9.857C8 20.09 8.895 21 10 21z"],
  refresh:  ["M23 4v6h-6", "M1 20v-6h6", "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"],
  alert:    ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4M12 17h.01"],
  x:        "M18 6L6 18M6 6l12 12",
  phone:    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail:     ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  clock:    ["M12 2a10 10 0 100 20A10 10 0 0012 2z", "M12 6v6l4 2"],
  external: ["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6", "M15 3h6v6", "M10 14L21 3"],
  prev:     "M15 18l-6-6 6-6",
  next:     "M9 18l6-6-6-6",
  users:    ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"],
  bell:     "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  plus:     "M12 5v14M5 12h14",
  globe:    ["M12 2a10 10 0 100 20A10 10 0 0012 2z", "M2 12h20", "M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"],
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, photo, size = "md" }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [bg, fg] = avatarStyle(name ?? "E");
  const dim = size === "sm" ? "w-8 h-8 text-[11px]" : size === "xs" ? "w-6 h-6 text-[9px]" : "w-10 h-10 text-[13px]";
  if (photo && !imgFailed)
    return (
      <img src={photo} alt={name}
        onError={() => setImgFailed(true)}
        className={`${dim} rounded-full object-cover flex-shrink-0 border-2`}
        style={{ borderColor: `${fg}30` }} />
    );
  return (
    <div className={`${dim} rounded-full flex items-center justify-center flex-shrink-0 font-extrabold tracking-wide`}
      style={{ background: bg, color: fg }}>
      {initials(name ?? "EX")}
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ s }) => {
  const c = STATUS[s] || STATUS.EXPIRED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-widest border whitespace-nowrap ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot} ${c.pulse ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
};

// ─── Copy Button ──────────────────────────────────────────────────────────────
const CopyBtn = ({ text, id, copied, onCopy }) => {
  const done = copied === id;
  return (
    <button onClick={() => onCopy(text, id)}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all duration-150 flex-shrink-0 cursor-pointer
        ${done ? "bg-green-50 border-green-100 text-green-700" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
      {done ? <><Icon d={ICONS.check} size={10} /><span>Copied!</span></> : <><Icon d={ICONS.copy} size={10} /><span>Copy</span></>}
    </button>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 16 }) => (
  <div className="rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0"
    style={{ width: size, height: size }} />
);

// ─── Pagination Bar ───────────────────────────────────────────────────────────
const PaginBar = ({ page, totalPages, onPage, loading }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (i === page - 2 || i === page + 2) pages.push("...");
  }
  const deduped = pages.filter((p, i) => p !== pages[i - 1]);
  return (
    <div className="flex items-center justify-center gap-1 py-3">
      <button onClick={() => onPage(page - 1)} disabled={page === 1 || loading}
        className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-300 transition-colors cursor-pointer">
        <Icon d={ICONS.prev} size={13} />
      </button>
      {deduped.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1 text-slate-400 text-xs">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p)} disabled={loading}
            className="w-8 h-8 rounded-lg border text-sm font-semibold transition-all cursor-pointer"
            style={p === page
              ? { borderColor: "var(--color-primary)", background: "var(--color-primary)", color: "#fff" }
              : { borderColor: "#e4e4ec", background: "#fff", color: "#424260" }}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages || loading}
        className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-300 transition-colors cursor-pointer">
        <Icon d={ICONS.next} size={13} />
      </button>
    </div>
  );
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {[160, 110, 200, 70, 80, 150, 80, 90].map((w, i) => (
      <td key={i} className="px-3.5 py-3 border-b border-slate-100">
        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ─── User Picker ──────────────────────────────────────────────────────────────
const UserPicker = ({ selectedUser, onSelect }) => {
  const [open, setOpen]             = useState(false);
  const [query, setQuery]           = useState("");
  const [debQ, setDebQ]             = useState("");
  const [users, setUsers]           = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const ref      = useRef(null);
  const inputRef = useRef(null);
  const debRef   = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { setDebQ(query); setPage(1); }, 320);
  }, [query]);

 useEffect(() => {
  if (!open) return;
  setLoading(true);

  const p = new URLSearchParams({ page, limit: 50 });
  if (debQ) p.set("search", debQ);

  axiosInstance.get(`/staff/payments/users?${p}`)
    .then((r) => { 
      setUsers(Array.isArray(r.data) ? r.data : r.data?.users || []);
      setPagination(r.data?.pagination || null);
    })
    .catch(() => setUsers([]))
    .finally(() => setLoading(false));

}, [open, debQ, page]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (u) => { onSelect(u); setOpen(false); setQuery(""); };
  const isSelected = (u) => selectedUser?.userId === u.userId;

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full h-12 px-3.5 rounded-xl flex items-center justify-between gap-2.5 border-2 transition-all duration-150 cursor-pointer font-[inherit]"
        style={open
          ? { borderColor: "var(--color-primary)", background: "#fff", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" }
          : { borderColor: "#e4e4ec", background: "#f8f8fa" }}>
        {!selectedUser ? (
          <span className="flex items-center gap-2.5 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
              <Icon d={ICONS.user} size={14} />
            </div>
            <span className="text-sm">Choose a user…</span>
          </span>
        ) : selectedUser === "other" ? (
          <span className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              <Icon d={ICONS.user} size={14} />
            </div>
            <div className="text-left">
              <p className="m-0 text-sm font-bold text-slate-900">Other / External</p>
              <p className="m-0 text-[11px] text-slate-400">Unlisted user</p>
            </div>
          </span>
        ) : (
          <span className="flex items-center gap-2.5">
            <Avatar name={selectedUser.name} photo={selectedUser.photoUrl} />
            <div className="text-left min-w-0">
              <p className="m-0 text-sm font-bold text-slate-900 truncate max-w-[200px]">{selectedUser.name}</p>
              <p className="m-0 text-[11px] text-slate-500 truncate max-w-[200px]">
                {selectedUser.email || selectedUser.phoneNumber || ""}
              </p>
            </div>
          </span>
        )}
        <div className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          style={{ color: open ? "var(--color-primary)" : "#a8a8c0" }}>
          <Icon d={ICONS.chevron} size={16} />
        </div>
      </button>

      {open && (
        <div className="absolute z-[60] w-full mt-1.5 bg-white rounded-2xl border border-slate-200 overflow-hidden animate-[fadein_0.18s_ease]"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)" }}>
          <div className="p-3 pb-0">
            <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 transition-all">
              <span className="text-slate-400 flex-shrink-0">
                {loading
                  ? <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 animate-spin" style={{ borderTopColor: "var(--color-primary)" }} />
                  : <Icon d={ICONS.search} size={14} />}
              </span>
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email or phone…"
                className="flex-1 border-none outline-none bg-transparent text-[13px] text-slate-900 font-[inherit]" />
              {query && (
                <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="border-none bg-transparent cursor-pointer p-0 text-slate-400 flex hover:text-slate-600">
                  <Icon d={ICONS.x} size={13} />
                </button>
              )}
            </div>
          </div>

          {pagination && (
            <p className="mx-3.5 mt-2 mb-0 text-[11px] text-slate-400 font-medium">
              {loading ? "Searching…" : `${pagination.total} user${pagination.total !== 1 ? "s" : ""} found`}
            </p>
          )}

          <div className="overflow-y-auto max-h-72 py-2">
            {loading && users.length === 0 ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 animate-spin" style={{ borderTopColor: "var(--color-primary)" }} />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-7 px-5">
                <p className="m-0 text-[13px] text-slate-500 font-medium">No users found</p>
              </div>
            ) : users.map((u) => {
              const active = isSelected(u);
              return (
                <button key={u.userId} type="button" onClick={() => handleSelect(u)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 border-none cursor-pointer text-left transition-colors duration-100 hover:bg-slate-50"
                  style={active
                    ? { background: "rgba(239,68,68,0.06)", borderLeft: "3px solid var(--color-primary)", paddingLeft: 11 }
                    : { borderLeft: "3px solid transparent" }}>
                  <Avatar name={u.name} photo={u.photoUrl} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="m-0 text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                      <span className="text-[9px] text-slate-300 font-mono bg-slate-100 px-1 py-px rounded flex-shrink-0">
                        #{u.userId?.slice(-5)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {u.email && <span className="flex items-center gap-1 text-xs text-slate-500"><Icon d={ICONS.mail} size={10} />{u.email}</span>}
                      {u.phoneNumber && <span className="flex items-center gap-1 text-xs text-slate-500"><Icon d={ICONS.phone} size={10} />{u.phoneNumber}</span>}
                    </div>
                  </div>
                  {active && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: "var(--color-primary)" }}>
                      <Icon d={ICONS.check} size={10} sw={2.5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Showing {users.length} of {pagination.total}</span>
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" onClick={() => setPage(p)} disabled={loading}
                    className="w-6 h-6 rounded text-[11px] border-none cursor-pointer font-semibold transition-all"
                    style={p === page ? { background: "var(--color-primary)", color: "#fff" } : { background: "#e4e4ec", color: "#5a5a7a" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100">
            <button type="button" onClick={() => { onSelect("other"); setOpen(false); setQuery(""); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 border-none cursor-pointer text-left transition-colors hover:bg-slate-50"
              style={selectedUser === "other"
                ? { background: "#f8f8fa", borderLeft: "3px solid #7878a0", paddingLeft: 11 }
                : { borderLeft: "3px solid transparent" }}>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-400">
                <Icon d={ICONS.user} size={16} />
              </div>
              <div>
                <p className="m-0 text-sm font-semibold text-slate-700">Other / External</p>
                <p className="m-0 text-xs text-slate-400 mt-0.5">User not in the system</p>
              </div>
              {selectedUser === "other" && (
                <div className="ml-auto w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 text-white">
                  <Icon d={ICONS.check} size={10} sw={2.5} />
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Create Link Modal ────────────────────────────────────────────────────────
const CreateLinkModal = ({ onClose, onSuccess }) => {
  const [selectedUser, setSelected] = useState(null);
  const [form, setForm]             = useState({ note: "", amount: "" });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  // lock body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser)                            { setError("Please select a user."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Amount must be greater than 0."); return; }
    setLoading(true); setError("");
    // capture before async so we always have them
    const submittedAmount = Number(form.amount);
    const submittedNote   = form.note;
    try {
      const r = await axiosInstance.post("/staff/payments/create/amendment-link", {
        employeeId: EMPLOYEE_ID,
        userId: selectedUser === "other" ? null : selectedUser?.userId,
        note: submittedNote,
        amount: submittedAmount,
      });
      // attach submitted values so success modal is never 0
      onSuccess({ ...r.data, _amount: submittedAmount, _note: submittedNote });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-[slideup_0.28s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b rounded-t-2xl"
          style={{ background: "var(--primary-50)", borderColor: "var(--primary-100)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--color-primary)", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}>
              <Icon d={ICONS.link} size={16} />
            </div>
            <div>
              <p className="m-0 text-[15px] font-bold" style={{ color: "var(--primary-800)" }}>Create Payment Link</p>
              <p className="m-0 text-[11px]" style={{ color: "var(--primary-600)" }}>Fill in details to generate</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 cursor-pointer transition-all">
            <Icon d={ICONS.x} size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Select User</label>
            <UserPicker selectedUser={selectedUser} onSelect={setSelected} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Note <span className="opacity-50 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <input
              className="w-full h-11 px-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition-all duration-150 font-[inherit]"
              placeholder="Brief note for this amendment…"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] font-extrabold pointer-events-none"
                style={{ color: "var(--color-primary-hover)" }}>₹</span>
              <input type="text" inputMode="numeric"
                className="w-full h-11 pl-7 pr-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition-all duration-150 font-[inherit]"
                placeholder="0"
                value={form.amount}
                onChange={(e) => { if (/^\d*$/.test(e.target.value)) setForm({ ...form, amount: e.target.value }); }} />
            </div>
            <p className="mt-1.5 m-0 text-[11px] text-slate-400">Whole numbers only — no decimals</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">
              <Icon d={ICONS.alert} size={14} className="flex-shrink-0" />{error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 h-11 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm cursor-pointer font-[inherit] hover:border-slate-300 transition-all active:scale-[0.97]">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading}
            className={`flex-1 h-11 rounded-xl border-none text-white font-bold text-sm flex items-center justify-center gap-2 font-[inherit] transition-all duration-150 cursor-pointer ${loading ? "opacity-75 cursor-not-allowed" : "active:scale-[0.97]"}`}
            style={{ background: "var(--color-primary)", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}>
            {loading ? <><Spinner size={16} />Generating…</> : <><Icon d={ICONS.link} size={15} />Generate</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Notification Panel ───────────────────────────────────────────────────────
function NotifPanel({ open, onClose, onCountChange }) {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [err, setErr]               = useState(null);
  const [busy, setBusy]             = useState(new Set());
  const [markingAll, setMarkingAll] = useState(false);
  const ref   = useRef(null);
  const empId = localStorage.getItem("employeeId");

  const load = useCallback(async () => {
    if (!empId) return;
    setLoading(true); setErr(null);
    try {
      const r = await axiosInstance.get(`/notifications/employee/${empId}`);
      if (r.data?.success) {
        const list = r.data.data ?? [];
        setItems(list);
        onCountChange?.(list.filter((n) => !n.isRead).length);
      }
    } catch { setErr("Could not load notifications."); }
    finally { setLoading(false); }
  }, [empId, onCountChange]);

  useEffect(() => { if (open) load(); }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 15);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [open, onClose]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && open) onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  const markOne = async (id) => {
    if (busy.has(id)) return;
    setBusy((p) => new Set([...p, id]));
    try {
      await axiosInstance.put(`/notifications/read/${id}`);
      setItems((p) => {
        const next = p.map((n) => n.notificationId === id ? { ...n, isRead: true } : n);
        onCountChange?.(next.filter((n) => !n.isRead).length);
        return next;
      });
    } catch { /* silent */ }
    finally { setBusy((p) => { const s = new Set(p); s.delete(id); return s; }); }
  };

  const markAll = async () => {
    const unread = items.filter((n) => !n.isRead);
    if (!unread.length || markingAll) return;
    setMarkingAll(true);
    try {
      await Promise.all(unread.map((n) => axiosInstance.put(`/notifications/read/${n.notificationId}`)));
      setItems((p) => { const next = p.map((n) => ({ ...n, isRead: true })); onCountChange?.(0); return next; });
    } catch { /* silent */ }
    finally { setMarkingAll(false); }
  };

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <>
      <div onClick={onClose}
        className={`fixed inset-0 z-40 bg-[rgba(10,10,30,0.28)] backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <div ref={ref} role="dialog"
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${open ? "translate-x-0" : "translate-x-full"}`}>

        <div className="h-16 flex-shrink-0 flex items-center justify-between px-5 border-b border-slate-100"
          style={{ background: "linear-gradient(to right, var(--primary-50), #fff)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--primary-100)", color: "var(--color-primary)" }}>
              <Icon d={ICONS.bell} size={16} />
            </div>
            <div>
              <p className="m-0 text-sm font-bold text-slate-900 leading-tight">Notifications</p>
              <p className="m-0 text-[11px] text-slate-400 mt-0.5">
                {loading ? "Refreshing…" : unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={load} disabled={loading}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-transparent flex items-center justify-center text-slate-500 cursor-pointer hover:border-slate-300 transition-colors">
              <Icon d={ICONS.refresh} size={13} className={loading ? "animate-spin" : ""} />
            </button>
            {unreadCount > 0 && (
              <button onClick={markAll} disabled={markingAll}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer font-[inherit] border"
                style={{ borderColor: "var(--primary-200)", background: "var(--primary-50)", color: "var(--color-primary)", opacity: markingAll ? 0.5 : 1 }}>
                <Icon d={ICONS.check} size={10} /> Mark all read
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-transparent flex items-center justify-center text-slate-500 cursor-pointer hover:border-slate-300 transition-colors">
              <Icon d={ICONS.x} size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {err && (
            <div className="m-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2">
              <Icon d={ICONS.alert} size={14} className="text-rose-600" />
              <p className="m-0 text-xs text-rose-700 flex-1">{err}</p>
              <button onClick={load} className="bg-transparent border-none text-rose-700 text-[11px] font-bold cursor-pointer font-[inherit]">Retry</button>
            </div>
          )}
          {loading && items.length === 0 && Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-3 px-5 py-3.5 border-b border-slate-50">
              <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-2.5 w-1/2 rounded bg-slate-100 animate-pulse" />
                <div className="h-2.5 w-3/4 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
          {!loading && !err && items.length === 0 && (
            <div className="min-h-[280px] flex flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--primary-50)", color: "var(--color-primary)" }}>
                <Icon d={ICONS.bell} size={22} />
              </div>
              <p className="m-0 text-[15px] font-bold text-slate-700">All caught up!</p>
              <p className="m-0 text-[13px] text-slate-400">No notifications right now.</p>
            </div>
          )}
          {!loading && items.map((n, i) => {
            const isBusy = busy.has(n.notificationId);
            return (
              <div key={n.notificationId}
                className={`flex gap-3 px-5 py-3.5 relative ${i < items.length - 1 ? "border-b border-slate-50" : ""}`}
                style={{ background: n.isRead ? "#fff" : "var(--primary-50)" }}>
                {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r" style={{ background: "var(--color-primary)" }} />}
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: n.isRead ? "#f1f1f5" : "var(--primary-100)", color: n.isRead ? "#a8a8c0" : "var(--color-primary)" }}>
                  <Icon d={ICONS.bell} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 justify-between mb-0.5">
                    <p className={`m-0 text-[13px] leading-snug ${n.isRead ? "font-normal" : "font-bold"} text-slate-900`}>{n.title}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                  </div>
                  {n.description && <p className="m-0 text-xs text-slate-500 leading-relaxed">{n.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    {n.redirectUrl && (
                      <a href={n.redirectUrl} onClick={() => !n.isRead && markOne(n.notificationId)}
                        className="text-[11px] font-bold no-underline" style={{ color: "var(--color-primary)" }}>
                        View details →
                      </a>
                    )}
                    {!n.isRead && (
                      <button onClick={() => markOne(n.notificationId)} disabled={isBusy}
                        className={`bg-transparent border-none p-0 text-[11px] text-slate-400 cursor-pointer font-[inherit] ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {isBusy ? "…" : "Mark as read"}
                      </button>
                    )}
                    {n.isRead && <span className="text-[11px] text-green-500">✓ Read</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-2.5 bg-slate-50 text-center">
            <p className="m-0 text-[11px] text-slate-400">
              {items.length} notification{items.length !== 1 ? "s" : ""}
              {unreadCount > 0 ? ` · ${unreadCount} unread` : " · all read"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Payment Card (Mobile) ────────────────────────────────────────────────────
const PaymentCard = ({ p, copied, onCopy }) => {
  const isExternal = !p.user;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm animate-[fadein_0.18s_ease]">
      {/* Top: user + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {isExternal ? (
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-400">
              <Icon d={ICONS.globe} size={16} />
            </div>
          ) : <Avatar name={p.user.name} photo={p.user.photoUrl} />}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="m-0 font-bold text-slate-900 text-sm truncate">{isExternal ? "External" : p.user?.name}</p>
              {isExternal && <span className="text-[9px] font-bold px-1.5 py-px rounded-full bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">External</span>}
            </div>
            {!isExternal && p.user?.email && <p className="m-0 text-[11px] text-slate-400 truncate">{p.user.email}</p>}
            {!isExternal && p.user?.phoneNumber && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <Icon d={ICONS.phone} size={9} />{p.user.phoneNumber}
              </span>
            )}
          </div>
        </div>
        <StatusBadge s={p.status} />
      </div>

      {/* Amount + Payment Link highlighted together */}
      <div className="rounded-xl border p-3 mb-2.5"
        style={{ background: "var(--primary-50)", borderColor: "var(--primary-200)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xl font-extrabold tracking-tight" style={{ color: "var(--primary-700)" }}>
            ₹{(p.amount || 0).toLocaleString("en-IN")}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border"
            style={{ background: "var(--primary-100)", color: "var(--primary-700)", borderColor: "var(--primary-200)" }}>
            {p.type}
          </span>
          {p.createdBy?.name && (
            <span className="flex items-center gap-1.5 ml-auto text-[11px] text-slate-500">
              <Avatar name={p.createdBy.name} photo={p.createdBy.photoUrl} size="xs" />{p.createdBy.name}
            </span>
          )}
        </div>
        {p.razorpayPaymentLink ? (
          <div className="flex items-center gap-1.5">
            <a href={p.razorpayPaymentLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[11px] no-underline truncate flex-1"
              style={{ color: "var(--primary-600)" }}>
              <Icon d={ICONS.external} size={10} />{p.razorpayPaymentLink}
            </a>
            <CopyBtn text={p.razorpayPaymentLink} id={p.paymentId} copied={copied} onCopy={onCopy} />
          </div>
        ) : <span className="text-[11px] text-slate-300">No payment link</span>}
      </div>

      {/* Order ID */}
      {p.razorpayOrderId && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 mb-2">
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
            <p className="m-0 mt-0.5 font-mono text-[11px] text-slate-600 truncate max-w-[200px]">{p.razorpayOrderId}</p>
          </div>
          <CopyBtn text={p.razorpayOrderId} id={`ord-${p.paymentId}`} copied={copied} onCopy={onCopy} />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Icon d={ICONS.clock} size={10} />{fmtDate(p.createdAt)} · {fmtTime(p.createdAt)}
        </span>
        {p.paidAt && <span className="text-[11px] font-bold text-green-600">✓ Paid {fmtDate(p.paidAt)}</span>}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateAmendmentLink() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successLink, setSuccess]             = useState(null);
  const [copied, setCopied]                   = useState(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread]       = useState(0);
  const [bellAnim, setBellAnim]   = useState(false);

  const [payments, setPayments]           = useState([]);
  const [payPagination, setPayPagination] = useState(null);
  const [payPage, setPayPage]             = useState(1);
  const [tableSearch, setTSearch]         = useState("");
  const [tableDebouncedQ, setTableDQ]     = useState("");
  const [tLoading, setTLoading]           = useState(false);
  const tableDebRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    if (!id) return;
    axiosInstance.get(`/notifications/employee/${id}`)
      .then((r) => { if (r.data?.success) setUnread((r.data.data ?? []).filter((n) => !n.isRead).length); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (unread > 0) { setBellAnim(true); const t = setTimeout(() => setBellAnim(false), 850); return () => clearTimeout(t); }
  }, [unread]);

  useEffect(() => {
    clearTimeout(tableDebRef.current);
    tableDebRef.current = setTimeout(() => { setTableDQ(tableSearch); setPayPage(1); }, 350);
  }, [tableSearch]);

  const fetchPayments = useCallback(() => {
    if (!EMPLOYEE_ID) return;
    setTLoading(true);
    const params = new URLSearchParams({ page: payPage, limit: 10 });
    if (tableDebouncedQ) params.set("search", tableDebouncedQ);
    axiosInstance.get(`/staff/payments/${EMPLOYEE_ID}?${params}`)
      .then((r) => { setPayments(r.data.data || []); setPayPagination(r.data.pagination || null); })
      .catch(() => setPayments([]))
      .finally(() => setTLoading(false));
  }, [payPage, tableDebouncedQ]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const doCopy = (text, id) =>
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });

  const handleSuccess = (data) => {
    setShowCreateModal(false);
    setSuccess(data);
    setPayPage(1);
    fetchPayments();
  };

  const stats = [
    { label: "Total Links", val: payPagination?.total ?? "—",                          color: "var(--primary-700)", bg: "var(--primary-50)",  border: "var(--primary-200)" },
    { label: "Paid",        val: payments.filter((p) => p.status === "PAID").length,    color: "#047857",             bg: "#ecfdf5",            border: "#d1fae5"            },
    { label: "Pending",     val: payments.filter((p) => p.status === "CREATED").length, color: "#b45309",             bg: "#fffbeb",            border: "#fef3c7"            },
    { label: "Failed",      val: payments.filter((p) => p.status === "FAILED").length,  color: "#be123c",             bg: "#fff1f2",            border: "#ffe4e6"            },
  ];

  const TABLE_HEADERS = ["User", "Created By", "Amount & Link", "Type", "Status", "Order ID", "Paid At", "Created"];

  return (
    <div className="min-h-screen bg-slate-100 font-[DM_Sans,system-ui,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadein  { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes slideup { from{opacity:0;transform:translateY(24px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bell    { 0%,100%{transform:rotate(0)} 15%{transform:rotate(14deg)} 30%{transform:rotate(-10deg)} 45%{transform:rotate(8deg)} 60%{transform:rotate(-6deg)} 75%{transform:rotate(3deg)} }
        .bell-anim { animation: bell 0.82s ease; }
        .row-hover:hover td { background: var(--primary-50) !important; }
        input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important; background: #fff !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #e4e4ec; border-radius: 4px; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 h-16 flex items-center sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "var(--color-primary)", boxShadow: "0 4px 14px rgba(239,68,68,0.35)" }}>
              <Icon d={ICONS.link} size={18} />
            </div>
            <div>
              <h1 className="m-0 text-[17px] font-extrabold text-slate-900 tracking-tight leading-tight">Amendment Links</h1>
              <p className="m-0 text-[11px] text-slate-400 hidden sm:block">Generate Razorpay payment links for amendments</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowCreateModal(true)}
              className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl border-none text-white text-sm font-bold cursor-pointer font-[inherit] transition-all active:scale-[0.97]"
              style={{ background: "var(--color-primary)", boxShadow: "0 3px 10px rgba(239,68,68,0.3)" }}>
              <Icon d={ICONS.plus} size={14} />Create Link
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen((v) => !v)}
                className="w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-150"
                style={notifOpen
                  ? { borderColor: "var(--color-primary)", background: "var(--primary-50)", color: "var(--color-primary)" }
                  : { borderColor: "#e4e4ec", background: "transparent", color: "#7878a0" }}>
                <Icon d={ICONS.bell} size={16} className={bellAnim ? "bell-anim" : ""} />
              </button>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white px-0.5"
                  style={{ background: "var(--color-primary)" }}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} onCountChange={setUnread} />
      {showCreateModal && <CreateLinkModal onClose={() => setShowCreateModal(false)} onSuccess={handleSuccess} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-5">

        {/* ── STATS ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl p-4 border shadow-sm"
              style={{ background: s.bg, borderColor: s.border }}>
              <p className="m-0 text-[10px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.label}</p>
              <p className="m-0 mt-1.5 text-[32px] font-extrabold tracking-tighter leading-none" style={{ color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* ── FULL-WIDTH TABLE CARD ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 text-sm font-bold text-slate-900">Recent Payments</p>
              <p className="m-0 text-xs text-slate-400 mt-0.5">
                {payPagination
                  ? `${payPagination.total} total · page ${payPagination.page} of ${payPagination.totalPages}`
                  : "Loading…"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile create */}
              <button onClick={() => setShowCreateModal(true)}
                className="sm:hidden flex items-center gap-1.5 h-9 px-3 rounded-xl border-none text-white text-xs font-bold cursor-pointer font-[inherit]"
                style={{ background: "var(--color-primary)" }}>
                <Icon d={ICONS.plus} size={13} />Create
              </button>

              {/* Search */}
              <div className="flex items-center gap-1.5 h-9 px-3 rounded-xl border-[1.5px] transition-all duration-150"
                style={tableSearch
                  ? { borderColor: "var(--color-primary)", background: "var(--primary-50)" }
                  : { borderColor: "#e4e4ec", background: "#f8f8fa" }}>
                <span style={{ color: tableSearch ? "var(--color-primary)" : "#a8a8c0" }}>
                  {tLoading
                    ? <div className="w-3 h-3 rounded-full border-2 border-slate-200 animate-spin" style={{ borderTopColor: "var(--color-primary)" }} />
                    : <Icon d={ICONS.search} size={13} />}
                </span>
                <input type="text" value={tableSearch} onChange={(e) => setTSearch(e.target.value)}
                  placeholder="Search payments…"
                  className="border-none outline-none bg-transparent text-xs text-slate-900 font-[inherit] w-28 sm:w-48" />
                {tableSearch && (
                  <button type="button" onClick={() => setTSearch("")}
                    className="border-none bg-transparent cursor-pointer text-slate-400 flex p-0 hover:text-slate-600">
                    <Icon d={ICONS.x} size={12} />
                  </button>
                )}
              </div>

              {/* Refresh */}
              <button onClick={() => { setPayPage(1); fetchPayments(); }} disabled={tLoading}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer font-[inherit] hover:border-slate-300 transition-all ${tLoading ? "opacity-60" : ""}`}>
                <Icon d={ICONS.refresh} size={13} className={tLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* ── Desktop table ──────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            {tLoading && payments.length === 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="px-3.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-b"
                        style={{ color: "var(--primary-700)", background: "var(--primary-50)", borderColor: "var(--primary-100)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)}</tbody>
              </table>
            ) : payments.length === 0 ? (
              <div className="text-center py-16 px-5">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-300">
                  <Icon d={ICONS.search} size={20} />
                </div>
                <p className="text-sm text-slate-500 font-medium m-0">
                  {tableSearch ? `No results for "${tableSearch}"` : "No payments found"}
                </p>
                {tableSearch && (
                  <button type="button" onClick={() => setTSearch("")}
                    className="mt-2 bg-transparent border-none text-sm font-semibold cursor-pointer font-[inherit]"
                    style={{ color: "var(--color-primary-hover)" }}>
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full border-collapse text-sm" style={{ opacity: tLoading ? 0.6 : 1, transition: "opacity 200ms" }}>
                <thead>
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="px-3.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-b"
                        style={{ color: "var(--primary-700)", background: "var(--primary-50)", borderColor: "var(--primary-100)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const isExternal = !p.user;
                    return (
                      <tr key={p.paymentId} className="row-hover transition-colors">

                        {/* User */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          <div className="flex items-center gap-2.5" style={{ minWidth: 160 }}>
                            {isExternal ? (
                              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-400">
                                <Icon d={ICONS.globe} size={16} />
                              </div>
                            ) : <Avatar name={p.user.name} photo={p.user.photoUrl} />}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="m-0 font-semibold text-slate-900">{isExternal ? "External" : p.user?.name}</p>
                                {isExternal && <span className="text-[9px] font-bold px-1.5 py-px rounded-full bg-slate-100 text-slate-500 border border-slate-200">External</span>}
                              </div>
                              {!isExternal && p.user?.email && <p className="m-0 text-[11px] text-slate-400 mt-0.5">{p.user.email}</p>}
                              {!isExternal && p.user?.phoneNumber && (
                                <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                  <Icon d={ICONS.phone} size={9} />{p.user.phoneNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Created By */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          {p.createdBy?.name ? (
                            <div className="flex items-center gap-2">
                              <Avatar name={p.createdBy.name} photo={p.createdBy.photoUrl} size="sm" />
                              <span className="font-medium text-slate-700 whitespace-nowrap">{p.createdBy.name}</span>
                            </div>
                          ) : <span className="text-slate-300">—</span>}
                        </td>

                        {/* Amount & Link — highlighted */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          <div className="rounded-xl border px-3 py-2" style={{ background: "var(--primary-50)", borderColor: "var(--primary-200)", minWidth: 210 }}>
                            <span className="font-extrabold text-[16px] tabular-nums block mb-1.5" style={{ color: "var(--primary-700)" }}>
                              ₹{(p.amount || 0).toLocaleString("en-IN")}
                            </span>
                            {p.razorpayPaymentLink ? (
                              <div className="flex items-center gap-1.5">
                                <a href={p.razorpayPaymentLink} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 font-mono text-[11px] no-underline truncate" style={{ color: "var(--primary-600)", maxWidth: 130 }}>
                                  <Icon d={ICONS.external} size={9} />{p.razorpayPaymentLink}
                                </a>
                                <CopyBtn text={p.razorpayPaymentLink} id={p.paymentId} copied={copied} onCopy={doCopy} />
                              </div>
                            ) : <span className="text-[11px] text-slate-300">No link</span>}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap"
                            style={{ background: "var(--primary-50)", color: "var(--primary-700)", borderColor: "var(--primary-200)" }}>
                            {p.type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          <StatusBadge s={p.status} />
                        </td>

                        {/* Order ID */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          {p.razorpayOrderId ? (
                            <div className="flex items-center gap-1.5" style={{ minWidth: 155 }}>
                              <span className="font-mono text-[11px] text-slate-500 truncate" style={{ maxWidth: 90 }}>{p.razorpayOrderId}</span>
                              <CopyBtn text={p.razorpayOrderId} id={`ord-${p.paymentId}`} copied={copied} onCopy={doCopy} />
                            </div>
                          ) : <span className="text-slate-300">—</span>}
                        </td>

                        {/* Paid At */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          {p.paidAt ? (
                            <div>
                              <p className="m-0 text-xs font-medium text-slate-800 whitespace-nowrap">{fmtDate(p.paidAt)}</p>
                              <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                <Icon d={ICONS.clock} size={9} />{fmtTime(p.paidAt)}
                              </span>
                            </div>
                          ) : <span className="text-slate-300">—</span>}
                        </td>

                        {/* Created */}
                        <td className="px-3.5 py-3 border-b border-slate-100 align-middle">
                          <p className="m-0 text-xs font-medium text-slate-800 whitespace-nowrap">{fmtDate(p.createdAt)}</p>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Icon d={ICONS.clock} size={9} />{fmtTime(p.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Mobile Cards ─────────────────────── */}
          <div className={`md:hidden p-3 transition-opacity duration-200 ${tLoading ? "opacity-60" : "opacity-100"}`}>
            {tLoading && payments.length === 0
              ? Array.from({ length: 3 }, (_, i) => <div key={i} className="h-28 rounded-2xl bg-slate-100 mb-3 animate-pulse" />)
              : payments.length === 0
              ? <div className="text-center py-12"><p className="text-sm text-slate-500 font-medium m-0">{tableSearch ? `No results for "${tableSearch}"` : "No payments found"}</p></div>
              : payments.map((p) => <PaymentCard key={p.paymentId} p={p} copied={copied} onCopy={doCopy} />)
            }
          </div>

          {payPagination && (
            <div className="border-t border-slate-100 px-4 pb-1">
              <PaginBar page={payPagination.page} totalPages={payPagination.totalPages} onPage={setPayPage} loading={tLoading} />
            </div>
          )}
        </div>
      </div>

      {/* ── SUCCESS MODAL ───────────────────────────────────── */}
      {successLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[rgba(26,26,46,0.6)] backdrop-blur-md"
          onClick={() => setSuccess(null)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-7 animate-[slideup_0.28s_cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={(e) => e.stopPropagation()}>

            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-white"
              style={{ background: "var(--color-primary)", boxShadow: "0 8px 24px rgba(239,68,68,0.35)" }}>
              <Icon d={ICONS.check} size={28} sw={2.5} />
            </div>

            <h3 className="text-center m-0 mb-1 text-[22px] font-extrabold text-slate-900 tracking-tight">
              Link Generated! 🎉
            </h3>
            <p className="text-center m-0 mb-5 text-slate-400 text-sm">
              Your amendment payment link is ready to share.
            </p>

            {/* Use _amount (captured before submit) to avoid API returning 0 */}
            <div className="flex items-center justify-center gap-5 py-4 mb-5 border-t border-b border-slate-100">
              <div className="text-center">
                <p className="m-0 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Amount</p>
                <p className="m-0 mt-1 text-[28px] font-extrabold" style={{ color: "var(--primary-700)" }}>
                  ₹{(successLink._amount ?? successLink.amount ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
              {(successLink._note || successLink.note) && (
                <>
                  <div className="w-px h-9 bg-slate-200" />
                  <div className="text-center">
                    <p className="m-0 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Note</p>
                    <p className="m-0 mt-1 text-sm font-semibold text-slate-800 max-w-[160px] break-words">
                      {successLink._note || successLink.note}
                    </p>
                  </div>
                </>
              )}
            </div>

            {(successLink.razorpayPaymentLink || successLink.paymentLink) && (
              <div className="rounded-xl border p-4 mb-5"
                style={{ borderColor: "var(--primary-200)", background: "var(--primary-50)" }}>
                <p className="m-0 mb-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--primary-700)" }}>
                  Payment Link
                </p>
                <div className="flex items-start gap-2.5">
                  <a href={successLink.razorpayPaymentLink || successLink.paymentLink}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 font-mono text-xs break-all leading-relaxed no-underline"
                    style={{ color: "var(--primary-600)" }}>
                    {successLink.razorpayPaymentLink || successLink.paymentLink}
                  </a>
                  <CopyBtn
                    text={successLink.razorpayPaymentLink || successLink.paymentLink}
                    id="modal" copied={copied} onCopy={doCopy} />
                </div>
              </div>
            )}

            <button type="button" onClick={() => setSuccess(null)}
              className="w-full h-11 rounded-xl border-none text-white font-bold text-sm cursor-pointer font-[inherit] transition-all active:scale-[0.97]"
              style={{ background: "var(--color-primary)", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}