/**
 * PageHeader.jsx  —  THE single shared header for every STAFF page.
 *
 * Props
 *   title        {string}              Page title               (required)
 *   subtitle     {string}              Muted sub-line           (optional)
 *   breadcrumbs  [{label,href}]        Trail above title        (optional)
 *   onBack       {fn}                  Shows ← button           (optional)
 *   onRefresh    {fn}                  Shows ↺ button           (optional)
 *   refreshing   {boolean}             Spins the ↺ icon         (optional)
 *   actions      {ReactNode}           Right-side slot          (optional)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell, ArrowLeft, RefreshCw, X, CheckCheck,
  ChevronRight, ArrowRight, AlertCircle,
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

/* ── design tokens ─────────────────────────────────────────────── */
const T = {
  H: 64,
  panelW: 420,
  border: '#ebebf3',
  white: '#ffffff',
  subtle: '#fafafa',
  n900: '#1a1a2e', n700: '#424260', n500: '#7878a0',
  n400: '#a8a8c0', n200: '#e4e4ec', n100: '#f1f1f5',
  primary:    'var(--color-primary)',
  primary50:  'var(--primary-50,  #fef2f2)',
  primary100: 'var(--primary-100, #fee2e2)',
  primary200: 'var(--primary-200, #fecaca)',
  success: '#059669', error: '#be123c',
  errorBg: '#fff1f2', errorBorder: '#ffe4e6',
};

