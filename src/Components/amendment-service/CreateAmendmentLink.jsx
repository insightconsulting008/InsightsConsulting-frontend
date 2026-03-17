import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const EMPLOYEE_ID = localStorage.getItem("employeeId");

const T = {
  primary50:  "var(--primary-50)",
  primary100: "var(--primary-100)",
  primary200: "var(--primary-200)",
  primary500: "var(--color-primary)",
  primary600: "var(--color-primary-hover)",
  primary700: "var(--color-primary-text)",
  primary800: "var(--primary-800)",
  neutral0:   "#ffffff",
  neutral50:  "#f8f8fa",
  neutral100: "#f1f1f5",
  neutral200: "#e4e4ec",
  neutral300: "#d1d1de",
  neutral400: "#a8a8c0",
  neutral500: "#7878a0",
  neutral600: "#5a5a7a",
  neutral700: "#424260",
  neutral800: "#2c2c45",
  neutral900: "#1a1a2e",
  success50:  "#ecfdf5", success100: "#d1fae5", success500: "#10b981", success600: "#059669", success700: "#047857",
  warning50:  "#fffbeb", warning100: "#fef3c7", warning500: "#f59e0b", warning700: "#b45309",
  error50:    "#fff1f2", error100:   "#ffe4e6", error500:   "#f43f5e", error700:   "#be123c",
  shadowSm: "var(--shadow-sm)", shadowMd: "var(--shadow-md)", shadowLg: "var(--shadow-lg)", shadowXl: "var(--shadow-xl)",
  rsm: "6px", rmd: "10px", rlg: "14px", rxl: "18px", rfull: "9999px",
};
const primaryRgb = "239 68 68";

const fmtDate = (d) => !d ? null : new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
const fmtTime = (d) => !d ? "" : new Date(d).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
const avatarColors = [["#dc2626","#fef2f2"],["#7c3aed","#f5f3ff"],["#059669","#ecfdf5"],["#2563eb","#eff6ff"],["#d97706","#fffbeb"],["#db2777","#fdf4ff"]];
const avatarStyle = (name) => avatarColors[(name?.charCodeAt(0) ?? 0) % avatarColors.length];
const initials = (n) => !n ? "?" : n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();

const Svg = ({ d, size=16, sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const IC = {
  link:     ["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71","M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"],
  search:   ["M11 3a8 8 0 100 16A8 8 0 0011 3z","M21 21l-4.35-4.35"],
  user:     ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 3a4 4 0 100 8 4 4 0 000-8z"],
  chevron:  "M6 9l6 6 6-6",
  check:    "M20 6L9 17l-5-5",
  copy:     ["M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866","M10 21h8c1.105 0 2-.911 2-2.036V9.107c0-1.124-.895-2.036-2-2.036H10c-1.105 0-2 .912-2 2.036v9.857C8 20.09 8.895 21 10 21z"],
  refresh:  ["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"],
  alert:    ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4M12 17h.01"],
  x:        "M18 6L6 18M6 6l12 12",
  phone:    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail:     ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  clock:    ["M12 2a10 10 0 100 20A10 10 0 0012 2z","M12 6v6l4 2"],
  external: ["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6","M15 3h6v6","M10 14L21 3"],
  prev:     "M15 18l-6-6 6-6",
  next:     "M9 18l6-6-6-6",
  users:    ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 3a4 4 0 100 8 4 4 0 000-8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
};

const Avatar = ({ name, photo, size="md" }) => {
  const [bg, fg] = avatarStyle(name);
  const dim = size==="sm" ? 32 : size==="xs" ? 24 : 40;
  const fs  = size==="sm" ? 11 : size==="xs" ? 9 : 13;
  if (photo) return (
    <img src={photo} alt={name} onError={e=>e.target.style.display="none"}
      style={{ width:dim, height:dim, borderRadius:T.rfull, objectFit:"cover", flexShrink:0, border:`2px solid ${fg}20` }}/>
  );
  return (
    <div style={{ width:dim, height:dim, borderRadius:T.rfull, background:bg, color:fg,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:fs, fontWeight:800, flexShrink:0, letterSpacing:"0.03em" }}>
      {initials(name)}
    </div>
  );
};

const STATUS = {
  PAID:    { bg:T.success50,  color:T.success700, border:T.success100, dot:T.success500, label:"Paid"    },
  CREATED: { bg:T.warning50,  color:T.warning700, border:T.warning100, dot:T.warning500, label:"Pending", pulse:true },
  FAILED:  { bg:T.error50,    color:T.error700,   border:T.error100,   dot:T.error500,   label:"Failed"  },
  EXPIRED: { bg:T.neutral50,  color:T.neutral600, border:T.neutral200, dot:T.neutral400, label:"Expired" },
};
const StatusBadge = ({ s }) => {
  const c = STATUS[s] || STATUS.EXPIRED;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:T.rfull,
      background:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontSize:11, fontWeight:700, letterSpacing:"0.04em", whiteSpace:"nowrap", fontFamily:"inherit" }}>
      <span style={{ width:6, height:6, borderRadius:T.rfull, background:c.dot, flexShrink:0,
        ...(c.pulse?{animation:"pulse 1.6s infinite"}:{})}}/>
      {c.label}
    </span>
  );
};

