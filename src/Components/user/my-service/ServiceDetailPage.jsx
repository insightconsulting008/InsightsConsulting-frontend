import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';
import PageHeader from '../page-header/PageHeader';
import {
  ChevronLeft, RefreshCw, X, Check, Upload, Phone,
  FileText, Clock, Calendar, Activity, CheckCircle2, AlertTriangle,
  BellRing, Lock, ChevronDown, ChevronUp, AlertCircle,
  File, ImageIcon, FileSpreadsheet, FileClock, FileCheck, FileX,
  Eye, FileUp, Paperclip, Type, ClipboardList,
  Zap, Package, Layers, UserCheck, ArrowUpFromLine,
  Sparkles, HelpCircle, Info, TrendingUp, CalendarDays, Hash,
  Timer, Repeat2, LayoutGrid, BadgeCheck, XCircle, Search,
  SendHorizonal, MessageSquareWarning, Inbox, BarChart3,
  Star, ArrowRight, CheckCheck, ShieldAlert, Hourglass,
  FolderOpen, ArrowUpCircle, ThumbsUp, ScanSearch,
} from 'lucide-react';

// ─── CONFIGS ──────────────────────────────────────────────────────────────────
const DOC_STATUS = {
  PENDING: {
    label: 'Upload needed',
    sublabel: 'Waiting for you to send this',
    StatusIcon: Inbox,
    FileIcon: FileClock,
    iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
    border: 'border-amber-300', headerBg: 'bg-amber-50',
    pillBg: 'bg-amber-100', pillText: 'text-amber-700',
  },
  UPLOADED: {
    label: 'Being checked',
    sublabel: 'Our team is reviewing this now',
    StatusIcon: ScanSearch,
    FileIcon: FileUp,
    iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
    border: 'border-blue-200', headerBg: 'bg-blue-50',
    pillBg: 'bg-blue-100', pillText: 'text-blue-700',
  },
  VERIFIED: {
    label: 'Approved',
    sublabel: 'Looks great — all good!',
    StatusIcon: BadgeCheck,
    FileIcon: FileCheck,
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    border: 'border-emerald-200', headerBg: 'bg-emerald-50',
    pillBg: 'bg-emerald-100', pillText: 'text-emerald-700',
  },
  REJECTED: {
    label: 'Please re-upload',
    sublabel: 'There was a problem — see note below',
    StatusIcon: XCircle,
    FileIcon: FileX,
    iconBg: 'bg-rose-100', iconColor: 'text-rose-600',
    border: 'border-rose-300', headerBg: 'bg-rose-50',
    pillBg: 'bg-rose-100', pillText: 'text-rose-700',
  },
};

const SVC_STATUS = {
  NOT_STARTED: { text: 'text-slate-600', bg: 'bg-slate-100', label: 'Not Started Yet', Icon: Hourglass },
  IN_PROGRESS: { text: 'text-blue-700',    bg: 'bg-blue-100',    label: 'Work in Progress', Icon: Activity },
  COMPLETED:   { text: 'text-emerald-700', bg: 'bg-emerald-100', label: 'All Done',           Icon: CheckCheck },
  CANCELLED:   { text: 'text-rose-700',    bg: 'bg-rose-100',    label: 'Cancelled',          Icon: XCircle },
  ON_HOLD:     { text: 'text-orange-700',  bg: 'bg-orange-100',  label: 'Paused for Now',     Icon: AlertTriangle },
};

