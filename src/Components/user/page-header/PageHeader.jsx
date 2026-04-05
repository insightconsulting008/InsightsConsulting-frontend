/**
 * PageHeader.jsx  —  THE single shared header for every USER page.
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
  ChevronRight, ExternalLink, AlertCircle, CheckCircle,
  FileText, Package, CreditCard,
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

/* ─── design tokens ────────────────────────────────────────────── */
const P = {
  primary: 'var(--color-primary)',
  p50:     'var(--primary-50,  #fef2f2)',
  p100:    'var(--primary-100, #fee2e2)',
  p200:    'var(--primary-200, #fecaca)',
};
const C = {
  white:  '#ffffff',
  border: '#e8e8f0',
  n900:   '#1a1a2e',
  n700:   '#424260',
  n500:   '#7878a0',
  n400:   '#a8a8c0',
  n200:   '#e4e4ec',
  n100:   '#f1f1f5',
  n50:    '#f8f8fa',
  ok:     '#059669',
  errTxt: '#be123c',
  errBg:  '#fff1f2',
  errBdr: '#fecaca',
};
const H = 64;

/* ─── inject keyframes once ─────────────────────────────────────── */
const STYLE_ID = '__uph2__';
function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes uph-slide { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
    @keyframes uph-spin   { to{transform:rotate(360deg)} }
    @keyframes uph-pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes uph-pop    { 0%{transform:scale(0)} 65%{transform:scale(1.3)} 100%{transform:scale(1)} }
    @keyframes uph-bell   {
      0%,100%{transform:rotate(0)} 20%{transform:rotate(14deg)}
      40%{transform:rotate(-10deg)} 60%{transform:rotate(6deg)} 80%{transform:rotate(-3deg)}
    }
  `;
  document.head.appendChild(s);
}

/* ─── helpers ───────────────────────────────────────────────────── */
function timeAgo(d) {
  if (!d) return '';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtClock(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function fmtDateLabel(d) {
  if (!d) return '';
  const dt    = new Date(d);
  const today = new Date();
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  const same  = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();
  if (same(dt, today)) return 'Today';
  if (same(dt, yest))  return 'Yesterday';
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function groupByDate(items) {
  const groups = [];
  const seen   = {};
  items.forEach(n => {
    const label = fmtDateLabel(n.createdAt);
    if (!seen[label]) { seen[label] = true; groups.push({ label, items: [] }); }
    groups[groups.length - 1].items.push(n);
  });
  return groups;
}

/* ─── notification type → icon + colour ─────────────────────────── */
function notifMeta(title = '') {
  const t = title.toLowerCase();
  if (t.includes('document') || t.includes('upload'))
    return { Icon: FileText,  bg: P.p50,     iconColor: P.primary };
  if (t.includes('service')  || t.includes('order') || t.includes('assign'))
    return { Icon: Package,   bg: '#eff6ff',  iconColor: '#3b82f6' };
  if (t.includes('pay')      || t.includes('amount'))
    return { Icon: CreditCard, bg: '#f0fdf4', iconColor: '#16a34a' };
  return { Icon: Bell, bg: C.n100, iconColor: C.n400 };
}

/* ─── header icon button ────────────────────────────────────────── */
function IconBtn({ children, label, onClick, disabled, active }) {
  const [hov, setHov] = useState(false);
  const lit = active || hov;
  return (
    <button
      aria-label={label} title={label} onClick={onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: 9, padding: 0, flexShrink: 0,
        border:     `1.5px solid ${lit ? P.primary : C.n200}`,
        background:  lit ? P.p50 : 'transparent',
        color:       lit ? P.primary : C.n500,
        display:    'flex', alignItems: 'center', justifyContent: 'center',
        cursor:      disabled ? 'not-allowed' : 'pointer',
        opacity:     disabled ? 0.45 : 1,
        transition: 'border-color 130ms, background 130ms, color 130ms',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

/* ─── skeleton row ─────────────────────────────────────────────── */
function SkRow({ delay = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: C.n100, animation: `uph-pulse 1.4s ${delay}ms ease-in-out infinite` }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 11, width: '42%', borderRadius: 5, background: C.n100, animation: `uph-pulse 1.4s ${delay + 80}ms ease-in-out infinite` }} />
        <div style={{ height: 10, width: '72%', borderRadius: 5, background: C.n100, animation: `uph-pulse 1.4s ${delay + 160}ms ease-in-out infinite` }} />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NOTIFICATION ITEM — isolated component so props are always fresh,
   hover handlers never use stale closures.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function NotifItem({ notif, onMarkRead, isBusy, isLast }) {
  const isUnread = !notif.isRead;
  const { Icon, bg, iconColor } = notifMeta(notif.title);

  return (
    <div style={{
      display: 'flex', gap: 12, padding: '13px 16px',
      borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
      background: isUnread ? P.p50 : C.white,
      position: 'relative',
    }}>
      {/* unread left accent */}
      {isUnread && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: P.primary, borderRadius: '0 2px 2px 0',
        }} />
      )}

      {/* icon bubble */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: isUnread ? bg : C.n100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: isUnread ? iconColor : C.n400 }} />
      </div>

      {/* body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* title + time — no bottom margin, description sits flush below */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 0 }}>
          <p style={{
            margin: 0, fontSize: 13, lineHeight: 1.4,
            fontWeight: isUnread ? 700 : 500,
            color: isUnread ? C.n900 : C.n700,
          }}>
            {notif.title}
          </p>
          {/* relative + clock time */}
          <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 48 }}>
            <p style={{ margin: 0, fontSize: 10, color: C.n500, whiteSpace: 'nowrap' }}>
              {timeAgo(notif.createdAt)}
            </p>
            <p style={{ margin: '1px 0 0', fontSize: 10, color: C.n400, whiteSpace: 'nowrap' }}>
              {fmtClock(notif.createdAt)}
            </p>
          </div>
        </div>

        {/* description — 2px top gap only, flush to title */}
        {notif.description && (
          <p style={{ margin: '2px 0 7px', fontSize: 12, color: C.n500, lineHeight: 1.55 }}>
            {notif.description}
          </p>
        )}

        {/* actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: notif.description ? 0 : 6 }}>
          {notif.redirectUrl && (
            <a
              href={notif.redirectUrl}
              onClick={() => isUnread && onMarkRead(notif.notificationId)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 700, color: P.primary, textDecoration: 'none',
              }}
            >
              View <ExternalLink size={10} />
            </a>
          )}

          {isUnread ? (
            <button
              onClick={() => onMarkRead(notif.notificationId)}
              disabled={isBusy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', padding: 0,
                fontSize: 11, fontWeight: 600, color: C.n400,
                cursor: isBusy ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              {isBusy
                ? <RefreshCw size={10} style={{ animation: 'uph-spin .6s linear infinite' }} />
                : <CheckCheck size={10} />}
              {isBusy ? 'Marking…' : 'Mark read'}
            </button>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.ok, fontWeight: 600 }}>
              <CheckCircle size={10} /> Read
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NOTIFICATION PANEL  (user — uses userId)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function NotifPanel({ open, onClose, onCountChange }) {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [busyIds,    setBusyIds]    = useState(new Set());
  const [markingAll, setMarkingAll] = useState(false);
  const [tab,        setTab]        = useState('all');
  const panelRef = useRef(null);
  const userId   = localStorage.getItem('userId');

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true); setError(null);
    try {
      const r = await axiosInstance.get(`/notifications/user/${userId}`);
      if (r.data?.success) {
        const list = r.data.data ?? [];
        setItems(list);
        onCountChange?.(list.filter(n => !n.isRead).length);
      }
    } catch { setError('Could not load notifications.'); }
    finally   { setLoading(false); }
  }, [userId, onCountChange]);

  useEffect(() => { if (open) load(); }, [open, load]);

  /* outside click + Escape */
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    const t  = setTimeout(() => document.addEventListener('mousedown', fn), 20);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', fn); };
  }, [open, onClose]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, onClose]);

  /* mark single — fresh state update, no stale closures */
  const markOne = useCallback(async (id) => {
    if (busyIds.has(id)) return;
    setBusyIds(prev => new Set([...prev, id]));
    try {
      await axiosInstance.put(`/notifications/read/${id}`);
      setItems(prev => {
        const next = prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n);
        onCountChange?.(next.filter(n => !n.isRead).length);
        return next;
      });
    } catch { /* silent */ }
    finally { setBusyIds(prev => { const s = new Set(prev); s.delete(id); return s; }); }
  }, [busyIds, onCountChange]);

  /* mark all */
  const markAll = useCallback(async () => {
    const unread = items.filter(n => !n.isRead);
    if (!unread.length || markingAll) return;
    setMarkingAll(true);
    try {
      await Promise.all(unread.map(n => axiosInstance.put(`/notifications/read/${n.notificationId}`)));
      setItems(prev => { const next = prev.map(n => ({ ...n, isRead: true })); onCountChange?.(0); return next; });
    } catch { await load(); }   /* resync on failure */
    finally { setMarkingAll(false); }
  }, [items, markingAll, onCountChange, load]);

  const unreadCount = items.filter(n => !n.isRead).length;
  const visible     = tab === 'unread' ? items.filter(n => !n.isRead) : items;
  const groups      = groupByDate(visible);

  return (
    <>
      {/* backdrop */}
      <div
        aria-hidden="true" onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(0,0,0,.22)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 240ms ease',
        }}
      />

      {/* panel
          SCROLL FIX: height:100dvh + overflow:hidden on panel.
          Only the body section (flex:1, overflow-y:auto) scrolls.
      */}
      <div
        ref={panelRef}
        role="dialog" aria-label="Notifications" aria-modal="true"
        style={{
          position:      'fixed',
          top:           0, right: 0,
          height:        '100dvh',           /* exact viewport, no overflow */
          width:         'min(400px, 100vw)', /* full-width on mobile */
          zIndex:        50,
          display:       'flex',
          flexDirection: 'column',           /* header | tabs | body | footer */
          overflow:      'hidden',           /* panel itself never scrolls */
          background:    C.white,
          boxShadow:     '-4px 0 32px rgba(0,0,0,.12)',
          transform:     open ? 'translateX(0)' : 'translateX(100%)',
          transition:    'transform 280ms cubic-bezier(.32,.72,0,1)',
          willChange:    'transform',
        }}
      >
        {/* ── 1. HEADER ── */}
        <div style={{
          flexShrink: 0, height: H,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingInline: 16, gap: 8,
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${P.p50} 0%, ${C.white} 70%)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: P.p100, color: P.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={15} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.n900, lineHeight: 1.2 }}>
                Notifications
              </p>
              <p style={{ margin: 0, fontSize: 11, color: C.n500, marginTop: 1 }}>
                {loading ? 'Loading…' : unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconBtn label="Refresh" onClick={load} disabled={loading}>
              <RefreshCw size={13} style={loading ? { animation: 'uph-spin .7s linear infinite' } : {}} />
            </IconBtn>
            {unreadCount > 0 && (
              <button onClick={markAll} disabled={markingAll} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 8,
                border: `1.5px solid ${P.p200}`, background: P.p50, color: P.primary,
                fontSize: 11, fontWeight: 700,
                cursor: markingAll ? 'not-allowed' : 'pointer',
                opacity: markingAll ? 0.5 : 1,
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>
                {markingAll
                  ? <RefreshCw size={10} style={{ animation: 'uph-spin .7s linear infinite' }} />
                  : <CheckCheck size={10} />}
                Mark all
              </button>
            )}
            <IconBtn label="Close" onClick={onClose}><X size={14} /></IconBtn>
          </div>
        </div>

        {/* ── 2. TABS ── */}
        <div style={{
          flexShrink: 0,
          display: 'flex', gap: 2,
          paddingInline: 12, paddingTop: 6,
          borderBottom: `1px solid ${C.border}`,
          background: C.white,
        }}>
          {[
            { key: 'all',    label: 'All',    count: items.length },
            { key: 'unread', label: 'Unread', count: unreadCount  },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '6px 14px', border: 'none', background: 'none',
              fontSize: 12, fontWeight: tab === key ? 700 : 500,
              color: tab === key ? P.primary : C.n500,
              borderBottom: tab === key ? `2px solid ${P.primary}` : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'color 130ms, border-color 130ms',
            }}>
              {label}{' '}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 20,
                background: tab === key ? P.p100 : C.n100,
                color: tab === key ? P.primary : C.n500,
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── 3. SCROLLABLE BODY — flex:1 + overflow-y:auto ── */}
        <div style={{
          flex:                    1,
          overflowY:               'auto',
          overflowX:               'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior:      'contain',
        }}>
          {/* error */}
          {error && (
            <div style={{
              margin: 12, padding: '11px 14px', borderRadius: 10,
              background: C.errBg, border: `1px solid ${C.errBdr}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <AlertCircle size={14} style={{ color: C.errTxt, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: C.errTxt, flex: 1 }}>{error}</p>
              <button onClick={load} style={{
                background: 'none', border: 'none', color: C.errTxt,
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Retry</button>
            </div>
          )}

          {/* skeleton */}
          {loading && items.length === 0 &&
            [...Array(5)].map((_, i) => <SkRow key={i} delay={i * 60} />)}

          {/* empty */}
          {!loading && !error && visible.length === 0 && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px 24px', gap: 12, textAlign: 'center',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: P.p50, color: P.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bell size={22} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.n700 }}>
                  {tab === 'unread' ? 'No unread notifications' : 'All caught up!'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.n400, lineHeight: 1.5 }}>
                  {tab === 'unread' ? 'Switch to All to see past notifications.' : 'Nothing here yet.'}
                </p>
              </div>
            </div>
          )}

          {/* grouped list — top space between date sections */}
          {!loading && !error && groups.map((group, gi) => (
            <div key={group.label}>
              {/* sticky date label — gap above every group after the first */}
              <div style={{
                position: 'sticky', top: 0, zIndex: 1,
                padding: '6px 16px',
                marginTop: gi === 0 ? 0 : 10,
                background: C.n50,
                borderTop:    gi === 0 ? 'none' : `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
              }}>
                <p style={{
                  margin: 0, fontSize: 10, fontWeight: 700,
                  color: C.n500, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {group.label}
                </p>
              </div>

              {group.items.map((n, i) => (
                <NotifItem
                  key={n.notificationId}
                  notif={n}
                  onMarkRead={markOne}
                  isBusy={busyIds.has(n.notificationId)}
                  isLast={i === group.items.length - 1}
                />
              ))}
            </div>
          ))}
        </div>

        {/* ── 4. FOOTER ── */}
        {items.length > 0 && (
          <div style={{
            flexShrink: 0,
            borderTop: `1px solid ${C.border}`,
            padding: '9px 16px',
            background: C.n50,
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: C.n400 }}>
              {items.length} notification{items.length !== 1 ? 's' : ''}
              {unreadCount > 0 ? ` · ${unreadCount} unread` : ' · all read'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   USER PAGE HEADER — only export
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PageHeader({
  title, subtitle, breadcrumbs, onBack, onRefresh, refreshing = false, actions,
}) {
  useEffect(injectStyles, []);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [bellAnim,  setBellAnim]  = useState(false);

  /* initial badge count */
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return;
    axiosInstance.get(`/notifications/user/${id}`)
      .then(r => { if (r.data?.success) setUnread((r.data.data ?? []).filter(n => !n.isRead).length); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (unread > 0) {
      setBellAnim(true);
      const t = setTimeout(() => setBellAnim(false), 900);
      return () => clearTimeout(t);
    }
  }, [unread]);

  const hasCrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;

  return (
    <>
      <header role="banner" style={{
        height: H, background: C.white,
        borderBottom: `1px solid ${C.border}`,
        boxShadow: '0 1px 0 rgba(0,0,0,.03), 0 2px 12px -2px rgba(0,0,0,.07)',
        position: 'sticky', top: 0, zIndex: 29,
        animation: 'uph-slide .25s ease both',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', width: '100%', height: '100%',
          display: 'flex', alignItems: 'center',
          paddingInline: 'clamp(12px, 3vw, 24px)', gap: 8, boxSizing: 'border-box',
        }}>

          {onBack && <IconBtn label="Go back" onClick={onBack}><ArrowLeft size={15} /></IconBtn>}

          {/* title + breadcrumbs */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {hasCrumbs && (
              <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1, overflow: 'hidden' }}>
                {breadcrumbs.map((c, i) => (
                  <React.Fragment key={i}>
                    <a href={c.href} style={{
                      fontSize: 10, fontWeight: 600, color: C.n400,
                      textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '0.03em',
                    }}>
                      {c.label}
                    </a>
                    {i < breadcrumbs.length - 1 && (
                      <ChevronRight size={9} style={{ color: C.n200, flexShrink: 0 }} />
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, overflow: 'hidden' }}>
              <h1 style={{
                margin: 0,
                fontSize: subtitle || hasCrumbs ? 15 : 17,
                fontWeight: 700, color: C.n900,
                letterSpacing: '-0.02em', lineHeight: 1.25,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {title}
              </h1>
              {subtitle && (
                <span style={{
                  fontSize: 12, color: C.n400, fontWeight: 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1,
                }}>
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {actions}
            </div>
          )}

          {onRefresh && (
            <IconBtn label={refreshing ? 'Refreshing…' : 'Refresh'} onClick={onRefresh} disabled={refreshing}>
              <RefreshCw size={14} style={refreshing ? { animation: 'uph-spin .7s linear infinite' } : {}} />
            </IconBtn>
          )}

          {/* bell + badge */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <IconBtn
              label={`Notifications${unread > 0 ? ` (${unread})` : ''}`}
              onClick={() => setNotifOpen(v => !v)}
              active={notifOpen}
            >
              <Bell size={15} style={bellAnim ? { animation: 'uph-bell .85s ease' } : {}} />
            </IconBtn>
            {unread > 0 && (
              <span aria-label={`${unread} unread`} style={{
                position: 'absolute', top: -3, right: -3,
                minWidth: 16, height: 16, borderRadius: 999,
                background: P.primary, color: '#fff',
                fontSize: unread > 9 ? 8 : 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingInline: 3, border: '2px solid #fff',
                boxShadow: '0 1px 4px rgba(0,0,0,.20)', pointerEvents: 'none',
                animation: 'uph-pop .3s cubic-bezier(.34,1.56,.64,1) forwards',
              }}>
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