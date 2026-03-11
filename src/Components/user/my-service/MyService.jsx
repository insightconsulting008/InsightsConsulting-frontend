import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';
import {
  Clock, Calendar, FileText, CheckCircle, X, Search, Filter,
  ChevronRight as ChevronRightIcon, Play, Check, Layers, Headphones,
  MessageSquare, HelpCircle, AlertCircle as AlertCircleIcon, File, MoreHorizontal,
  ChevronLeft, RefreshCw, AlertTriangle,
  Bell, Info, Activity, Briefcase,
  Zap, Eye as EyeIcon, CircleAlert,
  Upload, BarChart, FileCheck
} from 'lucide-react';

const SVC_STATUS = {
  NOT_STARTED: { dot: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-100', label: 'Not Started', Icon: Clock },
  IN_PROGRESS: { dot: 'bg-primary', text: 'text-primary-700', bg: 'bg-primary-100', label: 'In Progress', Icon: Activity },
  COMPLETED: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Completed', Icon: CheckCircle },
  CANCELLED: { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-100', label: 'Cancelled', Icon: X },
  ON_HOLD: { dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100', label: 'On Hold', Icon: AlertTriangle },
};


const SvcBadge = ({ status }) => {
  const c = SVC_STATUS[status] || SVC_STATUS.NOT_STARTED;
  const Icon = c.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <Icon size={12} />
      {c.label}
    </span>
  );
};

const TypeTag = ({ type }) => {
  // Check if it's recurring (monthly, quarterly, yearly, etc.) or one-time
  const isRecurring = type === 'MONTHLY' || type === 'QUARTERLY' || type === 'YEARLY' || type === 'RECURRING';
  
  return isRecurring
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <RefreshCw size={9}/> {type?.toLowerCase() || 'subscription'}
      </span>
    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-100 text-primary-700 border border-primary-200">
        <Zap size={9}/> One-Time
      </span>;
};

const ServiceCard = ({ myService, onView, onStart, isTransitioning }) => {
  const svc = myService.service;
  const isRec = svc.serviceType === 'MONTHLY' || svc.serviceType === 'QUARTERLY' || svc.serviceType === 'YEARLY' || svc.serviceType === 'RECURRING';
  const daysAgo = Math.floor((Date.now() - new Date(myService.createdAt)) / 86400000);
  const isStarted = myService.status !== 'NOT_STARTED';

  // Since there's no application data in your response, we'll use default values
  const needDocs = 0; // Default since no document data
  const hasError = false; // Default since no error data
  
  // Calculate progress based on status only since we don't have detailed step data
  let pct = 0;
  switch(myService.status) {
    case 'COMPLETED':
      pct = 100;
      break;
    case 'IN_PROGRESS':
      pct = 50;
      break;
    case 'ON_HOLD':
      pct = 30;
      break;
    case 'CANCELLED':
      pct = 0;
      break;
    default: // NOT_STARTED
      pct = 0;
  }

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex-shrink-0">
        <img 
          src={svc.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(svc.name || 'S')}&background=6869AC&color=fff&size=400`} 
          alt={svc.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"/>
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <SvcBadge status={myService.status}/>
          <TypeTag type={svc.serviceType}/>
        </div>
        {/* Only show notification badges if there's actual data */}
        {needDocs > 0 && (
          <div className="absolute bottom-10 left-3 flex flex-col gap-1.5">
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-lg shadow">
              <Bell size={10}/> {needDocs} doc{needDocs>1?'s':''} needed
            </span>
          </div>
        )}
        {hasError && (
          <div className="absolute bottom-10 left-3 flex flex-col gap-1.5">
            <span className="flex items-center gap-1 px-2 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-lg shadow">
              <CircleAlert size={10}/> Action needed
            </span>
          </div>
        )}
      
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-1">{svc.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">{svc.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Progress</span>
            <span className="text-[11px] font-bold text-gray-700">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${pct===100?'bg-emerald-500':pct===0?'bg-gray-300':'bg-primary'}`} 
              style={{ width:`${pct}%` }}
            />
          </div>
        </div>

        {/* Stats Grid - Simplified based on available data */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-primary-50 rounded-xl p-3 border border-primary-100">
            <p className="text-[10px] text-primary-500 mb-0.5 flex items-center gap-1">
              <FileText size={9}/> Status
            </p>
            <p className="text-sm font-bold text-gray-900 capitalize">
              {myService.status?.toLowerCase().replace('_', ' ') || '—'}
            </p>
          </div>
          <div className="bg-primary-50 rounded-xl p-3 border border-primary-100">
            <p className="text-[10px] text-primary-500 mb-0.5 flex items-center gap-1">
              <Calendar size={9}/> Created
            </p>
            <p className="text-sm font-bold text-gray-900">
              {new Date(myService.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {isStarted ? (
            <button 
              onClick={() => onView(myService)} 
              disabled={isTransitioning}
              className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <EyeIcon size={14}/> View Details
            </button>
          ) : (
            <button 
              onClick={() => onStart(myService)} 
              disabled={isTransitioning}
              className="w-full bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Play size={14}/> Start Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField = React.memo(({ field, formData, files, onInput, onCheck, onFile, onRemoveFile }) => {
  const { fieldId, type, label, placeholder, required, options } = field;
  if (!fieldId) return null;
  const value   = formData[fieldId] ?? '';
  const hasFile = !!files[fieldId];
  const onChange = e => onInput(fieldId, e.target.value);
  const base = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-primary transition-all text-[16px]";
  
  switch (type?.toLowerCase()) {
    case 'text': case 'email': case 'number': case 'tel':
      return <input type={type} value={value} onChange={onChange} placeholder={placeholder||`Enter ${label}`} required={required} className={base}/>;
    case 'textarea':
      return <textarea value={value} onChange={onChange} rows={4} placeholder={placeholder||`Enter ${label}`} required={required} className={base+' resize-none'}/>;
    case 'select':
      return (
        <select value={value} onChange={onChange} required={required} className={base+' appearance-none'}>
          <option value="">Select {label}</option>
          {options?.map((o,i)=><option key={i} value={o}>{o}</option>)}
        </select>
      );
    case 'radio':
      return (
        <div className="space-y-3">
          {options?.map((o,i)=>(
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <div className="relative flex-shrink-0">
                <input 
                  type="radio" 
                  name={`r-${fieldId}`} 
                  value={o} 
                  checked={value===o} 
                  onChange={()=>onInput(fieldId,o)} 
                  className="sr-only peer" 
                  required={required}
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-primary peer-checked:bg-primary peer-checked:border-[5px] transition-all"/>
              </div>
              <span className="text-sm text-gray-700">{o}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox': {
      const checked = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-3">
          {options?.map((o,i)=>{ 
            const on=checked.includes(o); 
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all flex-shrink-0 ${on?'bg-primary border-primary':'border-gray-300'}`} 
                  onClick={()=>onCheck(fieldId,o)}
                >
                  {on&&<Check size={11} className="text-white"/>}
                </div>
                <span className="text-sm text-gray-700">{o}</span>
              </label>
            ); 
          })}
        </div>
      );
    }
    case 'file':
      return (
        <div className="space-y-3">
          <label className="cursor-pointer block">
            <input 
              type="file" 
              onChange={e=>onFile(fieldId, e.target.files?.[0])} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" 
              required={required && !hasFile}
            />
            <div className={`flex flex-col items-center justify-center py-7 border-2 border-dashed rounded-xl transition-all ${hasFile?'border-emerald-300 bg-emerald-50':'border-primary-200 hover:border-primary hover:bg-primary-50'}`}>
              {hasFile ? (
                <>
                  <FileCheck className="w-9 h-9 text-emerald-500 mb-1.5"/>
                  <p className="text-sm font-semibold text-emerald-700">{files[fieldId]?.name}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to change</p>
                </>
              ) : (
                <>
                  <Upload className="w-9 h-9 text-primary-300 mb-1.5"/>
                  <p className="text-sm font-medium text-gray-500">Click to upload file</p>
                  <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG, DOC, XLS</p>
                </>
              )}
            </div>
          </label>
          {hasFile && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <File className="w-4 h-4 text-primary"/>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{files[fieldId]?.name}</p>
                  <p className="text-xs text-gray-400">{files[fieldId]?.size ? `${(files[fieldId].size/1024).toFixed(1)} KB` : ''}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={()=>onRemoveFile(fieldId)} 
                className="p-1.5 hover:bg-gray-200 rounded-lg ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X size={14}/>
              </button>
            </div>
          )}
        </div>
      );
    case 'date':
      return <input type="date" value={value} onChange={onChange} required={required} className={base}/>;
    default:
      return <input type="text" value={value} onChange={onChange} placeholder={placeholder||`Enter ${label}`} required={required} className={base}/>;
  }
}, (p, n) => {
  const fid = p.field.fieldId;
  return p.formData[fid]===n.formData[fid] && p.files[fid]===n.files[fid] &&
    p.onInput===n.onInput && p.onCheck===n.onCheck && p.onFile===n.onFile && p.onRemoveFile===n.onRemoveFile;
});

const InputFormDrawer = ({ show, service, serviceDetails, loadingDetails, submitSuccess, submitting, submitError, formData, files, onClose, onSubmit, onInput, onCheck, onFile, onRemoveFile }) => {
  if (!show || !service) return null;
  
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-white z-[60] border-l border-gray-100 flex flex-col" style={{ boxShadow: 'var(--shadow-drawer)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
          <ChevronLeft size={16}/> Back
        </button>
        {!loadingDetails && !submitSuccess && (
          <button 
            onClick={onSubmit} 
            disabled={submitting} 
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                Submitting…
              </>
            ) : (
              <>
                <Play size={14}/>Start Service
              </>
            )}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loadingDetails ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-gray-400">Loading requirements…</p>
          </div>
        ) : submitSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <Check className="w-10 h-10 text-emerald-500"/>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Submitted!</h3>
            <p className="text-gray-400 text-sm mb-8">Our team will review and get started shortly.</p>
            <button onClick={onClose} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover text-sm">
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-5 pb-12">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-32">
              <img 
                src={service.service?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.service?.name||'S')}&background=6869AC&color=fff&size=400`} 
                alt={service.service?.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-base font-bold text-white leading-tight">{service.service?.name}</h2>
                <SvcBadge status={service.status}/>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{service.service?.description}</p>
            <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <Info size={14} className="text-primary flex-shrink-0 mt-0.5"/>
              <p className="text-xs text-primary-700">Fill all required (<span className="text-rose-500 font-bold">*</span>) fields to start your service.</p>
            </div>
            <div className="space-y-5">
              {serviceDetails?.inputFields?.map(field => field.fieldId && (
                <div key={field.fieldId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-gray-800">
                      {field.label}
                      {field.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded-full capitalize border border-primary-100">
                      {field.type}
                    </span>
                  </div>
                  <InputField 
                    field={field} 
                    formData={formData} 
                    files={files} 
                    onInput={onInput} 
                    onCheck={onCheck} 
                    onFile={onFile} 
                    onRemoveFile={onRemoveFile}
                  />
                </div>
              ))}
            </div>
            {submitError && (
              <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircleIcon size={14} className="text-rose-500 flex-shrink-0 mt-0.5"/>
                <p className="text-sm text-rose-700">{submitError}</p>
              </div>
            )}
            <button 
              onClick={onSubmit} 
              disabled={submitting} 
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Submitting…
                </>
              ) : (
                <>
                  <Play size={15}/>Start Service Now
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MyService() {
  const navigate = useNavigate();
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInputForm, setShowInputForm] = useState(false);
  const [selectedServiceForInput, setSelectedServiceForInput] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldLabelMapping, setFieldLabelMapping] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, pending: 0 });
  const filePreviewRefs = useRef({});
  const userId = localStorage.getItem("userId");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/my-services/${userId}`);
      if (res.data.success) {
        const s = res.data.data;
        setMyServices(s);
        setStats({ 
          total: s.length, 
          active: s.filter(x => x.status === 'IN_PROGRESS').length, 
          completed: s.filter(x => x.status === 'COMPLETED').length, 
          pending: s.filter(x => x.status === 'NOT_STARTED' || x.status === 'ON_HOLD').length 
        });
      }
    } catch(e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  }, [userId]);

  useEffect(() => { 
    fetchServices(); 
  }, [fetchServices]);

  useEffect(() => {
    let filtered = myServices;
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    setFilteredServices(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage) || 1);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, myServices, itemsPerPage]);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const closeForm = useCallback(() => {
    Object.values(filePreviewRefs.current).forEach(u => u && URL.revokeObjectURL(u));
    filePreviewRefs.current = {};
    setShowInputForm(false); 
    setSelectedServiceForInput(null);
    setServiceDetails(null); 
    setFormData({}); 
    setFiles({}); 
    setSubmitError(''); 
    setSubmitSuccess(false); 
    setFieldLabelMapping({});
  }, []);

  const openDetail = useCallback((myService) => { 
    navigate(`/my-service/view/${myService.myServiceId}`); 
  }, [navigate]);

  const openStart = useCallback(async (s) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedServiceForInput(s); 
    setShowInputForm(true); 
    setLoadingServiceDetails(true);
    setFormData({}); 
    setFiles({}); 
    setSubmitError(''); 
    setSubmitSuccess(false);
    
    try {
      const res = await axiosInstance.get(`/service/${s.service.serviceId}`);
      if (res.data.success) {
        setServiceDetails(res.data.service);
        const init = {};
        const mapping = {};
        res.data.service.inputFields?.forEach(f => { 
          if (!f.fieldId) return; 
          mapping[f.fieldId] = f.label; 
          init[f.fieldId] = f.type === 'checkbox' ? [] : f.type === 'file' ? null : ''; 
        });
        setFormData(init); 
        setFieldLabelMapping(mapping);
      }
    } catch(e) { 
      setSubmitError('Failed to load service details.'); 
    } finally { 
      setLoadingServiceDetails(false); 
      setIsTransitioning(false); 
    }
  }, [isTransitioning]);

  const handleInput = useCallback((fid, v) => setFormData(p => ({ ...p, [fid]: v })), []);
  
  const handleCheck = useCallback((fid, opt) => setFormData(p => {
    const c = p[fid] || [];
    return { ...p, [fid]: c.includes(opt) ? c.filter(x => x !== opt) : [...c, opt] };
  }), []);
  
  const handleFile = useCallback((fid, file) => { 
    if (!file) return; 
    if (filePreviewRefs.current[fid]) URL.revokeObjectURL(filePreviewRefs.current[fid]); 
    filePreviewRefs.current[fid] = URL.createObjectURL(file); 
    setFiles(p => ({ ...p, [fid]: file })); 
    setFormData(p => ({ ...p, [fid]: 'file_uploaded' })); 
  }, []);
  
  const handleRemove = useCallback((fid) => { 
    if (filePreviewRefs.current[fid]) {
      URL.revokeObjectURL(filePreviewRefs.current[fid]);
      delete filePreviewRefs.current[fid];
    } 
    setFiles(p => {
      const n = { ...p };
      delete n[fid];
      return n;
    }); 
    setFormData(p => ({ ...p, [fid]: null })); 
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedServiceForInput || !serviceDetails) return;
    
    const missing = serviceDetails.inputFields?.filter(f => 
      f.required && (!formData[f.fieldId] || (Array.isArray(formData[f.fieldId]) && !formData[f.fieldId].length))
    ).map(f => f.label) || [];
    
    if (missing.length) {
      setSubmitError(`Required: ${missing.join(', ')}`);
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const fd = new FormData();
      fd.append('serviceId', serviceDetails.serviceId);
      
      Object.entries(formData).forEach(([fid, val]) => {
        const lbl = fieldLabelMapping[fid];
        if (!lbl || files[fid]) return;
        if (Array.isArray(val)) fd.append(lbl, JSON.stringify(val));
        else if (val) fd.append(lbl, val);
      });
      
      Object.entries(files).forEach(([fid, file]) => {
        const lbl = fieldLabelMapping[fid];
        if (lbl && file) fd.append(lbl, file);
      });
      
      const res = await axiosInstance.post(
        `/application/start/apply/${selectedServiceForInput.myServiceId}`, 
        fd, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      if (res.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          closeForm();
          fetchServices();
        }, 2000);
      } else {
        setSubmitError(res.data.message || 'Submission failed');
      }
    } catch(e) {
      setSubmitError(e.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedServiceForInput, serviceDetails, formData, files, fieldLabelMapping, closeForm, fetchServices]);

  const STAT_CARDS = [
    { label: 'Total', val: stats.total, Icon: Briefcase, color: 'text-primary', bg: 'bg-primary-50' },
    { label: 'Active', val: stats.active, Icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', val: stats.completed, Icon: CheckCircle, color: 'text-primary-700', bg: 'bg-primary-100' },
    { label: 'Pending', val: stats.pending, Icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--neutral-50)' }}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {showInputForm && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={closeForm}/>}
      
      <InputFormDrawer 
        show={showInputForm} 
        service={selectedServiceForInput} 
        serviceDetails={serviceDetails} 
        loadingDetails={loadingServiceDetails} 
        submitSuccess={submitSuccess} 
        submitting={submitting} 
        submitError={submitError} 
        formData={formData} 
        files={files} 
        onClose={closeForm} 
        onSubmit={handleSubmit} 
        onInput={handleInput} 
        onCheck={handleCheck} 
        onFile={handleFile} 
        onRemoveFile={handleRemove}
      />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">My Services</h1>
              <p className="text-sm text-gray-400 mt-0.5">Track and manage all your purchased services</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14}/>
                <input 
                  type="text" 
                  placeholder="Search services…" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 border border-gray-200 bg-white text-sm rounded-xl focus:border-primary w-52 transition-all outline-none"
                />
              </div>
              <div className="relative group">
                <button className="px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl hover:border-primary-200 flex items-center gap-1.5 text-sm font-medium text-gray-600">
                  <Filter size={13}/> Filter {statusFilter !== 'all' && <span className="w-1.5 h-1.5 bg-primary rounded-full"/>}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10" style={{ boxShadow: 'var(--shadow-xl)' }}>
                  <button 
                    onClick={() => setStatusFilter('all')} 
                    className="w-full px-3.5 py-2 text-sm text-left text-gray-700 hover:bg-primary-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Layers size={12} className="text-gray-400"/> All
                    </span>
                    {statusFilter === 'all' && <Check size={12} className="text-primary"/>}
                  </button>
                  {Object.entries(SVC_STATUS).map(([s, cfg]) => {
                    const Icon = cfg.Icon;
                    return (
                      <button 
                        key={s} 
                        onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)} 
                        className="w-full px-3.5 py-2 text-sm text-left text-gray-700 hover:bg-primary-50 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={12} className={cfg.text}/> {cfg.label}
                        </span>
                        {statusFilter === s && <Check size={12} className="text-primary"/>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button 
                onClick={fetchServices} 
                className="p-2.5 border border-gray-200 bg-white rounded-xl text-gray-400 hover:text-primary transition-all" 
                title="Refresh"
              >
                <RefreshCw size={14}/>
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STAT_CARDS.map(({ label, val, Icon, color, bg }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={17} className={color}/>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">{val}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
            <button 
              onClick={() => setStatusFilter('all')} 
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter === 'all' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-primary-50 hover:text-primary'}`}
            >
              All ({stats.total})
            </button>
            {Object.entries(SVC_STATUS).map(([status, cfg]) => {
              const cnt = myServices.filter(s => s.status === status).length;
              const Icon = cfg.Icon;
              return (
                <button 
                  key={status} 
                  onClick={() => setStatusFilter(status)} 
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter === status ? 'bg-primary text-white' : 'text-gray-500 hover:bg-primary-50 hover:text-primary'}`}
                >
                  <Icon size={12}/> {cfg.label} ({cnt})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-gray-400">Loading your services…</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={26} className="text-primary-300"/>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No services found</h3>
            <p className="text-sm text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters.' : "You haven't purchased any services yet."}
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }} 
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors"
            >
              {searchQuery || statusFilter !== 'all' ? 'Clear Filters' : 'Browse Services'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                Showing <strong className="text-gray-700">{paginatedServices.length}</strong> of <strong className="text-gray-700">{filteredServices.length}</strong>
              </p>
              <select 
                value={itemsPerPage} 
                onChange={e => setItemsPerPage(Number(e.target.value))} 
                className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white outline-none focus:border-primary"
              >
                {[6, 9, 12, 15].map(n => <option key={n} value={n}>Show {n}</option>)}
              </select>
            </div>
            
            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {paginatedServices.map(s => (
                <ServiceCard 
                  key={s.myServiceId} 
                  myService={s} 
                  onView={openDetail} 
                  onStart={openStart} 
                  isTransitioning={isTransitioning}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {filteredServices.length > itemsPerPage && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length}
                </p>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14}/>
                  </button>
                  
                  {getPageNumbers().map((pn, i) => (
                    pn === '...' 
                      ? <span key={`d${i}`} className="px-2 text-gray-300"><MoreHorizontal size={13}/></span>
                      : <button 
                          key={pn} 
                          onClick={() => {
                            setCurrentPage(pn);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} 
                          className={`min-w-[34px] h-9 rounded-lg text-sm font-semibold transition-all ${currentPage === pn ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary'}`}
                        >
                          {pn}
                        </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages} 
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRightIcon size={14}/>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Support Banner */}
        {!loading && filteredServices.length > 0 && (
          <div 
            className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-950) 100%)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgb(255 255 255 / 0.12)' }}>
                <Headphones size={19} className="text-white"/>
              </div>
              <div>
                <p className="font-bold text-white">24/7 Expert Support</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--primary-300)' }}>Avg response 2 min · 98% satisfaction</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button className="px-4 py-2 bg-white text-primary rounded-xl text-sm font-bold hover:bg-primary-50 flex items-center gap-1.5">
                <MessageSquare size={13}/> Chat
              </button>
              <button 
                className="px-4 py-2 border text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors"
                style={{ borderColor: 'rgb(255 255 255 / 0.15)', background: 'rgb(255 255 255 / 0.08)' }}
              >
                <HelpCircle size={13}/> Help
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}