/* ── inject CSS keyframes once ─────────────────────────────────── */
const STYLE_ID = '__sph__';
function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes sph-down  {from{transform:translateY(-5px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes sph-spin  {to{transform:rotate(360deg)}}
    @keyframes sph-pulse {0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes sph-bell  {
      0%,100%{transform:rotate(0)}   15%{transform:rotate(14deg)}
      30%{transform:rotate(-10deg)}  45%{transform:rotate(8deg)}
      60%{transform:rotate(-6deg)}   75%{transform:rotate(3deg)}
    }
    @keyframes sph-pop{0%{transform:scale(0)}70%{transform:scale(1.3)}100%{transform:scale(1)}}
    @media(max-width:480px){.sph-sub{display:none!important}}
    @media(max-width:380px){.sph-crumbs{display:none!important}}
    @media(max-width:767px){.sph-header{top:64px!important}}
  `;
  document.head.appendChild(s);
}

/* ── helpers ──────────────────────────────────────────────────── */
function ago(d) {
  if (!d) return '';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── notification type icon ───────────────────────────────────── */
function NIcon({ title = '', read }) {
  const c = read ? T.n400 : T.primary;
  const t = title.toLowerCase();
  if (t.includes('assign'))
    return <svg width="14" height="14" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
  if (t.includes('updat') || t.includes('amend') || t.includes('edit'))
    return <svg width="14" height="14" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
  if (t.includes('pay') || t.includes('amount'))
    return <svg width="14" height="14" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
  return <svg width="14" height="14" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
}

/* ── icon button ──────────────────────────────────────────────── */
function Btn({ children, label, onClick, disabled, active }) {
  const [hov, setHov] = useState(false);
  const on = active || hov;
  return (
    <button aria-label={label} title={label} onClick={onClick} disabled={disabled}
      onMouseEnter={() => { if (!disabled) setHov(true); }}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0, padding: 0,
        border: `1.5px solid ${on ? T.primary : T.n200}`,
        background: on ? T.primary50 : 'transparent',
        color: on ? T.primary : T.n500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .45 : 1,
        transition: 'border-color 140ms,background 140ms,color 140ms',
        fontFamily: 'inherit',
      }}>
      {children}
    </button>
  );
}

/* ── skeleton row ─────────────────────────────────────────────── */
function SkRow({ i }) {
  const d = i * 60;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: '1px solid #f5f5fa' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: T.n100, animation: `sph-pulse 1.5s ${d}ms ease-in-out infinite` }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 11, width: '52%', borderRadius: 6, background: T.n100, animation: `sph-pulse 1.5s ${d + 80}ms ease-in-out infinite` }} />
        <div style={{ height: 10, width: '82%', borderRadius: 6, background: T.n100, animation: `sph-pulse 1.5s ${d + 160}ms ease-in-out infinite` }} />
        <div style={{ height: 10, width: '32%', borderRadius: 6, background: T.n100, animation: `sph-pulse 1.5s ${d + 240}ms ease-in-out infinite` }} />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NOTIFICATION PANEL  (staff — uses employeeId)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function NotifPanel({ open, onClose, onCountChange }) {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [busy,       setBusy]       = useState(new Set());
  const [markingAll, setMarkingAll] = useState(false);
  const ref   = useRef(null);
  const empId = localStorage.getItem('employeeId');

  const load = useCallback(async () => {
    if (!empId) return;
    setLoading(true); setError(null);
    try {
      const r = await axiosInstance.get(`/notifications/employee/${empId}`);
      if (r.data?.success) {
        const list = r.data.data ?? [];
        setItems(list);
        onCountChange?.(list.filter(n => !n.isRead).length);
      }
    } catch { setError('Could not load notifications.'); }
    finally { setLoading(false); }
  }, [empId, onCountChange]);

  useEffect(() => { if (open) load(); }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const t = setTimeout(() => document.addEventListener('mousedown', h), 15);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h); };
  }, [open, onClose]);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  const markOne = async id => {
    if (busy.has(id)) return;
    setBusy(p => new Set([...p, id]));
    try {
      await axiosInstance.put(`/notifications/read/${id}`);
      setItems(p => {
        const next = p.map(n => n.notificationId === id ? { ...n, isRead: true } : n);
        onCountChange?.(next.filter(n => !n.isRead).length);
        return next;
      });
    } catch { /* silent */ }
    finally { setBusy(p => { const s = new Set(p); s.delete(id); return s; }); }
  };

  const markAll = async () => {
    const unread = items.filter(n => !n.isRead);
    if (!unread.length || markingAll) return;
    setMarkingAll(true);
    try {
      await Promise.all(unread.map(n => axiosInstance.put(`/notifications/read/${n.notificationId}`)));
      setItems(p => { const next = p.map(n => ({ ...n, isRead: true })); onCountChange?.(0); return next; });
    } catch { /* silent */ }
    finally { setMarkingAll(false); }
  };

  const unread = items.filter(n => !n.isRead).length;

  return (
    <>
      <div aria-hidden="true" onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(10,10,30,.30)',
          backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 260ms ease',
        }}
      />
      <div ref={ref} role="dialog" aria-label="Notifications" aria-modal="true"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: `min(${T.panelW}px,100vw)`, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          background: T.white,
          boxShadow: '-6px 0 48px rgba(0,0,0,.13)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(.32,.72,0,1)',
          willChange: 'transform',
        }}>

        {/* panel header */}
        <div style={{
          height: T.H, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingInline: 20, borderBottom: `1px solid ${T.border}`,
          background: `linear-gradient(to right,${T.primary50},${T.white})`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: T.primary100, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.n900, lineHeight: 1.2 }}>Notifications</p>
              <p style={{ margin: 0, fontSize: 11, color: T.n400, marginTop: 1 }}>
                {loading ? 'Refreshing…' : unread > 0 ? `${unread} unread` : 'All caught up'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Btn label="Refresh" onClick={load} disabled={loading}>
              <RefreshCw size={13} style={loading ? { animation: 'sph-spin .7s linear infinite' } : {}} />
            </Btn>
            {unread > 0 && (
              <button onClick={markAll} disabled={markingAll}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${T.primary200}`, background: T.primary50, color: T.primary, fontSize: 11, fontWeight: 700, fontFamily: 'inherit', opacity: markingAll ? .5 : 1, transition: 'opacity 140ms' }}>
                <CheckCheck size={11} /> Mark all read
              </button>
            )}
            <Btn label="Close" onClick={onClose}><X size={14} /></Btn>
          </div>
        </div>

        {/* panel body */}
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          {error && (
            <div style={{ margin: 16, padding: '12px 14px', borderRadius: 10, background: T.errorBg, border: `1px solid ${T.errorBorder}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={14} style={{ color: T.error, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: T.error, flex: 1 }}>{error}</p>
              <button onClick={load} style={{ background: 'none', border: 'none', color: T.error, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>
            </div>
          )}
          {loading && items.length === 0 && [...Array(6)].map((_, i) => <SkRow key={i} i={i} />)}
          {!loading && !error && items.length === 0 && (
            <div style={{ minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: T.primary50, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={28} />
              </div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.n700 }}>All caught up!</p>
              <p style={{ margin: 0, fontSize: 13, color: T.n400, lineHeight: 1.55 }}>No notifications right now.</p>
            </div>
          )}
          {!loading && items.map((n, i) => {
            const isBusy = busy.has(n.notificationId);
            return (
              <div key={n.notificationId}
                style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: i < items.length - 1 ? '1px solid #f5f5fa' : 'none', background: n.isRead ? T.white : T.primary50, position: 'relative', transition: 'background 140ms' }}
                onMouseEnter={e => { if (n.isRead) e.currentTarget.style.background = T.subtle; }}
                onMouseLeave={e => { e.currentTarget.style.background = n.isRead ? T.white : T.primary50; }}>
                {!n.isRead && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '0 2px 2px 0', background: T.primary }} />}
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: n.isRead ? T.n100 : T.primary100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <NIcon title={n.title} read={n.isRead} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 3 }}>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4, fontWeight: n.isRead ? 400 : 700, color: T.n900 }}>{n.title}</p>
                    <span style={{ fontSize: 10, color: T.n400, flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap' }}>{ago(n.createdAt)}</span>
                  </div>
                  {n.description && <p style={{ margin: 0, fontSize: 12, color: T.n500, lineHeight: 1.55 }}>{n.description}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    {n.redirectUrl && (
                      <a href={n.redirectUrl} onClick={() => !n.isRead && markOne(n.notificationId)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: T.primary, textDecoration: 'none' }}>
                        View details <ArrowRight size={10} />
                      </a>
                    )}
                    {!n.isRead && (
                      <button onClick={() => markOne(n.notificationId)} disabled={isBusy}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, fontSize: 11, color: T.n400, fontFamily: 'inherit', cursor: isBusy ? 'not-allowed' : 'pointer', opacity: isBusy ? .5 : 1, transition: 'color 140ms' }}
                        onMouseEnter={e => { if (!isBusy) e.currentTarget.style.color = T.primary; }}
                        onMouseLeave={e => { e.currentTarget.style.color = T.n400; }}>
                        {isBusy ? <RefreshCw size={10} style={{ animation: 'sph-spin .7s linear infinite' }} /> : <CheckCheck size={10} />}
                        Mark as read
                      </button>
                    )}
                    {n.isRead && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.success }}>
                        <CheckCheck size={10} /> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* panel footer */}
        {items.length > 0 && (
          <div style={{ borderTop: `1px solid ${T.border}`, flexShrink: 0, padding: '10px 20px', background: T.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ margin: 0, fontSize: 11, color: T.n400 }}>
              {items.length} notification{items.length !== 1 ? 's' : ''}{unread > 0 ? ` · ${unread} unread` : ' · all read'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STAFF PAGE HEADER  ← the only export
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PageHeader({ title, subtitle, breadcrumbs, onBack, onRefresh, refreshing = false, actions }) {
  useEffect(injectStyles, []);

  const [notifOpen, setNotifOpen] = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [bellAnim,  setBellAnim]  = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('employeeId');
    if (!id) return;
    axiosInstance.get(`/notifications/employee/${id}`)
      .then(r => { if (r.data?.success) setUnread((r.data.data ?? []).filter(n => !n.isRead).length); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (unread > 0) { setBellAnim(true); const t = setTimeout(() => setBellAnim(false), 850); return () => clearTimeout(t); }
  }, [unread]);

  const hasCrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;

  return (
    <>
      <header role="banner" className="sph-header"
        style={{
          height: T.H, background: T.white,
          borderBottom: `1px solid ${T.border}`,
          boxShadow: '0 1px 0 rgba(0,0,0,.03),0 2px 14px -2px rgba(0,0,0,.07)',
          position: 'sticky', top: 0, zIndex: 29,
          animation: 'sph-down .28s ease both',
        }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', height: '100%', display: 'flex', alignItems: 'center', paddingInline: 20, gap: 10 }}>

        {onBack && <Btn label="Go back" onClick={onBack}><ArrowLeft size={15} /></Btn>}

        <div style={{ flex: 1, minWidth: 0 }}>
          {hasCrumbs && (
            <nav aria-label="Breadcrumb" className="sph-crumbs"
              style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1, overflow: 'hidden' }}>
              {breadcrumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <a href={c.href}
                    style={{ fontSize: 10, fontWeight: 600, color: T.n400, textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '0.02em', transition: 'color 140ms' }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.primary; }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.n400; }}>
                    {c.label}
                  </a>
                  <ChevronRight size={9} style={{ color: '#d1d1de', flexShrink: 0 }} />
                </React.Fragment>
              ))}
            </nav>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, overflow: 'hidden' }}>
            <h1 style={{ margin: 0, fontSize: (subtitle || hasCrumbs) ? 15 : 17, fontWeight: 700, color: T.n900, letterSpacing: '-0.022em', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1 }}>
              {title}
            </h1>
            {subtitle && (
              <span className="sph-sub"
                style={{ fontSize: 12, color: T.n400, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1 }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{actions}</div>}

        {onRefresh && (
          <Btn label={refreshing ? 'Refreshing…' : 'Refresh'} onClick={onRefresh} disabled={refreshing}>
            <RefreshCw size={14} style={refreshing ? { animation: 'sph-spin .7s linear infinite' } : {}} />
          </Btn>
        )}

        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Btn label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`} onClick={() => setNotifOpen(v => !v)} active={notifOpen}>
            <Bell size={15} style={bellAnim ? { animation: 'sph-bell .82s ease' } : {}} />
          </Btn>
          {unread > 0 && (
            <span aria-label={`${unread} unread notifications`}
              style={{ position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 999, background: T.primary, color: '#fff', fontSize: unread > 9 ? 8 : 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 3, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.20)', pointerEvents: 'none', animation: 'sph-pop .3s cubic-bezier(.34,1.56,.64,1) forwards' }}>
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </div>
        </div>
      </header>

      <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} onCountChange={setUnread} />
    </>
  );
}
