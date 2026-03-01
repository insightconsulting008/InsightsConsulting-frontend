import { useState, useEffect, useRef } from "react";
import axios from "axios";

// ── react-icons ───────────────────────────────────────────────────────────────
import { FiUser, FiSearch, FiCheck, FiCopy, FiLink, FiChevronDown, FiRefreshCw, FiAlertCircle, FiX, FiZap, FiClock, FiPhone, FiMail, FiHash } from "react-icons/fi";

const cn = (...c) => c.filter(Boolean).join(" ");
// Hardcoded user ID as requested
  const employeeId = localStorage.getItem("employeeId");

if (!employeeId) {
  console.error("Employee ID not found");
}

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};
const fmtTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
};

const AVATAR_BG = ["#b45309","#92400e","#991b1b","#7f1d1d","#854d0e","#713f12","#78350f","#431407"];
const getAvatarBg = (n) => AVATAR_BG[(n?.charCodeAt(0) ?? 0) % AVATAR_BG.length];
const getInitials = (n) => !n ? "?" : n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();

// ── icon wrappers (keep same cls prop API as before) ──────────────────────────
const IcoUser      = ({cls=""}) => <FiUser      className={cn("w-4 h-4",cls)} />;
const IcoSearch    = ({cls=""}) => <FiSearch    className={cn("w-3.5 h-3.5",cls)} />;
const IcoCheck     = ({cls=""}) => <FiCheck     className={cn("w-3.5 h-3.5",cls)} />;
const IcoCopy      = ({cls=""}) => <FiCopy      className={cn("w-3.5 h-3.5",cls)} />;
const IcoLink      = ({cls=""}) => <FiLink      className={cn("w-4 h-4",cls)} />;
const IcoChevron   = ({open})   => <FiChevronDown className={cn("w-4 h-4 text-amber-600 transition-transform duration-200",open&&"rotate-180")} />;
const IcoRefresh   = ({spin})   => <FiRefreshCw  className={cn("w-3.5 h-3.5",spin&&"animate-spin")} />;
const IcoAlert     = ({cls=""}) => <FiAlertCircle className={cn("w-4 h-4 flex-shrink-0",cls)} />;
const IcoX         = ({cls=""}) => <FiX          className={cn("w-2.5 h-2.5",cls)} />;
const IcoLightning = ({cls=""}) => <FiZap        className={cn("w-4 h-4",cls)} />;

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name, size="md" }) => {
  const sz = size==="sm" ? "w-7 h-7 text-[9px]" : "w-9 h-9 text-xs";
  return <div className={cn("rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 tracking-wide ring-2 ring-white",sz)} style={{backgroundColor:getAvatarBg(name)}}>{getInitials(name)}</div>;
};

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS = { CREATED:"bg-amber-100 text-amber-800 border-amber-300", PAID:"bg-green-100 text-green-800 border-green-300", FAILED:"bg-red-100 text-red-800 border-red-300", EXPIRED:"bg-stone-100 text-stone-500 border-stone-300" };
const StatusBadge = ({s}) => <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide uppercase", STATUS[s]||"bg-stone-100 text-stone-400 border-stone-200")}>{s||"—"}</span>;
const Spin = ({cls=""}) => <span className={cn("inline-block w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-600 animate-spin",cls)} />;

