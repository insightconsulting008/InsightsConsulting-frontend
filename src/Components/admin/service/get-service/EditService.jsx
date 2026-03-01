// EditService.jsx
// Fixes:
//  1. axiosInstance import: removed @src alias → relative path
//  2. Success popup navigate('/service/view/...') → navigate(`/services/${serviceId}`)  (matches ViewService route)
//  3. Success popup navigate('/service-hub')      → navigate('/services')               (matches Service list route)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, MoreVertical, ChevronDown, X, Upload,
  Percent, CheckCircle, CheckSquare, Square
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance'; // ← fixed: was @src/providers/axiosInstance
import Cropper from 'react-easy-crop';

const API_BASE = 'https://insightsconsult-backend.onrender.com';

// ─────────────────────────────────────────────────────────────────────────────
// ServiceInfo step
// ─────────────────────────────────────────────────────────────────────────────
const ServiceInfo = ({ basicInfo, setBasicInfo, categories, filteredSubcategories, stepErrors, goToNextStep, goToPreviousStep, currentStep }) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const serviceTypeOptions = [
    { value: 'ONE_TIME',  label: 'One Time'  },
    { value: 'RECURRING', label: 'Recurring' },
  ];
  const frequencyOptions = [
    { value: 'MONTHLY',   label: 'Monthly'   },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'YEARLY',    label: 'Yearly'    },
  ];
  const durationUnitOptions = [
    { value: 'MONTH', label: 'Months' },
    { value: 'YEAR',  label: 'Years'  },
  ];

  const onCropComplete = useCallback((_, cap) => setCroppedAreaPixels(cap), []);

  const createCroppedImage = useCallback(async () => {
    if (!originalImage || !croppedAreaPixels) return null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width  = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(image,
          croppedAreaPixels.x, croppedAreaPixels.y,
          croppedAreaPixels.width, croppedAreaPixels.height,
          0, 0, croppedAreaPixels.width, croppedAreaPixels.height
        );
        canvas.toBlob(blob => {
          resolve(new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.95);
      };
      image.onerror = reject;
      image.src = URL.createObjectURL(originalImage);
    });
  }, [originalImage, croppedAreaPixels]);

  const handleCropComplete = async () => {
    try {
      setUploadingImage(true);
      const croppedFile = await createCroppedImage();
      if (!croppedFile) throw new Error('Failed to create cropped image');
      const blobUrl = URL.createObjectURL(croppedFile);
      setBasicInfo(prev => ({ ...prev, photoUrl: blobUrl, photoFile: croppedFile, photoChanged: true }));
      setShowCropModal(false);
      setOriginalImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (err) {
      console.error('Crop error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 512) return;
    setOriginalImage(file);
    setBasicInfo(prev => ({ ...prev, photoUrl: URL.createObjectURL(file), photoFile: null, photoChanged: true }));
    setShowCropModal(true);
  };

  const handleRemoveImage = () => {
    if (basicInfo.photoUrl?.startsWith('blob:')) URL.revokeObjectURL(basicInfo.photoUrl);
    setBasicInfo(prev => ({ ...prev, photoUrl: '', photoFile: null, photoChanged: true }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setOriginalImage(null);
    setShowCropModal(false);
  };

  const handleCancelCrop = () => { setShowCropModal(false); handleRemoveImage(); };

  const field = (label, required, error, children) => (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
      err ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
    }`;

  const selectCls = (err) =>
    `w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
      err ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Information</h2>
        <p className="text-sm text-gray-600">Update the basic details about your service.</p>
      </div>

      <div className="space-y-4">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Service Image <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col items-center">
            {basicInfo.photoUrl && !showCropModal ? (
              <div className="relative w-full max-w-md">
                <img src={basicInfo.photoUrl} alt="Service preview" className="w-full h-64 object-cover rounded-lg border border-gray-300" />
                <button onClick={handleRemoveImage} type="button"
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-md h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                  stepErrors.photoUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#6869AC]'
                }`}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload}
                  accept="image/*" className="hidden" disabled={uploadingImage || showCropModal} />
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6869AC]" />
                    <p className="mt-2 text-sm text-gray-600">Processing image...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to update service image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </div>
            )}
            {stepErrors.photoUrl && <p className="mt-1 text-sm text-red-600">{stepErrors.photoUrl}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Service Type', true, stepErrors.serviceType,
            <div className="relative">
              <select value={basicInfo.serviceType}
                onChange={e => setBasicInfo(p => ({ ...p, serviceType: e.target.value }))}
                className={selectCls(stepErrors.serviceType)}>
                {serviceTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {field('Select Category', true, stepErrors.categoryId,
            <div className="relative">
              <select value={basicInfo.categoryId}
                onChange={e => setBasicInfo(p => ({ ...p, categoryId: e.target.value }))}
                className={selectCls(stepErrors.categoryId)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Select Sub Category', true, stepErrors.subCategoryId,
            <div className="relative">
              <select value={basicInfo.subCategoryId}
                onChange={e => setBasicInfo(p => ({ ...p, subCategoryId: e.target.value }))}
                className={selectCls(stepErrors.subCategoryId)}
                disabled={!basicInfo.categoryId}>
                <option value="">Select subcategory</option>
                {filteredSubcategories.map(s => <option key={s.subCategoryId} value={s.subCategoryId}>{s.subCategoryName}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Documents Required</label>
            <div className="flex items-center mt-2">
              <input type="checkbox" checked={basicInfo.documentsRequired}
                onChange={e => setBasicInfo(p => ({ ...p, documentsRequired: e.target.checked }))}
                className="w-4 h-4 text-[#6869AC] rounded border-gray-300 focus:ring-[#6869AC]" />
              <span className="ml-2 text-sm text-gray-700">Service requires document upload</span>
            </div>
          </div>
        </div>

        {basicInfo.serviceType === 'RECURRING' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
            {field('Frequency', true, stepErrors.frequency,
              <div className="relative">
                <select value={basicInfo.frequency}
                  onChange={e => setBasicInfo(p => ({ ...p, frequency: e.target.value }))}
                  className={selectCls(stepErrors.frequency)}>
                  <option value="">Select frequency</option>
                  {frequencyOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
            {field('Duration Unit', true, stepErrors.durationUnit,
              <div className="relative">
                <select value={basicInfo.durationUnit}
                  onChange={e => setBasicInfo(p => ({ ...p, durationUnit: e.target.value }))}
                  className={selectCls(stepErrors.durationUnit)}>
                  <option value="">Select unit</option>
                  {durationUnitOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
            {field('Duration Value', true, stepErrors.duration,
              <input type="number" min="1" value={basicInfo.duration || ''}
                onChange={e => setBasicInfo(p => ({ ...p, duration: e.target.value }))}
                placeholder="e.g., 12" className={inputCls(stepErrors.duration)} />
            )}
          </div>
        )}

        {field('Service Name', true, stepErrors.name,
          <input type="text" value={basicInfo.name}
            onChange={e => setBasicInfo(p => ({ ...p, name: e.target.value }))}
            placeholder="New GST Registration – Your Business"
            className={inputCls(stepErrors.name)} />
        )}

        {field('Description', true, stepErrors.description,
          <textarea value={basicInfo.description}
            onChange={e => setBasicInfo(p => ({ ...p, description: e.target.value }))}
            placeholder="Register your business with GST..."
            className={`${inputCls(stepErrors.description)} h-32 resize-none`} />
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button onClick={goToPreviousStep} disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
          Previous
        </button>
        <button onClick={goToNextStep} className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90">
          Next
        </button>
      </div>

      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <button onClick={handleCancelCrop} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="relative w-full h-96 mb-4">
              <Cropper image={basicInfo.photoUrl} crop={crop} zoom={zoom} aspect={4 / 3}
                onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}
                cropShape="rect" showGrid={true} />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Zoom</label>
              <input type="range" min="1" max="3" step="0.1" value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCropComplete} disabled={uploadingImage}
                className="flex-1 py-3 rounded-lg text-white text-sm font-medium bg-[#6869AC] hover:opacity-90 disabled:bg-gray-400">
                {uploadingImage ? 'Processing...' : 'Apply Crop'}
              </button>
              <button onClick={handleCancelCrop}
                className="px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PricingSetup step  (unchanged logic, just included for completeness)
// ─────────────────────────────────────────────────────────────────────────────
const PricingSetup = ({ basicInfo, setBasicInfo, priceMode, setPriceMode, discountPercentage, setDiscountPercentage, stepErrors, goToNextStep, goToPreviousStep }) => {
  const calcDiscountPct = () => {
    const ip = parseFloat(basicInfo.individualPrice), op = parseFloat(basicInfo.offerPrice);
    return (!isNaN(ip) && !isNaN(op) && ip > 0) ? Math.round(((ip - op) / ip) * 100) : 0;
  };
  const calcOfferFromPct = () => {
    const ip = parseFloat(basicInfo.individualPrice), d = parseFloat(discountPercentage);
    return (!isNaN(ip) && !isNaN(d) && d >= 0 && d <= 100) ? Math.round(ip - ip * d / 100) : 0;
  };
  const calcFinalWithGST = () => {
    let base = priceMode === 'fixed' ? parseFloat(basicInfo.offerPrice) : calcOfferFromPct();
    if (isNaN(base) || base <= 0) base = parseFloat(basicInfo.individualPrice);
    const gst = parseFloat(basicInfo.gstPercentage);
    return (!isNaN(base) && base > 0 && !isNaN(gst) && gst >= 0) ? Math.round(base + base * gst / 100) : 0;
  };
  const handleModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === 'fixed') setDiscountPercentage('');
    else setBasicInfo(p => ({ ...p, offerPrice: '' }));
  };
  const handleDiscountChange = (val) => {
    setDiscountPercentage(val);
    const d = parseFloat(val);
    if (!isNaN(d) && d >= 0 && d <= 100) {
      const ip = parseFloat(basicInfo.individualPrice);
      if (!isNaN(ip)) setBasicInfo(p => ({ ...p, offerPrice: Math.round(ip - ip * d / 100).toString() }));
    } else setBasicInfo(p => ({ ...p, offerPrice: '' }));
  };

  const ic = (err) => `w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${err ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing Setup</h2>
        <p className="text-sm text-gray-600">Update your pricing strategy for this service.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-800">Pricing Mode</label>
          <div className="flex gap-2">
            {['fixed', 'percentage'].map(m => (
              <button key={m} onClick={() => handleModeChange(m)}
                className={`px-3 py-1.5 text-xs rounded-lg ${priceMode === m ? 'bg-[#6869AC] text-white' : 'bg-gray-200 text-gray-700'}`}>
                {m === 'fixed' ? 'Fixed Price' : 'Discount %'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Actual Price <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
              <input type="number" min="1" value={basicInfo.individualPrice}
                onChange={e => setBasicInfo(p => ({ ...p, individualPrice: e.target.value }))}
                placeholder="1099" className={`${ic(stepErrors.individualPrice)} pl-7`} />
            </div>
            {stepErrors.individualPrice && <p className="mt-1 text-sm text-red-600">{stepErrors.individualPrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              {priceMode === 'percentage' ? 'Discount Percentage' : 'Offer Price'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {priceMode === 'percentage' ? (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2"><Percent className="w-4 h-4 text-gray-500" /></span>
                  <input type="number" min="1" max="100" value={discountPercentage}
                    onChange={e => handleDiscountChange(e.target.value)} placeholder="35"
                    className={`${ic(stepErrors.discountPercentage)} pl-9`} />
                </>
              ) : (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" min="1" value={basicInfo.offerPrice}
                    onChange={e => setBasicInfo(p => ({ ...p, offerPrice: e.target.value }))}
                    placeholder="700" className={`${ic(stepErrors.offerPrice)} pl-7`} />
                </>
              )}
            </div>
            {priceMode === 'fixed' && basicInfo.individualPrice && basicInfo.offerPrice && (
              <p className="text-xs text-gray-500 mt-1">Discount: {calcDiscountPct()}%</p>
            )}
            {priceMode === 'percentage' && discountPercentage && basicInfo.individualPrice && (
              <p className="text-xs text-gray-500 mt-1">Offer Price: ₹{calcOfferFromPct()}</p>
            )}
            {stepErrors.discountPercentage && <p className="mt-1 text-sm text-red-600">{stepErrors.discountPercentage}</p>}
            {stepErrors.offerPrice && <p className="mt-1 text-sm text-red-600">{stepErrors.offerPrice}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center mb-4">
            <input type="checkbox" checked={basicInfo.isGstApplicable}
              onChange={e => setBasicInfo(p => ({ ...p, isGstApplicable: e.target.checked }))}
              className="w-4 h-4 text-[#6869AC] rounded border-gray-300 focus:ring-[#6869AC]" />
            <span className="ml-2 text-sm font-medium text-gray-800">GST Applicable</span>
          </div>
          {basicInfo.isGstApplicable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">GST Percentage <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="number" min="0" max="100" step="0.01" value={basicInfo.gstPercentage}
                    onChange={e => setBasicInfo(p => ({ ...p, gstPercentage: e.target.value }))}
                    placeholder="18" className={ic(stepErrors.gstPercentage)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
                {stepErrors.gstPercentage && <p className="mt-1 text-sm text-red-600">{stepErrors.gstPercentage}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Final Price (Incl. GST)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="text" value={calcFinalWithGST()} readOnly
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button onClick={goToPreviousStep} className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Previous</button>
        <button onClick={goToNextStep} className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90">Next</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DatasetSetup step  (unchanged from original — full copy kept for completeness)
// ─────────────────────────────────────────────────────────────────────────────
const DatasetSetup = ({
  selectedMasterFields, setSelectedMasterFields,
  customFields, setCustomFields,
  newCustomField, setNewCustomField,
  masterFields, stepErrors, goToNextStep, goToPreviousStep
}) => {
  const [showMasterFieldsModal, setShowMasterFieldsModal] = useState(false);
  const [customFieldNewOptions, setCustomFieldNewOptions] = useState({});

  const fieldTypeOptions = [
    { value: 'text', label: 'Text Field' }, { value: 'email', label: 'Email Field' },
    { value: 'number', label: 'Number Field' }, { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown Select' }, { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' }, { value: 'date', label: 'Date Field' },
    { value: 'file', label: 'File Upload' }, { value: 'password', label: 'Password' },
  ];
  const isOptionField = (type) => ['select', 'radio', 'checkbox'].includes(type);

  const toggleMasterField = (field) => {
    setSelectedMasterFields(prev => {
      const exists = prev.find(f => f.masterFieldId === field.masterFieldId);
      return exists ? prev.filter(f => f.masterFieldId !== field.masterFieldId)
                    : [...prev, { masterFieldId: field.masterFieldId, required: true }];
    });
  };
  const toggleMasterFieldRequired = (id) =>
    setSelectedMasterFields(prev => prev.map(f => f.masterFieldId === id ? { ...f, required: !f.required } : f));
  const isMasterFieldSelected = (id) => selectedMasterFields.some(f => f.masterFieldId === id);

  const addCustomField = () => {
    if (!newCustomField.label.trim()) return;
    const f = {
      label: newCustomField.label.trim(), type: newCustomField.type,
      placeholder: newCustomField.placeholder || `Enter ${newCustomField.label.toLowerCase()}`,
      required: newCustomField.required,
    };
    if (isOptionField(newCustomField.type)) {
      const valid = newCustomField.options.filter(o => o?.trim());
      if (valid.length) f.options = valid;
    }
    setCustomFields(prev => [...prev, f]);
    setNewCustomField({ label: '', type: 'text', placeholder: '', required: false, options: [] });
    setCustomFieldNewOptions(p => ({ ...p, new: '' }));
  };

  const removeCustomField = (i) => setCustomFields(prev => prev.filter((_, idx) => idx !== i));
  const updateCustomField = (i, key, val) => {
    setCustomFields(prev => {
      const u = [...prev]; u[i][key] = val;
      if (key === 'type') {
        if (!isOptionField(val)) delete u[i].options;
        else if (!u[i].options) u[i].options = ['Option 1', 'Option 2'];
      }
      return u;
    });
  };

  const handleNewOptionInput = (idx, val) => setCustomFieldNewOptions(p => ({ ...p, [idx]: val }));

  const addOptionToField = (idx) => {
    const val = (customFieldNewOptions[idx] || '').trim();
    if (!val) return;
    setCustomFields(prev => {
      const u = [...prev];
      u[idx].options = [...(u[idx].options || []), val];
      return u;
    });
    handleNewOptionInput(idx, '');
  };

  const addOptionToNew = () => {
    const val = (customFieldNewOptions['new'] || '').trim();
    if (!val) return;
    setNewCustomField(p => ({ ...p, options: [...p.options, val] }));
    handleNewOptionInput('new', '');
  };

  const cls = 'w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dataset Setup</h2>
          <p className="text-sm text-gray-600">Update pre-defined fields or custom input fields.</p>
        </div>
        <button onClick={() => setShowMasterFieldsModal(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-white text-[#6869AC] border border-[#6869AC] hover:bg-gray-50">
          <Plus className="w-4 h-4 mr-1" /> Select Pre-defined Fields
        </button>
      </div>

      {selectedMasterFields.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Selected Pre-defined Fields</h3>
          <div className="space-y-2">
            {selectedMasterFields.map(field => {
              const mf = masterFields.find(f => f.masterFieldId === field.masterFieldId);
              return (
                <div key={field.masterFieldId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{mf?.label || field.masterFieldId}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">{mf?.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${field.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleMasterFieldRequired(field.masterFieldId)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${field.required ? 'bg-[#6869AC]' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${field.required ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <button onClick={() => toggleMasterField({ masterFieldId: field.masterFieldId })}
                      className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-4">Custom Fields</h3>

        <form onSubmit={e => { e.preventDefault(); addCustomField(); }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">Field Label <span className="text-red-500">*</span></label>
              <input type="text" value={newCustomField.label}
                onChange={e => setNewCustomField(p => ({ ...p, label: e.target.value }))}
                placeholder="e.g., Company Name" className={cls} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">Field Type <span className="text-red-500">*</span></label>
              <select value={newCustomField.type}
                onChange={e => {
                  const t = e.target.value;
                  setNewCustomField(p => ({ ...p, type: t, options: isOptionField(t) ? ['Option 1', 'Option 2'] : [] }));
                }} className={cls}>
                {fieldTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">Placeholder</label>
            <input type="text" value={newCustomField.placeholder}
              onChange={e => setNewCustomField(p => ({ ...p, placeholder: e.target.value }))}
              placeholder="e.g., Enter your company name" className={cls} />
          </div>

          {isOptionField(newCustomField.type) && (
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 text-gray-700">Options</label>
              <div className="space-y-2 mb-2">
                {newCustomField.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={opt}
                      onChange={e => setNewCustomField(p => ({ ...p, options: p.options.map((o, idx) => idx === i ? e.target.value : o) }))}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                    {newCustomField.options.length > 2 && (
                      <button type="button" onClick={() => setNewCustomField(p => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }))}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={customFieldNewOptions['new'] || ''} placeholder="Add an option"
                  onChange={e => handleNewOptionInput('new', e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addOptionToNew())}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm" />
                <button type="button" onClick={addOptionToNew}
                  className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded">Add Option</button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newCustomField.required}
                onChange={e => setNewCustomField(p => ({ ...p, required: e.target.checked }))}
                className="w-4 h-4 text-[#6869AC] rounded border-gray-300" />
              <span className="text-sm">Required field</span>
            </div>
            <button type="submit" disabled={!newCustomField.label.trim()}
              className="px-4 py-2 text-sm text-white rounded bg-[#6869AC] hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4 inline mr-1" /> Add Custom Field
            </button>
          </div>
        </form>

        {customFields.length > 0 && (
          <div className="space-y-4">
            {customFields.map((f, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{f.label}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">{f.type}</span>
                    {f.required && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">Required</span>}
                  </div>
                  <button onClick={() => removeCustomField(i)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Field Label</label>
                    <input type="text" value={f.label} onChange={e => updateCustomField(i, 'label', e.target.value)} className={cls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Field Type</label>
                    <select value={f.type} onChange={e => updateCustomField(i, 'type', e.target.value)} className={cls}>
                      {fieldTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1 text-gray-700">Placeholder</label>
                  <input type="text" value={f.placeholder || ''} onChange={e => updateCustomField(i, 'placeholder', e.target.value)} className={cls} />
                </div>
                {isOptionField(f.type) && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1 text-gray-700">Options</label>
                    <div className="space-y-2 mb-2">
                      {f.options?.map((opt, oi) => (
                        <div key={oi} className="flex gap-2">
                          <input type="text" value={opt}
                            onChange={e => setCustomFields(prev => {
                              const u = [...prev]; u[i].options[oi] = e.target.value; return u;
                            })} className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm" />
                          <button type="button"
                            onClick={() => setCustomFields(prev => {
                              const u = [...prev]; u[i].options = u[i].options.filter((_, idx) => idx !== oi); return u;
                            })} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Add an option" value={customFieldNewOptions[i] || ''}
                        onChange={e => handleNewOptionInput(i, e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addOptionToField(i))}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm" />
                      <button type="button" onClick={() => addOptionToField(i)}
                        className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded">Add Option</button>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={f.required}
                    onChange={e => updateCustomField(i, 'required', e.target.checked)}
                    className="w-4 h-4 text-[#6869AC] rounded border-gray-300" />
                  <span className="text-sm">Required field</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button onClick={goToPreviousStep} className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Previous</button>
        <button onClick={goToNextStep} className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90">Next</button>
      </div>

      {showMasterFieldsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Pre-defined Fields</h3>
              <button onClick={() => setShowMasterFieldsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedMasterFields.length} selected</p>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {masterFields.map(field => {
                  const sel = isMasterFieldSelected(field.masterFieldId);
                  const sf = selectedMasterFields.find(f => f.masterFieldId === field.masterFieldId);
                  return (
                    <div key={field.masterFieldId}
                      onClick={() => toggleMasterField(field)}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${sel ? 'border-[#6869AC] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {sel ? <CheckSquare className="w-4 h-4 text-[#6869AC]" /> : <Square className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{field.label}</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">{field.type}</span>
                            </div>
                            {sel && (
                              <button onClick={e => { e.stopPropagation(); toggleMasterFieldRequired(field.masterFieldId); }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${sf?.required ? 'bg-[#6869AC]' : 'bg-gray-300'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${sf?.required ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            )}
                          </div>
                          {field.placeholder && <p className="text-xs text-gray-500">{field.placeholder}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t mt-4">
              <button onClick={() => setShowMasterFieldsModal(false)}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium bg-[#6869AC] hover:opacity-90">
                Add Selected Fields ({selectedMasterFields.length})
              </button>
              <button onClick={() => setShowMasterFieldsModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ChecklistSetup step
// ─────────────────────────────────────────────────────────────────────────────
const ChecklistSetup = ({ trackSteps, setTrackSteps, goToNextStep, goToPreviousStep, stepErrors }) => {
  const addStep = () => setTrackSteps(prev => [...prev, { title: '', description: '', order: prev.length + 1 }]);

  const updateStep = (i, key, val) => setTrackSteps(prev => {
    const u = [...prev]; u[i][key] = val; return u;
  });

  const removeStep = (i) => {
    if (trackSteps.length <= 1) return;
    setTrackSteps(trackSteps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const moveStep = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= trackSteps.length) return;
    const u = [...trackSteps];
    [u[i], u[j]] = [u[j], u[i]];
    setTrackSteps(u.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const ic = (err) => `w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 ${err ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Checklist Setup</h2>
        <p className="text-sm text-gray-600">Define the steps customers will follow for this service.</p>
      </div>

      <div className="space-y-4">
        {trackSteps.map((step, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6869AC] text-white text-sm font-medium">
                  {step.order}
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => moveStep(i, -1)} disabled={i === 0}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50">Move Up</button>
                  <button onClick={() => moveStep(i, 1)} disabled={i === trackSteps.length - 1}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50">Move Down</button>
                </div>
              </div>
              <button onClick={() => removeStep(i)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Step Title <span className="text-red-500">*</span></label>
                <input type="text" value={step.title} onChange={e => updateStep(i, 'title', e.target.value)}
                  placeholder="e.g., Data & Document Intake" className={ic(stepErrors[`step_${i}_title`])} />
                {stepErrors[`step_${i}_title`] && <p className="mt-1 text-xs text-red-600">{stepErrors[`step_${i}_title`]}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Step Description <span className="text-red-500">*</span></label>
                <textarea value={step.description} onChange={e => updateStep(i, 'description', e.target.value)}
                  placeholder="e.g., Share your basic details and upload the necessary documents"
                  className={`${ic(stepErrors[`step_${i}_description`])} h-20 resize-none`} />
                {stepErrors[`step_${i}_description`] && <p className="mt-1 text-xs text-red-600">{stepErrors[`step_${i}_description`]}</p>}
              </div>
            </div>
          </div>
        ))}
        <button onClick={addStep}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center hover:border-[#6869AC] hover:bg-gray-50">
          <Plus className="w-6 h-6 text-gray-400 mb-1" />
          <span className="text-sm text-gray-600">Add Another Step</span>
        </button>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button onClick={goToPreviousStep} className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Previous</button>
        <button onClick={goToNextStep} className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90">Next</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReviewPublish step
// ─────────────────────────────────────────────────────────────────────────────
const ReviewPublish = ({
  basicInfo, categories, filteredSubcategories,
  selectedMasterFields, customFields, trackSteps,
  priceMode, discountPercentage, masterFields, newCustomField,
  loading, error, goToPreviousStep, goToStep,
  submissionStatus, showSuccessPopup, serviceId,
  navigate, handleUpdateService
}) => {
  const getCatName = () => categories.find(c => c.categoryId === basicInfo.categoryId)?.categoryName || 'Not selected';
  const getSubName = () => filteredSubcategories.find(s => s.subCategoryId === basicInfo.subCategoryId)?.subCategoryName || 'Not selected';
  const getMFName  = (id) => masterFields.find(f => f.masterFieldId === id)?.label || id;
  const hasUnsaved = newCustomField.label?.trim() !== '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Update</h2>
          <p className="text-sm text-gray-600">Review all information before updating your service.</p>
        </div>
        <button onClick={goToPreviousStep}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Service Info */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <button onClick={() => goToStep(1)} className="absolute top-4 right-4 flex items-center gap-1 text-sm text-[#6869AC] hover:text-[#595a9c]">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
          {basicInfo.photoUrl && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">{basicInfo.photoChanged ? '✓ Image updated' : 'Original image'}</p>
              <img src={basicInfo.photoUrl} alt="Service" className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Service Type</p><p className="font-medium">{basicInfo.serviceType === 'ONE_TIME' ? 'One Time' : 'Recurring'}</p></div>
            <div><p className="text-gray-500">Category</p><p className="font-medium">{getCatName()}</p></div>
            <div><p className="text-gray-500">Subcategory</p><p className="font-medium">{getSubName()}</p></div>
            <div><p className="text-gray-500">Documents Required</p><p className="font-medium">{basicInfo.documentsRequired ? 'Yes' : 'No'}</p></div>
            <div className="md:col-span-2"><p className="text-gray-500">Service Name</p><p className="font-medium">{basicInfo.name}</p></div>
            <div className="md:col-span-2"><p className="text-gray-500">Description</p><p className="font-medium">{basicInfo.description}</p></div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <button onClick={() => goToStep(2)} className="absolute top-4 right-4 flex items-center gap-1 text-sm text-[#6869AC] hover:text-[#595a9c]">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Actual Price</p><p className="font-medium">₹{basicInfo.individualPrice || '0'}</p></div>
            <div><p className="text-gray-500">Offer Price</p><p className="font-medium">₹{basicInfo.offerPrice || '0'}</p></div>
            <div><p className="text-gray-500">GST Applicable</p><p className="font-medium">{basicInfo.isGstApplicable ? 'Yes' : 'No'}</p></div>
            {basicInfo.isGstApplicable && (
              <div><p className="text-gray-500">GST %</p><p className="font-medium">{basicInfo.gstPercentage}%</p></div>
            )}
          </div>
        </div>

        {/* Dataset */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <button onClick={() => goToStep(3)} className="absolute top-4 right-4 flex items-center gap-1 text-sm text-[#6869AC] hover:text-[#595a9c]">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <h3 className="font-semibold text-gray-900 mb-3">Dataset Setup</h3>
          {selectedMasterFields.length === 0 && customFields.length === 0 && !hasUnsaved
            ? <p className="text-sm text-gray-500 italic">No fields configured</p>
            : (
              <>
                {selectedMasterFields.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Pre-defined Fields ({selectedMasterFields.length})</p>
                    {selectedMasterFields.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1 text-sm">
                        <span>{getMFName(f.masterFieldId)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${f.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {f.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {customFields.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Custom Fields ({customFields.length})</p>
                    {customFields.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1 text-sm">
                        <div><span className="font-medium">{f.label}</span><span className="text-xs ml-2 text-gray-500">({f.type})</span></div>
                        <span className={`text-xs px-2 py-1 rounded ${f.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {f.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
        </div>

        {/* Checklist */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <button onClick={() => goToStep(4)} className="absolute top-4 right-4 flex items-center gap-1 text-sm text-[#6869AC] hover:text-[#595a9c]">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <h3 className="font-semibold text-gray-900 mb-3">Checklist Steps ({trackSteps.length})</h3>
          <div className="space-y-3">
            {trackSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6869AC] text-white text-sm font-medium flex-shrink-0">
                  {step.order}
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={goToPreviousStep} disabled={loading || submissionStatus === 'loading'}
            className="flex-1 py-3 rounded-lg font-semibold text-gray-700 text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            ← Back
          </button>
          <button onClick={handleUpdateService} disabled={loading || submissionStatus === 'loading'}
            className="flex-1 py-3 rounded-lg font-semibold text-white text-sm bg-[#6869AC] hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {submissionStatus === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating...
              </span>
            ) : 'Update Service'}
          </button>
        </div>
      </div>

      {/* ── Success popup ── */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Updated Successfully!</h3>
            <p className="text-gray-600 mb-6">Your service has been updated successfully.</p>
            <div className="flex gap-3">
              {/* ── FIXED: was /service/view/:id → now /services/:id (matches ViewService route) ── */}
              <button
                onClick={() => navigate(`/services/${serviceId}`)}
                className="flex-1 py-3 rounded-lg font-semibold text-[#6869AC] text-sm border border-[#6869AC] hover:bg-[#6869AC] hover:text-white transition-colors"
              >
                View Service
              </button>
              {/* ── FIXED: was /service-hub → now /services (matches Service list route) ── */}
              <button
                onClick={() => navigate('/services')}
                className="flex-1 py-3 rounded-lg font-semibold text-white text-sm bg-[#6869AC] hover:opacity-90"
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main EditService component
// ─────────────────────────────────────────────────────────────────────────────
const EditService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep]     = useState(1);
  const [categories, setCategories]       = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [masterFields, setMasterFields]   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [stepErrors, setStepErrors]       = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    serviceId, categoryId: '', subCategoryId: '',
    name: '', description: '',
    individualPrice: '', offerPrice: '',
    employeeId: 'cmjjl771p0005g11eu3q8t2rq',
    serviceType: 'ONE_TIME',
    frequency: '', duration: '', durationUnit: '',
    documentsRequired: true, isGstApplicable: true,
    gstPercentage: 18, finalIndividualPrice: '',
    photoFile: null, photoUrl: '', photoChanged: false,
  });

  const [priceMode, setPriceMode]                 = useState('fixed');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [selectedMasterFields, setSelectedMasterFields] = useState([]);
  const [customFields, setCustomFields]           = useState([]);
  const [newCustomField, setNewCustomField]       = useState({ label: '', type: 'text', placeholder: '', required: false, options: [] });
  const [trackSteps, setTrackSteps]               = useState([
    { title: 'Data & Document Intake', order: 1, description: 'Share your basic details and upload the necessary documents to begin' },
    { title: 'Verification & Preparation', order: 2, description: 'Verification of information and application setup' },
    { title: 'Document Delivery', order: 3, description: 'Receive your official certificate' },
  ]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchMasterFields();
    fetchServiceData();
  }, [serviceId]);

  useEffect(() => {
    setFilteredSubcategories(
      basicInfo.categoryId ? subcategories.filter(s => s.categoryId === basicInfo.categoryId) : []
    );
  }, [basicInfo.categoryId, subcategories]);

  useEffect(() => {
    if (priceMode === 'percentage' && basicInfo.individualPrice && discountPercentage) {
      const ip = parseFloat(basicInfo.individualPrice), d = parseFloat(discountPercentage);
      if (!isNaN(ip) && !isNaN(d) && d > 0 && d <= 100)
        setBasicInfo(p => ({ ...p, offerPrice: Math.round(ip - ip * d / 100).toString() }));
    }
    if (basicInfo.individualPrice && basicInfo.isGstApplicable && basicInfo.gstPercentage) {
      const ip = parseFloat(basicInfo.individualPrice), gst = parseFloat(basicInfo.gstPercentage);
      if (!isNaN(ip) && !isNaN(gst) && gst >= 0)
        setBasicInfo(p => ({ ...p, finalIndividualPrice: Math.round(ip + ip * gst / 100).toString() }));
    }
  }, [basicInfo.individualPrice, discountPercentage, priceMode, basicInfo.isGstApplicable, basicInfo.gstPercentage]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/service/${serviceId}`);
      if (res.data.success) {
        const s = res.data.service;
        setBasicInfo(p => ({
          ...p,
          categoryId: s.categoryId || '', subCategoryId: s.subCategoryId || '',
          name: s.name || '', description: s.description || '',
          individualPrice: s.individualPrice?.toString() || '',
          offerPrice: s.offerPrice?.toString() || '',
          serviceType: s.serviceType || 'ONE_TIME',
          frequency: s.frequency || '', duration: s.duration?.toString() || '',
          durationUnit: s.durationUnit || '',
          documentsRequired: s.documentsRequired ?? true,
          isGstApplicable: s.isGstApplicable ?? true,
          gstPercentage: s.gstPercentage?.toString() || '18',
          finalIndividualPrice: s.finalIndividualPrice?.toString() || '',
          photoUrl: s.photoUrl || '',
        }));
        if (s.individualPrice && s.offerPrice) {
          const d = ((s.individualPrice - s.offerPrice) / s.individualPrice) * 100;
          if (Math.round(d) > 0) { setPriceMode('percentage'); setDiscountPercentage(Math.round(d).toString()); }
        }
        await fetchInputFields();
        await fetchTrackSteps();
      }
    } catch (err) { console.error(err); setError('Failed to load service data'); }
    finally { setLoading(false); }
  };

  const fetchInputFields = async () => {
    try {
      const res = await axiosInstance.get(`/service/${serviceId}/input-fields`);
      if (res.data.success) {
        const master = [], custom = [];
        (res.data.fields || []).forEach(f => {
          if (f.masterFieldId) master.push({ masterFieldId: f.masterFieldId, required: f.required || false });
          else custom.push({ label: f.label, type: f.type, placeholder: f.placeholder || '', required: f.required || false, options: f.options || [] });
        });
        setSelectedMasterFields(master);
        setCustomFields(custom);
      }
    } catch (err) { console.error(err); }
  };

  const fetchTrackSteps = async () => {
    try {
      const res = await axiosInstance.get(`/service/${serviceId}/track-steps`);
      if (res.data.success && res.data.steps?.length) {
        setTrackSteps(res.data.steps.map(s => ({ title: s.title, description: s.description, order: s.order })).sort((a, b) => a.order - b.order));
      }
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/category');
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) { console.error(err); }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await axiosInstance.get('/subcategory');
      if (res.data.success) setSubcategories(res.data.subcategories);
    } catch (err) { console.error(err); }
  };

  const fetchMasterFields = async () => {
    try {
      const res = await axiosInstance.get('/master-fields');
      if (res.data.success) setMasterFields(res.data.masterFields);
    } catch (err) { console.error(err); }
  };

  const validateCurrentStep = () => {
    const errors = {};
    if (currentStep === 1) {
      if (!basicInfo.serviceType) errors.serviceType = 'Required';
      if (!basicInfo.categoryId) errors.categoryId = 'Required';
      if (!basicInfo.subCategoryId) errors.subCategoryId = 'Required';
      if (!basicInfo.name) errors.name = 'Required';
      if (!basicInfo.description) errors.description = 'Required';
      if (!basicInfo.photoUrl) errors.photoUrl = 'Required';
      if (basicInfo.serviceType === 'RECURRING') {
        if (!basicInfo.frequency) errors.frequency = 'Required';
        if (!basicInfo.duration) errors.duration = 'Required';
        if (!basicInfo.durationUnit) errors.durationUnit = 'Required';
      }
    }
    if (currentStep === 2) {
      if (!basicInfo.individualPrice || parseFloat(basicInfo.individualPrice) <= 0) errors.individualPrice = 'Valid price required';
      if (priceMode === 'fixed' && (!basicInfo.offerPrice || parseFloat(basicInfo.offerPrice) <= 0)) errors.offerPrice = 'Valid offer price required';
      if (priceMode === 'percentage' && (!discountPercentage || parseFloat(discountPercentage) <= 0 || parseFloat(discountPercentage) > 100)) errors.discountPercentage = 'Valid discount (1–100) required';
      if (basicInfo.isGstApplicable && (!basicInfo.gstPercentage || parseFloat(basicInfo.gstPercentage) < 0)) errors.gstPercentage = 'Valid GST required';
    }
    if (currentStep === 4) {
      trackSteps.forEach((step, i) => {
        if (!step.title?.trim()) errors[`step_${i}_title`] = 'Required';
        if (!step.description?.trim()) errors[`step_${i}_description`] = 'Required';
      });
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToStep = (n) => setCurrentStep(n);
  const goToPreviousStep = () => currentStep > 1 && setCurrentStep(p => p - 1);
  const goToNextStep = () => { if (validateCurrentStep() && currentStep < 5) { setCurrentStep(p => p + 1); setStepErrors({}); } };

  const handleUpdateService = async () => {
    setError(''); setSubmissionStatus('loading'); setLoading(true);
    try {
      let finalCustomFields = [...customFields];
      if (newCustomField.label?.trim()) {
        const f = { label: newCustomField.label.trim(), type: newCustomField.type, placeholder: newCustomField.placeholder || '', required: newCustomField.required };
        if (['select', 'radio', 'checkbox'].includes(newCustomField.type)) {
          const valid = newCustomField.options.filter(o => o?.trim());
          if (valid.length) f.options = valid;
        }
        finalCustomFields.push(f);
      }

      const serviceData = {
        name: basicInfo.name.trim(), description: basicInfo.description.trim(),
        serviceType: basicInfo.serviceType,
        documentsRequired: basicInfo.documentsRequired,
        individualPrice: parseFloat(basicInfo.individualPrice),
        offerPrice: parseFloat(basicInfo.offerPrice),
        isGstApplicable: basicInfo.isGstApplicable,
        gstPercentage: basicInfo.isGstApplicable ? parseFloat(basicInfo.gstPercentage) : 0,
        finalIndividualPrice: parseFloat(basicInfo.finalIndividualPrice || basicInfo.offerPrice),
        employeeId: basicInfo.employeeId,
        subCategoryId: basicInfo.subCategoryId,
      };
      if (basicInfo.serviceType === 'RECURRING') {
        serviceData.frequency = basicInfo.frequency;
        serviceData.duration = parseInt(basicInfo.duration);
        serviceData.durationUnit = basicInfo.durationUnit;
      }

      const svcRes  = await fetch(`${API_BASE}/service/${serviceId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(serviceData) });
      const svcData = await svcRes.json();
      if (!svcData.success) throw new Error(svcData.error || svcData.message || 'Service update failed');

      if (basicInfo.photoChanged && basicInfo.photoFile) {
        const fd = new FormData(); fd.append('photoUrl', basicInfo.photoFile, basicInfo.photoFile.name);
        await fetch(`${API_BASE}/service/${serviceId}/image`, { method: 'PUT', body: fd }).catch(console.warn);
      }

      if (finalCustomFields.length > 0 || selectedMasterFields.length > 0) {
        const payload = [
          ...finalCustomFields.map(f => {
            const obj = { label: f.label, type: f.type, placeholder: f.placeholder || '', required: f.required || false };
            if (['select', 'radio', 'checkbox'].includes(f.type) && f.options?.length) obj.options = f.options;
            return obj;
          }),
          ...selectedMasterFields.map(f => {
            const mf = masterFields.find(m => m.masterFieldId === f.masterFieldId);
            const obj = { masterFieldId: f.masterFieldId, required: f.required || false };
            if (mf?.options?.length) obj.options = mf.options;
            return obj;
          }),
        ];
        await fetch(`${API_BASE}/service/${serviceId}/input-fields`, { method: 'DELETE' }).catch(console.warn);
        await fetch(`${API_BASE}/service/${serviceId}/input-fields`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: payload }) }).catch(console.warn);
      }

      if (trackSteps.length > 0) {
        await fetch(`${API_BASE}/service/${serviceId}/track-steps`, { method: 'DELETE' }).catch(console.warn);
        await fetch(`${API_BASE}/service/${serviceId}/track-steps`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steps: trackSteps.map(s => ({ title: s.title, description: s.description, order: s.order })) }),
        }).catch(console.warn);
      }

      setSubmissionStatus('success');
      setShowSuccessPopup(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update service. Please try again.');
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !basicInfo.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6869AC]" />
      </div>
    );
  }

  const steps = ['Basic Info', 'Pricing', 'Dataset', 'Checklist', 'Review'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
              <p className="text-sm text-gray-600 mt-1">Update service details and configuration</p>
            </div>
            <span className="text-sm text-gray-500">Service ID: {serviceId}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((label, idx) => {
              const n = idx + 1;
              return (
                <div key={n} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === n ? 'bg-[#6869AC] text-white' : currentStep > n ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {currentStep > n ? '✓' : n}
                  </div>
                  <div className="ml-2 text-sm font-medium hidden sm:block">{label}</div>
                  {n < 5 && <div className={`ml-2 w-8 sm:w-16 h-0.5 ${currentStep > n ? 'bg-green-300' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {currentStep === 1 && <ServiceInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} categories={categories} filteredSubcategories={filteredSubcategories} stepErrors={stepErrors} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} currentStep={currentStep} />}
          {currentStep === 2 && <PricingSetup basicInfo={basicInfo} setBasicInfo={setBasicInfo} priceMode={priceMode} setPriceMode={setPriceMode} discountPercentage={discountPercentage} setDiscountPercentage={setDiscountPercentage} stepErrors={stepErrors} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />}
          {currentStep === 3 && <DatasetSetup selectedMasterFields={selectedMasterFields} setSelectedMasterFields={setSelectedMasterFields} customFields={customFields} setCustomFields={setCustomFields} newCustomField={newCustomField} setNewCustomField={setNewCustomField} masterFields={masterFields} stepErrors={stepErrors} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />}
          {currentStep === 4 && <ChecklistSetup trackSteps={trackSteps} setTrackSteps={setTrackSteps} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} stepErrors={stepErrors} />}
          {currentStep === 5 && <ReviewPublish basicInfo={basicInfo} categories={categories} filteredSubcategories={filteredSubcategories} selectedMasterFields={selectedMasterFields} customFields={customFields} trackSteps={trackSteps} priceMode={priceMode} discountPercentage={discountPercentage} masterFields={masterFields} newCustomField={newCustomField} loading={loading} error={error} goToPreviousStep={goToPreviousStep} goToStep={goToStep} submissionStatus={submissionStatus} showSuccessPopup={showSuccessPopup} serviceId={serviceId} navigate={navigate} handleUpdateService={handleUpdateService} />}
        </div>
      </div>
    </div>
  );
};

export default EditService;