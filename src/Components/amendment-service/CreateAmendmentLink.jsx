import { useState, useEffect, useRef } from "react";
import axios from "axios";

const EMPLOYEE_ID = "RAMESH_001"; // adjust as needed

/* ─────────────────────────────────────────────────────────────────────────
   Design tokens — mirrors app.css exactly
───────────────────────────────────────────────────────────────────────── */
const T = {
  primary50:  "var(--primary-50)",
  primary100: "var(--primary-100)",
  primary200: "var(--primary-200)",
  primary300: "var(--primary-300)",
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

  success50:  "#ecfdf5",
  success100: "#d1fae5",
  success500: "#10b981",
  success600: "#059669",
  success700: "#047857",
  warning50:  "#fffbeb",
  warning100: "#fef3c7",
  warning500: "#f59e0b",
  warning700: "#b45309",
  error50:    "#fff1f2",
  error100:   "#ffe4e6",
  error500:   "#f43f5e",
  error700:   "#be123c",
  info50:     "#eff6ff",
  info100:    "#dbeafe",
  info500:    "#3b82f6",
  info700:    "#1d4ed8",

  shadowSm: "var(--shadow-sm)",
  shadowMd: "var(--shadow-md)",
  shadowLg: "var(--shadow-lg)",
  shadowXl: "var(--shadow-xl)",

  rsm:  "6px",
  rmd:  "10px",
  rlg:  "14px",
  rxl:  "18px",
  r2xl: "24px",
  rfull:"9999px",
};

const primaryRgb = "239 68 68";

/* ── Helpers ──────────────────────────────────────────────────────────── */
const fmtDate = (d) => !d ? null : new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
const fmtTime = (d) => !d ? ""   : new Date(d).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });

const AVATAR_COLORS = [
  [T.primary600, T.primary50],
  [T.neutral700,  T.neutral100],
  [T.success600,  T.success50],
  [T.info700,     T.info50],
  [T.warning700,  T.warning50],
  [T.error700,    T.error50],
];
const avatarStyle = (name) => AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
const initials    = (n) => !n ? "?" : n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();

/* ── Tiny SVG icon factory ────────────────────────────────────────────── */
const Svg = ({ d, size=16, sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
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
  hash:     ["M4 9h16","M4 15h16","M10 3L8 21","M16 3l-2 18"],
};

/* ── Sub-components ───────────────────────────────────────────────────── */
const Avatar = ({ name, size="md" }) => {
  const [bg, fg] = avatarStyle(name);
  const dim = size==="sm" ? 28 : 36;
  return (
    <div style={{ width:dim, height:dim, borderRadius:T.rfull, background:bg, color:fg,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: size==="sm"?9:12, fontWeight:700, flexShrink:0,
      letterSpacing:"0.05em", border:`2px solid ${fg}` }}>
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
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:T.rfull,
      background:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontSize:11, fontWeight:700, letterSpacing:"0.04em", whiteSpace:"nowrap", fontFamily:"inherit" }}>
      <span style={{ width:6, height:6, borderRadius:T.rfull, background:c.dot, flexShrink:0,
        ...(c.pulse ? { animation:"pulse 1.6s infinite" } : {}) }}/>
      {c.label}
    </span>
  );
};

const CopyBtn = ({ text, id, copied, onCopy }) => {
  const done = copied === id;
  return (
    <button onClick={()=>onCopy(text,id)} style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"3px 9px", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit",
      border: done ? `1px solid ${T.success100}` : `1px solid ${T.neutral200}`,
      background: done ? T.success50 : T.neutral0,
      color: done ? T.success700 : T.neutral500,
      fontSize:11, fontWeight:600, transition:"all 150ms", flexShrink:0 }}>
      {done
        ? <><Svg d={IC.check} size={10}/><span>Copied!</span></>
        : <><Svg d={IC.copy}  size={10}/><span>Copy</span></>}
    </button>
  );
};

