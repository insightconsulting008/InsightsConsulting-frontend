import React, { useState } from 'react';
import { Search, Trash2, Plus, Package, X, Tag, Layers, Calendar, Percent, Eye, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  const icon = type === 'success'
    ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
    : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isMatch = confirmInput === itemName;

  const handleCopy = () => {
    navigator.clipboard.writeText(itemName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setConfirmInput('');
    setCopied(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!isMatch) return;
    setConfirmInput('');
    setCopied(false);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
    <div className="p-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mx-auto mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Bundle?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This action cannot be undone. Type the bundle name <span className="font-semibold text-gray-700">{itemName}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center align-middle hover:opacity-70 transition-opacity"
          title="Copy bundle name"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
        {' '}below to confirm.
      </p>

      {/* Confirm input */}
      <div className="mb-5">
        <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Confirm by typing</p>
        <input
          type="text"
          value={confirmInput}
          onChange={e => setConfirmInput(e.target.value)}
          onPaste={e => {
            const pasted = e.clipboardData.getData('text');
            setConfirmInput(pasted);
            e.preventDefault();
          }}
          placeholder={`Type bundle name to confirm…`}
          className="w-full px-3 py-2.5 border rounded-xl text-sm transition-all outline-none"
          style={{
            borderColor: confirmInput === ''
              ? '#e5e7eb'
              : isMatch
                ? '#86efac'
                : '#fca5a5',
            backgroundColor: confirmInput === ''
              ? '#fff'
              : isMatch
                ? '#f0fdf4'
                : '#fff5f5',
            boxShadow: confirmInput !== '' && isMatch
              ? '0 0 0 3px rgba(134,239,172,0.25)'
              : confirmInput !== ''
                ? '0 0 0 3px rgba(252,165,165,0.20)'
                : 'none',
          }}
          autoFocus
        />
        {confirmInput !== '' && !isMatch && (
          <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Name doesn't match
          </p>
        )}
        {isMatch && (
          <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Name matches — ready to delete
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isMatch}
          className="flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: isMatch ? '#ef4444' : '#fca5a5',
            cursor: isMatch ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (isMatch) e.currentTarget.style.backgroundColor = '#dc2626'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = isMatch ? '#ef4444' : '#fca5a5'; }}
        >
          Delete Bundle
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default function GetBundleList({ bundles = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [filters, setFilters] = useState({ sortBy: 'newest', gstStatus: 'all' });
  const [imgErrors, setImgErrors] = useState({});
  const navigate = useNavigate();

  const filteredBundles = bundles.filter(b => {
    if (searchQuery && !b.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !b.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.gstStatus === 'with_gst' && !b.isGstApplicable) return false;
    if (filters.gstStatus === 'without_gst' && b.isGstApplicable) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price_high': return (b.bundleOfferPrice || 0) - (a.bundleOfferPrice || 0);
      case 'price_low': return (a.bundleOfferPrice || 0) - (b.bundleOfferPrice || 0);
      case 'name_asc': return (a.name || '').localeCompare(b.name || '');
      case 'name_desc': return (b.name || '').localeCompare(a.name || '');
      default: return 0;
    }
  });

  const fmt = p => parseInt(p || 0).toLocaleString('en-IN');
  const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const calcDiscount = b => !b.bundlePrice || b.bundlePrice === 0 ? 0
    : Math.round(((b.bundlePrice - b.bundleOfferPrice) / b.bundlePrice) * 100);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await axiosInstance.delete(`/admin/bundle/${deleteItem.id}`, {
        data: { bundleId: deleteItem.id, confirmName: deleteItem.name },
      });
      showToast('Bundle deleted successfully');
      onRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error deleting bundle', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const selectCls = {
    padding: '9px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" style={{ borderColor: 'var(--primary-100)', borderTopColor: 'var(--color-primary)' }} />
        <p className="text-sm text-gray-400">Loading bundles…</p>
      </div>
    );
  }

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={deleteItem?.name}
      />

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bundles…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all"
              onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(104,105,172,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div className="flex gap-2">
            <select value={filters.gstStatus} onChange={e => setFilters(p => ({ ...p, gstStatus: e.target.value }))} style={selectCls}>
              <option value="all">All GST Status</option>
              <option value="with_gst">With GST</option>
              <option value="without_gst">Without GST</option>
            </select>
            <select value={filters.sortBy} onChange={e => setFilters(p => ({ ...p, sortBy: e.target.value }))} style={selectCls}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Showing <span className="font-medium text-gray-600">{filteredBundles.length}</span> of{' '}
          <span className="font-medium text-gray-600">{bundles.length}</span> bundles
        </p>
      </div>

      {/* Empty state */}
      {filteredBundles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--primary-50)' }}>
            <Package className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Bundles Found</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
            {searchQuery ? 'No bundles match your search.' : 'Create your first bundle to get started.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/services/bundle/add')}
              className="px-5 py-2.5 text-white rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              <Plus className="w-4 h-4" /> Create Your First Bundle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBundles.map(bundle => {
            const discount = calcDiscount(bundle);
            const hasImage = bundle.photoUrl && !imgErrors[bundle.bundleId];

            return (
              <div
                key={bundle.bundleId}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 flex flex-col"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-200)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f1f5'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Image Area */}
                <div className="relative w-full h-44 overflow-hidden bg-gray-50 flex-shrink-0">
                  {hasImage ? (
                    <img
                      src={bundle.photoUrl}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                      onError={() => setImgErrors(prev => ({ ...prev, [bundle.bundleId]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)' }}>
                      <Package className="w-10 h-10 mb-1" style={{ color: 'var(--primary-300)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--primary-400)' }}>No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    {discount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full shadow-sm" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #bbf7d0' }}>
                        <Percent className="w-3 h-3" />{discount}% OFF
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ml-auto"
                      style={bundle.isGstApplicable
                        ? { background: 'var(--primary-50)', color: 'var(--color-primary)', border: '1px solid var(--primary-200)' }
                        : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }}
                    >
                      {bundle.isGstApplicable ? `GST ${bundle.gstPercentage}%` : 'No GST'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-1">{bundle.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{bundle.description || 'No description provided.'}</p>
                  </div>

                  {bundle.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {bundle.services.slice(0, 3).map(svc => (
                        <span
                          key={svc.serviceId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
                          style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)' }}
                        >
                          <Layers className="w-2.5 h-2.5" />{svc.name}
                        </span>
                      ))}
                      {bundle.services.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          +{bundle.services.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="rounded-xl p-3 mb-3 mt-auto" style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Offer Price</p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>₹{fmt(bundle.bundleOfferPrice)}</span>
                          {bundle.bundlePrice > bundle.bundleOfferPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{fmt(bundle.bundlePrice)}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">Final (incl. tax)</p>
                        <p className="text-base font-bold text-gray-800">₹{fmt(bundle.finalBundlePrice)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 hidden md:block" />
                      <span>{fmtDate(bundle.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/bundle/edit/${bundle.bundleId}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ color: 'var(--color-primary)', backgroundColor: 'var(--primary-50)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--primary-100)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--primary-50)'; }}
                      >
                        <Eye className="w-3.5 h-3.5" /> View <span>More</span>
                      </button>
                      <button
                        onClick={() => { setDeleteItem({ id: bundle.bundleId, name: bundle.name }); setShowDeleteModal(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}