import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from '../page-header/PageHeader';
import {
  ArrowLeft, Package, Calendar, Clock, CheckCircle, AlertCircle,
  User, File, Image, FileText, FileSpreadsheet, FileArchive,
  FileAudio, FileVideo, Download, Eye, Copy, Printer,
  ExternalLink, DollarSign, Hash, Layers, RefreshCw,
  MessageSquare, HelpCircle, AlertTriangle, Info, Shield,
  Phone, Mail, Building, CreditCard, ChevronRight, ChevronDown,
  ChevronUp, X, Filter, Search, Users, BarChart, TrendingUp,
  Settings, List, Star, Bell, Heart, Check, XCircle, PlayCircle,
  Save, Edit, Trash2, Send, AlertOctagon,
  FileUp, FileClock, FileCheck, FileX, Plus, RotateCcw,
  ChevronLeft, MoreHorizontal, Lock, Upload, Type,
} from 'lucide-react';


const employeeId = localStorage.getItem("employeeId");

if (!employeeId) {
  console.error("Employee ID not found");
}

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
let _toastFn = null;
export const toast = (msg, type = 'success') => _toastFn && _toastFn(msg, type);

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _toastFn = (msg, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    return () => { _toastFn = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto
            transition-all duration-300 min-w-[260px] max-w-[360px]
            ${t.type === 'success'
              ? 'bg-white border border-emerald-200 text-emerald-800'
              : t.type === 'error'
              ? 'bg-white border border-rose-200 text-rose-800'
              : 'bg-white border border-blue-200 text-blue-800'
            }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            t.type === 'success' ? 'bg-emerald-100' : t.type === 'error' ? 'bg-rose-100' : 'bg-blue-100'
          }`}>
            {t.type === 'success'
              ? <CheckCircle className="w-4 h-4 text-emerald-600" />
              : t.type === 'error'
              ? <XCircle className="w-4 h-4 text-rose-600" />
              : <Info className="w-4 h-4 text-blue-600" />}
          </div>
          <span className="flex-1 leading-snug">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

// ─── DOC STATUS CONFIG ─────────────────────────────────────────────────────────
const DOC_STATUS_CONFIG = {
  PENDING: {
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: FileClock, iconColor: 'text-amber-500', label: 'Awaiting Upload',
  },
  FOR_REVIEW: {
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: FileUp, iconColor: 'text-blue-500', label: 'Needs Review',
  },
  VERIFIED: {
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: FileCheck, iconColor: 'text-emerald-500', label: 'Verified',
  },
  REJECTED: {
    badge: 'bg-rose-50 text-rose-700 border border-rose-200',
    icon: FileX, iconColor: 'text-rose-500', label: 'Rejected',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'ASSIGNED':   return { color: 'bg-blue-100 text-blue-800 border-blue-200',   icon: <CheckCircle className="w-5 h-5" />, label: 'Assigned' };
    case 'PROCESSING': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <RefreshCw className="w-5 h-5" />,   label: 'In Progress' };
    case 'COMPLETED':  return { color: 'bg-green-100 text-green-800 border-green-200',  icon: <CheckCircle className="w-5 h-5" />, label: 'Completed' };
    case 'PENDING':    return { color: 'bg-gray-100 text-gray-800 border-gray-200',     icon: <Clock className="w-5 h-5" />,       label: 'Pending' };
    case 'ERROR':      return { color: 'bg-red-100 text-red-800 border-red-200',        icon: <AlertCircle className="w-5 h-5" />, label: 'Error/Rejected' };
    default:           return { color: 'bg-gray-100 text-gray-800 border-gray-200',     icon: <AlertCircle className="w-5 h-5" />, label: status };
  }
};

const getTrackStepStatusConfig = (status) => {
  switch (status) {
    case 'COMPLETED':  return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, badge: 'bg-emerald-100 text-emerald-700' };
    case 'PROCESSING': return { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',    icon: <PlayCircle  className="w-4 h-4 text-blue-500" />,    badge: 'bg-blue-100 text-blue-700' };
    case 'PENDING':    return { bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-700',    icon: <Clock       className="w-4 h-4 text-gray-400" />,    badge: 'bg-gray-100 text-gray-600' };
    case 'ERROR':      return { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-800',    icon: <XCircle     className="w-4 h-4 text-rose-500" />,    badge: 'bg-rose-100 text-rose-700' };
    default:           return { bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-700',    icon: <AlertCircle className="w-4 h-4 text-gray-400" />,    badge: 'bg-gray-100 text-gray-600' };
  }
};

const getFileIcon = (url) => {
  if (!url) return <File className="w-4 h-4" />;
  const ext = url.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','bmp','svg','webp'].includes(ext)) return <Image className="w-4 h-4 text-rose-500" />;
  if (ext === 'pdf') return <FileText className="w-4 h-4 text-red-500" />;
  if (['doc','docx'].includes(ext)) return <FileText className="w-4 h-4 text-blue-500" />;
  if (['xls','xlsx'].includes(ext)) return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
  if (['zip','rar','7z'].includes(ext)) return <FileArchive className="w-4 h-4 text-yellow-500" />;
  if (['mp3','wav','ogg'].includes(ext)) return <FileAudio className="w-4 h-4 text-purple-500" />;
  if (['mp4','avi','mov','mkv'].includes(ext)) return <FileVideo className="w-4 h-4 text-indigo-500" />;
  return <File className="w-4 h-4 text-gray-500" />;
};

const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('fetch failed');
    const blob = await response.blob();
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    const safeName = filename
      ? (filename.includes('.') ? filename : `${filename}.${ext}`)
      : `download.${ext}`;
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// ─── FORM DATA FIELD HELPERS ───────────────────────────────────────────────────
const detectFieldType = (v) => {
  if (typeof v === 'object' && v !== null) return v.url && v.sizeInMb ? 'file' : 'object';
  if (typeof v === 'string') {
    if (v.includes('@') && v.includes('.')) return 'email';
    if (v.match(/^\d{10}$/)) return 'phone';
    if (v.match(/^\d{12}$/)) return 'aadhar';
    if (v.match(/^[A-Z]{5}\d{4}[A-Z]$/)) return 'pan';
    if (v.match(/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d][Z][A-Z\d]$/)) return 'gst';
    // JSON array (multi-select)
    if (v.startsWith('[') && v.endsWith(']')) {
      try { JSON.parse(v); return 'array'; } catch {}
    }
    if (!isNaN(v) && v.trim() !== '') return 'number';
    return 'text';
  }
  if (typeof v === 'boolean') return 'boolean';
  return 'text';
};

const fieldTypeIcon = (type) => {
  switch (type) {
    case 'file':   return <FileText size={13} className="text-purple-500" />;
    case 'email':  return <Mail     size={13} className="text-blue-500" />;
    case 'phone':  return <Phone    size={13} className="text-teal-500" />;
    case 'number': return <Hash     size={13} className="text-orange-500" />;
    case 'array':  return <List     size={13} className="text-indigo-500" />;
    default:       return <Type     size={13} className="text-gray-400" />;
  }
};

// Renders the value portion of a form field
function FormFieldValue({ value }) {
  const type = detectFieldType(value);

  if (type === 'file') return (
    <div className="flex items-center gap-2.5 mt-1.5">
      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
        {getFileIcon(value.url)}
      </div>
      <div className="flex-1 min-w-0">
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
        >
          View File <ExternalLink size={11} />
        </a>
        <p className="text-[10px] text-gray-400 mt-0.5">{(parseFloat(value.sizeInMb) || 0).toFixed(2)} MB</p>
      </div>
      <button
        onClick={() => downloadFile(value.url, 'document')}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        title="Download"
      >
        <Download size={13} className="text-gray-400" />
      </button>
    </div>
  );

  if (type === 'email') return (
    <a href={`mailto:${value}`} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-1">
      <Mail size={12} className="text-gray-400 flex-shrink-0" />{value}
    </a>
  );

  if (type === 'phone') return (
    <a href={`tel:${value}`} className="flex items-center gap-1.5 text-sm text-gray-700 mt-1">
      <Phone size={12} className="text-gray-400 flex-shrink-0" />{value}
    </a>
  );

  if (type === 'aadhar' || type === 'pan' || type === 'gst') return (
    <span className="inline-block font-mono text-sm bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg mt-1">
      {value}
    </span>
  );

  if (type === 'array') {
    let items = [];
    try { items = JSON.parse(value); } catch {}
    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {items.map((item, i) => (
          <span key={i} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (type === 'boolean') return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
      value ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
    }`}>
      {value ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {value ? 'Yes' : 'No'}
    </span>
  );

  // Plain text / number — also handle date strings
  const isDateLike = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);
  const displayVal = isDateLike
    ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : value;

  return <p className="text-sm text-gray-800 mt-1 break-words leading-relaxed">{displayVal}</p>;
}