const CopyBtn = ({ text, id, copied, onCopy }) => {
  const done = copied===id;
  return (
    <button onClick={()=>onCopy(text,id)} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 9px",
      borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit",
      border:done?`1px solid ${T.success100}`:`1px solid ${T.neutral200}`,
      background:done?T.success50:T.neutral0, color:done?T.success700:T.neutral500,
      fontSize:11, fontWeight:600, transition:"all 150ms", flexShrink:0 }}>
      {done?<><Svg d={IC.check} size={10}/><span>Copied!</span></>:<><Svg d={IC.copy} size={10}/><span>Copy</span></>}
    </button>
  );
};

const Spinner = ({ size=16, color="#fff" }) => (
  <div className="spin" style={{ width:size, height:size, borderRadius:T.rfull, border:`2px solid ${color}30`, borderTopColor:color }}/>
);

const PaginBar = ({ page, totalPages, onPage, loading }) => {
  if (totalPages<=1) return null;
  const pages=[];
  for(let i=1;i<=totalPages;i++){
    if(i===1||i===totalPages||(i>=page-1&&i<=page+1)) pages.push(i);
    else if(i===page-2||i===page+2) pages.push("...");
  }
  const deduped=pages.filter((p,i)=>p!==pages[i-1]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"12px 0" }}>
      <button onClick={()=>onPage(page-1)} disabled={page===1||loading}
        style={{ width:32, height:32, borderRadius:T.rmd, border:`1px solid ${T.neutral200}`, background:T.neutral0,
          cursor:page===1?"not-allowed":"pointer", color:T.neutral500,
          display:"flex", alignItems:"center", justifyContent:"center", opacity:page===1?0.4:1 }}>
        <Svg d={IC.prev} size={13}/>
      </button>
      {deduped.map((p,i)=>p==="..."
        ?<span key={`e${i}`} style={{padding:"0 4px",color:T.neutral400,fontSize:12}}>…</span>
        :<button key={p} onClick={()=>onPage(p)} disabled={loading}
          style={{ width:32, height:32, borderRadius:T.rmd,
            border:`1px solid ${p===page?T.primary500:T.neutral200}`,
            background:p===page?T.primary500:T.neutral0,
            color:p===page?"#fff":T.neutral700, cursor:"pointer", fontSize:13,
            fontWeight:p===page?700:400,
            boxShadow:p===page?`0 2px 8px rgb(${primaryRgb}/.3)`:"none" }}>
          {p}
        </button>
      )}
      <button onClick={()=>onPage(page+1)} disabled={page===totalPages||loading}
        style={{ width:32, height:32, borderRadius:T.rmd, border:`1px solid ${T.neutral200}`, background:T.neutral0,
          cursor:page===totalPages?"not-allowed":"pointer", color:T.neutral500,
          display:"flex", alignItems:"center", justifyContent:"center", opacity:page===totalPages?0.4:1 }}>
        <Svg d={IC.next} size={13}/>
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   USER PICKER — redesigned as a clean modal-style
   dropdown with integrated search
