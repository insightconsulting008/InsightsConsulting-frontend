import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, X, Package, ChevronRight, Check, ArrowLeft,
  Loader2, CheckCircle, AlertTriangle, ImagePlus, Trash2,
  ChevronLeft, ChevronRight as ChevronRightIcon, Tag, Layers,
  Sparkles, ShieldCheck
} from 'lucide-react';
import PageHeader from '../../page-header/PageHeader';
import Cropper from "react-easy-crop";
import axiosInstance from '@src/providers/axiosInstance';

const TARGET_WIDTH = 1024;
const TARGET_HEIGHT = 512;

/* ── helper: create cropped image as a proper File from canvas ── */
async function getCroppedImg(imageSrc, croppedAreaPixels, fileName = 'bundle-cover.jpg') {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0, 0,
        TARGET_WIDTH,
        TARGET_HEIGHT
      );
      
      canvas.toBlob(blob => {
        if (!blob) { 
          reject(new Error('Canvas is empty')); 
          return; 
        }
        
        // Create File from Blob with proper name
        const file = new File([blob], fileName, { 
          type: 'image/jpeg', 
          lastModified: Date.now() 
        });
        
        // Create preview URL from the file
        const previewUrl = URL.createObjectURL(file);
        
        resolve({ file, previewUrl });
      }, 'image/jpeg', 0.92);
    });
    image.addEventListener('error', reject);
    image.src = imageSrc;
  });
}