const STEP_STATUS = {
  COMPLETED:   { dotBg: 'bg-emerald-500', ring: 'ring-4 ring-emerald-100', line: 'bg-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: 'Done',           DotIcon: Check },
  PROCESSING:  { dotBg: 'bg-blue-500',    ring: 'ring-4 ring-blue-100',    line: 'bg-blue-100',    badge: 'bg-blue-100 text-blue-700',       label: 'Happening now',  DotIcon: Activity },
  IN_PROGRESS: { dotBg: 'bg-blue-500',    ring: 'ring-4 ring-blue-100',    line: 'bg-blue-100',    badge: 'bg-blue-100 text-blue-700',       label: 'Happening now',  DotIcon: Activity },
  ERROR:       { dotBg: 'bg-rose-500',    ring: 'ring-4 ring-rose-100',    line: 'bg-rose-100',    badge: 'bg-rose-100 text-rose-700',       label: 'Needs your help',DotIcon: AlertCircle },
  PENDING:     { dotBg: 'bg-gray-300',    ring: 'ring-4 ring-gray-100',    line: 'bg-gray-100',    badge: 'bg-gray-100 text-gray-500',       label: 'Coming up next', DotIcon: Clock },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d, full) =>
  !d ? '—' : new Date(d).toLocaleDateString('en-IN', full
    ? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' });

const getExt = url => url?.split('.').pop()?.toLowerCase() || '';

const FileTypeIcon = ({ url, size = 14 }) => {
  const ext = getExt(url);
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return <ImageIcon size={size} className="text-rose-400" />;
  if (ext === 'pdf')                                          return <FileText  size={size} className="text-red-500" />;
  if (['doc','docx'].includes(ext))                          return <FileText  size={size} className="text-blue-500" />;
  if (['xls','xlsx'].includes(ext))                          return <FileSpreadsheet size={size} className="text-green-500" />;
  return <File size={size} className="text-gray-400" />;
};

// ─── LAYOUT ATOMS ─────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${className}`}
    style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
  >
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, iconBg = 'bg-primary/10', iconColor = 'text-primary', title, subtitle, right }) => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gray-50/60">
    <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={15} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-extrabold text-sm text-gray-900 leading-none">{title}</p>
      {subtitle && <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-tight">{subtitle}</p>}
    </div>
    {right}
  </div>
);

const SvcBadge = ({ status }) => {
  const c = SVC_STATUS[status] || SVC_STATUS.NOT_STARTED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      <c.Icon size={11} className="flex-shrink-0" />
      {c.label}
    </span>
  );
};

// ─── TEAM / YOU BLOCKS ────────────────────────────────────────────────────────
const TeamBlock = ({ label = 'From our team', children }) => (
  <div className="rounded-xl border border-purple-200 overflow-hidden">
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100">
      <UserCheck size={11} className="text-purple-600 flex-shrink-0" />
      <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest">{label}</span>
    </div>
    <div className="px-3 py-2.5 bg-purple-50">{children}</div>
  </div>
);

const YouBlock = ({ label = 'What you sent', children }) => (
  <div className="rounded-xl border border-sky-200 overflow-hidden">
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100">
      <ArrowUpFromLine size={11} className="text-sky-600 flex-shrink-0" />
      <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-widest">{label}</span>
    </div>
    <div className="px-3 py-2.5 bg-sky-50">{children}</div>
  </div>
);