═══════════════════════════════════════════════ */
const UserPicker = ({ selectedUser, onSelect }) => {
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState("");
  const [debQ, setDebQ]           = useState("");
  const [users, setUsers]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const ref    = useRef(null);
  const inputRef = useRef(null);
  const debRef = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
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
    const p = new URLSearchParams({ page, limit:8 });
    if (debQ) p.set("search", debQ);
    axios.get(`https://insightsconsult-backend.onrender.com/users?${p}`)
      .then(r => { setUsers(r.data.users||[]); setPagination(r.data.pagination||null); })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [open, debQ, page]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleOpen = () => setOpen(v => !v);
  const handleSelect = (u) => { onSelect(u); setOpen(false); setQuery(""); };

  const isSelected = (u) => selectedUser?.userId === u.userId;

  return (
    <div ref={ref} style={{ position:"relative" }}>
      {/* Trigger button */}
      <button type="button" onClick={handleOpen} style={{
        width:"100%", height:48, padding:"0 14px", borderRadius:T.rlg, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
        border:`2px solid ${open?"var(--color-primary)":T.neutral200}`,
        background:open?T.neutral0:T.neutral50,
        boxShadow:open?`0 0 0 3px rgb(${primaryRgb}/.1)`:"none",
        transition:"all 150ms", fontFamily:"inherit" }}>
        {!selectedUser ? (
          <span style={{ display:"flex", alignItems:"center", gap:10, color:T.neutral400 }}>
            <div style={{ width:32, height:32, borderRadius:T.rfull, background:T.neutral100,
              display:"flex", alignItems:"center", justifyContent:"center", color:T.neutral300 }}>
              <Svg d={IC.user} size={14}/>
            </div>
            <span style={{ fontSize:14, color:T.neutral400 }}>Choose a user…</span>
          </span>
        ) : selectedUser==="other" ? (
          <span style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:T.rfull, background:T.neutral100,
              border:`2px dashed ${T.neutral300}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.neutral400 }}>
              <Svg d={IC.user} size={14}/>
            </div>
            <div style={{ textAlign:"left" }}>
              <p style={{ margin:0, fontSize:14, fontWeight:700, color:T.neutral900 }}>Other / External</p>
              <p style={{ margin:0, fontSize:11, color:T.neutral400 }}>Unlisted user</p>
            </div>
          </span>
        ) : (
          <span style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Avatar name={selectedUser.name} photo={selectedUser.photoUrl}/>
            <div style={{ textAlign:"left", minWidth:0 }}>
              <p style={{ margin:0, fontSize:14, fontWeight:700, color:T.neutral900,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>
                {selectedUser.name}
              </p>
              <p style={{ margin:0, fontSize:11, color:T.neutral500,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>
                {selectedUser.email || selectedUser.phoneNumber || ""}
              </p>
            </div>
          </span>
        )}
        <div style={{ transform:open?"rotate(180deg)":"none", transition:"transform 200ms",
          color:open?"var(--color-primary)":T.neutral400, display:"flex", flexShrink:0 }}>
          <Svg d={IC.chevron} size={16}/>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="fadein" style={{
          position:"absolute", zIndex:1000, width:"100%", top:"calc(100% + 6px)",
          background:T.neutral0, borderRadius:T.rxl,
          border:`1.5px solid ${T.neutral200}`,
          boxShadow:`0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)`,
          overflow:"hidden" }}>

          {/* Search input — clean, prominent */}
          <div style={{ padding:"12px 12px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, height:42,
              padding:"0 12px", borderRadius:T.rlg,
              border:`1.5px solid ${T.neutral200}`, background:T.neutral50,
              transition:"all 150ms" }}
              onFocus={e=>{ e.currentTarget.style.borderColor="var(--color-primary)"; e.currentTarget.style.background=T.neutral0; e.currentTarget.style.boxShadow=`0 0 0 3px rgb(${primaryRgb}/.1)`; }}
              onBlur={e=>{ e.currentTarget.style.borderColor=T.neutral200; e.currentTarget.style.background=T.neutral50; e.currentTarget.style.boxShadow="none"; }}>
              <span style={{ color:T.neutral400, display:"flex", flexShrink:0 }}>
                {loading ? <Spinner size={14} color={T.primary500}/> : <Svg d={IC.search} size={14}/>}
              </span>
              <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Search by name, email or phone…"
                style={{ flex:1, border:"none", outline:"none", background:"transparent",
                  fontSize:13, color:T.neutral900, fontFamily:"inherit" }}/>
              {query && (
                <button type="button" onClick={()=>{ setQuery(""); inputRef.current?.focus(); }}
                  style={{ border:"none", background:"none", cursor:"pointer", padding:0,
                    color:T.neutral400, display:"flex", borderRadius:T.rsm }}>
                  <Svg d={IC.x} size={13}/>
                </button>
              )}
            </div>
          </div>

          {/* Result count hint */}
          {pagination && (
            <p style={{ margin:"8px 14px 0", fontSize:11, color:T.neutral400, fontWeight:500 }}>
              {loading ? "Searching…" : `${pagination.total} user${pagination.total!==1?"s":""} found`}
              {pagination.totalPages>1 && ` · page ${pagination.page}/${pagination.totalPages}`}
            </p>
          )}

          {/* User list */}
          <div style={{ overflowY:"auto", maxHeight:320, padding:"8px 0 4px" }}>
            {loading && users.length===0 ? (
              <div style={{ display:"flex", justifyContent:"center", padding:"24px 0" }}>
                <Spinner size={22} color={T.primary500}/>
              </div>
            ) : users.length===0 ? (
              <div style={{ textAlign:"center", padding:"28px 20px" }}>
                <div style={{ width:40, height:40, borderRadius:T.rfull, background:T.neutral100,
                  display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", color:T.neutral300 }}>
                  <Svg d={IC.users} size={18}/>
                </div>
                <p style={{ margin:0, fontSize:13, color:T.neutral500, fontWeight:500 }}>No users found</p>
                {query && <p style={{ margin:"4px 0 0", fontSize:11, color:T.neutral400 }}>Try a different search term</p>}
              </div>
            ) : users.map(u => {
              const active = isSelected(u);
              return (
                <button key={u.userId} type="button" onClick={()=>handleSelect(u)}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:12,
                    padding:"10px 14px", border:"none",
                    background:active?`rgb(${primaryRgb}/.06)`:"transparent",
                    cursor:"pointer", textAlign:"left", transition:"background 100ms",
                    borderLeft:active?`3px solid var(--color-primary)`:`3px solid transparent` }}>
                  <Avatar name={u.name} photo={u.photoUrl}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <p style={{ margin:0, fontSize:14, fontWeight:600, color:T.neutral900,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {u.name}
                      </p>
                      <span style={{ fontSize:9, color:T.neutral300, fontFamily:"monospace",
                        background:T.neutral100, padding:"1px 5px", borderRadius:4, flexShrink:0 }}>
                        #{u.userId?.slice(-5)}
                      </span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"3px 12px" }}>
                      {u.email && (
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.neutral500 }}>
                          <Svg d={IC.mail} size={10}/>{u.email}
                        </span>
                      )}
                      {u.phoneNumber && (
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.neutral500 }}>
                          <Svg d={IC.phone} size={10}/>{u.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  {active && (
                    <div style={{ width:22, height:22, borderRadius:T.rfull,
                      background:"var(--color-primary)", display:"flex", alignItems:"center",
                      justifyContent:"center", flexShrink:0 }}>
                      <Svg d={IC.check} size={11} sw={2.5}/>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Other/External option */}
          <div style={{ borderTop:`1px solid ${T.neutral100}`, margin:"0 0 0" }}>
            <button type="button" onClick={()=>{ onSelect("other"); setOpen(false); setQuery(""); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12,
                padding:"10px 14px", border:"none",
                background:selectedUser==="other"?T.neutral50:"transparent",
                borderLeft:selectedUser==="other"?`3px solid ${T.neutral400}`:`3px solid transparent`,
                cursor:"pointer", textAlign:"left" }}>
              <div style={{ width:40, height:40, borderRadius:T.rfull, background:T.neutral100,
                border:`2px dashed ${T.neutral300}`, display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0, color:T.neutral400 }}>
                <Svg d={IC.user} size={16}/>
              </div>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:600, color:T.neutral700 }}>Other / External</p>
                <p style={{ margin:"2px 0 0", fontSize:12, color:T.neutral400 }}>User not in the system</p>
              </div>
              {selectedUser==="other" && (
                <div style={{ marginLeft:"auto", width:22, height:22, borderRadius:T.rfull,
                  background:T.neutral600, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Svg d={IC.check} size={11} sw={2.5}/>
                </div>
              )}
            </button>
          </div>

          {/* Pagination footer */}
          {pagination && pagination.totalPages>1 && (
            <div style={{ borderTop:`1px solid ${T.neutral100}`, padding:"8px 12px",
              background:T.neutral50, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:T.neutral400 }}>
                Showing {users.length} of {pagination.total}
              </span>
              <div style={{ display:"flex", gap:4 }}>
                {[...Array(pagination.totalPages)].map((_,i)=>{
                  const p = i+1;
                  return (
                    <button key={p} type="button" onClick={()=>setPage(p)} disabled={loading}
                      style={{ width:26, height:26, borderRadius:T.rsm, border:"none",
                        background:p===page?`var(--color-primary)`:T.neutral200,
                        color:p===page?"#fff":T.neutral600,
                        cursor:"pointer", fontSize:11, fontWeight:p===page?700:400 }}>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function CreateAmendmentLink() {
  const [selectedUser, setSelected] = useState(null);
  const [form, setForm]             = useState({ note:"", amount:"" });
  const [loading, setLoading]       = useState(false);
  const [successLink, setSuccess]   = useState(null);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(null);
  const [mobile, setMobile]         = useState(window.innerWidth < 640);

  const [payments, setPayments]         = useState([]);
  const [payPagination, setPayPagination] = useState(null);
  const [payPage, setPayPage]           = useState(1);
  const [tableSearch, setTSearch]       = useState("");
  const [tableDebouncedQ, setTableDebouncedQ] = useState("");
  const [tLoading, setTLoading]         = useState(false);
  const tableDebounceRef = useRef(null);

  useEffect(() => {
    const onRS = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", onRS);
    return () => window.removeEventListener("resize", onRS);
  }, []);

  useEffect(() => {
    clearTimeout(tableDebounceRef.current);
    tableDebounceRef.current = setTimeout(() => { setTableDebouncedQ(tableSearch); setPayPage(1); }, 350);
  }, [tableSearch]);

  const fetchPayments = useCallback(() => {
    if (!EMPLOYEE_ID) return;
    setTLoading(true);
    const params = new URLSearchParams({ page: payPage, limit: 10 });
    if (tableDebouncedQ) params.set("search", tableDebouncedQ);
    axios.get(`https://insightsconsult-backend.onrender.com/payments/${EMPLOYEE_ID}?${params}`)
      .then(r => { setPayments(r.data.data||[]); setPayPagination(r.data.pagination||null); })
      .catch(() => setPayments([]))
      .finally(() => setTLoading(false));
  }, [payPage, tableDebouncedQ]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleSubmit = async () => {
    if (!selectedUser)                            { setError("Please select a user."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Amount must be greater than 0."); return; }
    setLoading(true); setError("");
    try {
      const r = await axios.post("https://insightsconsult-backend.onrender.com/create/amendment-link", {
        employeeId: EMPLOYEE_ID,
        userId: selectedUser==="other" ? null : selectedUser?.userId,
        note: form.note, amount: Number(form.amount),
      });
      setSuccess(r.data);
      setForm({ note:"", amount:"" });
      setSelected(null);
      setPayPage(1);
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const doCopy = (text, id) =>
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(()=>setCopied(null),2000); });

  const stats = [
    { label:"Total Links", val:payPagination?.total??"—", color:T.primary700, bg:T.primary50,  border:T.primary200 },
    { label:"Paid",        val:payments.filter(p=>p.status==="PAID").length,    color:T.success700, bg:T.success50,  border:T.success100 },
    { label:"Pending",     val:payments.filter(p=>p.status==="CREATED").length, color:T.warning700, bg:T.warning50,  border:T.warning100 },
    { label:"Failed",      val:payments.filter(p=>p.status==="FAILED").length,  color:T.error700,   bg:T.error50,    border:T.error100   },
  ];

  const card = { background:T.neutral0, borderRadius:T.rlg, border:`1px solid ${T.neutral200}`, overflow:"hidden", boxShadow:T.shadowSm };
  const inp  = { width:"100%", height:44, padding:"0 14px", borderRadius:T.rlg,
    border:`2px solid ${T.neutral200}`, background:T.neutral50, fontSize:14,
    color:T.neutral900, outline:"none", boxSizing:"border-box",
    transition:"border-color 150ms, box-shadow 150ms, background 150ms", fontFamily:"inherit" };
  const lbl  = { display:"block", fontSize:10, fontWeight:700, color:T.neutral500,
    letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase" };
  const th   = { padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:700,
    color:T.primary700, textTransform:"uppercase", letterSpacing:"0.07em",
    background:T.primary50, borderBottom:`1px solid ${T.primary100}`, whiteSpace:"nowrap" };
  const td   = { padding:"12px 14px", borderBottom:`1px solid ${T.neutral100}`, verticalAlign:"middle" };

  return (
    <div style={{ minHeight:"100vh", background:T.neutral100, fontFamily:"'DM Sans',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box}
        input:focus{border-color:var(--color-primary)!important;box-shadow:0 0 0 3px rgb(${primaryRgb}/.12)!important;background:#fff!important}
        .tr:hover td{background:var(--primary-50)!important}
        button:active{transform:scale(0.97)}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideup{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .spin{animation:spin .7s linear infinite}
        .fadein{animation:fadein .18s ease}
        .slideup{animation:slideup .28s cubic-bezier(0.34,1.56,0.64,1)}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${T.neutral200};border-radius:4px}
        @media(min-width:900px){.main-grid{display:grid!important;grid-template-columns:340px 1fr;gap:20px;align-items:start}}
      `}</style>

      {/* HEADER */}
      <div style={{ background:T.neutral0, borderBottom:`1px solid ${T.neutral200}`, padding:"14px 20px", boxShadow:T.shadowSm }}>
        <div style={{ maxWidth:1320, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:T.rlg, background:"var(--color-primary)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 14px rgb(${primaryRgb}/.35)`, color:"#fff" }}>
              <Svg d={IC.link} size={18}/>
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:mobile?17:20, fontWeight:800, color:T.neutral900, letterSpacing:"-0.025em" }}>Amendment Links</h1>
              <p style={{ margin:0, fontSize:12, color:T.neutral400 }}>Generate Razorpay payment links for amendments</p>
            </div>
          </div>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:T.rfull,
            background:T.primary50, color:T.primary700, fontSize:10, fontWeight:700, letterSpacing:"0.08em", border:`1px solid ${T.primary200}` }}>
            <span style={{ width:6, height:6, borderRadius:T.rfull, background:T.primary500, animation:"pulse 2s infinite" }}/>
            INTERNAL TOOL
          </span>
        </div>
      </div>

      <div style={{ maxWidth:1320, margin:"0 auto", padding:mobile?"14px":"20px" }}>

        {/* STATS */}
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${mobile?2:4},1fr)`, gap:12, marginBottom:20 }}>
          {stats.map(s=>(
            <div key={s.label} className="fadein" style={{ background:s.bg, borderRadius:T.rlg,
              padding:mobile?"12px 14px":"16px 20px", border:`1px solid ${s.border}`, boxShadow:T.shadowSm }}>
              <p style={{ margin:0, fontSize:10, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</p>
              <p style={{ margin:"6px 0 0", fontSize:mobile?26:32, fontWeight:800, color:s.color, letterSpacing:"-0.03em", lineHeight:1 }}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="main-grid" style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* FORM CARD */}
          <div style={card}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.primary100}`,
              background:T.primary50, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <p style={{ margin:0, fontSize:15, fontWeight:700, color:T.primary800 }}>Create Payment Link</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:T.primary600 }}>Fill in details to generate</p>
              </div>
              <div style={{ width:34, height:34, borderRadius:T.rmd, background:T.primary100,
                display:"flex", alignItems:"center", justifyContent:"center", color:T.primary700 }}>
                <Svg d={IC.link} size={16}/>
              </div>
            </div>

            <div style={{ padding:20 }}>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Select User</label>
                <UserPicker selectedUser={selectedUser} onSelect={setSelected}/>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Note <span style={{ opacity:0.45, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                <input style={inp} placeholder="Brief note for this amendment…"
                  value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={lbl}>Amount</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
                    fontWeight:800, color:T.primary600, fontSize:17, pointerEvents:"none" }}>₹</span>
                  <input type="text" inputMode="numeric" style={{ ...inp, paddingLeft:30 }}
                    placeholder="0" value={form.amount}
                    onChange={e=>{ if(/^\d*$/.test(e.target.value)) setForm({...form,amount:e.target.value}); }}/>
                </div>
                <p style={{ margin:"5px 0 0", fontSize:11, color:T.neutral400 }}>Whole numbers only — no decimals</p>
              </div>

              {error && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:T.rmd,
                  background:T.error50, border:`1px solid ${T.error100}`, color:T.error700, fontSize:13, marginBottom:16 }}>
                  <Svg d={IC.alert} size={14}/>{error}
                </div>
              )}

              <button type="button" onClick={handleSubmit} disabled={loading} style={{
                width:"100%", height:46, borderRadius:T.rlg, border:"none",
                background:"var(--color-primary)", color:"#fff", fontWeight:700, fontSize:14,
                cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", gap:8, opacity:loading?0.75:1,
                boxShadow:`0 4px 16px rgb(${primaryRgb}/.3)`, fontFamily:"inherit",
                transition:"all 150ms" }}>
                {loading?<><Spinner size={16}/>Generating…</>:<><Svg d={IC.link} size={15}/>Generate Payment Link</>}
              </button>
            </div>
          </div>

          {/* TABLE CARD */}
          <div style={card}>
            <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.neutral200}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:T.neutral900 }}>Recent Payments</p>
                <p style={{ margin:"2px 0 0", fontSize:12, color:T.neutral400 }}>
                  {payPagination ? `${payPagination.total} total · page ${payPagination.page} of ${payPagination.totalPages}` : "Loading…"}
                </p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, height:36, padding:"0 12px", borderRadius:T.rmd,
                  border:tableSearch?`1.5px solid ${T.primary500}`:`1.5px solid ${T.neutral200}`,
                  background:tableSearch?T.primary50:T.neutral50, transition:"all 150ms",
                  boxShadow:tableSearch?`0 0 0 3px rgb(${primaryRgb}/.08)`:"" }}>
                  <span style={{ color:tableSearch?T.primary500:T.neutral400 }}>
                    {tLoading?<Spinner size={13} color={T.primary500}/>:<Svg d={IC.search} size={13}/>}
                  </span>
                  <input type="text" value={tableSearch} onChange={e=>setTSearch(e.target.value)}
                    placeholder="Search payments…"
                    style={{ border:"none", outline:"none", background:"transparent", fontSize:12,
                      color:T.neutral900, fontFamily:"inherit", width:mobile?100:160 }}/>
                  {tableSearch && (
                    <button type="button" onClick={()=>setTSearch("")}
                      style={{ border:"none", background:"none", cursor:"pointer", color:T.neutral400, display:"flex", padding:0 }}>
                      <Svg d={IC.x} size={12}/>
                    </button>
                  )}
                </div>
                <button onClick={()=>{ setPayPage(1); fetchPayments(); }} disabled={tLoading} style={{
                  display:"inline-flex", alignItems:"center", gap:5, height:36, padding:"0 12px",
                  borderRadius:T.rmd, border:`1.5px solid ${T.neutral200}`, background:T.neutral0,
                  color:T.neutral600, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                  opacity:tLoading?0.6:1 }}>
                  <div className={tLoading?"spin":""} style={{ display:"flex" }}><Svg d={IC.refresh} size={13}/></div>
                  {!mobile&&"Refresh"}
                </button>
              </div>
            </div>

            {/* Desktop table */}
            {!mobile && (
              <div style={{ overflowX:"auto" }}>
                {tLoading&&payments.length===0 ? (
                  <div style={{ padding:16 }}>
                    {[1,2,3].map(i=><div key={i} style={{ height:54, borderRadius:T.rmd, background:T.neutral100, marginBottom:8, animation:"pulse 1.4s infinite" }}/>)}
                  </div>
                ) : payments.length===0 ? (
                  <div style={{ textAlign:"center", padding:"52px 20px" }}>
                    <div style={{ width:48, height:48, borderRadius:T.rfull, border:`2px dashed ${T.neutral200}`,
                      display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", color:T.neutral300 }}>
                      <Svg d={IC.search} size={20}/>
                    </div>
                    <p style={{ fontSize:14, color:T.neutral500, fontWeight:500, margin:0 }}>
                      {tableSearch?`No results for "${tableSearch}"`:"No payments found"}
                    </p>
                    {tableSearch&&(
                      <button type="button" onClick={()=>setTSearch("")}
                        style={{ marginTop:8, background:"none", border:"none", color:T.primary600, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, opacity:tLoading?0.6:1, transition:"opacity 200ms" }}>
                    <thead>
                      <tr>{["User","Created By","Amount","Type","Status","Order ID","Payment Link","Paid At","Created"].map(h=>(
                        <th key={h} style={th}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {payments.map(p=>{
                        const link=p.razorpayPaymentLinkId, id=p.paymentId;
                        return (
                          <tr key={id} className="tr fadein">
                            <td style={td}>
                              {p.user?.name?(
                                <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:160 }}>
                                  <Avatar name={p.user.name}/>
                                  <div>
                                    <p style={{ margin:0, fontWeight:600, color:T.neutral900 }}>{p.user.name}</p>
                                    {p.user.email&&<p style={{ margin:"2px 0 0", fontSize:11, color:T.neutral400 }}>{p.user.email}</p>}
                                    {p.user.phoneNumber&&<span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}><Svg d={IC.phone} size={9}/>{p.user.phoneNumber}</span>}
                                  </div>
                                </div>
                              ):<span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}>
                              {p.createdBy?.name?(
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <Avatar name={p.createdBy.name} size="sm"/>
                                  <span style={{ fontWeight:500, color:T.neutral700 }}>{p.createdBy.name}</span>
                                </div>
                              ):<span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}><span style={{ fontWeight:800, color:T.primary700, fontSize:15, fontVariantNumeric:"tabular-nums" }}>₹{(p.amount||0).toLocaleString("en-IN")}</span></td>
                            <td style={td}><span style={{ padding:"3px 8px", borderRadius:T.rsm, background:T.primary50, color:T.primary700, fontSize:10, fontWeight:700, border:`1px solid ${T.primary200}` }}>{p.type}</span></td>
                            <td style={td}><StatusBadge s={p.status}/></td>
                            <td style={td}>
                              {p.razorpayOrderId?(
                                <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:145 }}>
                                  <span style={{ fontFamily:"monospace", fontSize:11, color:T.neutral500, overflow:"hidden", textOverflow:"ellipsis", maxWidth:100, whiteSpace:"nowrap" }}>{p.razorpayOrderId}</span>
                                  <CopyBtn text={p.razorpayOrderId} id={`ord-${id}`} copied={copied} onCopy={doCopy}/>
                                </div>
                              ):<span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}>
                              {link?(
                                <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:155 }}>
                                  <a href={link} target="_blank" rel="noopener noreferrer"
                                    style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"monospace", fontSize:11, color:T.primary600, textDecoration:"none", maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                    <Svg d={IC.external} size={10}/>{link}
                                  </a>
                                  <CopyBtn text={link} id={id} copied={copied} onCopy={doCopy}/>
                                </div>
                              ):<span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}>
                              {p.paidAt?(
                                <div><p style={{ margin:0, fontSize:12, color:T.neutral800, fontWeight:500 }}>{fmtDate(p.paidAt)}</p>
                                  <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}><Svg d={IC.clock} size={9}/>{fmtTime(p.paidAt)}</span>
                                </div>
                              ):<span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}>
                              <p style={{ margin:0, fontSize:12, color:T.neutral800, fontWeight:500 }}>{fmtDate(p.createdAt)}</p>
                              <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}><Svg d={IC.clock} size={9}/>{fmtTime(p.createdAt)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Mobile cards */}
            {mobile && (
              <div style={{ padding:12, opacity:tLoading?0.6:1, transition:"opacity 200ms" }}>
                {tLoading&&payments.length===0?[1,2,3].map(i=><div key={i} style={{ height:100, borderRadius:T.rmd, background:T.neutral100, marginBottom:8, animation:"pulse 1.4s infinite" }}/>)
                :payments.length===0?(
                  <div style={{ textAlign:"center", padding:"40px 20px" }}>
                    <p style={{ color:T.neutral500, fontSize:14, fontWeight:500 }}>{tableSearch?`No results for "${tableSearch}"`:"No payments found"}</p>
                  </div>
                ):payments.map(p=>{
                  const link=p.razorpayPaymentLinkId, id=p.paymentId;
                  return (
                    <div key={id} className="fadein" style={{ borderRadius:T.rlg, border:`1.5px solid ${T.neutral200}`, background:T.neutral0, padding:13, marginBottom:10, boxShadow:T.shadowSm }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          {p.user?.name&&<Avatar name={p.user.name}/>}
                          <div>
                            <p style={{ margin:0, fontWeight:700, color:T.neutral900, fontSize:14 }}>{p.user?.name||"—"}</p>
                            {p.user?.email&&<p style={{ margin:"2px 0 0", fontSize:11, color:T.neutral400 }}>{p.user.email}</p>}
                            {p.user?.phoneNumber&&<span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}><Svg d={IC.phone} size={9}/>{p.user.phoneNumber}</span>}
                          </div>
                        </div>
                        <StatusBadge s={p.status}/>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:T.rmd, background:T.neutral50, border:`1px solid ${T.neutral100}`, marginBottom:8 }}>
                        <span style={{ fontSize:19, fontWeight:800, color:T.primary700 }}>₹{(p.amount||0).toLocaleString("en-IN")}</span>
                        <span style={{ padding:"2px 8px", borderRadius:T.rsm, background:T.primary50, color:T.primary700, fontSize:10, fontWeight:700, border:`1px solid ${T.primary200}` }}>{p.type}</span>
                        {p.createdBy?.name&&<span style={{ display:"flex", alignItems:"center", gap:5, marginLeft:"auto", fontSize:11, color:T.neutral500 }}><Avatar name={p.createdBy.name} size="xs"/>{p.createdBy.name}</span>}
                      </div>
                      {p.razorpayOrderId&&(
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 10px", borderRadius:T.rmd, background:T.neutral50, border:`1px solid ${T.neutral100}`, marginBottom:6 }}>
                          <div style={{ minWidth:0 }}>
                            <span style={{ fontSize:9, fontWeight:700, color:T.neutral400, letterSpacing:"0.08em", textTransform:"uppercase" }}>Order ID</span>
                            <p style={{ margin:"1px 0 0", fontFamily:"monospace", fontSize:11, color:T.neutral600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>{p.razorpayOrderId}</p>
                          </div>
                          <CopyBtn text={p.razorpayOrderId} id={`ord-${id}`} copied={copied} onCopy={doCopy}/>
                        </div>
                      )}
                      {link&&(
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 10px", borderRadius:T.rmd, background:T.primary50, border:`1px solid ${T.primary200}`, marginBottom:6 }}>
                          <div style={{ minWidth:0, flex:1 }}>
                            <span style={{ fontSize:9, fontWeight:700, color:T.primary700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Payment Link</span>
                            <p style={{ margin:"1px 0 0", fontFamily:"monospace", fontSize:11, color:T.primary700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>{link}</p>
                          </div>
                          <CopyBtn text={link} id={id} copied={copied} onCopy={doCopy}/>
                        </div>
                      )}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.neutral400 }}><Svg d={IC.clock} size={10}/>Created {fmtDate(p.createdAt)} · {fmtTime(p.createdAt)}</span>
                        {p.paidAt&&<span style={{ fontSize:11, color:T.success700, fontWeight:700 }}>✓ Paid {fmtDate(p.paidAt)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {payPagination&&(
              <div style={{ borderTop:`1px solid ${T.neutral100}`, padding:"0 14px 4px" }}>
                <PaginBar page={payPagination.page} totalPages={payPagination.totalPages} onPage={setPayPage} loading={tLoading}/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {successLink&&(
        <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center",
          justifyContent:"center", padding:20, background:"rgba(26,26,46,0.6)", backdropFilter:"blur(5px)" }}
          onClick={()=>setSuccess(null)}>
          <div className="slideup" onClick={e=>e.stopPropagation()}
            style={{ background:T.neutral0, borderRadius:T.rxl, border:`1px solid ${T.neutral200}`,
              boxShadow:T.shadowXl, width:"100%", maxWidth:420, padding:"30px 26px" }}>
            <div style={{ width:64, height:64, borderRadius:T.rfull, background:"var(--color-primary)",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#fff",
              boxShadow:`0 8px 24px rgb(${primaryRgb}/.35)` }}>
              <Svg d={IC.check} size={28} sw={2.5}/>
            </div>
            <h3 style={{ textAlign:"center", margin:"0 0 4px", fontSize:22, fontWeight:800, color:T.neutral900, letterSpacing:"-0.02em" }}>
              Link Generated! 🎉
            </h3>
            <p style={{ textAlign:"center", margin:"0 0 22px", color:T.neutral400, fontSize:13 }}>
              Your amendment payment link is ready to share.
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20,
              padding:"14px 0", marginBottom:20, borderTop:`1px solid ${T.neutral100}`, borderBottom:`1px solid ${T.neutral100}` }}>
              <div style={{ textAlign:"center" }}>
                <p style={{ margin:0, fontSize:10, color:T.neutral400, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Amount</p>
                <p style={{ margin:"4px 0 0", fontSize:26, fontWeight:800, color:T.primary700 }}>₹{Number(successLink.amount||0).toLocaleString("en-IN")}</p>
              </div>
              {successLink.note&&(
                <><div style={{ width:1, height:36, background:T.neutral200 }}/>
                <div style={{ textAlign:"center" }}>
                  <p style={{ margin:0, fontSize:10, color:T.neutral400, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Note</p>
                  <p style={{ margin:"4px 0 0", fontSize:14, fontWeight:600, color:T.neutral800 }}>{successLink.note}</p>
                </div></>
              )}
            </div>
            {(successLink.razorpayPaymentLinkId||successLink.paymentLink)&&(
              <div style={{ borderRadius:T.rmd, border:`1.5px solid ${T.primary200}`, background:T.primary50, padding:"12px 14px", marginBottom:20 }}>
                <p style={{ margin:"0 0 6px", fontSize:9, fontWeight:700, color:T.primary700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Payment Link</p>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <p style={{ flex:1, margin:0, fontFamily:"monospace", fontSize:12, color:T.neutral700, wordBreak:"break-all", lineHeight:1.6 }}>
                    {successLink.razorpayPaymentLinkId||successLink.paymentLink}
                  </p>
                  <CopyBtn text={successLink.razorpayPaymentLinkId||successLink.paymentLink} id="modal" copied={copied} onCopy={doCopy}/>
                </div>
              </div>
            )}
            <button type="button" onClick={()=>setSuccess(null)} style={{
              width:"100%", height:46, borderRadius:T.rlg, border:"none",
              background:"var(--color-primary)", color:"#fff", fontWeight:700, fontSize:14,
              cursor:"pointer", boxShadow:`0 4px 14px rgb(${primaryRgb}/.3)`, fontFamily:"inherit" }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}