const Spinner = ({ size=16 }) => (
  <div className="spin" style={{ width:size, height:size, borderRadius:T.rfull,
    border:`2px solid rgba(255,255,255,0.3)`, borderTopColor:"#fff" }}/>
);

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function CreateAmendmentLink() {
  const [payments, setPayments]     = useState([]);
  const [users, setUsers]           = useState([]);
  const [selectedUser, setSelected] = useState(null);
  const [search, setSearch]         = useState("");
  const [openDrop, setOpenDrop]     = useState(false);
  const [form, setForm]             = useState({ note:"", amount:"" });
  const [loading, setLoading]       = useState(false);
  const [successLink, setSuccess]   = useState(null);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(null);
  const [tableSearch, setTSearch]   = useState("");
  const [tLoading, setTLoading]     = useState(false);
  const [mobile, setMobile]         = useState(window.innerWidth < 640);
  const dropRef = useRef(null);

  /* ── API: fetch payments ── */
  const fetchPayments = async () => {
    setTLoading(true);
    try {
      const r = await axios.get(
        `https://insightsconsult-backend.onrender.com/payments/${EMPLOYEE_ID}?page=1&limit=50`
      );
      setPayments(r.data.data || r.data || []);
    } catch {
      // silently fail — table will stay empty
    } finally {
      setTLoading(false);
    }
  };

  /* ── API: fetch users ── */
  useEffect(() => {
    axios
      .get("https://insightsconsult-backend.onrender.com/users")
      .then(r => {
        const d = r.data;
        const arr = Array.isArray(d) ? d : (d?.data ?? d?.users ?? d?.results ?? []);
        setUsers(arr);
      })
      .catch(() => {});

    fetchPayments();
  }, []);

  /* ── Click-outside / resize ── */
  useEffect(() => {
    const onMD = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpenDrop(false); };
    const onRS = () => setMobile(window.innerWidth < 640);
    document.addEventListener("mousedown", onMD);
    window.addEventListener("resize", onRS);
    return () => { document.removeEventListener("mousedown", onMD); window.removeEventListener("resize", onRS); };
  }, []);

  /* ── Filtered lists ── */
  const filteredUsers = users.filter(u =>
    `${u.name} ${u.email} ${u.phoneNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPay = payments.filter(p => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      (p.user?.name || "").toLowerCase().includes(q) ||
      (p.user?.email || "").toLowerCase().includes(q) ||
      (p.user?.phoneNumber || "").toLowerCase().includes(q) ||
      (p.status || "").toLowerCase().includes(q) ||
      (p.type || "").toLowerCase().includes(q) ||
      (p.paymentLink || "").toLowerCase().includes(q) ||
      (p.razorpayOrderId || "").toLowerCase().includes(q) ||
      (p.paymentId || "").toLowerCase().includes(q) ||
      String(p.amount || "").includes(q)
    );
  });

  const stats = [
    { label:"Total Links",  val:payments.length,                                 color:T.primary700, bg:T.primary50,  border:T.primary200,  sub:"all time"     },
    { label:"Paid",         val:payments.filter(p=>p.status==="PAID").length,    color:T.success700, bg:T.success50,  border:T.success100,  sub:"completed"    },
    { label:"Pending",      val:payments.filter(p=>p.status==="CREATED").length, color:T.warning700, bg:T.warning50,  border:T.warning100,  sub:"awaiting"     },
    { label:"Failed",       val:payments.filter(p=>p.status==="FAILED").length,  color:T.error700,   bg:T.error50,    border:T.error100,    sub:"unsuccessful" },
  ];

  /* ── API: create amendment link ── */
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!selectedUser)                            { setError("Please select a user."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Amount must be greater than 0."); return; }
    setLoading(true); setError("");
    try {
      const r = await axios.post(
        "https://insightsconsult-backend.onrender.com/create/amendment-link",
        {
          employeeId: EMPLOYEE_ID,
          userId: selectedUser === "other" ? null : selectedUser?.userId,
          note: form.note,
          amount: Number(form.amount),
        }
      );
      setSuccess(r.data);
      setForm({ note:"", amount:"" });
      setSelected(null);
      // Refresh payment list to include the newly created link
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const doCopy = (text, id) =>
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });

  const doRefresh = () => fetchPayments();

  /* ── Shared style fragments ── */
  const card  = { background:T.neutral0, borderRadius:T.rlg, border:`1px solid ${T.neutral200}`, overflow:"hidden", boxShadow:T.shadowSm };
  const inp   = { width:"100%", height:40, padding:"0 12px", borderRadius:T.rmd,
                  border:`1.5px solid ${T.neutral200}`, background:T.neutral50,
                  fontSize:14, color:T.neutral900, outline:"none",
                  boxSizing:"border-box", transition:"border-color 150ms, box-shadow 150ms, background 150ms",
                  fontFamily:"inherit" };
  const label = { display:"block", fontSize:10, fontWeight:700, color:T.neutral500,
                  letterSpacing:"0.08em", marginBottom:5, textTransform:"uppercase" };
  const th    = { padding:"9px 14px", textAlign:"left", fontSize:10, fontWeight:700,
                  color:T.primary700, textTransform:"uppercase", letterSpacing:"0.07em",
                  background:T.primary50, borderBottom:`1px solid ${T.primary100}`, whiteSpace:"nowrap" };
  const td    = { padding:"11px 14px", borderBottom:`1px solid ${T.neutral100}`, verticalAlign:"middle" };

  return (
    <div style={{ minHeight:"100vh", background:T.neutral100, fontFamily:"'DM Sans',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box}
        input:focus{
          border-color:var(--color-primary)!important;
          box-shadow:0 0 0 3px rgb(${primaryRgb}/0.15)!important;
          background:${T.neutral0}!important
        }
        .tr:hover td{background:var(--primary-50)!important}
        button:active{transform:scale(0.97)}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadein{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideup{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        .spin{animation:spin .7s linear infinite}
        .fadein{animation:fadein .2s ease}
        .slideup{animation:slideup .3s cubic-bezier(0.34,1.56,0.64,1)}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${T.neutral300};border-radius:4px}
        ::-webkit-scrollbar-track{background:transparent}
        @media(min-width:900px){.main-grid{display:grid!important;grid-template-columns:320px 1fr;gap:18px;align-items:start}}
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={{ background:T.neutral0, borderBottom:`1px solid ${T.neutral200}`, padding:"14px 20px", boxShadow:T.shadowSm }}>
        <div style={{ maxWidth:1300, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:40, height:40, borderRadius:T.rlg,
              background:"var(--color-primary)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 12px rgb(${primaryRgb} / 0.35)`,
              flexShrink:0, color:"#fff",
            }}>
              <Svg d={IC.link} size={18}/>
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:mobile?17:20, fontWeight:800, color:T.neutral900, letterSpacing:"-0.025em" }}>Amendment Links</h1>
              <p style={{ margin:0, fontSize:12, color:T.neutral400, marginTop:1 }}>Generate Razorpay payment links for amendments</p>
            </div>
          </div>
          <span style={{
            display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px",
            borderRadius:T.rfull, background:T.primary50, color:T.primary700,
            fontSize:10, fontWeight:700, letterSpacing:"0.08em",
            border:`1px solid ${T.primary200}`,
          }}>
            <span style={{ width:6, height:6, borderRadius:T.rfull, background:T.primary500, animation:"pulse 2s infinite" }}/>
            INTERNAL TOOL
          </span>
        </div>
      </div>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:mobile?"14px":"20px" }}>

        {/* ── STATS ─────────────────────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${mobile?2:4},1fr)`, gap:12, marginBottom:18 }}>
          {stats.map(s => (
            <div key={s.label} className="fadein" style={{
              background:s.bg, borderRadius:T.rlg,
              padding:mobile?"12px 14px":"14px 18px",
              border:`1px solid ${s.border}`, boxShadow:T.shadowSm,
            }}>
              <p style={{ margin:0, fontSize:10, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</p>
              <p style={{ margin:"5px 0 2px", fontSize:mobile?24:30, fontWeight:800, color:s.color, letterSpacing:"-0.03em", lineHeight:1 }}>{s.val}</p>
              <p style={{ margin:0, fontSize:11, color:s.color, opacity:0.6 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID (form + table) ──────────────────────────────── */}
        <div className="main-grid" style={{ display:"flex", flexDirection:"column", gap:18 }}>

          {/* ── FORM CARD ─────────────────────────────────────────── */}
          <div style={card}>
            <div style={{
              padding:"13px 18px", borderBottom:`1px solid ${T.primary100}`,
              background:T.primary50, display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:T.primary800 }}>Create Payment Link</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:T.primary600 }}>Fill in details to generate</p>
              </div>
              <div style={{
                width:32, height:32, borderRadius:T.rmd,
                background:T.primary100,
                display:"flex", alignItems:"center", justifyContent:"center", color:T.primary700,
              }}>
                <Svg d={IC.link} size={15}/>
              </div>
            </div>

            <div style={{ padding:18 }}>

              {/* User dropdown */}
              <div ref={dropRef} style={{ position:"relative", marginBottom:14 }}>
                <label style={label}>Select User</label>
                <button type="button" onClick={()=>setOpenDrop(v=>!v)} style={{
                  ...inp, height:42, display:"flex", alignItems:"center", justifyContent:"space-between",
                  cursor:"pointer",
                  border:openDrop?`1.5px solid ${T.primary500}`:`1.5px solid ${T.neutral200}`,
                  boxShadow:openDrop?`0 0 0 3px rgb(${primaryRgb}/0.12)`:"none",
                  background:openDrop?T.neutral0:T.neutral50, padding:"0 12px",
                }}>
                  {!selectedUser ? (
                    <span style={{ display:"flex", alignItems:"center", gap:8, color:T.neutral400, fontSize:14 }}>
                      <Svg d={IC.user} size={14}/>Select a user…
                    </span>
                  ) : selectedUser==="other" ? (
                    <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:T.rfull, background:T.neutral100,
                        border:`2px dashed ${T.neutral300}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.neutral400 }}>
                        <Svg d={IC.user} size={12}/>
                      </div>
                      <span style={{ fontSize:14, fontWeight:600, color:T.neutral900 }}>Other / External</span>
                    </span>
                  ) : (
                    <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Avatar name={selectedUser.name} size="sm"/>
                      <span style={{ fontSize:14, fontWeight:600, color:T.neutral900, maxWidth:170, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {selectedUser.name}
                      </span>
                    </span>
                  )}
                  <div style={{ transform:openDrop?"rotate(180deg)":"none", transition:"transform 200ms", color:T.primary500, display:"flex" }}>
                    <Svg d={IC.chevron} size={15}/>
                  </div>
                </button>

                {openDrop && (
                  <div className="fadein" style={{ position:"absolute", zIndex:999, width:"100%", marginTop:4,
                    background:T.neutral0, border:`1.5px solid ${T.neutral200}`,
                    borderRadius:T.rlg, boxShadow:T.shadowXl, overflow:"hidden" }}>
                    <div style={{ padding:"8px 11px", background:T.neutral50, borderBottom:`1px solid ${T.neutral100}`,
                      display:"flex", alignItems:"center", gap:7, color:T.neutral400 }}>
                      <Svg d={IC.search} size={13}/>
                      <input autoFocus style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, color:T.neutral900, fontFamily:"inherit" }}
                        placeholder="Search name, email, phone…" value={search} onChange={e=>setSearch(e.target.value)}/>
                      {search && <button type="button" onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", color:T.neutral400, display:"flex", padding:0 }}><Svg d={IC.x} size={12}/></button>}
                    </div>
                    <div style={{ overflowY:"auto", maxHeight:220 }}>
                      {users.length === 0 && !search && (
                        <p style={{ textAlign:"center", color:T.neutral400, fontSize:12, padding:"18px 0" }}>Loading users…</p>
                      )}
                      {filteredUsers.length===0 && search && (
                        <p style={{ textAlign:"center", color:T.neutral400, fontSize:12, padding:"18px 0" }}>No users found</p>
                      )}
                      {filteredUsers.map(u => {
                        const active = selectedUser?.userId===u.userId;
                        return (
                          <button key={u.userId} type="button"
                            onClick={()=>{ setSelected(u); setOpenDrop(false); setSearch(""); }}
                            style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                              border:"none", borderLeft:active?`2.5px solid ${T.primary500}`:`2.5px solid transparent`,
                              background:active?T.primary50:"transparent", cursor:"pointer", textAlign:"left", transition:"background 100ms" }}>
                            <Avatar name={u.name} size="sm"/>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, marginBottom:2 }}>
                                <p style={{ margin:0, fontSize:13, fontWeight:600, color:T.neutral900 }}>{u.name}</p>
                                <span style={{ fontSize:9, color:T.neutral400, fontFamily:"monospace" }}>#{u.userId?.slice(-5)}</span>
                              </div>
                              <div style={{ display:"flex", flexWrap:"wrap", gap:"2px 10px" }}>
                                {u.email && <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral500 }}><Svg d={IC.mail} size={9}/>{u.email}</span>}
                                {u.phoneNumber && <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral500 }}><Svg d={IC.phone} size={9}/>{u.phoneNumber}</span>}
                              </div>
                            </div>
                            {active && <span style={{ color:T.primary500 }}><Svg d={IC.check} size={13}/></span>}
                          </button>
                        );
                      })}
                      <button type="button" onClick={()=>{ setSelected("other"); setOpenDrop(false); setSearch(""); }}
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                          border:"none", borderTop:`1px solid ${T.neutral100}`,
                          borderLeft:selectedUser==="other"?`2.5px solid ${T.neutral400}`:`2.5px solid transparent`,
                          background:selectedUser==="other"?T.neutral50:"transparent", cursor:"pointer", textAlign:"left" }}>
                        <div style={{ width:28, height:28, borderRadius:T.rfull, background:T.neutral100,
                          border:`2px dashed ${T.neutral300}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:T.neutral400 }}>
                          <Svg d={IC.user} size={12}/>
                        </div>
                        <div>
                          <p style={{ margin:0, fontSize:13, fontWeight:600, color:T.neutral700 }}>Other / External</p>
                          <p style={{ margin:"1px 0 0", fontSize:11, color:T.neutral400 }}>Unlisted user</p>
                        </div>
                        {selectedUser==="other" && <span style={{ color:T.neutral600, marginLeft:"auto" }}><Svg d={IC.check} size={13}/></span>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Note */}
              <div style={{ marginBottom:14 }}>
                <label style={label}>Note <span style={{ opacity:0.5, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                <input style={inp} placeholder="Brief note for this amendment…"
                  value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
              </div>

              {/* Amount */}
              <div style={{ marginBottom:18 }}>
                <label style={label}>Amount</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                    fontWeight:800, color:T.primary600, fontSize:16, pointerEvents:"none" }}>₹</span>
                  <input type="text" inputMode="numeric" style={{ ...inp, paddingLeft:28 }}
                    placeholder="0" value={form.amount}
                    onChange={e=>{ if(/^\d*$/.test(e.target.value)) setForm({...form,amount:e.target.value}); }}/>
                </div>
                <p style={{ margin:"4px 0 0", fontSize:11, color:T.neutral400 }}>Whole numbers only — no decimals</p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px",
                  borderRadius:T.rmd, background:T.error50, border:`1px solid ${T.error100}`,
                  color:T.error700, fontSize:13, marginBottom:14 }}>
                  <Svg d={IC.alert} size={14}/>{error}
                </div>
              )}

              {/* Submit */}
              <button type="button" onClick={handleSubmit} disabled={loading} style={{
                width:"100%", height:42, borderRadius:T.rmd, border:"none",
                background:T.primary500, color:"#fff", fontWeight:700, fontSize:14,
                cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", gap:8, opacity:loading?0.7:1,
                boxShadow:`0 4px 14px rgb(${primaryRgb} / 0.3)`,
                fontFamily:"inherit", letterSpacing:"0.01em",
                transition:"background 150ms, box-shadow 150ms",
              }}>
                {loading
                  ? <><Spinner size={15}/>Generating…</>
                  : <><Svg d={IC.link} size={15}/>Generate Payment Link</>}
              </button>
            </div>
          </div>

          {/* ── TABLE CARD ──────────────────────────────────────────── */}
          <div style={card}>
            <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.neutral200}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:T.neutral900 }}>Recent Payments</p>
                <p style={{ margin:"2px 0 0", fontSize:12, color:T.neutral400 }}>
                  {tableSearch
                    ? `${filteredPay.length} result${filteredPay.length!==1?"s":""} for "${tableSearch}"`
                    : `${payments.length} total payment link${payments.length!==1?"s":""}`}
                </p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, height:34, padding:"0 10px",
                  borderRadius:T.rmd,
                  border:tableSearch?`1.5px solid ${T.primary500}`:`1.5px solid ${T.neutral200}`,
                  background:tableSearch?T.primary50:T.neutral50, transition:"all 150ms",
                  boxShadow:tableSearch?`0 0 0 3px rgb(${primaryRgb}/0.1)`:""  }}>
                  <span style={{ color:tableSearch?T.primary500:T.neutral400 }}><Svg d={IC.search} size={13}/></span>
                  <input type="text" value={tableSearch} onChange={e=>setTSearch(e.target.value)}
                    placeholder="Search payments…"
                    style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:T.neutral900, fontFamily:"inherit", width:mobile?100:150 }}/>
                  {tableSearch && (
                    <button type="button" onClick={()=>setTSearch("")} style={{ border:"none", background:"none", cursor:"pointer", color:T.neutral400, display:"flex", padding:0 }}>
                      <Svg d={IC.x} size={12}/>
                    </button>
                  )}
                </div>
                <button onClick={doRefresh} disabled={tLoading} style={{
                  display:"inline-flex", alignItems:"center", gap:5, height:34, padding:"0 12px",
                  borderRadius:T.rmd, border:`1.5px solid ${T.neutral200}`, background:T.neutral0,
                  color:T.neutral600, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                  opacity:tLoading?0.6:1, transition:"all 150ms" }}>
                  <div className={tLoading?"spin":""} style={{ display:"flex" }}><Svg d={IC.refresh} size={13}/></div>
                  {!mobile && "Refresh"}
                </button>
              </div>
            </div>

            {/* ── Desktop Table ── */}
            {!mobile && (
              <div style={{ overflowX:"auto" }}>
                {tLoading ? (
                  <div style={{ padding:16 }}>
                    {[1,2,3].map(i=><div key={i} style={{ height:52, borderRadius:T.rmd, background:T.neutral100, marginBottom:8, animation:"pulse 1.4s infinite" }}/>)}
                  </div>
                ) : filteredPay.length===0 ? (
                  <div style={{ textAlign:"center", padding:"52px 20px" }}>
                    <div style={{ width:44, height:44, borderRadius:T.rfull, border:`2px dashed ${T.neutral200}`,
                      display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", color:T.neutral300 }}>
                      <Svg d={IC.search} size={20}/>
                    </div>
                    <p style={{ fontSize:14, color:T.neutral500, fontWeight:500, margin:0 }}>
                      {tableSearch?`No results for "${tableSearch}"`:"No payments found"}
                    </p>
                    {tableSearch && (
                      <button type="button" onClick={()=>setTSearch("")}
                        style={{ marginTop:8, background:"none", border:"none", color:T.primary600, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr>{["User","Created By","Amount","Type","Status","Order ID","Payment Link","Paid At","Created"].map(h=>(
                        <th key={h} style={th}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {filteredPay.map(p => {
                        const link = p.razorpayPaymentLinkId;
                        const id   = p.paymentId;
                        return (
                          <tr key={id} className="tr fadein">
                            <td style={td}>
                              {p.user?.name ? (
                                <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:160 }}>
                                  <Avatar name={p.user.name}/>
                                  <div>
                                    <p style={{ margin:0, fontWeight:600, color:T.neutral900, fontSize:13 }}>{p.user.name}</p>
                                    {p.user.email && <p style={{ margin:"2px 0 0", fontSize:11, color:T.neutral400 }}>{p.user.email}</p>}
                                    {p.user.phoneNumber && (
                                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}>
                                        <Svg d={IC.phone} size={9}/>{p.user.phoneNumber}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : <span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}>
                              {p.createdBy?.name ? (
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <Avatar name={p.createdBy.name} size="sm"/>
                                  <span style={{ fontWeight:500, color:T.neutral700, fontSize:13 }}>{p.createdBy.name}</span>
                                </div>
                              ) : <span style={{ color:T.neutral300 }}>—</span>}
                            </td>
                            <td style={td}>
                              <span style={{ fontWeight:800, color:T.primary700, fontSize:15, fontVariantNumeric:"tabular-nums" }}>
                                ₹{(p.amount||0).toLocaleString("en-IN")}
                              </span>
                            </td>
                            <td style={td}>
                              <span style={{ padding:"3px 8px", borderRadius:T.rsm,
                                background:T.primary50, color:T.primary700, fontSize:10,
                                fontWeight:700, letterSpacing:"0.05em", border:`1px solid ${T.primary200}` }}>
                                {p.type}
                              </span>
                            </td>
                            <td style={td}><StatusBadge s={p.status}/></td>
                            <td style={td}>
                              {p.razorpayOrderId ? (
                                <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:145 }}>
                                  <span style={{ fontFamily:"monospace", fontSize:11, color:T.neutral500,
                                    overflow:"hidden", textOverflow:"ellipsis", maxWidth:105, whiteSpace:"nowrap" }}>
                                    {p.razorpayOrderId}
                                  </span>
                                  <CopyBtn text={p.razorpayOrderId} id={`ord-${id}`} copied={copied} onCopy={doCopy}/>
                                </div>
                              ) : <span style={{ color:T.neutral300, fontSize:12 }}>—</span>}
                            </td>
                            <td style={td}>
                              {link ? (
                                <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:155 }}>
                                  <a href={`https://rzp.io/l/${link}`} target="_blank" rel="noopener noreferrer"
                                    style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"monospace",
                                      fontSize:11, color:T.primary600, textDecoration:"none",
                                      maxWidth:105, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                    <Svg d={IC.external} size={10}/>{link}
                                  </a>
                                  <CopyBtn text={`https://rzp.io/l/${link}`} id={id} copied={copied} onCopy={doCopy}/>
                                </div>
                              ) : <span style={{ color:T.neutral300, fontSize:12 }}>—</span>}
                            </td>
                            <td style={td}>
                              {p.paidAt ? (
                                <div>
                                  <p style={{ margin:0, fontSize:12, color:T.neutral800, fontWeight:500 }}>{fmtDate(p.paidAt)}</p>
                                  <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}>
                                    <Svg d={IC.clock} size={9}/>{fmtTime(p.paidAt)}
                                  </span>
                                </div>
                              ) : <span style={{ color:T.neutral300, fontSize:12 }}>—</span>}
                            </td>
                            <td style={td}>
                              <p style={{ margin:0, fontSize:12, color:T.neutral800, fontWeight:500 }}>{fmtDate(p.createdAt)}</p>
                              <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}>
                                <Svg d={IC.clock} size={9}/>{fmtTime(p.createdAt)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Mobile Cards ── */}
            {mobile && (
              <div style={{ padding:"12px" }}>
                {tLoading ? (
                  [1,2,3].map(i=><div key={i} style={{ height:100, borderRadius:T.rmd, background:T.neutral100, marginBottom:8, animation:"pulse 1.4s infinite" }}/>)
                ) : filteredPay.length===0 ? (
                  <div style={{ textAlign:"center", padding:"40px 20px" }}>
                    <p style={{ color:T.neutral500, fontSize:14, fontWeight:500 }}>
                      {tableSearch?`No results for "${tableSearch}"`:"No payments found"}
                    </p>
                  </div>
                ) : filteredPay.map(p => {
                  const link = p.razorpayPaymentLinkId;
                  const id   = p.paymentId;
                  return (
                    <div key={id} className="fadein" style={{ borderRadius:T.rlg, border:`1.5px solid ${T.neutral200}`,
                      background:T.neutral0, padding:13, marginBottom:10, boxShadow:T.shadowSm }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          {p.user?.name && <Avatar name={p.user.name}/>}
                          <div>
                            <p style={{ margin:0, fontWeight:700, color:T.neutral900, fontSize:14 }}>{p.user?.name||"—"}</p>
                            {p.user?.email && <p style={{ margin:"2px 0 0", fontSize:11, color:T.neutral400 }}>{p.user.email}</p>}
                            {p.user?.phoneNumber && (
                              <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:T.neutral400, marginTop:2 }}>
                                <Svg d={IC.phone} size={9}/>{p.user.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                        <StatusBadge s={p.status}/>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                        borderRadius:T.rmd, background:T.neutral50, border:`1px solid ${T.neutral100}`, marginBottom:8 }}>
                        <span style={{ fontSize:19, fontWeight:800, color:T.primary700 }}>₹{(p.amount||0).toLocaleString("en-IN")}</span>
                        <span style={{ padding:"2px 8px", borderRadius:T.rsm, background:T.primary50,
                          color:T.primary700, fontSize:10, fontWeight:700, border:`1px solid ${T.primary200}` }}>
                          {p.type}
                        </span>
                        {p.createdBy?.name && (
                          <span style={{ display:"flex", alignItems:"center", gap:5, marginLeft:"auto", fontSize:11, color:T.neutral500 }}>
                            <Avatar name={p.createdBy.name} size="sm"/>{p.createdBy.name}
                          </span>
                        )}
                      </div>
                      {p.razorpayOrderId && (
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          padding:"7px 10px", borderRadius:T.rmd, background:T.neutral50,
                          border:`1px solid ${T.neutral100}`, marginBottom:6 }}>
                          <div style={{ minWidth:0 }}>
                            <span style={{ fontSize:9, fontWeight:700, color:T.neutral400, letterSpacing:"0.08em", textTransform:"uppercase" }}>Order ID</span>
                            <p style={{ margin:"1px 0 0", fontFamily:"monospace", fontSize:11, color:T.neutral600,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>
                              {p.razorpayOrderId}
                            </p>
                          </div>
                          <CopyBtn text={p.razorpayOrderId} id={`ord-${id}`} copied={copied} onCopy={doCopy}/>
                        </div>
                      )}
                      {link && (
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          padding:"7px 10px", borderRadius:T.rmd, background:T.primary50,
                          border:`1px solid ${T.primary200}`, marginBottom:6 }}>
                          <div style={{ minWidth:0, flex:1 }}>
                            <span style={{ fontSize:9, fontWeight:700, color:T.primary700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Payment Link</span>
                            <p style={{ margin:"1px 0 0", fontFamily:"monospace", fontSize:11, color:T.primary700,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>
                              {link}
                            </p>
                          </div>
                          <CopyBtn text={`https://rzp.io/l/${link}`} id={id} copied={copied} onCopy={doCopy}/>
                        </div>
                      )}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.neutral400 }}>
                          <Svg d={IC.clock} size={10}/>Created {fmtDate(p.createdAt)} · {fmtTime(p.createdAt)}
                        </span>
                        {p.paidAt && (
                          <span style={{ fontSize:11, color:T.success700, fontWeight:700 }}>
                            ✓ Paid {fmtDate(p.paidAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SUCCESS MODAL ─────────────────────────────────────────────── */}
      {successLink && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center",
          justifyContent:"center", padding:20, background:"rgba(26,26,46,0.55)", backdropFilter:"blur(4px)" }}
          onClick={()=>setSuccess(null)}>
          <div className="slideup"
            style={{ background:T.neutral0, borderRadius:T.rxl, border:`1px solid ${T.neutral200}`,
              boxShadow:T.shadowXl, width:"100%", maxWidth:420, padding:"28px 26px" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ width:62, height:62, borderRadius:T.rfull,
              background:T.primary500,
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#fff",
              boxShadow:`0 8px 24px rgb(${primaryRgb} / 0.35)`,
            }}>
              <Svg d={IC.check} size={28} sw={2.5}/>
            </div>
            <h3 style={{ textAlign:"center", margin:"0 0 4px", fontSize:21, fontWeight:800, color:T.neutral900, letterSpacing:"-0.02em" }}>
              Link Generated! 🎉
            </h3>
            <p style={{ textAlign:"center", margin:"0 0 22px", color:T.neutral400, fontSize:13 }}>
              Your amendment payment link is ready to share.
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20,
              padding:"12px 0", marginBottom:20,
              borderTop:`1px solid ${T.neutral100}`, borderBottom:`1px solid ${T.neutral100}` }}>
              <div style={{ textAlign:"center" }}>
                <p style={{ margin:0, fontSize:10, color:T.neutral400, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Amount</p>
                <p style={{ margin:"4px 0 0", fontSize:24, fontWeight:800, color:T.primary700 }}>
                  ₹{Number(successLink.amount || form.amount || 0).toLocaleString("en-IN")}
                </p>
              </div>
              {(successLink.note || form.note) && (
                <><div style={{ width:1, height:36, background:T.neutral200 }}/>
                <div style={{ textAlign:"center" }}>
                  <p style={{ margin:0, fontSize:10, color:T.neutral400, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Note</p>
                  <p style={{ margin:"4px 0 0", fontSize:14, fontWeight:600, color:T.neutral800 }}>{successLink.note || form.note}</p>
                </div></>
              )}
            </div>
            {(successLink.razorpayPaymentLinkId || successLink.paymentLink) && (
              <div style={{ borderRadius:T.rmd, border:`1.5px solid ${T.primary200}`, background:T.primary50, padding:"12px 14px", marginBottom:20 }}>
                <p style={{ margin:"0 0 6px", fontSize:9, fontWeight:700, color:T.primary700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Payment Link</p>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <p style={{ flex:1, margin:0, fontFamily:"monospace", fontSize:12, color:T.neutral700, wordBreak:"break-all", lineHeight:1.6 }}>
                    {successLink.razorpayPaymentLinkId || successLink.paymentLink}
                  </p>
                  <CopyBtn
                    text={successLink.razorpayPaymentLinkId || successLink.paymentLink}
                    id="modal" copied={copied} onCopy={doCopy}
                  />
                </div>
              </div>
            )}
            <button type="button" onClick={()=>setSuccess(null)} style={{
              width:"100%", height:44, borderRadius:T.rmd, border:"none",
              background:T.primary500, color:"#fff", fontWeight:700, fontSize:14,
              cursor:"pointer", boxShadow:`0 4px 14px rgb(${primaryRgb} / 0.3)`,
              fontFamily:"inherit", letterSpacing:"0.01em",
            }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}