// ─── PROGRESS RING ────────────────────────────────────────────────────────────
const ProgressRing = ({ pct, size = 72 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={pct === 100 ? '#10b981' : 'var(--color-primary, #6869AC)'}
        strokeWidth={7} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
      />
    </svg>
  );
};

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
const UploadModal = ({ doc, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');
  const isText = doc.inputType === 'TEXT';

  const submit = async () => {
    if (!isText && !file)        { setErr('Please pick a file first'); return; }
    if (isText && !text.trim())  { setErr('Please write something first'); return; }
    setBusy(true); setErr('');
    try {
      let r;
      if (!isText) {
        const fd = new FormData(); fd.append('file', file);
        r = await axiosInstance.put(`/user/upload-document/${doc.documentId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        r = await axiosInstance.put(`/user/upload-document/${doc.documentId}`, {
          fileUrl: null, textValue: text.trim(),
        });
      }
      if (r.data.success) { onSuccess(); onClose(); }
      else setErr(r.data.message || 'Something went wrong. Please try again.');
    } catch (e) {
      setErr(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${isText ? 'bg-emerald-100' : 'bg-primary/10'}`}>
            {isText
              ? <Type size={18} className="text-emerald-600" />
              : <Paperclip size={18} className="text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-900 text-[15px] leading-tight">{doc.documentType}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {isText
                ? <><Type size={11} className="text-gray-400" /><span className="text-xs text-gray-400">Type your answer below</span></>
                : <><Paperclip size={11} className="text-gray-400" /><span className="text-xs text-gray-400">Choose a file from your device</span></>}
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-xl text-gray-400 transition-colors flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Rejection note */}
        {doc.status === 'REJECTED' && doc.staffRemark && (
          <div className="mx-4 mt-4">
            <TeamBlock label="Why it was sent back">
              <div className="flex items-start gap-2">
                <MessageSquareWarning size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-purple-900 leading-relaxed font-medium">{doc.staffRemark}</p>
              </div>
            </TeamBlock>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* File picker or textarea */}
          {!isText ? (
            <label className="cursor-pointer block">
              <input type="file" className="hidden"
                onChange={e => setFile(e.target.files?.[0])}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />
              <div className={`flex flex-col items-center gap-3 py-9 border-2 border-dashed rounded-2xl transition-all
                ${file
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-gray-200 hover:border-primary hover:bg-primary/5 active:bg-primary/10'}`}>
                {file ? (
                  <>
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <FileCheck size={24} className="text-emerald-500" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-emerald-700 break-all">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB · Tap to change</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Upload size={22} className="text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700">Tap here to pick a file</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, photo, Word or Excel · max 10 MB</p>
                    </div>
                  </>
                )}
              </div>
            </label>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Answer</label>
              <textarea rows={5} value={text} onChange={e => setText(e.target.value)}
                placeholder="Write your answer here…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none outline-none bg-gray-50 focus:bg-white focus:border-primary transition-all" />
            </div>
          )}

          {/* Error */}
          {err && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-rose-700 font-medium">{err}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pb-2">
            <button onClick={submit} disabled={busy}
              className={`flex-1 py-3.5 text-sm font-extrabold rounded-xl flex items-center justify-center gap-2
                transition-all disabled:opacity-50 active:scale-95
                ${doc.status === 'REJECTED'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-primary hover:bg-primary-hover text-white'}`}>
              {busy
                ? <><RefreshCw size={14} className="animate-spin" /> Sending…</>
                : <><SendHorizonal size={14} /> Send it in</>}
            </button>
            <button onClick={onClose}
              className="px-5 py-3.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl
                hover:bg-gray-50 active:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENT CARD ────────────────────────────────────────────────────────────
const DocCard = ({ doc, onUpload }) => {
  const cfg  = DOC_STATUS[doc.status] || DOC_STATUS.PENDING;
  const DIcon = cfg.FileIcon;
  const SIcon = cfg.StatusIcon;
  const canAct = doc.status === 'PENDING' || doc.status === 'REJECTED';
  const hasFile = !!doc.fileUrl;
  const hasText = !!doc.textValue;
  const hasRejectionNote = doc.status === 'REJECTED' && doc.staffRemark;
  const hasInstruction   = doc.remark && doc.status !== 'REJECTED';

  return (
    <div className={`rounded-2xl border-2 ${cfg.border} overflow-hidden bg-white`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${cfg.headerBg}`}>
        <div className={`w-9 h-9 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
          <DIcon size={16} className={cfg.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">{doc.documentType}</p>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400 font-medium">
            {doc.inputType === 'FILE' || doc.inputType === 'file'
              ? <><Paperclip size={9} /><span>File upload</span></>
              : <><Type size={9} /><span>Written answer</span></>}
            {doc.version > 0 && <span className="ml-1 opacity-70">· v{doc.version}</span>}
          </div>
        </div>
        {/* Status pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0 ${cfg.pillBg}`}>
          <SIcon size={13} className={cfg.pillText} />
          <span className={`text-[10px] font-extrabold ${cfg.pillText} hidden sm:block`}>{cfg.label}</span>
        </div>
      </div>

      {/* Sublabel strip */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-100">
        <SIcon size={11} className={cfg.pillText} />
        <p className={`text-[11px] font-semibold ${cfg.pillText}`}>{cfg.sublabel}</p>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2.5">
        {hasInstruction && (
          <TeamBlock label="What we need from you">
            <p className="text-sm text-purple-900 leading-relaxed">{doc.remark}</p>
          </TeamBlock>
        )}
        {hasRejectionNote && (
          <TeamBlock label="Why it was sent back">
            <div className="flex items-start gap-2">
              <MessageSquareWarning size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-900 leading-relaxed font-medium">{doc.staffRemark}</p>
            </div>
          </TeamBlock>
        )}
        {hasFile && (
          <YouBlock label="File you uploaded">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileTypeIcon url={doc.fileUrl} size={15} />
                <span className="text-sm text-sky-800 font-semibold truncate">
                  {decodeURIComponent(doc.fileUrl.split('/').pop())}
                </span>
              </div>
              <button onClick={() => window.open(doc.fileUrl, '_blank')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-200 hover:bg-sky-300 active:bg-sky-400
                  text-sky-800 rounded-lg text-xs font-bold transition-colors flex-shrink-0">
                <Eye size={12} /> View
              </button>
            </div>
          </YouBlock>
        )}
        {hasText && (
          <YouBlock label="Answer you wrote">
            <p className="text-sm text-sky-900 leading-relaxed">{doc.textValue}</p>
          </YouBlock>
        )}
        {canAct && (
          <button onClick={() => onUpload(doc)}
            className={`w-full py-3 text-sm font-extrabold rounded-xl flex items-center justify-center gap-2
              transition-all active:scale-[.98]
              ${doc.status === 'REJECTED'
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-primary hover:bg-primary-hover text-white'}`}>
            <Upload size={14} />
            {doc.status === 'REJECTED' ? 'Upload a fixed version' : 'Upload your file now'}
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── STEP ITEM ────────────────────────────────────────────────────────────────
const StepItem = ({ step, isLast, onUpload, num }) => {
  const [open, setOpen] = useState(
    step.status === 'ERROR' ||
    (step.serviceDocument || []).some(d => d.status === 'PENDING' || d.status === 'REJECTED')
  );
  const cfg      = STEP_STATUS[step.status] || STEP_STATUS.PENDING;
  const docs     = step.serviceDocument || [];
  const needsDocs = docs.filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length;
  const isDone   = step.status === 'COMPLETED';
  const isError  = step.status === 'ERROR';
  const isActive = step.status === 'PROCESSING' || step.status === 'IN_PROGRESS';

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
          ${cfg.dotBg} ${cfg.ring}`}>
          {isDone   && <Check size={13} className="text-white" />}
          {isError  && <AlertCircle size={13} className="text-white" />}
          {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />}
          {!isDone && !isError && !isActive && (
            <span className="text-[11px] font-extrabold text-gray-500">{num}</span>
          )}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-2 min-h-[20px] ${cfg.line}`} />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isLast ? 'pb-2' : 'pb-6'}`}>
        {/* Title + badge */}
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-sm text-gray-900 leading-snug">{step.title}</p>
            {step.description && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg whitespace-nowrap ${cfg.badge}`}>
              {cfg.label}
            </span>
            {needsDocs > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5
                bg-amber-100 text-amber-700 rounded-full border border-amber-200 whitespace-nowrap">
                <BellRing size={9} />{needsDocs} file{needsDocs > 1 ? 's' : ''} needed
              </span>
            )}
          </div>
        </div>

        {/* Error note from staff */}
        {isError && step.remarks && (
          <div className="mt-2 mb-3">
            <TeamBlock label="Our team flagged this">
              <div className="flex items-start gap-2">
                <MessageSquareWarning size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-purple-900 leading-relaxed">{step.remarks}</p>
              </div>
            </TeamBlock>
          </div>
        )}

        {/* Documents toggle */}
        {docs.length > 0 && (
          <div className="mt-2.5">
            <button onClick={() => setOpen(v => !v)}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary
                bg-gray-100 hover:bg-primary/10 active:bg-primary/20 px-3 py-2 rounded-xl transition-colors">
              <FolderOpen size={12} />
              {docs.length} document{docs.length > 1 ? 's' : ''}
              {needsDocs > 0 && !open && (
                <span className="bg-amber-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {needsDocs} to do
                </span>
              )}
              {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            {open && (
              <div className="mt-3 space-y-3">
                {docs.map(d => <DocCard key={d.documentId} doc={d} onUpload={onUpload} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PERIOD ROW ───────────────────────────────────────────────────────────────
const PeriodRow = ({ period, isFirst, onUpload }) => {
  const [open, setOpen] = useState(isFirst && !period.isLocked);
  const pct        = period.completionPercent || 0;
  const done       = period.status === 'COMPLETED';
  const steps      = [...(period.periodStep || [])].sort((a, b) => a.order - b.order);
  const pDocs      = period.serviceDocument || [];
  const needAction = pDocs.filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length
    + steps.reduce((n, s) =>
        n + (s.serviceDocument || []).filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length, 0);
  const hasError = steps.some(s => s.status === 'ERROR');

  const borderCls = period.isLocked ? 'border-gray-200'
    : done       ? 'border-emerald-200'
    : hasError   ? 'border-rose-300'
    : 'border-gray-200';

  const headBg = period.isLocked ? 'bg-gray-50'
    : done      ? 'bg-emerald-50'
    : hasError  ? 'bg-rose-50/60'
    : open      ? 'bg-primary/5'
    : 'bg-white hover:bg-gray-50';

  const PIcon = period.isLocked ? Lock
    : done     ? CheckCircle2
    : hasError ? AlertCircle
    : CalendarDays;

  const PIconColor = period.isLocked ? 'text-gray-400'
    : done     ? 'text-emerald-600'
    : hasError ? 'text-rose-500'
    : 'text-primary';

  const PIconBg = period.isLocked ? 'bg-gray-200'
    : done     ? 'bg-emerald-100'
    : hasError ? 'bg-rose-100'
    : 'bg-primary/10';

  return (
    <div className={`rounded-2xl border-2 ${borderCls} overflow-hidden ${period.isLocked ? 'opacity-60' : ''}`}>
      <button onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${headBg}`}>
        {/* Period icon */}
        <div className={`w-10 h-10 rounded-2xl ${PIconBg} flex items-center justify-center flex-shrink-0`}>
          <PIcon size={16} className={PIconColor} />
        </div>

        {/* Label + pills */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="font-extrabold text-sm text-gray-900">{period.periodLabel}</span>
            {period.isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                <Lock size={8} /> Locked
              </span>
            )}
            {done && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                <Check size={8} /> Done
              </span>
            )}
            {hasError && !period.isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                <AlertCircle size={8} /> Needs help
              </span>
            )}
            {needAction > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                <BellRing size={8} /> {needAction} file{needAction > 1 ? 's' : ''} needed
              </span>
            )}
          </div>
          {(period.startDate || period.endDate) && (
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium flex items-center gap-1">
              <CalendarDays size={9} />
              {fmtDate(period.startDate)} — {fmtDate(period.endDate)}
            </p>
          )}
        </div>

        {/* Progress mini bar (hidden on tiny screens) + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {!period.isLocked && (
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-xs font-extrabold text-gray-700">{pct}%</span>
              <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-primary'}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors
            ${open ? 'bg-primary/10' : 'bg-gray-100'}`}>
            {open
              ? <ChevronUp size={13} className="text-primary" />
              : <ChevronDown size={13} className="text-gray-400" />}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 bg-white">
          {period.isLocked ? (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock size={18} className="text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-600">Not open yet</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Our team will unlock this when it's time. We'll let you know!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {pDocs.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                    <FileText size={10} /> Documents this month
                  </p>
                  <div className="space-y-3">
                    {pDocs.map(d => <DocCard key={d.documentId} doc={d} onUpload={onUpload} />)}
                  </div>
                </div>
              )}
              {steps.length > 0 && (
                <div>
                  {pDocs.length > 0 && (
                    <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 mt-4">
                      <Layers size={10} /> Steps this month
                    </p>
                  )}
                  {steps.map((s, i) => (
                    <StepItem key={s.periodStepId || i} step={s} num={i + 1}
                      isLast={i === steps.length - 1} onUpload={onUpload} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploadDoc, setUploadDoc] = useState(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/my-service/${id}/details`);
      if (res.data.success) setData(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  // ── loading ──
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--neutral-50)' }}>
      <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading your service…</p>
    </div>
  );

  // ── error ──
  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: 'var(--neutral-50)' }}>
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
        <HelpCircle size={30} className="text-rose-400" />
      </div>
      <p className="text-base font-bold text-gray-700">Couldn't load this service</p>
      <button onClick={() => navigate('/my-services')}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold
          hover:bg-primary-hover transition-colors">
        <ChevronLeft size={15} /> Go Back
      </button>
    </div>
  );

  // ── derived state ──
  const svc     = data.service;
  const app     = data.application;
  const isRec   = svc.serviceType === 'RECURRING';
  const periods = app?.servicePeriod || [];
  const periodsDone  = periods.filter(p => p.status === 'COMPLETED').length;
  const appSteps     = [...(app?.applicationTrackStep || [])].sort((a, b) => a.order - b.order);
  const stepsDone    = appSteps.filter(s => s.status === 'COMPLETED').length;

  const allDocs = [];
  appSteps.forEach(s => (s.serviceDocument || []).forEach(d => allDocs.push(d)));
  periods.forEach(p => {
    (p.serviceDocument || []).forEach(d => allDocs.push(d));
    (p.periodStep || []).forEach(s => (s.serviceDocument || []).forEach(d => allDocs.push(d)));
  });
  const byStatus    = { PENDING: 0, UPLOADED: 0, VERIFIED: 0, REJECTED: 0 };
  allDocs.forEach(d => { byStatus[d.status] = (byStatus[d.status] || 0) + 1; });
  const needAction  = byStatus.PENDING + byStatus.REJECTED;
  const hasErrors   = appSteps.some(s => s.status === 'ERROR') ||
    periods.some(p => p.periodStep?.some(s => s.status === 'ERROR'));
  const totalAlerts = needAction + (hasErrors ? 1 : 0);

  const pct = periods.length
    ? Math.round((periodsDone / periods.length) * 100)
    : appSteps.length ? Math.round((stepsDone / appSteps.length) * 100) : 0;

  // ── render ──
  return (
    <>
      {uploadDoc && (
        <UploadModal doc={uploadDoc} onClose={() => setUploadDoc(null)} onSuccess={fetchDetail} />
      )}

      <div className="min-h-screen" style={{ background: 'var(--neutral-50)' }}>

        <PageHeader
          title="Service Details"
          subtitle="Track your service progress and updates"
          onBack={() => navigate('/my-services')}
          onRefresh={fetchDetail}
          actions={
            <button className="flex items-center gap-1.5 bg-primary text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-primary-hover transition-colors">
              <Phone size={13} />
              <span className="hidden sm:inline">Call Us</span>
            </button>
          }
        />

        {/* ══ PAGE BODY ══ */}
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 items-start">

            {/* ════════════════════════════════════
                LEFT — main tracking flow
            ════════════════════════════════════ */}
            <div className="w-full xl:flex-1 xl:min-w-0 space-y-4">

              {/* ① SERVICE CARD */}
              <Card>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-full  rounded-2xl overflow-hidden flex-shrink-0
                      border-2 border-gray-100" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.10)' }}>
                      <img
                        src={svc.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(svc.name || 'S')}&background=6869AC&color=fff&size=200`}
                        alt={svc.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                        {svc.name}
                      </h1>
                      {svc.description && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {svc.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5">
                        <SvcBadge status={data.status} />
                        {isRec
                          ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <Repeat2 size={10} /> Monthly
                            </span>
                          : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                              <Zap size={10} /> One-Time
                            </span>}
                        {data.serviceBundle && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            <Package size={10} /> {data.serviceBundle.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert banner */}
                {totalAlerts > 0 && (
                  <div className="flex items-start gap-3 px-4 py-4 bg-amber-50 border-t-2 border-amber-300">
                    <div className="w-9 h-9 bg-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldAlert size={17} className="text-amber-700" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-amber-900 flex items-center gap-2">
                        <BellRing size={13} /> We need your help!
                      </p>
                      <p className="text-sm text-amber-800 mt-0.5 leading-relaxed">
                        {needAction > 0
                          ? `Please upload ${needAction} file${needAction > 1 ? 's' : ''}.`
                          : ''
                        }{needAction > 0 && hasErrors ? ' Also, ' : ''}{hasErrors
                          ? 'our team left a note on one of your steps.'
                          : ''
                        } Scroll down to see exactly what to do.
                      </p>
                    </div>
                  </div>
                )}

                {/* Color legend */}
                <div className="flex items-center flex-wrap gap-3 px-4 py-3 bg-gray-50/80 border-t border-gray-100">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Color guide:
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 rounded-lg border border-purple-200">
                    <UserCheck size={10} className="text-purple-600" />
                    <span className="text-[10px] font-bold text-purple-700">From our team</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-100 rounded-lg border border-sky-200">
                    <ArrowUpFromLine size={10} className="text-sky-600" />
                    <span className="text-[10px] font-bold text-sky-700">From you</span>
                  </div>
                </div>
              </Card>

              {/* ② NOT STARTED */}
              {!app && (
                <Card>
                  <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4
                      border-2 border-dashed border-primary/20">
                      <Sparkles size={26} className="text-primary/40" />
                    </div>
                    <p className="font-extrabold text-base text-gray-700">We haven't started yet</p>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-xs">
                      Our team is getting things ready. You'll see your progress here once we begin!
                    </p>
                  </div>
                </Card>
              )}

              {/* ③ APPLICATION STEPS */}
              {appSteps.length > 0 && (
                <Card>
                  <CardHeader
                    icon={Layers} title="What's happening — step by step"
                    subtitle={`${stepsDone} done · ${appSteps.length - stepsDone} remaining`}
                    iconBg="bg-primary/10" iconColor="text-primary"
                  />
                  <div className="px-4 pt-5 pb-2">
                    {appSteps.map((s, i) => (
                      <StepItem key={s.applicationTrackStepId || i} step={s} num={i + 1}
                        isLast={i === appSteps.length - 1} onUpload={setUploadDoc} />
                    ))}
                  </div>
                </Card>
              )}

              {/* ④ MONTHLY PERIODS */}
              {periods.length > 0 && (
                <Card>
                  <CardHeader
                    icon={CalendarDays} title="Monthly breakdown"
                    subtitle={`${periodsDone} months finished · ${periods.length - periodsDone} to go`}
                    iconBg="bg-blue-50" iconColor="text-blue-500"
                    right={
                      <span className="text-[11px] font-extrabold bg-primary/10 text-primary
                        px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                        <Calendar size={10} /> {periods.length}
                      </span>
                    }
                  />
                  <div className="p-3.5 sm:p-4 space-y-2.5">
                    {[...periods]
                      .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
                      .map((p, i) => (
                        <PeriodRow key={p.servicePeriodId || i} period={p}
                          isFirst={i === 0} onUpload={setUploadDoc} />
                      ))}
                  </div>
                </Card>
              )}

              {/* ⑤ FORM ANSWERS */}
              {app?.formData && Object.keys(app.formData).length > 0 && (
                <Card>
                  <CardHeader
                    icon={ClipboardList} title="Info you gave us"
                    subtitle="Answers you filled in when you started"
                    iconBg="bg-violet-50" iconColor="text-violet-500"
                  />
                  <div className="p-3.5 sm:p-4 space-y-2.5">
                    {Object.entries(app.formData).map(([k, v]) => (
                      <div key={k} className="flex flex-col sm:grid sm:grid-cols-5 gap-1.5 sm:gap-2 sm:items-start">
                        <div className="sm:col-span-2">
                          <TeamBlock label="Question">
                            <p className="text-sm text-purple-900 font-bold capitalize leading-snug">
                              {k.replace(/_/g, ' ')}
                            </p>
                          </TeamBlock>
                        </div>
                        <div className="sm:col-span-3">
                          <YouBlock label="Your answer">
                            {typeof v === 'object' && v !== null
                              ? v.url
                                ? <a href={v.url} target="_blank" rel="noreferrer"
                                    className="text-sky-600 underline text-sm font-semibold flex items-center gap-1.5">
                                    <Eye size={13} /> Open file
                                  </a>
                                : <p className="text-sm text-sky-900">{JSON.stringify(v)}</p>
                              : <p className="text-sm text-sky-900 leading-relaxed font-medium">{String(v)}</p>}
                          </YouBlock>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* ════════════════════════════════════
                RIGHT — sticky summary panel (xl)
                On mobile collapses to full-width cards
            ════════════════════════════════════ */}
            <div className="w-full xl:w-[300px] 2xl:w-[340px] flex-shrink-0 space-y-3 sm:space-y-4 xl:sticky xl:top-[60px]">

              {/* PROGRESS */}
              {app && (
                <Card>
                  <CardHeader icon={TrendingUp} title="Overall progress"
                    iconBg="bg-blue-50" iconColor="text-blue-500" />
                  <div className="px-4 py-4">
                    {/* Mobile: compact bar */}
                    <div className="flex items-center gap-3 xl:hidden">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <p className="text-xs text-gray-500 font-semibold">
                            {periods.length
                              ? `${periodsDone} / ${periods.length} months`
                              : `${stepsDone} / ${appSteps.length} steps`}
                          </p>
                          <p className="text-sm font-extrabold text-primary">{pct}%</p>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        {pct === 100 && (
                          <p className="text-xs text-emerald-600 font-extrabold mt-1.5 flex items-center gap-1.5">
                            <Star size={11} className="fill-emerald-500 text-emerald-500" /> All done! Great job!
                          </p>
                        )}
                      </div>
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
                        ${pct === 100 ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                        {pct === 100
                          ? <CheckCheck size={20} className="text-emerald-600" />
                          : <BarChart3 size={20} className="text-primary" />}
                      </div>
                    </div>

                    {/* Desktop: ring */}
                    <div className="hidden xl:flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <ProgressRing pct={pct} size={72} />
                        <span className="absolute inset-0 flex items-center justify-center
                          text-sm font-extrabold text-gray-800 pointer-events-none">
                          {pct}%
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-gray-900 leading-none">{pct}% done</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          {periods.length
                            ? `${periodsDone} of ${periods.length} months`
                            : `${stepsDone} of ${appSteps.length} steps`}
                        </p>
                        {pct === 100 && (
                          <p className="text-xs text-emerald-600 font-extrabold mt-1.5 flex items-center gap-1.5">
                            <Star size={11} className="fill-emerald-500 text-emerald-500" /> All done! Great job!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Recurring mini stats */}
                    {isRec && periods.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                          { label: 'Total',    val: periods.length,                          color: 'text-gray-800',    bg: 'bg-gray-50',     Icon: CalendarDays },
                          { label: 'Finished', val: periodsDone,                             color: 'text-emerald-600', bg: 'bg-emerald-50',  Icon: CheckCircle2 },
                          { label: 'Open now', val: periods.filter(p => !p.isLocked).length, color: 'text-primary',     bg: 'bg-primary/5',   Icon: LayoutGrid },
                        ].map(({ label, val, color, bg, Icon: IIcon }) => (
                          <div key={label} className={`${bg} rounded-xl py-3 px-1 text-center border border-gray-100`}>
                            <IIcon size={12} className={`${color} mx-auto mb-1 opacity-60`} />
                            <p className={`text-xl font-extrabold ${color} leading-none`}>{val}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-tight">{label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* DOCUMENTS OVERVIEW */}
              {allDocs.length > 0 && (
                <Card>
                  <CardHeader icon={FileText} title="Your documents"
                    subtitle={`${allDocs.length} total`} />
                  <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                    {[
                      { key: 'PENDING',  label: 'Upload needed', Icon: Inbox,      color: 'text-amber-600',   iconBg: 'bg-amber-50',   bg: 'bg-amber-50/40' },
                      { key: 'UPLOADED', label: 'Being checked', Icon: ScanSearch, color: 'text-blue-600',    iconBg: 'bg-blue-50',    bg: 'bg-blue-50/40' },
                      { key: 'VERIFIED', label: 'Approved',      Icon: BadgeCheck, color: 'text-emerald-600', iconBg: 'bg-emerald-50', bg: 'bg-emerald-50/40' },
                      { key: 'REJECTED', label: 'Needs fixing',  Icon: XCircle,    color: 'text-rose-600',    iconBg: 'bg-rose-50',    bg: 'bg-rose-50/40' },
                    ].map(({ key, label, Icon: DIcon, color, iconBg, bg }) => (
                      <div key={key} className={`${bg} flex flex-col items-center justify-center py-4 px-2 gap-1`}>
                        <div className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center mb-1`}>
                          <DIcon size={15} className={color} />
                        </div>
                        <p className={`text-2xl font-extrabold leading-none ${color}`}>{byStatus[key] || 0}</p>
                        <p className="text-[10px] text-gray-500 font-bold text-center leading-tight mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  {needAction > 0 && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-t-2 border-amber-200">
                      <BellRing size={13} className="text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-900 font-bold">
                        {needAction} file{needAction > 1 ? 's' : ''} still need{needAction === 1 ? 's' : ''} your upload!
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* SERVICE INFO */}
              <Card>
                <CardHeader icon={Info} title="About this service"
                  iconBg="bg-gray-100" iconColor="text-gray-500" />
                <div className="divide-y divide-gray-50">
                  {[
                    { label: 'Started on', Icon: CalendarDays, val: fmtDate(data.createdAt, true) },
                    { label: 'Service ID',  Icon: Hash,         val: `#${data.myServiceId.slice(-8).toUpperCase()}` },
                    svc.duration && { label: 'Duration', Icon: Timer, val: `${svc.duration} ${svc.durationUnit?.toLowerCase()}` },
                    isRec && svc.frequency && { label: 'Repeats', Icon: Repeat2, val: svc.frequency.charAt(0) + svc.frequency.slice(1).toLowerCase() },
                  ].filter(Boolean).map(({ label, Icon: RowIcon, val }) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-3">
                      <RowIcon size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-400 font-semibold flex-1">{label}</span>
                      <span className="text-xs text-gray-800 font-extrabold text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* BUNDLE */}
              {data.serviceBundle && (
                <Card>
                  <CardHeader icon={Package} title="Part of a bundle"
                    iconBg="bg-purple-50" iconColor="text-purple-500" />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {data.serviceBundle.photoUrl && (
                        <img src={data.serviceBundle.photoUrl} alt={data.serviceBundle.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-gray-900 truncate">{data.serviceBundle.name}</p>
                        {data.serviceBundle.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {data.serviceBundle.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {data.serviceBundle.services?.length > 0 && (
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-400
                          uppercase tracking-widest mb-2">
                          <LayoutGrid size={10} /> Also included
                        </p>
                        <div className="space-y-1.5">
                          {data.serviceBundle.services.map(s => (
                            <div key={s.serviceId}
                              className="flex items-center gap-2.5 py-2 px-3 bg-gray-50 rounded-xl border border-gray-100">
                              {s.photoUrl && (
                                <img src={s.photoUrl} alt={s.name}
                                  className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />
                              )}
                              <span className="text-xs font-bold text-gray-700 flex-1 truncate">{s.name}</span>
                              <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

            </div>{/* end right */}
          </div>
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}