// ═════════════════════════════════════════════════════════════════════════════
export default function CreateAmendmentLink() {
  const [users,setUsers]=useState([]);
  const [selectedUser,setSelectedUser]=useState(null);
  const [search,setSearch]=useState("");
  const [openDrop,setOpenDrop]=useState(false);
  const [form,setForm]=useState({note:"",amount:""});
  const [loading,setLoading]=useState(false);
  const [successLink,setSuccessLink]=useState(null);
  const [error,setError]=useState("");
  const [payments,setPayments]=useState([]);
  const [tLoading,setTLoading]=useState(false);
  const [copied,setCopied]=useState(null);
  const [tableSearch,setTableSearch]=useState("");
  const dropRef=useRef(null);
  const tableSearchRef=useRef(null);

  useEffect(()=>{
    const h=(e)=>{ if(dropRef.current&&!dropRef.current.contains(e.target)) setOpenDrop(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const fetchPayments=async()=>{
    setTLoading(true);
    try{ const r=await axios.get(`https://insightsconsult-backend.onrender.com/payments/${employeeId}?search=plink_&page=1&limit=5`); setPayments(r.data.data||r.data||[]); }
    catch{} finally{setTLoading(false);}
  };

  useEffect(()=>{
    axios.get("https://insightsconsult-backend.onrender.com/users").then(r=>setUsers(r.data)).catch(()=>{});
    fetchPayments();
  },[]);

  const filtered=users.filter(u=>`${u.name} ${u.email} ${u.phoneNumber}`.toLowerCase().includes(search.toLowerCase()));

  const filteredPayments=payments.filter(p=>{
    if(!tableSearch.trim()) return true;
    const q=tableSearch.toLowerCase();
    return (p.user?.name||"").toLowerCase().includes(q)||(p.user?.email||"").toLowerCase().includes(q)||(p.user?.phoneNumber||"").toLowerCase().includes(q)||(p.status||"").toLowerCase().includes(q)||(p.type||"").toLowerCase().includes(q)||(p.paymentLink||"").toLowerCase().includes(q)||String(p.amount||"").includes(q);
  });

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!selectedUser){setError("Please select a user.");return;}
    if(!form.amount||Number(form.amount)<=0){setError("Amount must be greater than 0.");return;}
    setLoading(true);setError("");
    try{
      const r=await axios.post("https://insightsconsult-backend.onrender.com/create/amendment-link",{employeeId:employeeId,userId:selectedUser==="other"?null:selectedUser?.userId,note:form.note,amount:Number(form.amount)});
      setSuccessLink(r.data);setForm({note:"",amount:""});setSelectedUser(null);
    }catch(err){setError(err.response?.data?.message||"Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const doCopy=(text,id)=>{ navigator.clipboard.writeText(text).then(()=>{setCopied(id);setTimeout(()=>setCopied(null),2000);}); };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        @keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleUp{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        .drop-anim{animation:fadeDown .15s ease}
        .modal-anim{animation:scaleUp .2s ease}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .shimmer-line{background:linear-gradient(90deg,#fef3c7 25%,#fde68a 50%,#fef3c7 75%);background-size:200% 100%;animation:shimmer 1.6s infinite;border-radius:6px;height:14px;}
        .scrollbar-thin::-webkit-scrollbar{width:4px}
        .scrollbar-thin::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:4px}
        .scrollbar-thin::-webkit-scrollbar-track{background:transparent}
        .table-search-expand{transition:width 0.2s ease}
      `}</style>

      {/* HERO */}
      <div className="bg-red text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-amber-100 text-xs font-semibold uppercase tracking-widest mb-1">Internal Tool</p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight" style={{fontFamily:"'DM Serif Display',serif"}}>Amendment Links</h1>
          <p className="text-amber-100 text-sm mt-1.5 max-w-md">Generate Razorpay payment links for amendment orders — instantly.</p>
        </div>
      </div>

      <main className="w-full mx-auto px-4 lg:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* FORM CARD */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
              <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-stone-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red flex items-center justify-center flex-shrink-0">
                  <IcoLink cls="text-white"/>
                </div>
                <div>
                  <h2 className="font-semibold text-stone-900 text-sm leading-none">Create New Link</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Fill details and generate</p>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5 space-y-5">

                {/* user select */}
                <div className="space-y-1.5" ref={dropRef}>
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">User</label>
                  <div className="relative">
                    <button type="button" onClick={()=>setOpenDrop(v=>!v)} className={cn("w-full flex items-center justify-between h-10 px-3 rounded-xl border text-sm bg-stone-50 transition-all",openDrop?"border-amber-500 ring-2 ring-amber-100":"border-stone-200 hover:border-amber-400")}>
                      {!selectedUser?(
                        <div className="flex items-center gap-2 text-stone-400">
                          <div className="w-6 h-6 rounded-full border border-dashed border-stone-300 flex items-center justify-center"><IcoUser/></div>
                          <span className="text-sm">Select a user…</span>
                        </div>
                      ):selectedUser==="other"?(
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-stone-500"><IcoUser/></div>
                          <span className="text-sm font-medium text-stone-800">Other / External</span>
                        </div>
                      ):(
                        <div className="flex items-center gap-2">
                          <Avatar name={selectedUser.name} size="sm"/>
                          <span className="text-sm font-medium text-stone-900 truncate max-w-[160px]">{selectedUser.name}</span>
                        </div>
                      )}
                      <IcoChevron open={openDrop}/>
                    </button>

                    {openDrop&&(
                      <div className="drop-anim absolute z-50 w-full mt-1.5 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border-b border-amber-100">
                          <IcoSearch cls="text-amber-500"/>
                          <input autoFocus className="flex-1 text-sm outline-none bg-transparent text-stone-800 placeholder-stone-400" placeholder="Search name, email, phone…" value={search} onChange={e=>setSearch(e.target.value)}/>
                          {search&&<button type="button" onClick={()=>setSearch("")} className="text-stone-400 hover:text-stone-600 text-xs">✕</button>}
                        </div>
                        <div className="scrollbar-thin overflow-y-auto" style={{maxHeight:220}}>
                          {filtered.length===0&&<p className="text-center text-xs text-stone-400 py-5">No users found</p>}
                          {filtered.map(u=>{
                            const active=selectedUser?.userId===u.userId;
                            return(
                              <button key={u.userId} type="button" onClick={()=>{setSelectedUser(u);setOpenDrop(false);setSearch("");}} className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-l-2",active?"bg-amber-50 border-amber-500":"border-transparent hover:bg-stone-50 hover:border-amber-300")}>
                                <Avatar name={u.name} size="sm"/>
                                 <div className="flex-1 min-w-0">
                                  {/* name + userId on same row, space-between */}
                                  <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className="text-sm font-semibold text-stone-900 truncate">{u.name}</p>
                                    <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono flex-shrink-0">
                                      <FiHash className="w-2.5 h-2.5 text-amber-400" />{u.userId}
                                    </span>
                                  </div>
                                  {/* email + phone each with icon */}
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                    {u.email && (
                                      <span className="flex items-center gap-1 text-[11px] text-stone-400 truncate max-w-[160px]">
                                        <FiMail className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />{u.email}
                                      </span>
                                    )}
                                    {u.phoneNumber && (
                                      <span className="flex items-center gap-1 text-[11px] text-stone-400 flex-shrink-0">
                                        <FiPhone className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />{u.phoneNumber}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {active&&<IcoCheck cls="text-amber-600 flex-shrink-0"/>}
                              </button>
                            );
                          })}
                          <button type="button" onClick={()=>{setSelectedUser("other");setOpenDrop(false);setSearch("");}} className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-l-2 border-t border-stone-100",selectedUser==="other"?"bg-stone-100 border-stone-400":"border-transparent hover:bg-stone-50 hover:border-stone-400")}>
                            <div className="w-7 h-7 rounded-full bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center flex-shrink-0 text-stone-400"><IcoUser/></div>
                            <div>
                              <p className="text-sm font-medium text-stone-700">Other / External</p>
                              <p className="text-xs text-stone-400">Unlisted user</p>
                            </div>
                            {selectedUser==="other"&&<IcoCheck cls="text-stone-600 ml-auto flex-shrink-0"/>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Note</label>
                  <input className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:bg-white" placeholder="Brief note for this amendment…" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} required/>
                </div>

                {/* amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold text-sm pointer-events-none">₹</span>
                    <input type="text" inputMode="numeric" className="w-full h-10 pl-7 pr-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:bg-white" placeholder="0" value={form.amount} onChange={e=>{if(/^\d*$/.test(e.target.value))setForm({...form,amount:e.target.value});}} onKeyDown={e=>{if([".",",","e","E","+","-"].includes(e.key))e.preventDefault();}} required/>
                  </div>
                  <p className="text-[11px] text-stone-400">Whole numbers only — no decimals</p>
                </div>

                {error&&(
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <IcoAlert cls="text-red-500 mt-0.5"/>{error}
                  </div>
                )}

                <button type="button" onClick={handleSubmit} disabled={loading} className="w-full h-11 rounded-xl bg-red text-white font-semibold text-sm tracking-wide shadow-sm hover:from-amber-400 hover:to-red-500 hover:-translate-y-0.5 hover:shadow-md transition-all active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                  {loading?(<><Spin/>Generating…</>):(<><IcoLink cls="text-white"/>Generate Payment Link</>)}
                </button>
              </div>
            </div>
          </div>

          {/* PAYMENTS CARD */}
          <div className="lg:col-span-8 space-y-4">

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {label:"Total Shown",val:filteredPayments.length,accent:"text-stone-800"},
                {label:"Paid",val:filteredPayments.filter(p=>p.status==="PAID").length,accent:"text-green-700"},
                {label:"Pending",val:filteredPayments.filter(p=>p.status==="CREATED").length,accent:"text-amber-700"},
                {label:"Failed",val:filteredPayments.filter(p=>p.status==="FAILED").length,accent:"text-red-700"},
              ].map(s=>(
                <div key={s.label} className="bg-white border-l-2 border-yellow border-stone-200 rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-xs text-stone-400 font-medium">{s.label}</p>
                  <p className={cn("text-2xl font-bold mt-0.5",s.accent)}>{s.val}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

              {/* TABLE HEADER */}
              <div className="px-5 sm:px-6 py-4 border-b border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-shrink-0">
                    <h2 className="font-semibold text-stone-900 text-sm leading-none">Recent Payments</h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {tableSearch ? `${filteredPayments.length} result${filteredPayments.length!==1?"s":""} for "${tableSearch}"` : "Latest 5 amendment payment links"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* search */}
                    <div className={cn(
                      "flex items-center gap-2 h-8 px-2.5 rounded-lg border bg-stone-50 transition-all duration-200",
                      tableSearch
                        ? "border-amber-400 ring-2 ring-amber-100 bg-amber-50"
                        : "border-stone-200 hover:border-amber-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 focus-within:bg-amber-50"
                    )} style={{width: tableSearch ? "220px" : "180px"}}>
                      <IcoSearch cls={tableSearch?"text-amber-500 flex-shrink-0":"text-stone-400 flex-shrink-0"}/>
                      <input
                        ref={tableSearchRef}
                        type="text"
                        value={tableSearch}
                        onChange={e=>setTableSearch(e.target.value)}
                        placeholder="Search payments…"
                        className="flex-1 text-xs outline-none bg-transparent text-stone-800 placeholder-stone-400 min-w-0"
                      />
                      {tableSearch&&(
                        <button type="button" onClick={()=>{setTableSearch("");tableSearchRef.current?.focus();}}
                          className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-colors">
                          <IcoX cls="text-amber-700"/>
                        </button>
                      )}
                    </div>

                    {/* refresh */}
                    <button onClick={fetchPayments} disabled={tLoading}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 text-xs font-medium hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all disabled:opacity-60 flex-shrink-0">
                      <IcoRefresh spin={tLoading}/>
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE cards */}
              <div className="block md:hidden">
                {tLoading?(
                  <div className="p-4 space-y-3">{[1,2,3].map(i=><div key={i} className="rounded-xl border border-stone-100 p-4 space-y-3"><div className="shimmer-line w-2/3"/><div className="shimmer-line w-1/2"/><div className="shimmer-line w-full"/></div>)}</div>
                ):filteredPayments.length===0?(
                  <div className="py-14 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-dashed border-stone-200 flex items-center justify-center text-stone-300"><IcoSearch cls="w-5 h-5"/></div>
                    <p className="text-sm text-stone-500 font-medium">{tableSearch?`No results for "${tableSearch}"`:"No payments found"}</p>
                    {tableSearch&&<button type="button" onClick={()=>setTableSearch("")} className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium underline">Clear search</button>}
                  </div>
                ):(
                  <div className="p-4 space-y-3">
                    {filteredPayments.map(p=>{
                      const id=p.paymentId||p.id;
                      return(
                        <div key={id} className="rounded-xl border border-stone-100 bg-stone-50 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              {p.user?.name&&<Avatar name={p.user.name} size="sm"/>}
                              <div>
                                <p className="text-sm font-semibold text-stone-900 leading-none">{p.user?.name||"—"}</p>
                                <p className="text-xs text-stone-400 mt-0.5">{p.user?.email||""}</p>
                              </div>
                            </div>
                            <StatusBadge s={p.status}/>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-amber-700">₹{p.amount}</span>
                            <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">{p.type||"—"}</span>
                          </div>
                          {p.paymentLink&&(
                            <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-3 py-2">
                              <span className="text-[11px] font-mono text-stone-500 truncate flex-1">{p.paymentLink}</span>
                              <button type="button" onClick={()=>doCopy(p.paymentLink,id)} className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex-shrink-0",copied===id?"bg-green-50 border-green-200 text-green-700":"border-stone-200 text-stone-500 hover:border-amber-400 hover:text-amber-700 bg-white")}>
                                {copied===id?<><IcoCheck/>Copied</>:<><IcoCopy/>Copy</>}
                              </button>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-stone-500 font-medium">{fmtDate(p.createdAt)}</span>
                            <span className="flex items-center gap-1 text-[11px] text-stone-400">
                              <FiClock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                              {fmtTime(p.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DESKTOP table */}
              <div className="hidden md:block">
                {tLoading?(
                  <div className="p-6 space-y-3">{[1,2,3,4].map(i=><div key={i} className="shimmer-line w-full" style={{height:16}}/>)}</div>
                ):filteredPayments.length===0?(
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-dashed border-stone-200 flex items-center justify-center text-stone-300"><IcoSearch cls="w-5 h-5"/></div>
                    <p className="text-sm text-stone-500 font-medium">{tableSearch?`No results for "${tableSearch}"`:"No payments found"}</p>
                    {tableSearch&&<button type="button" onClick={()=>setTableSearch("")} className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium underline">Clear search</button>}
                  </div>
                ):(
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                        {["User","Amount","Type","Status","Payment Link","Created At"].map(h=>(
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-amber-800 uppercase tracking-wider whitespace-nowrap first:pl-6 last:pr-6">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {filteredPayments.map(p=>{
                        const id=p.paymentId||p.id;
                        return(
                          <tr key={id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-4 py-3.5 pl-6">
                              {p.user?.name?(
                                <div className="flex items-center gap-2.5">
                                  <Avatar name={p.user.name} size="sm"/>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-stone-900 text-sm leading-none">{p.user.name}</p>
                                    <p className="text-[11px] text-stone-400 mt-0.5 truncate max-w-[130px]">{p.user.email||""}</p>
                                  </div>
                                </div>
                              ):<span className="text-stone-300">—</span>}
                            </td>
                            <td className="px-4 py-3.5"><span className="font-bold text-amber-700 text-base">₹{p.amount}</span></td>
                            <td className="px-4 py-3.5"><span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">{p.type||"—"}</span></td>
                            <td className="px-4 py-3.5"><StatusBadge s={p.status}/></td>
                            <td className="px-4 py-3.5">
                              {p.paymentLink?(
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-stone-400 truncate max-w-[110px] lg:max-w-[180px]">{p.paymentLink}</span>
                                  <button type="button" onClick={()=>doCopy(p.paymentLink,id)} className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex-shrink-0",copied===id?"bg-green-50 border-green-200 text-green-700":"border-stone-200 text-stone-500 hover:border-amber-400 hover:text-amber-600 bg-white")}>
                                    {copied===id?<><IcoCheck/></>:<><IcoCopy/></>}
                                  </button>
                                </div>
                              ):<span className="text-stone-300 text-xs">—</span>}
                            </td>
                            <td className="px-4 py-3.5 pr-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] text-stone-600 font-medium whitespace-nowrap">{fmtDate(p.createdAt)}</span>
                                <span className="flex items-center gap-1 text-[11px] text-stone-400 whitespace-nowrap">
                                  <FiClock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                  {fmtTime(p.createdAt)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SUCCESS MODAL */}
      {successLink&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={()=>{setSuccessLink(null);fetchPayments();}}>
          <div className="modal-anim bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-md p-6 sm:p-8" onClick={e=>e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center shadow-lg">
              <FiCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 text-center mb-1" style={{fontFamily:"'DM Serif Display',serif"}}>Link Generated!</h3>
            <p className="text-sm text-stone-500 text-center mb-6">Your amendment payment link is ready to share with the client.</p>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5">
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-2">Payment Link</p>
              <div className="flex items-start gap-3">
                <p className="text-xs font-mono text-stone-700 break-all flex-1 leading-relaxed">{successLink.paymentLink}</p>
                <button type="button" onClick={()=>doCopy(successLink.paymentLink,"modal")} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex-shrink-0 mt-0.5",copied==="modal"?"bg-green-100 border-green-300 text-green-700":"bg-white border-amber-300 text-amber-700 hover:bg-amber-100")}>
                  {copied==="modal"?<><IcoCheck/>Copied!</>:<><IcoCopy/>Copy</>}
                </button>
              </div>
            </div>
            <button type="button" onClick={()=>{setSuccessLink(null);fetchPayments();}} className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-semibold text-sm hover:from-amber-400 hover:to-red-500 hover:-translate-y-0.5 hover:shadow-md transition-all active:translate-y-0">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}