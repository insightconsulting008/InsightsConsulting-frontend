import React, { useState, useEffect, useRef } from 'react'
import axiosInstance from '@src/providers/axiosInstance'
import PageHeader from '../page-header/PageHeader'

const USER_ID = localStorage.getItem("userId");
const LIMIT   = 8
const NOW     = new Date()
const MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December']

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const Ic = {
  folder: c => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="16" fill={c} fillOpacity=".13"/>
      <path d="M12 20a3 3 0 013-3h7.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0027.828 21H37a3 3 0 013 3v13a3 3 0 01-3 3H15a3 3 0 01-3-3V20z" fill={c} fillOpacity=".22" stroke={c} strokeWidth="1.6"/>
      <path d="M12 26h28" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  back: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4L6 9l5 5"/></svg>),
  file: (c='#7878a0') => (
    <svg width="30" height="36" viewBox="0 0 30 36" fill="none">
      <path d="M3 2h16l7 7v25H3V2z" fill={c} fillOpacity=".1" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M19 2v8h8" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
      <rect x="7" y="16" width="15" height="1.5" rx=".75" fill={c} fillOpacity=".4"/>
      <rect x="7" y="21" width="11" height="1.5" rx=".75" fill={c} fillOpacity=".4"/>
      <rect x="7" y="26" width="13" height="1.5" rx=".75" fill={c} fillOpacity=".4"/>
    </svg>
  ),
  eye: (<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 7.5s2.5-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1 7.5 1 7.5z"/><circle cx="7.5" cy="7.5" r="1.75"/></svg>),
  dl:  (<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 2v8M4.5 8l3 3 3-3M2 13h11"/></svg>),
  grid:(<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.4"/><rect x="8" y="1" width="6" height="6" rx="1.4"/><rect x="1" y="8" width="6" height="6" rx="1.4"/><rect x="8" y="8" width="6" height="6" rx="1.4"/></svg>),
  list:(<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><rect x="1" y="2" width="13" height="2" rx="1"/><rect x="1" y="6.5" width="13" height="2" rx="1"/><rect x="1" y="11" width="13" height="2" rx="1"/></svg>),
  chevL:(<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>),
  chevR:(<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>),
  cal:  (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="2" width="12" height="11" rx="2"/><path d="M1 6h12M4.5 1v2M9.5 1v2"/></svg>),
  x:    (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8"/></svg>),
  empty:(<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="var(--neutral-100)"/><path d="M12 18a3 3 0 013-3h6.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0026.828 19H33a3 3 0 013 3v12a3 3 0 01-3 3H15a3 3 0 01-3-3V18z" stroke="var(--neutral-300)" strokeWidth="1.5" fill="none"/><path d="M12 24h24M19 30h10" stroke="var(--neutral-300)" strokeWidth="1.5" strokeLinecap="round"/></svg>),
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const getExt   = url => url?.split('.').pop()?.split('?')[0]?.toLowerCase() || 'file'
const isImg    = url => url && ['png','jpg','jpeg','gif','webp','svg'].includes(getExt(url))
const fmtDate  = iso => new Date(iso).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})
const fmtTime  = iso => new Date(iso).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
const fileName = url => url ? decodeURIComponent(url.split('/').pop().replace(/^\d+_\d+_/,'')).slice(0,32) : 'Untitled'
const extColor = ext => {
  const colors = {
    'pdf': 'var(--error-500)',
    'png': 'var(--primary-500)',
    'jpg': 'var(--warning-500)',
    'jpeg': 'var(--warning-500)',
    'doc': 'var(--info-500)',
    'docx': 'var(--info-500)',
    'xls': 'var(--success-500)',
    'xlsx': 'var(--success-500)'
  };
  return colors[ext] || 'var(--neutral-500)';
}

/* ── MOCK fallback ───────────────────────────────────────────────────────── */
const MOCK = {
  mydocuments:{ total:3, documents:[
    {fileUrl:'https://insightconsulting.s3.ap-south-1.amazonaws.com/myDocuments/1772709128359_1771569495560_love-message.png',createdAt:'2026-03-04T16:42:48.547Z'},
    {fileUrl:'https://insightconsulting.s3.ap-south-1.amazonaws.com/myDocuments/1772632791595_1772259692628_cropped-1772259641234.jpg',createdAt:'2026-03-04T08:03:47.719Z'},
    {fileUrl:'https://insightconsulting.s3.ap-south-1.amazonaws.com/myDocuments/1772633128788_1772259692628_cropped-1772259641234.jpg',createdAt:'2026-03-04T08:03:47.719Z'},
  ]},
  mycompany:{ total:1, documents:[
    {fileUrl:'https://insightconsulting.s3.ap-south-1.amazonaws.com/myDocuments/1772644618178_1772259692628_cropped-1772259641234.jpg',createdAt:'2026-03-04T17:16:58.927Z'},
  ]},
}

/* ════════════════════════════════════════════════════════════════════════════
   FILTER BAR  — month pills + year selector
   ════════════════════════════════════════════════════════════════════════════ */
function FilterBar({ month, year, color, onChange, total }) {
  const [open, setOpen] = useState(false)
  const ref  = useRef(null)
  const years = Array.from({length: 5}, (_, i) => NOW.getFullYear() - i)
  const isActive = month !== null

  /* close on outside click */
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const clear = () => onChange(null, NOW.getFullYear())

  const labelText = isActive
    ? `${MONTHS[month - 1]} ${year}`
    : 'Filter by month'

  return (
    <div className="fb-wrap" ref={ref}>

      {/* ── trigger button ── */}
      <button
        className={`fb-trigger ${isActive ? 'fb-trigger--active' : ''}`}
        style={isActive ? { '--fc': color, '--fb': 'var(--primary-50)', '--fb2': 'var(--primary-100)' } : {}}
        onClick={() => setOpen(o => !o)}
      >
        <span className="fb-trigger__cal" style={isActive ? { color } : {}}>{Ic.cal}</span>
        <span className="fb-trigger__label">{labelText}</span>
        {isActive && (
          <span className="fb-trigger__count" style={{ background: color, color: '#fff' }}>
            {total ?? '—'}
          </span>
        )}
        {isActive
          ? <button className="fb-trigger__clear" onClick={e => { e.stopPropagation(); clear(); setOpen(false) }}>{Ic.x}</button>
          : <span className="fb-trigger__arrow" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>{Ic.chevR}</span>
        }
      </button>

      {/* ── dropdown panel ── */}
      {open && (
        <div className="fb-panel">
          <div className="fb-panel__head">
            <span className="fb-panel__title">Filter by date</span>
            {isActive && (
              <button className="fb-panel__reset" onClick={() => { clear(); setOpen(false) }}>Clear</button>
            )}
          </div>

          {/* year tabs */}
          <div className="fb-year-row">
            {years.map(y => (
              <button
                key={y}
                className={`fb-year ${year === y ? 'fb-year--on' : ''}`}
                style={year === y ? { '--fc': color } : {}}
                onClick={() => onChange(month, y)}
              >{y}</button>
            ))}
          </div>

          {/* month grid */}
          <div className="fb-month-grid">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                className={`fb-month ${month === i + 1 ? 'fb-month--on' : ''}`}
                style={month === i + 1 ? { '--fc': color } : {}}
                onClick={() => { onChange(i + 1, year); setOpen(false) }}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   FILE CARD  (grid view)
   ════════════════════════════════════════════════════════════════════════════ */
function FileCard({ doc, idx, color }) {
  const [err, setErr] = useState(false)
  const ext    = getExt(doc.fileUrl)
  const hasImg = isImg(doc.fileUrl) && !err

  return (
    <div className="fc" style={{ animationDelay: `${idx * 50}ms` }}>
      <div className="fc__preview" style={{ background: hasImg ? '#000' : 'linear-gradient(135deg,var(--neutral-100) 0%,var(--neutral-200) 100%)' }}>
        {hasImg
          ? <img src={doc.fileUrl} alt="" onError={() => setErr(true)} className="fc__img"/>
          : <div className="fc__ph">
              {Ic.file(doc.fileUrl ? extColor(ext) : 'var(--neutral-300)')}
              {doc.fileUrl && (
                <span className="fc__ext" style={{ color: extColor(ext), background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                  {ext.toUpperCase()}
                </span>
              )}
            </div>
        }
        <div className="fc__overlay">
          {doc.fileUrl && <>
            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="fc__act">{Ic.eye}</a>
            <a href={doc.fileUrl} download className="fc__act" style={{ background: 'var(--primary-100)', borderColor: 'var(--primary-200)' }}>{Ic.dl}</a>
          </>}
        </div>
        {!doc.fileUrl && <span className="fc__nofile">No file attached</span>}
      </div>
      <div className="fc__meta">
        <p className="fc__name">{fileName(doc.fileUrl) || 'Untitled'}</p>
        <p className="fc__date">{fmtDate(doc.createdAt)} · {fmtTime(doc.createdAt)}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   FILE ROW  (list view)
   ════════════════════════════════════════════════════════════════════════════ */
function FileRow({ doc, idx, color }) {
  const ext = getExt(doc.fileUrl)
  return (
    <div className="fr" style={{ animationDelay: `${idx * 40}ms` }}>
      <div className="fr__icon">{Ic.file(doc.fileUrl ? extColor(ext) : 'var(--neutral-300)')}</div>
      <div className="fr__info">
        <p className="fr__name">{doc.fileUrl ? fileName(doc.fileUrl) : 'Untitled Document'}</p>
        <p className="fr__sub">{doc.fileUrl ? ext.toUpperCase() + ' file' : 'No attachment'}</p>
      </div>
      <span className="fr__date">{fmtDate(doc.createdAt)}</span>
      <div className="fr__actions">
        {doc.fileUrl
          ? <>
              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="fr__btn">{Ic.eye}</a>
              <a href={doc.fileUrl} download className="fr__btn" style={{ '--ac': color }}>{Ic.dl}</a>
            </>
          : <span className="fr__dash">—</span>
        }
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   DETAIL VIEW
   ════════════════════════════════════════════════════════════════════════════ */
function DetailView({ folder, onBack }) {
  const [docs,    setDocs]    = useState([])
  const [total,   setTotal]   = useState(null)
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [view,    setView]    = useState('grid')
  const [month,   setMonth]   = useState(null)           // null = no filter
  const [year,    setYear]    = useState(NOW.getFullYear())

  const totalPages = Math.ceil((total || 0) / LIMIT)

  /* reset page when filter changes */
  useEffect(() => { setPage(1) }, [month, year])

  /* fetch */
  useEffect(() => {
    setLoading(true)
    let url = `/${folder.key}/documents/user/${USER_ID}?page=${page}&limit=${LIMIT}`
    if (month !== null) url += `&month=${month}&year=${year}`
    axiosInstance.get(url)
      .then(r  => { setDocs(r.data.documents); setTotal(r.data.total ?? r.data.totalCount) })
      .catch(() => { const m = MOCK[folder.key]; setDocs(m.documents); setTotal(m.total) })
      .finally(() => setLoading(false))
  }, [page, month, year, folder.key])

  return (
    <div className="dv">
      {/* ── top row ── */}
      <div className="dv__topbar">
        <button className="back-btn" onClick={onBack}>{Ic.back} <span>All Documents</span></button>
        <div className="dv__controls">
          <div className="vt">
            <button className={`vt__btn ${view==='grid'?'vt__btn--on':''}`} onClick={()=>setView('grid')} title="Grid">{Ic.grid}</button>
            <button className={`vt__btn ${view==='list'?'vt__btn--on':''}`} onClick={()=>setView('list')} title="List">{Ic.list}</button>
          </div>
        </div>
      </div>

      {/* ── heading ── */}
      <div className="dv__heading">
        <div className="dv__heading-left">
          <span className="dv__folder-icon" style={{ background: 'var(--primary-50)' }}>{Ic.folder(folder.color)}</span>
          <div>
            <h2 className="dv__title">{folder.label}</h2>
            <p className="dv__sub">{folder.desc}</p>
          </div>
        </div>
        <FilterBar
          month={month} year={year} color={folder.color} total={total}
          onChange={(m, y) => { setMonth(m); setYear(y) }}
        />
      </div>

      {/* ── active filter strip ── */}
      {month !== null && (
        <div className="filter-strip" style={{ '--fc': folder.color, '--fb': 'var(--primary-50)', borderColor: 'var(--primary-100)' }}>
          <span className="filter-strip__dot" style={{ background: folder.color }}/>
          <span className="filter-strip__text">
            Showing results for <strong>{MONTHS[month - 1]} {year}</strong>
            {total !== null && <> — <strong>{total}</strong> document{total !== 1 ? 's' : ''} found</>}
          </span>
          <button className="filter-strip__clear" style={{ color: folder.color }} onClick={() => { setMonth(null); setYear(NOW.getFullYear()) }}>
            {Ic.x} Clear filter
          </button>
        </div>
      )}

      {/* ── content ── */}
      {loading ? (
        <div className={view === 'grid' ? 'file-grid' : 'file-list'}>
          {Array(LIMIT).fill(0).map((_, i) => (
            <div key={i} className={`skel ${view==='grid'?'skel--card':'skel--row'}`} style={{ animationDelay: `${i*55}ms` }}/>
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="empty">
          {Ic.empty}
          <p>{month !== null ? `No documents found for ${MONTHS[month-1]} ${year}` : 'No documents found'}</p>
          {month !== null && (
            <button className="empty__btn" style={{ '--fc': folder.color }} onClick={() => { setMonth(null); setYear(NOW.getFullYear()) }}>
              Show all documents
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="file-grid">
          {docs.map((d, i) => <FileCard key={i} doc={d} idx={i} color={folder.color}/>)}
        </div>
      ) : (
        <div className="file-list">
          {docs.map((d, i) => <FileRow key={i} doc={d} idx={i} color={folder.color}/>)}
        </div>
      )}

      {/* ── pagination ── */}
      {totalPages > 1 && (
        <div className="pager">
          <button className="pager__btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>{Ic.chevL}</button>
          <div className="pager__pages">
            {Array(totalPages).fill(0).map((_,i)=>(
              <button key={i} className={`pager__page ${page===i+1?'pager__page--on':''}`} style={page===i+1?{'--fc':folder.color}:{}} onClick={()=>setPage(i+1)}>{i+1}</button>
            ))}
          </div>
          <button className="pager__btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>{Ic.chevR}</button>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   FOLDER CARD  (home screen)
   ════════════════════════════════════════════════════════════════════════════ */
const FOLDERS = [
  { key:'mydocuments', label:'My Documents',      desc:'Your personal uploaded files', color: 'var(--color-primary)' },
  { key:'mycompany',   label:'Company Documents',  desc:'Shared files across your org', color: 'var(--color-primary)' },
]

function FolderCard({ folder, count, onClick }) {
  return (
    <button className="folder-card" onClick={onClick}>
      <div className="folder-card__icon">{Ic.folder(folder.color)}</div>
      <div className="folder-card__body">
        <h3 className="folder-card__label">{folder.label}</h3>
        <p className="folder-card__desc">{folder.desc}</p>
        <span className="folder-card__pill">{count !== null ? `${count} files` : '—'}</span>
      </div>
      <span className="folder-card__arrow">{Ic.chevR}</span>
      <span className="folder-card__glow"/>
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════════════════════════════════════ */
export default function Documents() {
  const [active, setActive] = useState(null)
  const [counts, setCounts] = useState({ mydocuments: null, mycompany: null })

  useEffect(() => {
    const load = async (key, seg) => {
      try {
        const r = await axiosInstance.get(`/${seg}/documents/user/${USER_ID}?page=1&limit=1`)
        setCounts(c => ({ ...c, [key]: r.data.total ?? r.data.totalCount }))
      } catch {
        setCounts(c => ({ ...c, [key]: MOCK[key].total }))
      }
    }
    load('mydocuments', 'mydocuments')
    load('mycompany',   'mycompany')
  }, [])

  return (
    <>
    <PageHeader
      title="Documents"
      subtitle="Choose a folder to browse your files"
    />
    <div className="docs-root">
      <style>{`
        .docs-root {
          font-family: var(--font-sans);
          background: var(--neutral-50);
          min-height: 100vh;
          padding: 40px 32px;
        }
        @media (max-width: 640px) {
          .docs-root {
            padding: 22px 16px;
          }
        }

        /* ── page header ── */
        .page-header {
          margin-bottom: 36px;
        }
        .page-header h1 {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: var(--neutral-900);
          margin: 0 0 5px;
          letter-spacing: -0.6px;
        }
        .page-header p {
          font-size: 14px;
          color: var(--neutral-500);
          margin: 0;
        }

        /* ── folder cards ── */
        .home-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 18px;
          max-width: 720px;
        }

        .folder-card {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 26px 22px;
          background: var(--neutral-0);
          border: 1.5px solid var(--neutral-200);
          border-radius: 22px;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-spring);
        }
        .folder-card:hover {
          transform: translateY(-1px) scale(1.000);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }
        .folder-card:hover .folder-card__glow {
          opacity: 1;
        }
        .folder-card__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 0% 0%, var(--color-primary) 0%, transparent 65%);
          opacity: 0;
          transition: 250ms;
          pointer-events: none;
          mix-blend-mode: overlay;
          border-radius: inherit;
        }
        .folder-card__icon {
          flex-shrink: 0;
        }
        .folder-card__body {
          flex: 1;
          min-width: 0;
        }
        .folder-card__label {
          font-size: 17px;
          font-weight: 700;
          color: var(--neutral-900);
          margin: 0 0 3px;
          letter-spacing: -0.3px;
        }
        .folder-card__desc {
          font-size: 13px;
          color: var(--neutral-500);
          margin: 0 0 11px;
          line-height: 1.4;
        }
        .folder-card__pill {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.2px;
          color: var(--color-primary);
          background: var(--primary-50);
          border: 1px solid var(--color-primary);
          padding: 3px 10px;
          border-radius: 999px;
        }
        .folder-card__arrow {
          color: var(--neutral-400);
          flex-shrink: 0;
          transition: 250ms;
        }
        .folder-card:hover .folder-card__arrow {
          color: var(--color-primary);
          transform: translateX(4px);
        }

        /* ── detail view ── */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .dv {
          animation: slideIn 0.26s ease both;
        }

        .dv__topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--neutral-600);
          background: var(--neutral-0);
          border: 1.5px solid var(--neutral-200);
          border-radius: 12px;
          padding: 8px 15px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: 200ms;
        }
        .back-btn:hover {
          color: var(--neutral-900);
          border-color: var(--neutral-400);
        }
        .dv__controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* view toggle */
        .vt {
          display: flex;
          background: var(--neutral-0);
          border: 1.5px solid var(--neutral-200);
          border-radius: 9px;
          padding: 3px;
          gap: 2px;
          box-shadow: var(--shadow-sm);
        }
        .vt__btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--neutral-500);
          cursor: pointer;
          transition: 180ms;
        }
        .vt__btn:hover {
          background: var(--neutral-100);
          color: var(--neutral-800);
        }
        .vt__btn--on {
          background: var(--color-primary) !important;
          color: var(--neutral-0) !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* heading */
        .dv__heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1.5px solid var(--neutral-200);
        }
        .dv__heading-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .dv__folder-icon {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dv__title {
          font-size: 21px;
          font-weight: 800;
          color: var(--neutral-900);
          margin: 0 0 3px;
          letter-spacing: -0.4px;
        }
        .dv__sub {
          font-size: 13px;
          color: var(--neutral-500);
          margin: 0;
        }

        /* ════════════════════════════════
           FILTER BAR
           ════════════════════════════════ */
        .fb-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .fb-trigger {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          color: var(--neutral-600);
          background: var(--neutral-0);
          border: 1.5px solid var(--neutral-200);
          border-radius: 12px;
          padding: 8px 13px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: 200ms;
          white-space: nowrap;
        }
        .fb-trigger:hover {
          border-color: var(--neutral-400);
          color: var(--neutral-900);
        }
        .fb-trigger--active {
          background: var(--primary-50);
          border-color: var(--primary-100);
          color: var(--neutral-900);
        }
        .fb-trigger__cal {
          display: flex;
          color: var(--neutral-400);
        }
        .fb-trigger__label {
          flex: 1;
        }
        .fb-trigger__count {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .fb-trigger__arrow {
          display: flex;
          color: var(--neutral-400);
          transition: 200ms;
        }
        .fb-trigger__clear {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.08);
          color: var(--neutral-600);
          cursor: pointer;
          padding: 0;
          transition: 150ms;
          flex-shrink: 0;
        }
        .fb-trigger__clear:hover {
          background: rgba(0, 0, 0, 0.15);
        }

        /* dropdown panel */
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fb-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 200;
          background: var(--neutral-0);
          border: 1.5px solid var(--neutral-200);
          border-radius: 18px;
          padding: 18px;
          width: 272px;
          box-shadow: var(--shadow-xl);
          animation: dropIn 0.18s ease both;
        }
        .fb-panel__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .fb-panel__title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: var(--neutral-400);
        }
        .fb-panel__reset {
          font-size: 12px;
          font-weight: 600;
          color: var(--error-600);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: 150ms;
        }
        .fb-panel__reset:hover {
          opacity: 0.75;
        }

        /* year row */
        .fb-year-row {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .fb-year {
          font-size: 12px;
          font-weight: 600;
          color: var(--neutral-700);
          background: var(--neutral-100);
          border: 1.5px solid transparent;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          transition: 150ms;
        }
        .fb-year:hover {
          background: var(--neutral-200);
        }
        .fb-year--on {
          background: var(--color-primary) !important;
          color: var(--neutral-0) !important;
          border-color: var(--color-primary) !important;
        }

        /* month grid */
        .fb-month-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
        }
        .fb-month {
          font-size: 12px;
          font-weight: 600;
          color: var(--neutral-700);
          background: var(--neutral-100);
          border: 1.5px solid transparent;
          border-radius: 8px;
          padding: 7px 0;
          cursor: pointer;
          transition: 150ms;
        }
        .fb-month:hover {
          background: var(--neutral-200);
          color: var(--neutral-900);
        }
        .fb-month--on {
          background: var(--color-primary) !important;
          color: var(--neutral-0) !important;
          border-color: var(--color-primary) !important;
        }

        /* ── active filter strip ── */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .filter-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          background: var(--primary-50);
          border: 1.5px solid var(--primary-100);
          border-radius: 10px;
          padding: 9px 14px;
          margin-bottom: 18px;
          animation: fadeUp 0.2s ease both;
        }
        .filter-strip__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .filter-strip__text {
          font-size: 13px;
          color: var(--neutral-600);
          flex: 1;
          min-width: 120px;
        }
        .filter-strip__text strong {
          color: var(--neutral-900);
          font-weight: 700;
        }
        .filter-strip__clear {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: 150ms;
          flex-shrink: 0;
          opacity: 0.8;
          padding: 0;
        }
        .filter-strip__clear:hover {
          opacity: 1;
        }

        /* ── file grid ── */
        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          gap: 13px;
          margin-bottom: 24px;
        }
        @media (max-width: 480px) {
          .file-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 9px;
          }
        }

        .fc {
          border-radius: 13px;
          overflow: hidden;
          border: 1.5px solid var(--neutral-200);
          background: var(--neutral-0);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-spring);
          animation: fadeUp 0.28s ease both;
        }
        .fc:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--neutral-300);
        }
        .fc__preview {
          position: relative;
          height: 112px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .fc__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fc__ph {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .fc__ext {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .fc__nofile {
          position: absolute;
          bottom: 7px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 9.5px;
          color: var(--neutral-400);
        }
        .fc__overlay {
          position: absolute;
          inset: 0;
          background: rgba(26, 26, 46, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          opacity: 0;
          transition: 190ms;
          backdrop-filter: blur(3px);
        }
        .fc:hover .fc__overlay {
          opacity: 1;
        }
        .fc__act {
          width: 33px;
          height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--neutral-0);
          text-decoration: none;
          background: rgba(255, 255, 255, 0.18);
          border: 1.5px solid rgba(255, 255, 255, 0.28);
          transition: 140ms;
        }
        .fc__meta {
          padding: 9px 11px;
        }
        .fc__name {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--neutral-800);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 2px;
        }
        .fc__date {
          font-size: 10px;
          color: var(--neutral-400);
          margin: 0;
        }

        /* ── file list ── */
        .file-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 24px;
        }
        .fr {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 15px;
          background: var(--neutral-0);
          border: 1.5px solid var(--neutral-100);
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          transition: 190ms;
          animation: fadeUp 0.26s ease both;
        }
        .fr:hover {
          border-color: var(--neutral-300);
          box-shadow: var(--shadow-md);
          background: var(--neutral-50);
        }
        .fr__icon {
          flex-shrink: 0;
        }
        .fr__info {
          flex: 1;
          min-width: 0;
        }
        .fr__name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--neutral-800);
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fr__sub {
          font-size: 11px;
          color: var(--neutral-400);
          margin: 0;
        }
        .fr__date {
          font-size: 11.5px;
          color: var(--neutral-500);
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 560px) {
          .fr__date {
            display: none;
          }
        }
        .fr__actions {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
        }
        .fr__btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: var(--neutral-100);
          color: var(--neutral-600);
          text-decoration: none;
          transition: 190ms;
        }
        .fr__btn:hover {
          background: var(--color-primary);
          color: var(--neutral-0);
        }
        .fr__dash {
          font-size: 16px;
          color: var(--neutral-300);
        }

        /* ── skeleton ── */
        @keyframes shimmer {
          0% {
            background-position: -500px 0;
          }
          100% {
            background-position: 500px 0;
          }
        }
        .skel {
          background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%);
          background-size: 500px 100%;
          animation: shimmer 1.3s infinite ease, fadeUp 0.26s ease both;
          border-radius: 13px;
        }
        .skel--card {
          height: 152px;
        }
        .skel--row {
          height: 54px;
          border-radius: 10px;
        }

        /* ── empty ── */
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 52px 0;
          color: var(--neutral-400);
        }
        .empty p {
          font-size: 13.5px;
          font-weight: 500;
          margin: 0;
          color: var(--neutral-500);
          text-align: center;
        }
        .empty__btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary);
          background: transparent;
          border: 1.5px solid var(--color-primary);
          border-radius: 999px;
          padding: 7px 18px;
          cursor: pointer;
          transition: 160ms;
          font-family: inherit;
        }
        .empty__btn:hover {
          background: var(--color-primary);
          color: var(--neutral-0);
        }

        /* ── pagination ── */
        .pager {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding-top: 18px;
          border-top: 1.5px solid var(--neutral-100);
        }
        .pager__btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--neutral-200);
          border-radius: 9px;
          background: var(--neutral-0);
          color: var(--neutral-600);
          cursor: pointer;
          transition: 190ms;
          box-shadow: var(--shadow-sm);
        }
        .pager__btn:hover:not(:disabled) {
          border-color: var(--neutral-400);
          color: var(--neutral-900);
        }
        .pager__btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .pager__pages {
          display: flex;
          gap: 3px;
        }
        .pager__page {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid transparent;
          border-radius: 9px;
          background: transparent;
          color: var(--neutral-600);
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: 190ms;
          font-family: inherit;
        }
        .pager__page:hover {
          background: var(--neutral-100);
        }
        .pager__page--on {
          background: var(--color-primary) !important;
          color: var(--neutral-0) !important;
          border-color: var(--color-primary) !important;
        }
      `}</style>

      {!active ? (
        <div className="home-grid">
          {FOLDERS.map(f => (
            <FolderCard key={f.key} folder={f} count={counts[f.key]} onClick={() => setActive(f)}/>
          ))}
        </div>
      ) : (
        <DetailView folder={active} onBack={() => setActive(null)}/>
      )}
    </div>
    </>
  )
}