export default function AddBundleService() {
  /* ── state ── */
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [bundleDetails, setBundleDetails] = useState({
    name: '',
    description: '',
    bundlePrice: '',
    bundleOfferPrice: '',
    isGstApplicable: true,
    gstPercentage: '18',
  });

  /* ── cropper state ── */
  const [rawImageSrc, setRawImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);

  /* ── final image state (File for upload) ── */
  const [photoFile, setPhotoFile] = useState(null);      // File object for FormData
  const [photoPreview, setPhotoPreview] = useState('');  // preview URL
  const [isImageRequired, setIsImageRequired] = useState(true);

  const [creatingBundle, setCreatingBundle] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1, limit: 9, totalPages: 1, totalRecords: 0,
  });
  
  const fileInputRef = useRef(null);
  const rawFileRef = useRef(null); // keeps original File for proper naming

  /* ─── fetch services ─── */
  const fetchServices = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/service?limit=9&page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );
      const list = res.data.services ?? [];
      const pag = res.data.pagination ?? {};
      setServices(list);
      setPagination({
        page: pag.page ?? page,
        limit: pag.limit ?? 9,
        totalPages: pag.totalPages ?? 1,
        totalRecords: pag.totalRecords ?? list.length,
      });
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  /* ─── search ─── */
  const handleSearch = () => fetchServices(1, searchQuery);

  /* ─── pagination ─── */
  const handlePageChange = (p) => {
    if (p >= 1 && p <= pagination.totalPages) fetchServices(p, searchQuery);
  };

  /* ─── service selection ─── */
  const toggleService = (svc) =>
    setSelectedServices(prev =>
      prev.some(s => s.serviceId === svc.serviceId)
        ? prev.filter(s => s.serviceId !== svc.serviceId)
        : [...prev, svc]
    );

  const removeService = (id) =>
    setSelectedServices(prev => prev.filter(s => s.serviceId !== id));

  /* ─── photo: open cropper ─── */
  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    rawFileRef.current = file; // keep original for naming
    
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
    setRawImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowCropper(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCropConfirm = async () => {
    try {
      setUploadingImage(true);
      
      const originalName = rawFileRef.current?.name || 'bundle-cover.jpg';
      const { file, previewUrl } = await getCroppedImg(rawImageSrc, croppedAreaPixels, originalName);
      
      // Clean up old preview
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      
      setPhotoFile(file);           // Store File object for FormData
      setPhotoPreview(previewUrl);  // Store preview URL
      setIsImageRequired(false);    // Image requirement satisfied
      setShowCropper(false);
      
      URL.revokeObjectURL(rawImageSrc);
      setRawImageSrc('');
      setImageDimensions({ width: 0, height: 0 });
    } catch (err) {
      console.error('Crop failed:', err);
      setError('Image crop failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    URL.revokeObjectURL(rawImageSrc);
    setRawImageSrc('');
    setImageDimensions({ width: 0, height: 0 });
  };

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview('');
    setIsImageRequired(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─── price helpers ─── */
  const totalIndividual = selectedServices.reduce((s, sv) => s + parseInt(sv.individualPrice || 0), 0);
  const totalOffer = selectedServices.reduce((s, sv) => s + parseInt(sv.offerPrice || 0), 0);

  const discount = () => {
    const base = parseFloat(bundleDetails.bundlePrice) || totalIndividual;
    const offer = parseFloat(bundleDetails.bundleOfferPrice) || 0;
    if (!base || !offer) return 0;
    return Math.round(((base - offer) / base) * 100);
  };

  const finalPrice = () => {
    const offer = parseFloat(bundleDetails.bundleOfferPrice) || totalOffer;
    if (!bundleDetails.isGstApplicable) return Math.round(offer);
    const gst = parseFloat(bundleDetails.gstPercentage) || 0;
    return Math.round(offer + (offer * gst) / 100);
  };

  const fmt = (n) => parseInt(n || 0).toLocaleString('en-IN');

  /* ─── GST toggle ─── */
  const handleGstToggle = (v) =>
    setBundleDetails(p => ({ ...p, isGstApplicable: v, gstPercentage: v ? '18' : '0' }));

  /* ─── create bundle ─── */
  const handleCreate = async () => {
    setError('');
    
    // Validation
    if (!bundleDetails.name.trim()) { 
      setError('Bundle name is required'); 
      return; 
    }
    if (!bundleDetails.description.trim()) { 
      setError('Bundle description is required'); 
      return; 
    }
    if (selectedServices.length === 0) { 
      setError('Select at least one service'); 
      return; 
    }
    if (!photoFile) { 
      setError('Cover image is required'); 
      return; 
    }
    if (!bundleDetails.bundleOfferPrice || parseFloat(bundleDetails.bundleOfferPrice) <= 0) {
      setError('Enter a valid offer price'); 
      return;
    }
    if (bundleDetails.isGstApplicable && (!bundleDetails.gstPercentage || parseFloat(bundleDetails.gstPercentage) <= 0)) {
      setError('Enter a valid GST percentage'); 
      return;
    }

    try {
      setCreatingBundle(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields
      formData.append('name', bundleDetails.name.trim());
      formData.append('description', bundleDetails.description.trim());
      formData.append('bundlePrice', String(parseFloat(bundleDetails.bundlePrice) || totalIndividual));
      formData.append('bundleOfferPrice', String(parseFloat(bundleDetails.bundleOfferPrice)));
      formData.append('finalBundlePrice', String(finalPrice()));
      formData.append('isGstApplicable', String(bundleDetails.isGstApplicable));
      formData.append('gstPercentage', String(parseFloat(bundleDetails.gstPercentage) || 0));
      
      // Append service IDs
      selectedServices.forEach(service => {
        formData.append('serviceIds', service.serviceId);
      });
      
      // IMPORTANT: Append the file with field name 'photoUrl' as requested
      if (photoFile) {
        formData.append('photoUrl', photoFile); // Using photoUrl field name
      }

      // Send as multipart/form-data
      const res = await axiosInstance.post('/admin/bundle', formData);

      if (res.data.success) {
        setSuccess('Bundle created successfully!');
        setShowSuccessPopup(true);
        
        // Reset form
        setBundleDetails({ 
          name: '', 
          description: '', 
          bundlePrice: '', 
          bundleOfferPrice: '',
          isGstApplicable: true, 
          gstPercentage: '18' 
        });
        setSelectedServices([]);
        clearPhoto();
        
        setTimeout(() => { 
          setSuccess(''); 
          setShowSuccessPopup(false); 
        }, 4000);
      }
    } catch (err) {
      console.error('Bundle creation error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create bundle.');
    } finally {
      setCreatingBundle(false);
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
  
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  /* ══════════════════════════════════════════════════════
     SUB-COMPONENTS (unchanged)
  ══════════════════════════════════════════════════════ */

  const ServiceCard = ({ service, isSelected, onToggle }) => (
    <div
      onClick={() => onToggle(service)}
      className={`relative rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden group ${
        isSelected
          ? 'border-primary bg-primary-50 shadow-md'
          : 'border-neutral-200 bg-white hover:border-primary hover:shadow-sm'
      }`}
      style={{ borderColor: isSelected ? 'var(--color-primary)' : undefined }}
    >
      <div className="h-1 w-full"
        style={{ background: isSelected ? 'var(--color-primary)' : 'var(--neutral-100)' }} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: isSelected ? 'var(--color-primary)' : 'var(--neutral-300)',
              backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
            }}
          >
            {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--neutral-900)' }}>
                {service.name}
              </h4>
              {service.serviceType === 'RECURRING' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                  Recurring
                </span>
              )}
            </div>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--neutral-500)' }}>
              {service.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold" style={{ color: 'var(--neutral-900)' }}>
                  ₹{fmt(service.offerPrice)}
                </span>
                {service.individualPrice !== service.offerPrice && (
                  <span className="text-xs line-through" style={{ color: 'var(--neutral-400)' }}>
                    ₹{fmt(service.individualPrice)}
                  </span>
                )}
              </div>
              {service.isGstApplicable === 'true' && (
                <span className="text-[10px] font-medium" style={{ color: 'var(--color-primary)' }}>
                  GST {service.gstPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SelectedChip = ({ service }) => (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
      style={{ borderColor: 'var(--primary-200)', background: 'var(--primary-50)' }}>
      <Package size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--neutral-900)' }}>
          {service.name}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-primary)' }}>
          ₹{fmt(service.offerPrice)}
        </p>
      </div>
      <button onClick={() => removeService(service.serviceId)}
        className="flex-shrink-0 p-1 rounded transition-colors hover:bg-white"
        style={{ color: 'var(--neutral-400)' }}>
        <X size={14} />
      </button>
    </div>
  );

  const PaginationRow = () => (
    <div className="flex items-center justify-between pt-4 mt-2 border-t"
      style={{ borderColor: 'var(--neutral-200)' }}>
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--neutral-300)', color: 'var(--neutral-700)' }}
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <span className="text-xs font-medium" style={{ color: 'var(--neutral-500)' }}>
        Page <b style={{ color: 'var(--neutral-900)' }}>{pagination.page}</b> / {pagination.totalPages}
      </span>
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--neutral-300)', color: 'var(--neutral-700)' }}
      >
        Next <ChevronRightIcon size={14} />
      </button>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Crop Modal (unchanged) ── */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
                Crop Image to {TARGET_WIDTH}×{TARGET_HEIGHT}
              </h3>
              <button
                onClick={handleCancelCrop}
                className="p-1 rounded transition-colors hover:bg-neutral-100"
              >
                <X size={20} style={{ color: 'var(--neutral-500)' }} />
              </button>
            </div>

            {/* Dimensions info */}
            {imageDimensions.width > 0 && imageDimensions.height > 0 && (
              <div className="mb-3 p-3 rounded-lg border"
                style={{ background: 'var(--info-50, #eff6ff)', borderColor: 'var(--info-200, #bfdbfe)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--info-800, #1e40af)' }}>
                      Original: {imageDimensions.width} × {imageDimensions.height}px
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--info-600, #2563eb)' }}>
                      Target: {TARGET_WIDTH} × {TARGET_HEIGHT}px (2:1 ratio)
                    </p>
                  </div>
                  {imageDimensions.width < TARGET_WIDTH || imageDimensions.height < TARGET_HEIGHT ? (
                    <div className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--warning-100, #fef9c3)', color: 'var(--warning-800, #854d0e)' }}>
                      Small Image
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--success-100, #dcfce7)', color: 'var(--success-800, #166534)' }}>
                      Good Size
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cropper */}
            <div className="relative w-full mb-4" style={{ height: '384px' }}>
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={TARGET_WIDTH / TARGET_HEIGHT}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    backgroundColor: '#f3f4f6',
                  },
                }}
              />
            </div>

            {/* Zoom slider */}
            <div className="space-y-1 mb-6">
              <label className="block text-sm font-medium" style={{ color: 'var(--neutral-700)' }}>
                Zoom
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: 'var(--color-primary)', background: 'var(--neutral-200)' }}
              />
              <div className="flex justify-between text-xs" style={{ color: 'var(--neutral-500)' }}>
                <span>1x</span>
                <span>2x</span>
                <span>3x</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCropConfirm}
                disabled={uploadingImage}
                className="flex-1 py-3 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed"
                style={{ background: uploadingImage ? 'var(--neutral-400)' : 'var(--color-primary)' }}
              >
                {uploadingImage ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Crop to ${TARGET_WIDTH}×${TARGET_HEIGHT}`
                )}
              </button>
              <button
                onClick={handleCancelCrop}
                className="px-6 py-3 rounded-lg border text-sm font-medium transition-colors hover:bg-neutral-50"
                style={{ borderColor: 'var(--neutral-300)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Popup Toast (unchanged) ── */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: '#fff',
              border: '1px solid var(--success-200, #bbf7d0)',
              animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <style>{`
              @keyframes popIn {
                from { opacity: 0; transform: scale(0.85) translateY(16px); }
                to   { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>

            {/* Green top bar */}
            <div className="h-1.5 w-full" style={{ background: 'var(--success-500, #22c55e)' }} />

            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--success-50, #f0fdf4)', border: '2px solid var(--success-200, #bbf7d0)' }}>
                  <CheckCircle size={36} style={{ color: 'var(--success-500, #22c55e)' }} />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-center text-lg font-bold mb-1" style={{ color: 'var(--neutral-900)' }}>
                Bundle Created!
              </h3>
              <p className="text-center text-sm" style={{ color: 'var(--neutral-500)' }}>
                Your service bundle is live and ready for customers.
              </p>

              {/* Progress bar */}
              <div className="mt-5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--neutral-100)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'var(--success-500, #22c55e)',
                    animation: 'shrink 4s linear forwards',
                    transformOrigin: 'left',
                  }}
                />
              </div>
              <style>{`
                @keyframes shrink {
                  from { width: 100%; }
                  to   { width: 0%; }
                }
              `}</style>

              {/* Dismiss */}
              <button
                onClick={() => { setShowSuccessPopup(false); setSuccess(''); }}
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--success-50, #f0fdf4)', color: 'var(--success-700, #15803d)', border: '1px solid var(--success-200, #bbf7d0)' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Page ── */}
      <div className="min-h-screen font-sans" style={{ background: 'var(--neutral-50)' }}>
        <PageHeader
          title="Create Service Bundle"
          subtitle="Package multiple services into a single compelling offer"
          onBack={() => window.history.back()}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">


          {/* ── Alerts (unchanged) ── */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border"
              style={{ background: 'var(--error-50)', borderColor: 'var(--error-100)', color: 'var(--error-600)' }}>
              <AlertTriangle size={18} />
              <span className="font-semibold text-sm">
                {error.length > 200 ? error.slice(0, 200) + '…' : error}
              </span>
              <button className="ml-auto" onClick={() => setError('')}><X size={15} /></button>
            </div>
          )}

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* LEFT — Bundle Details Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Card: Basic Info */}
              <section className="rounded-2xl border p-5 sm:p-7 shadow-sm bg-white"
                style={{ borderColor: 'var(--neutral-200)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'var(--primary-50)' }}>
                      <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--neutral-900)' }}>
                        Bundle Info
                      </h2>
                      <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>
                        Name, description &amp; cover image
                      </p>
                    </div>
                  </div>
                  
                </div>

                <div className="space-y-5">
                  {/* Bundle Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--neutral-800)' }}>
                      Bundle Name <span style={{ color: 'var(--error-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={bundleDetails.name}
                      onChange={e => setBundleDetails(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g., Startup Compliance Bundle"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={{ borderColor: 'var(--neutral-300)', color: 'var(--neutral-900)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--neutral-300)'}
                    />
                  </div>

                  {/* Bundle Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--neutral-800)' }}>
                      Description <span style={{ color: 'var(--error-500)' }}>*</span>
                    </label>
                    <textarea
                      value={bundleDetails.description}
                      onChange={e => setBundleDetails(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe what's included and the value it offers..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none"
                      style={{ borderColor: 'var(--neutral-300)', color: 'var(--neutral-900)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--neutral-300)'}
                    />
                  </div>

                  {/* Cover Image with Cropper - Required field indicator */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--neutral-800)' }}>
                      Cover Image <span style={{ color: 'var(--error-500)' }}>*</span>
                      <span className="ml-2 text-xs font-normal" style={{ color: 'var(--neutral-400)' }}>
                        {TARGET_WIDTH}×{TARGET_HEIGHT}px
                      </span>
                    </label>

                    {photoPreview ? (
                      <div className="mb-3">
                        {/* Preview */}
                        <div className="relative rounded-xl overflow-hidden border"
                          style={{ borderColor: 'var(--primary-200)', aspectRatio: '2/1' }}>
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => setPhotoPreview('')}
                          />
                          {/* top-left badge */}
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                            {TARGET_WIDTH}×{TARGET_HEIGHT}
                          </div>
                        </div>
                        {/* Action row */}
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-all hover:shadow-sm"
                            style={{ borderColor: 'var(--primary-200)', background: 'var(--primary-50)', color: 'var(--color-primary)' }}
                          >
                            <ImagePlus size={13} /> Change Image
                          </button>
                          <button
                            type="button"
                            onClick={clearPhoto}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all hover:shadow-sm"
                            style={{ borderColor: 'var(--error-100)', background: 'var(--error-50)', color: 'var(--error-600)' }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all mb-3 hover:border-primary-300"
                        style={{ 
                          borderColor: 'var(--primary-200)', 
                          background: 'var(--primary-50)', 
                          aspectRatio: '2/1', 
                          minHeight: '120px' 
                        }}
                      >
                        <ImagePlus size={28} style={{ color: 'var(--color-primary)' }} />
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                          Click to upload image <span style={{color:'var(--error-500)'}}>{isImageRequired && '(Required)'}</span>
                        </p>
                        <p className="text-xs" style={{ color: 'var(--neutral-400)' }}>
                          PNG, JPG, WEBP · Will be cropped to {TARGET_WIDTH}×{TARGET_HEIGHT}px
                        </p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFile} />
                  </div>
                </div>
              </section>

              {/* Card: Pricing (unchanged) */}
              <section className="rounded-2xl border p-5 sm:p-7 shadow-sm bg-white"
                style={{ borderColor: 'var(--neutral-200)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl" style={{ background: 'var(--primary-50)' }}>
                    <Tag size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--neutral-900)' }}>Pricing</h2>
                    <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>Set your bundle price and tax details</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* GST toggle */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--neutral-800)' }}>
                      GST Configuration
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { val: true, label: 'GST Applicable', icon: <CheckCircle size={16} /> },
                        { val: false, label: 'No GST', icon: <X size={16} /> },
                      ].map(({ val, label, icon }) => (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => handleGstToggle(val)}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all"
                          style={bundleDetails.isGstApplicable === val ? {
                            background: 'var(--primary-50)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                          } : {
                            background: '#fff',
                            borderColor: 'var(--neutral-200)',
                            color: 'var(--neutral-600)',
                          }}
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {bundleDetails.isGstApplicable && (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--neutral-800)' }}>
                        GST Percentage <span style={{ color: 'var(--error-500)' }}>*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number" min="0" max="100" step="0.1"
                          value={bundleDetails.gstPercentage}
                          onChange={e => setBundleDetails(p => ({ ...p, gstPercentage: e.target.value }))}
                          placeholder="18"
                          className="w-full pl-4 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                          style={{ borderColor: 'var(--neutral-300)' }}
                          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--neutral-300)'}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                          style={{ color: 'var(--neutral-400)' }}>%</span>
                      </div>
                    </div>
                  )}

                  {/* Price fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: 'Original Price (₹)',
                        key: 'bundlePrice',
                        placeholder: `Calculated: ₹${fmt(totalIndividual)}`,
                        hint: `Services total: ₹${fmt(totalIndividual)}`,
                        required: false,
                      },
                      {
                        label: 'Offer Price (₹)',
                        key: 'bundleOfferPrice',
                        placeholder: 'Discounted bundle price',
                        hint: bundleDetails.bundlePrice && bundleDetails.bundleOfferPrice
                          ? `${discount()}% discount`
                          : `Services offer total: ₹${fmt(totalOffer)}`,
                        required: true,
                      },
                    ].map(({ label, key, placeholder, hint, required }) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--neutral-800)' }}>
                          {label} {required && <span style={{ color: 'var(--error-500)' }}>*</span>}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm"
                            style={{ color: 'var(--neutral-400)' }}>₹</span>
                          <input
                            type="number" min="0"
                            value={bundleDetails[key]}
                            onChange={e => setBundleDetails(p => ({ ...p, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full pl-8 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                            style={{ borderColor: 'var(--neutral-300)' }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--neutral-300)'}
                          />
                        </div>
                        <p className="text-xs mt-1"
                          style={{ color: bundleDetails.bundlePrice && bundleDetails.bundleOfferPrice && key === 'bundleOfferPrice'
                            ? 'var(--success-600)' : 'var(--neutral-500)' }}>
                          {hint}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Final price preview */}
                  <div className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--neutral-800)' }}>
                        Final Price {bundleDetails.isGstApplicable ? `(incl. ${bundleDetails.gstPercentage}% GST)` : ''}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--neutral-500)' }}>
                        Customer pays this amount
                      </p>
                    </div>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
                      ₹{fmt(finalPrice())}
                    </p>
                  </div>
                </div>
              </section>

              {/* Card: Selected Services Summary */}
              {selectedServices.length > 0 && (
                <section className="rounded-2xl border p-5 sm:p-7 shadow-sm bg-white"
                  style={{ borderColor: 'var(--neutral-200)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ background: 'var(--primary-50)' }}>
                        <Layers size={20} style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--neutral-900)' }}>
                          Selected Services
                        </h2>
                        <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>
                          {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} in bundle
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                      {selectedServices.length} selected
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {selectedServices.map(s => <SelectedChip key={s.serviceId} service={s} />)}
                  </div>
                </section>
              )}

              {/* CTA — desktop only */}
              <div className="hidden lg:block">
                <button
                  onClick={handleCreate}
                  disabled={creatingBundle || selectedServices.length === 0 || !photoFile}
                  className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  {creatingBundle ? (
                    <><Loader2 size={19} className="animate-spin" /> Creating Bundle…</>
                  ) : (
                    <><Package size={19} /> Create Bundle</>
                  )}
                </button>
                <p className="text-center text-xs mt-3 pb-4" style={{ color: 'var(--neutral-400)' }}>
                  <ShieldCheck size={12} className="inline mr-1" />
                  Bundle will be available for purchase immediately after creation
                </p>
              </div>
            </div>

            {/* RIGHT — Service Selector (unchanged) */}
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border shadow-sm bg-white overflow-hidden"
                style={{ borderColor: 'var(--neutral-200)' }}>

                {/* Selector header */}
                <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--neutral-100)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base" style={{ color: 'var(--neutral-900)' }}>
                      Select Services
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'var(--primary-50)', color: 'var(--color-primary)' }}>
                      {selectedServices.length} selected
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>
                    {pagination.totalRecords} services available
                  </p>

                  {/* Search */}
                  <div className="relative mt-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--neutral-400)' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      placeholder="Search services…"
                      className="w-full pl-9 pr-16 py-2.5 rounded-xl border text-sm outline-none transition-all"
                      style={{ borderColor: 'var(--neutral-200)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--neutral-200)'}
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
                      style={{ background: 'var(--primary-50)', color: 'var(--color-primary)' }}
                    >
                      Go
                    </button>
                  </div>
                </div>

                {/* Service list */}
                <div className="p-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-3">
                      <Loader2 size={30} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                      <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>Loading services…</p>
                    </div>
                  ) : services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-3">
                      <Package size={32} style={{ color: 'var(--neutral-300)' }} />
                      <p className="text-sm font-semibold" style={{ color: 'var(--neutral-500)' }}>No services found</p>
                      <button
                        onClick={() => { setSearchQuery(''); fetchServices(); }}
                        className="text-xs font-bold underline"
                        style={{ color: 'var(--color-primary)' }}>
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                      {services.map(svc => (
                        <ServiceCard
                          key={svc.serviceId}
                          service={svc}
                          isSelected={selectedServices.some(s => s.serviceId === svc.serviceId)}
                          onToggle={toggleService}
                        />
                      ))}
                    </div>
                  )}

                  {!loading && services.length > 0 && pagination.totalPages > 1 && <PaginationRow />}
                </div>

                {/* CTA — mobile only */}
                <div className="lg:hidden px-5 pb-4 pt-2">
                  <button
                    onClick={handleCreate}
                    disabled={creatingBundle || selectedServices.length === 0 || !photoFile}
                    className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                  >
                    {creatingBundle ? (
                      <><Loader2 size={19} className="animate-spin" /> Creating Bundle…</>
                    ) : (
                      <><Package size={19} /> Create Bundle</>
                    )}
                  </button>
                  <p className="text-center text-xs mt-2" style={{ color: 'var(--neutral-400)' }}>
                    <ShieldCheck size={11} className="inline mr-1" />
                    Available immediately after creation
                  </p>
                </div>

                {/* Tips */}
                <div className="px-5 pb-5 pt-1">
                  <div className="rounded-xl p-4" style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-100)' }}>
                    <p className="text-xs font-bold mb-2" style={{ color: 'var(--neutral-700)' }}>Bundle Tips</p>
                    <ul className="space-y-1.5">
                      {[
                        'Combine related services for better value',
                        'Offer at least 20% discount on the bundle',
                        'Keep bundle name clear and descriptive',
                      ].map(tip => (
                        <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: 'var(--neutral-500)' }}>
                          <ChevronRight size={12} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}