// ─── COLLAPSIBLE PANEL WRAPPER ────────────────────────────────────────────────
const CollapsiblePanel = ({ icon: Icon, iconBg, iconColor, gradientFrom, title, subtitle, defaultOpen = false, children, badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r ${gradientFrom} to-white transition-colors hover:brightness-[0.98]`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              {title}
              {badge && (
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-gray-100' : 'bg-gray-50'}`}>
          {open
            ? <ChevronUp   size={15} className="text-gray-500" />
            : <ChevronDown size={15} className="text-gray-500" />}
        </div>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

// ─── FORM DATA SECTION ────────────────────────────────────────────────────────
const FormDataSection = ({ formData }) => {
  const [expandedFields, setExpandedFields] = useState({});

  const entries = Object.entries(formData || {});
  if (!entries.length) return null;

  const toggleField = (key) => setExpandedFields(p => ({ ...p, [key]: !p[key] }));

  const fileEntries  = entries.filter(([, v]) => detectFieldType(v) === 'file');
  const otherEntries = entries.filter(([, v]) => detectFieldType(v) !== 'file');

  return (
    <CollapsiblePanel
      icon={FileText}
      iconBg="bg-indigo-100"
      iconColor="text-indigo-600"
      gradientFrom="from-indigo-50"
      title="Submitted Form Data"
      subtitle={`${entries.length} field${entries.length !== 1 ? 's' : ''} submitted by applicant`}
      badge={entries.length}
      defaultOpen={true}
    >
      <div className="p-4 space-y-4">

        {/* Plain fields: 2-col grid */}
        {otherEntries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherEntries.map(([key, value]) => {
              const type    = detectFieldType(value);
              const isLong  = typeof value === 'string' && value.length > 60;
              const isOpen  = expandedFields[key];
              return (
                <div key={key} className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {fieldTypeIcon(type)}
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{key}</p>
                  </div>
                  {isLong ? (
                    <>
                      <p className={`text-sm text-gray-800 mt-1 break-words leading-relaxed ${!isOpen ? 'line-clamp-2' : ''}`}>
                        {value}
                      </p>
                      <button
                        onClick={() => toggleField(key)}
                        className="mt-1 text-[10px] text-blue-500 font-medium self-start hover:underline"
                      >
                        {isOpen ? 'Show less' : 'Show more'}
                      </button>
                    </>
                  ) : (
                    <FormFieldValue value={value} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* File fields */}
        {fileEntries.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-0.5">
              Uploaded Documents
            </p>
            <div className="space-y-2">
              {fileEntries.map(([key, value]) => (
                <div key={key} className="bg-purple-50 border border-purple-100 rounded-xl px-3.5 py-3">
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">{key}</p>
                  <FormFieldValue value={value} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </CollapsiblePanel>
  );
};

// ─── REQUEST / ISSUE DOCUMENT MODAL ───────────────────────────────────────────
const RequestDocumentModal = ({
  applicationId,
  onClose,
  onSuccess,
  applicationTrackStepId = null,
  periodStepId = null,
  stepTitle = '',
}) => {
  const [flow, setFlow]             = useState('REQUESTED');
  const [documentType, setDocumentType] = useState('');
  const [remark, setRemark]         = useState('');
  const [inputType, setInputType]   = useState('FILE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const [textValue, setTextValue]   = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const fileInputRef                = useRef(null);

  const commonDocTypes = [
    'Aadhaar Card', 'Passport',
    'Bank Statement', 'Salary Slip',
    'Address Proof', 'Photo ID', 'Staff Note',
    'Approval Letter',
  ];

  useEffect(() => {
    setSelectedFile(null);
    setTextValue('');
    setError('');
  }, [flow, inputType]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!documentType.trim()) {
      setError('Please enter a document type.');
      return;
    }
    if (!applicationTrackStepId && !periodStepId) {
      setError('Document must be associated with a step or service period.');
      return;
    }

    if (flow === 'ISSUED') {
      if (inputType === 'FILE' && !selectedFile) {
        setError('Please select a file to upload.');
        return;
      }
      if (inputType === 'TEXT' && !textValue.trim()) {
        setError('Please enter the text content.');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      let requestData;

      if (flow === 'REQUESTED') {
        requestData = {
          flow: 'REQUESTED',
          requestedBy: employeeId,
          documentType: documentType.trim(),
          inputType,
          remark: remark.trim() || undefined,
        };
        if (applicationTrackStepId) requestData.applicationTrackStepId = applicationTrackStepId;
        else if (periodStepId) requestData.periodStepId = periodStepId;

        const res = await axiosInstance.post('/staff/documents', requestData);
        if (!res.data.success) throw new Error(res.data.message || 'Failed to create request.');

      } else {
        if (inputType === 'FILE') {
          const formData = new FormData();
          formData.append('flow',         'ISSUED');
          formData.append('issuedBy',     employeeId);
          formData.append('documentType', documentType.trim());
          formData.append('inputType',    'FILE');
          if (remark.trim()) formData.append('remark', remark.trim());
          if (applicationTrackStepId) formData.append('applicationTrackStepId', applicationTrackStepId);
          else if (periodStepId) formData.append('periodStepId', periodStepId);
          formData.append('file', selectedFile);

          const res = await axiosInstance.post('/staff/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (!res.data.success) throw new Error(res.data.message || 'Failed to issue document.');

        } else {
          requestData = {
            flow:         'ISSUED',
            issuedBy:     employeeId,
            documentType: documentType.trim(),
            inputType:    'TEXT',
            textValue:    textValue.trim(),
            remark:       remark.trim() || undefined,
          };
          if (applicationTrackStepId) requestData.applicationTrackStepId = applicationTrackStepId;
          else if (periodStepId) requestData.periodStepId = periodStepId;

          const res = await axiosInstance.post('/staff/documents', requestData);
          if (!res.data.success) throw new Error(res.data.message || 'Failed to issue document.');
        }
      }

      toast(flow === 'REQUESTED' ? 'Document request sent successfully!' : 'Document issued successfully!');
      onSuccess();
      onClose();
    } catch (e) {
      console.error('Error submitting document:', e);
      setError(e.response?.data?.message || e.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              flow === 'ISSUED' ? 'bg-emerald-100' : 'bg-blue-100'
            }`}>
              {flow === 'ISSUED'
                ? <Upload className="w-5 h-5 text-emerald-600" />
                : <Plus   className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {flow === 'ISSUED' ? 'Issue Document' : 'Request Document'}
              </h3>
              <p className="text-xs text-gray-500">
                {stepTitle ? `For: ${stepTitle}` : 'Manage document for this application'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Flow Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Flow Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFlow('REQUESTED')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  flow === 'REQUESTED'
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                }`}
              >
                {flow === 'REQUESTED' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  flow === 'REQUESTED' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Send className={`w-4 h-4 ${flow === 'REQUESTED' ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${flow === 'REQUESTED' ? 'text-blue-800' : 'text-gray-700'}`}>
                    Request
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Ask the user to upload a document
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFlow('ISSUED')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  flow === 'ISSUED'
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                {flow === 'ISSUED' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  flow === 'ISSUED' ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  <Upload className={`w-4 h-4 ${flow === 'ISSUED' ? 'text-emerald-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${flow === 'ISSUED' ? 'text-emerald-800' : 'text-gray-700'}`}>
                    Issue
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Upload or provide content directly
                  </p>
                </div>
              </button>
            </div>

            <div className={`mt-3 flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
              flow === 'ISSUED'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {flow === 'ISSUED'
                ? 'You (staff) are directly providing the document or text content on behalf of the application.'
                : 'A notification will be sent to the applicant asking them to upload the specified document.'}
            </div>
          </div>

          {/* Common Doc Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Example Document Types</label>
            <div className="flex flex-wrap gap-1.5">
              {commonDocTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setDocumentType(t === 'Other' ? '' : t)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all font-medium ${
                    documentType === t
                      ? flow === 'ISSUED'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Document Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentType}
              onChange={e => setDocumentType(e.target.value)}
              placeholder="e.g. PAN Card, Staff Note, Approval Letter…"
              className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:border-transparent ${
                flow === 'ISSUED'
                  ? 'focus:ring-emerald-500'
                  : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Input Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Input Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {[
                { val: 'FILE', icon: <File className="w-4 h-4" />,     label: 'File Upload' },
                { val: 'TEXT', icon: <Type className="w-4 h-4" />,     label: 'Text Input'  },
              ].map(({ val, icon, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputType(val)}
                  className={`flex-1 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                    inputType === val
                      ? flow === 'ISSUED'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                        : 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* ISSUED: File or Text Content */}
          {flow === 'ISSUED' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {inputType === 'FILE' ? 'Upload File' : 'Text Content'}{' '}
                <span className="text-red-500">*</span>
              </label>

              {inputType === 'FILE' ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={e => handleFileSelect(e.target.files?.[0])}
                    accept="*/*"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragOver
                        ? 'border-emerald-400 bg-emerald-50'
                        : selectedFile
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getFileIcon(selectedFile.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Drop file here or click to browse</p>
                        <p className="text-xs text-gray-400 mt-1">Any file type supported</p>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <textarea
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  rows={4}
                  placeholder="Enter the text content to be issued…"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none transition-colors"
                />
              )}
            </div>
          )}

          {/* Remark */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {flow === 'ISSUED' ? 'Remark' : 'Instruction / Remark'}{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              rows={2}
              placeholder={
                flow === 'ISSUED'
                  ? 'e.g. Approved manually after verification…'
                  : 'e.g. Please upload a clear scanned copy…'
              }
              className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent ${
                flow === 'ISSUED' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex-1 py-2.5 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${
              flow === 'ISSUED'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> {flow === 'ISSUED' ? 'Issuing…' : 'Sending…'}</>
            ) : flow === 'ISSUED' ? (
              <><Upload className="w-4 h-4" /> Issue Document</>
            ) : (
              <><Send className="w-4 h-4" /> Send Request</>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENT REVIEW MODAL ────────────────────────────────────────────────────
const DocumentReviewModal = ({ document: doc, onClose, onSuccess, defaultStatus = '' }) => {
  const [reviewStatus, setReviewStatus] = useState(defaultStatus || '');
  const [reviewRemark, setReviewRemark] = useState(doc.staffRemark || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reviewStatus) {
      setError('Please select VERIFIED or REJECTED.');
      return;
    }
    if (reviewStatus === 'REJECTED') {
      if (!reviewRemark.trim()) {
        setError('Please provide a rejection reason.');
        return;
      }
      if (reviewRemark.trim().length < 10) {
        setError('Rejection reason must be at least 10 characters.');
        return;
      }
    }

    setSubmitting(true);
    setError('');
    try {
      const requestBody = {
        status: reviewStatus,
        ...(reviewStatus === 'REJECTED' && reviewRemark.trim() ? { remark: reviewRemark.trim() } : {}),
      };
      const response = await axiosInstance.put(`/staff/documents/${doc.documentId}/review-document`, requestBody); 
      if (response.data.success) {
        const action = reviewStatus === 'VERIFIED' ? 'verified' : 'rejected';
        toast(`Document successfully ${action}!`, reviewStatus === 'VERIFIED' ? 'success' : 'error');
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Review failed.');
      }
    } catch (e) {
      console.error('Review error:', e);
      setError(e.response?.data?.message || 'Review failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Review Document</h3>
              <p className="text-xs text-gray-500">{doc.documentType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Document Details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Type:</span>
                <span className="text-xs font-medium text-gray-900">{doc.documentType}</span>
              </div>
              {doc.remark && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Instruction:</span>
                  <span className="text-xs font-medium text-gray-900 italic">"{doc.remark}"</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Input Type:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                  doc.inputType === 'FILE' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                }`}>
                  {doc.inputType === 'FILE' ? <File size={10} /> : <FileText size={10} />}
                  {doc.inputType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Current Status:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                  doc.status === 'FOR_REVIEW' ? 'bg-blue-100 text-blue-700' :
                  doc.status === 'VERIFIED'   ? 'bg-emerald-100 text-emerald-700' :
                  doc.status === 'REJECTED'   ? 'bg-rose-100 text-rose-700' :
                                                'bg-amber-100 text-amber-700'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>

            {(doc.fileUrl || doc.textValue) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Uploaded Content:</p>
                {doc.fileUrl ? (
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.fileUrl)}
                      <span className="text-xs font-medium text-gray-900 truncate max-w-[150px]">
                        {doc.fileUrl.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => window.open(doc.fileUrl, '_blank')} className="p-1 hover:bg-gray-100 rounded" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => downloadFile(doc.fileUrl, doc.documentType)} className="p-1 hover:bg-gray-100 rounded" title="Download">
                        <Download className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-900 whitespace-pre-wrap">{doc.textValue}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Decision <span className="text-red-500">*</span>
            </label>

            {doc.status === 'PENDING' ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  Awaiting upload from the client. Decision can be made once the document is submitted.
                </p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setReviewStatus('VERIFIED'); setReviewRemark(''); }}
                  className={`flex-1 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                    reviewStatus === 'VERIFIED'
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" /> Verify
                </button>
                <button
                  type="button"
                  onClick={() => setReviewStatus('REJECTED')}
                  className={`flex-1 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                    reviewStatus === 'REJECTED'
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-rose-300 hover:text-rose-600'
                  }`}
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>

          {reviewStatus === 'REJECTED' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewRemark}
                onChange={e => setReviewRemark(e.target.value)}
                rows={3}
                placeholder="Explain why the document is rejected (minimum 10 characters)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewRemark.length}/10 characters minimum
                {reviewRemark.length >= 10 && <CheckCircle className="inline ml-1 w-3 h-3 text-emerald-500" />}
              </p>
            </div>
          )}

          {reviewStatus === 'VERIFIED' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700">Document will be marked as verified. The applicant will be notified.</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <p className="text-xs text-rose-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleSubmit}
            disabled={submitting || !reviewStatus || doc.status === 'PENDING'}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
              reviewStatus === 'VERIFIED' ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : reviewStatus === 'REJECTED' ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {submitting
              ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
              : <><Save className="w-3.5 h-3.5" /> Submit Review</>}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENT MANAGEMENT SECTION ──────────────────────────────────────────────
const DocumentManagementSection = ({ applicationId, onCountChange }) => {
  const [documents,           setDocuments]           = useState([]);
  const [loading,             setLoading]             = useState(true);
  const [showRequestModal,    setShowRequestModal]    = useState(false);
  const [selectedStepForRequest, setSelectedStepForRequest] = useState(null);
  const [activeFilter,        setActiveFilter]        = useState('recent');
  const [showReviewModal,     setShowReviewModal]     = useState(false);
  const [selectedDocForReview,setSelectedDocForReview]= useState(null);
  const [reviewDefaultStatus, setReviewDefaultStatus] = useState('');
  const [quickActionLoading,  setQuickActionLoading]  = useState(null);
  const [actionMessage,       setActionMessage]       = useState({ type: '', text: '' });

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await axiosInstance.get(`/staff/documents/application/${applicationId}`); 
      if (res.data.success) {
        const docs = res.data.documents || [];
        setDocuments(docs);
        if (onCountChange) {
          onCountChange({
            total:      docs.length,
            pending:    docs.filter(d => d.status === 'PENDING').length,
            uploaded:   docs.filter(d => d.status === 'FOR_REVIEW').length,
            verified:   docs.filter(d => d.status === 'VERIFIED').length,
            rejected:   docs.filter(d => d.status === 'REJECTED').length,
            FOR_REVIEW: docs.filter(d => d.status === 'FOR_REVIEW').length,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
      setActionMessage({ type: 'error', text: e.response?.data?.message || 'Failed to load documents' });
    } finally {
      setLoading(false);
    }
  }, [applicationId, onCountChange]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleQuickVerify = async (doc) => {
    setQuickActionLoading(doc.documentId);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await axiosInstance.put(`/staff/review-document/${doc.documentId}`, { status: 'VERIFIED' });
      if (res.data.success) {
        setActionMessage({ type: 'success', text: 'Document verified successfully!' });
        setDocuments(prev => prev.map(d =>
          d.documentId === doc.documentId ? { ...d, status: 'VERIFIED', staffRemark: null } : d
        ));
        fetchDocuments();
        setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
      } else {
        setActionMessage({ type: 'error', text: res.data.message || 'Verification failed.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: e.response?.data?.message || 'Verification failed.' });
    } finally {
      setQuickActionLoading(null);
    }
  };

  const openReviewModal = (doc, defaultStatus = '') => {
    setSelectedDocForReview(doc);
    setReviewDefaultStatus(defaultStatus);
    setShowReviewModal(true);
  };

  const requestedOnly = documents.filter(d => d.flow === 'REQUESTED');
  const issuedDocs    = documents.filter(d => d.flow === 'ISSUED');

  const counts = {
    PENDING:    requestedOnly.filter(d => d.status === 'PENDING').length,
    FOR_REVIEW: requestedOnly.filter(d => d.status === 'FOR_REVIEW').length,
    VERIFIED:   requestedOnly.filter(d => d.status === 'VERIFIED').length,
    REJECTED:   requestedOnly.filter(d => d.status === 'REJECTED').length,
  };

  const filters = [
    { key: 'recent',     label: 'Recent',    color: 'bg-gray-100 text-gray-600',        activeColor: 'bg-gray-700 text-white' },
    { key: 'PENDING',    label: 'Awaiting',  color: 'bg-amber-50 text-amber-700',       activeColor: 'bg-amber-500 text-white' },
    { key: 'FOR_REVIEW', label: 'To Review', color: 'bg-blue-50 text-blue-700',         activeColor: 'bg-blue-600 text-white' },
    { key: 'VERIFIED',   label: 'Verified',  color: 'bg-emerald-50 text-emerald-700',   activeColor: 'bg-emerald-600 text-white' },
    { key: 'REJECTED',   label: 'Rejected',  color: 'bg-rose-50 text-rose-700',         activeColor: 'bg-rose-600 text-white' },
  ];

  // ── shared sub-components ──
  const FileActions = ({ url, docType }) => (
    <button onClick={() => downloadFile(url, docType)} title="Download"
      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0">
      <Download className="w-3.5 h-3.5 text-gray-400" />
    </button>
  );

  const DocCard = ({ doc, showReviewButtons = false }) => {
    const cfg = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.PENDING;
    const DocIcon = cfg.icon;
    const isQuickLoading = quickActionLoading === doc.documentId;
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <DocIcon size={15} className={cfg.iconColor} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{doc.documentType}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(doc.createdAt)}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0 border ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>

          {doc.remark && (
            <p className="text-[11px] text-gray-400 mt-1.5 italic pl-[26px]">"{doc.remark}"</p>
          )}
          {doc.applicationTrackStep && (
            <div className="flex items-center gap-1 mt-1 pl-[26px]">
              <Layers size={10} className="text-gray-300" />
              <span className="text-[11px] text-gray-400">{doc.applicationTrackStep.title}</span>
            </div>
          )}

          {/* File / text content */}
          {(doc.fileUrl || doc.textValue) && (
            <div className="mt-2.5 pl-[26px]">
              {doc.fileUrl ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(doc.fileUrl)}
                    <span className="text-xs text-gray-600 truncate">
                      {decodeURIComponent(doc.fileUrl.split('/').pop().split('?')[0]) || 'Uploaded File'}
                    </span>
                  </div>
                  <FileActions url={doc.fileUrl} docType={doc.documentType} />
                </div>
              ) : (
                <div className="px-3 py-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-0.5">Response</p>
                  <p className="text-xs text-gray-700">{doc.textValue}</p>
                </div>
              )}
            </div>
          )}

          {doc.status === 'REJECTED' && doc.staffRemark && (
            <p className="text-[10px] text-rose-500 font-medium mt-2 pl-[26px]">
              Rejected: <span className="font-normal italic">{doc.staffRemark}</span>
            </p>
          )}
          {doc.status === 'PENDING' && (
            <p className="text-[11px] text-amber-500 mt-1.5 pl-[26px]">Waiting for client to upload.</p>
          )}

          {/* Review buttons */}
          {showReviewButtons && doc.status === 'FOR_REVIEW' && (
            <div className="mt-3 flex gap-2 pl-[26px]">
              <button onClick={() => handleQuickVerify(doc)} disabled={isQuickLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
                {isQuickLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                Verify
              </button>
              <button onClick={() => openReviewModal(doc, 'REJECTED')} disabled={isQuickLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
                <XCircle className="w-3 h-3" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Filtered requested docs
  const displayRequested = activeFilter === 'recent'
    ? [...requestedOnly].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    : requestedOnly.filter(d => d.status === activeFilter).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const displayIssued = [...issuedDocs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const loadingState = (
    <div className="flex items-center justify-center py-10 gap-3">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading…</p>
    </div>
  );

  return (
    <>
      {showRequestModal && (
        <RequestDocumentModal
          applicationId={applicationId}
          onClose={() => { setShowRequestModal(false); setSelectedStepForRequest(null); }}
          onSuccess={fetchDocuments}
          applicationTrackStepId={selectedStepForRequest?.applicationTrackStepId}
          periodStepId={selectedStepForRequest?.periodStepId}
          stepTitle={selectedStepForRequest?.title}
        />
      )}
      {showReviewModal && selectedDocForReview && (
        <DocumentReviewModal
          document={selectedDocForReview}
          defaultStatus={reviewDefaultStatus}
          onClose={() => { setShowReviewModal(false); setSelectedDocForReview(null); setReviewDefaultStatus(''); }}
          onSuccess={fetchDocuments}
        />
      )}

      {/* ── Requested from Client panel ── */}
      <CollapsiblePanel
        icon={Send}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        gradientFrom="from-blue-50"
        title="Document Requests"
        subtitle="Documents requested from client"
        badge={requestedOnly.length}
        defaultOpen={false}
      >
        {actionMessage.text && (
          <div className={`mx-4 mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {actionMessage.type === 'success'
              ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
              : <AlertCircle className="w-3 h-3 flex-shrink-0" />}
            {actionMessage.text}
          </div>
        )}

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 overflow-x-auto">
          {filters.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeFilter === f.key ? f.activeColor : f.color + ' hover:opacity-80'
              }`}>
              {f.label}
              {f.key !== 'recent' && counts[f.key] > 0 && (
                <span className="ml-1 opacity-75">({counts[f.key]})</span>
              )}
            </button>
          ))}
        </div>

        <div className="px-4 pb-4">
          {loading ? loadingState : displayRequested.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-gray-400">
                {activeFilter === 'recent' ? 'No document requests yet.' : `No ${activeFilter.replace('_', ' ').toLowerCase()} requests.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayRequested.map(doc => <DocCard key={doc.documentId} doc={doc} showReviewButtons />)}
            </div>
          )}
        </div>
      </CollapsiblePanel>

      {/* ── Issued by Staff panel ── */}
      <CollapsiblePanel
        icon={Upload}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        gradientFrom="from-emerald-50"
        title="Issued by Staff"
        subtitle="Documents provided by the team"
        badge={issuedDocs.length}
        defaultOpen={false}
      >
        <div className="px-4 pb-4 pt-3">
          {loading ? loadingState : displayIssued.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-gray-400">No documents issued yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayIssued.map(doc => <DocCard key={doc.documentId} doc={doc} />)}
            </div>
          )}
        </div>
      </CollapsiblePanel>
    </>
  );
};

// ─── SINGLE TRACK STEP ────────────────────────────────────────────────────────
const TrackStepItem = ({ step, isLast, applicationId, isPeriodStep = false, onOpenDocRequest, onOpenStepUpdate }) => {
  const statusConfig = getTrackStepStatusConfig(step.status);
  const isDone  = step.status === 'COMPLETED';
  const isError = step.status === 'ERROR';

  const handleRequestDoc = () => {
    if (isPeriodStep) {
      onOpenDocRequest({ title: step.title, periodStepId: step.periodStepId }, true);
    } else {
      onOpenDocRequest({ title: step.title, applicationTrackStepId: step.applicationTrackStepId }, false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
          isDone    ? 'bg-emerald-500 border-emerald-200'
          : isError ? 'bg-rose-500 border-rose-200'
          : step.status === 'PROCESSING' ? 'bg-blue-500 border-blue-200'
          : 'bg-gray-100 border-gray-200'
        }`}>
          {/* Always show the step number — colour conveys status */}
          <span className={`text-xs font-bold leading-none ${
            isDone || isError || step.status === 'PROCESSING' ? 'text-white' : 'text-gray-400'
          }`}>
            {step.order}
          </span>
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 ${isDone ? 'bg-emerald-300' : 'bg-gray-200'}`} style={{ minHeight: 16 }} />
        )}
      </div>

      <div className={`flex-1 mb-2 rounded-lg border p-3 ${statusConfig.bg} ${statusConfig.border}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">Step {step.order}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusConfig.badge}`}>
                {step.status}
              </span>
            </div>
            <h5 className={`text-sm font-semibold ${statusConfig.text}`}>{step.title}</h5>
            <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>

            {isError && step.remarks && (
              <div className="mt-2 px-2 py-1 bg-rose-100 border border-rose-200 rounded-lg">
                <p className="text-[10px] font-semibold text-rose-700">Action Required:</p>
                <p className="text-[10px] text-rose-600 italic">"{step.remarks}"</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleRequestDoc}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <FileText size={12} /> Request Doc
              </button>
              <button
                onClick={() => onOpenStepUpdate(step, isPeriodStep)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Edit size={12} /> Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SERVICE PERIOD CARD ─────────────────────────────────────────────────────
const ServicePeriodCard = ({ period, isFirst, applicationId, onOpenDocRequest, onOpenStepUpdate }) => {
  const [expanded, setExpanded] = useState(isFirst);
  const pct = period.completionPercent || 0;

  const periodStatusMap = {
    COMPLETED: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    PROCESSING: { bg: 'bg-blue-50',   border: 'border-blue-200',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700' },
    PENDING:    { bg: 'bg-gray-50',   border: 'border-gray-200',    text: 'text-gray-600',    badge: 'bg-gray-100 text-gray-600' },
    ERROR:      { bg: 'bg-rose-50',   border: 'border-rose-200',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700' },
  };
  const pCfg = periodStatusMap[period.status] || periodStatusMap.PENDING;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${pCfg.border} ${period.isLocked ? 'opacity-70' : ''}`}>
      <button
        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${pCfg.bg} hover:brightness-95`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            period.isLocked ? 'bg-gray-200' : pct === 100 ? 'bg-emerald-100' : 'bg-white/70'
          }`}>
            {period.isLocked
              ? <Lock size={12} className="text-gray-500" />
              : pct === 100 ? <CheckCircle size={12} className="text-emerald-600" />
              : <Calendar size={12} className={pCfg.text} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">{period.periodLabel}</span>
              {period.isLocked && (
                <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-600 rounded-full font-medium">Locked</span>
              )}
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${pCfg.badge}`}>
                {period.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold text-gray-900">{pct}%</span>
          {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3 bg-white border-t border-gray-100">
          {period.periodStep && period.periodStep.length > 0 && (
            <div className="space-y-1">
              {[...period.periodStep]
                .sort((a, b) => a.order - b.order)
                .map((step, i, arr) => (
                  <TrackStepItem
                    key={step.periodStepId}
                    step={{ ...step, periodStepId: step.periodStepId }}
                    isLast={i === arr.length - 1}
                    applicationId={applicationId}
                    isPeriodStep={true}
                    onOpenDocRequest={onOpenDocRequest}
                    onOpenStepUpdate={onOpenStepUpdate}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TRACK STEPS ─────────────────────────────────────────────────────────────
const TrackSteps = ({ application, onOpenDocRequest, onOpenStepUpdate }) => {
  if (!application) return null;

  const hasApplicationTrackSteps = application.applicationTrackStep?.length > 0;
  const hasServicePeriods        = application.servicePeriod?.length > 0;

  const appSteps = [...(application.applicationTrackStep || [])].sort((a, b) => a.order - b.order);
  const appDone  = appSteps.filter(s => s.status === 'COMPLETED').length;
  const appPct   = appSteps.length ? Math.round((appDone / appSteps.length) * 100) : 0;

  const periodDone  = (application.servicePeriod || []).filter(p => p.status === 'COMPLETED').length;
  const periodTotal = (application.servicePeriod || []).length;
  const periodPct   = periodTotal ? Math.round((periodDone / periodTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">Progress</span>
          <span className="text-xs font-bold text-blue-600">
            {hasServicePeriods ? periodPct : appPct}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${hasServicePeriods ? periodPct : appPct}%` }}
          />
        </div>
      </div>

      {hasApplicationTrackSteps && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Application Progress Steps</h4>
          {appSteps.map((step, idx) => (
            <TrackStepItem
              key={step.applicationTrackStepId}
              step={step}
              isLast={idx === appSteps.length - 1}
              applicationId={application.applicationId}
              isPeriodStep={false}
              onOpenDocRequest={onOpenDocRequest}
              onOpenStepUpdate={onOpenStepUpdate}
            />
          ))}
        </div>
      )}

      {hasServicePeriods && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Service Periods</h4>
          {[...application.servicePeriod]
            .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
            .map((period, i) => (
              <ServicePeriodCard
                key={period.servicePeriodId}
                period={period}
                isFirst={i === 0}
                applicationId={application.applicationId}
                onOpenDocRequest={onOpenDocRequest}
                onOpenStepUpdate={onOpenStepUpdate}
              />
            ))}
        </div>
      )}

      {!hasApplicationTrackSteps && !hasServicePeriods && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          No tracking data available
        </div>
      )}
    </div>
  );
};

// ─── STEP UPDATE MODAL ────────────────────────────────────────────────────────
const StepUpdateModal = ({ step, isPeriodStep, onClose, onSuccess }) => {
  const [updateStatus, setUpdateStatus] = useState(step.status);
  const [remarks, setRemarks]           = useState(step.remarks || '');
  const [description, setDescription]   = useState(step.description || '');
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState('');

  const handleSubmit = async () => {
    if (!updateStatus) { setError('Please select a status'); return; }
    if (updateStatus === 'ERROR' && !remarks.trim()) { setError('Please provide remarks for ERROR status'); return; }

    setSubmitting(true);
    setError('');
    try {
      const updateData = {
        applicationTrackStepId: !isPeriodStep ? step.applicationTrackStepId : undefined,
        periodStepId:            isPeriodStep  ? step.periodStepId           : undefined,
        description: description || `Status updated to ${updateStatus}`,
        updatedBy: employeeId,
        remarks: updateStatus === 'COMPLETED' ? null : remarks.trim() || null,
        status: updateStatus,
      };
      const response = await axiosInstance.put('/staff/steps/update/step', updateData);
      if (response.data.success) {
        toast('Step status updated successfully!');
        onSuccess();
        onClose();
      } else throw new Error(response.data.message || 'Failed to update status');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Update Step Status</h3>
              <p className="text-xs text-gray-500">{step.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={updateStatus}
              onChange={e => setUpdateStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="ERROR">Error/Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Enter description..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {updateStatus === 'ERROR' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Remarks <span className="text-red-500">* (required for Error)</span>
              </label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                placeholder="Enter reason for rejection..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm resize-none"
              />
            </div>
          )}

          {updateStatus === 'COMPLETED' && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">Remarks will be cleared for COMPLETED status.</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {submitting
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Updating…</>
              : <><Save className="w-4 h-4" /> Update Status</>}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN VIEWDETAILS COMPONENT ───────────────────────────────────────────────
export default function ViewDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [docCounts, setDocCounts]     = useState({ total: 0, pending: 0, uploaded: 0, verified: 0, rejected: 0, FOR_REVIEW: 0 });

  const [showDocRequestModal,       setShowDocRequestModal]       = useState(false);
  const [selectedStepForDocRequest, setSelectedStepForDocRequest] = useState(null);
  const [showStepUpdateModal,       setShowStepUpdateModal]       = useState(false);
  const [selectedStepForUpdate,     setSelectedStepForUpdate]     = useState(null);
  const [selectedStepIsPeriod,      setSelectedStepIsPeriod]      = useState(false);

  useEffect(() => {
    if (applicationId) fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/staff/applications/${employeeId}/detail/${applicationId}`);
      if (response.data.success) setApplication(response.data.application);
      else setError('Failed to load application details');
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.data?.message || 'Failed to load application details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocRequest = (stepOrPeriod, isPeriodStep) => {
    if (stepOrPeriod.periodStepId && !stepOrPeriod.applicationTrackStepId) {
      setSelectedStepForDocRequest({
        title: stepOrPeriod.title || stepOrPeriod.periodLabel,
        periodStepId: stepOrPeriod.periodStepId,
        periodLabel: stepOrPeriod.periodLabel,
      });
    } else {
      if (isPeriodStep) {
        setSelectedStepForDocRequest({
          title: stepOrPeriod.title,
          periodStepId: stepOrPeriod.periodStepId,
        });
      } else {
        setSelectedStepForDocRequest({
          title: stepOrPeriod.title,
          applicationTrackStepId: stepOrPeriod.applicationTrackStepId,
        });
      }
    }
    setShowDocRequestModal(true);
  };

  const handleOpenStepUpdate = (step, isPeriodStep) => {
    setSelectedStepForUpdate(step);
    setSelectedStepIsPeriod(isPeriodStep);
    setShowStepUpdateModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error || 'Application not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasFormData = Object.keys(application.formData || {}).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Global Modals */}
      {showDocRequestModal && selectedStepForDocRequest && (
        <RequestDocumentModal
          applicationId={application.applicationId}
          onClose={() => { setShowDocRequestModal(false); setSelectedStepForDocRequest(null); }}
          onSuccess={fetchApplicationDetails}
          applicationTrackStepId={selectedStepForDocRequest.applicationTrackStepId}
          periodStepId={selectedStepForDocRequest.periodStepId}
          stepTitle={selectedStepForDocRequest.title}
        />
      )}

      {showStepUpdateModal && selectedStepForUpdate && (
        <StepUpdateModal
          step={selectedStepForUpdate}
          isPeriodStep={selectedStepIsPeriod}
          onClose={() => { setShowStepUpdateModal(false); setSelectedStepForUpdate(null); setSelectedStepIsPeriod(false); }}
          onSuccess={fetchApplicationDetails}
        />
      )}

      <PageHeader
        title="Application Details"
        subtitle={`ID: ${application.applicationId?.slice(0, 8)}…`}
        onBack={() => navigate(-1)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Service Info Banner ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="shrink-0">
              {application.servicePhoto ? (
                <img
                  src={application.servicePhoto}
                  alt={application.serviceName}
                  className="w-40 h-full rounded-xl object-cover border border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900">{application.serviceName}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  application.serviceType === 'RECURRING'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {application.serviceType === 'RECURRING' ? 'Recurring' : 'One-time'}
                </span>
                {(() => {
                  const sc = getStatusConfig(application.status);
                  return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sc.color}`}>
                      {sc.label}
                    </span>
                  );
                })()}
              </div>
              {application.serviceDescription && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{application.serviceDescription}</p>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> Created {formatDate(application.createdAt)}</span>
                <span className="flex items-center gap-1"><Hash size={12} /> {application.applicationId?.slice(0, 12)}…</span>
                {application.userId && (
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-gray-400" />
                    <span className="font-medium text-gray-700">{application.userId.slice(0, 8)}…</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column layout: Progress + (Form + Documents) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

          {/* LEFT: Application Progress */}
          <div className="lg:sticky" style={{ top: 'calc(64px + 1.5rem)' }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Application Progress</h3>
                  <p className="text-xs text-gray-500">Track steps &amp; service periods</p>
                </div>
              </div>
              <div className="p-4">
                {((application.applicationTrackStep?.length > 0) || (application.servicePeriod?.length > 0)) ? (
                  <TrackSteps
                    application={application}
                    onOpenDocRequest={handleOpenDocRequest}
                    onOpenStepUpdate={handleOpenStepUpdate}
                  />
                ) : (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">No progress steps yet</p>
                    <p className="text-xs text-gray-400 mt-1">Steps will appear once the application is processed.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Form Data + Document Requests stacked */}
          <div className="space-y-5">

            {/* Form Data */}
            {hasFormData && (
              <FormDataSection formData={application.formData} />
            )}

            {/* Document Requests */}
            <DocumentManagementSection
              applicationId={application.applicationId}
              onCountChange={setDocCounts}
            />

          </div>

        </div>
      </div>
    </div>
  );
}