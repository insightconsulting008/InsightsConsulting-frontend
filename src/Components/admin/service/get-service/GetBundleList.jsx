import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, Package, X } from 'lucide-react';
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
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 text-center mb-2">Delete Bundle?</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete "<span className="font-semibold text-gray-700">{itemName}</span>"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BundleDetailModal = ({ isOpen, onClose, bundle }) => {
  if (!isOpen || !bundle) return null;
  const fmt = p => parseInt(p || 0).toLocaleString('en-IN');
  const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const discount = !bundle.bundlePrice || bundle.bundlePrice === 0 ? 0
    : Math.round(((bundle.bundlePrice - bundle.bundleOfferPrice) / bundle.bundlePrice) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" style={{ boxShadow: 'var(--shadow-2xl)' }}>
        {/* Header */}
        <div
          className="p-5 border-b"
          style={{ borderColor: 'var(--primary-100)', background: 'linear-gradient(135deg, var(--primary-50) 0%, #fff 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-100)' }}>
                <Package className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{bundle.name}</h3>
                <p className="text-xs text-gray-400">Created: {fmtDate(bundle.createdAt)}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-5">
            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--primary-500)' }}>Description</p>
              <p className="text-sm text-gray-600">{bundle.description || 'No description provided.'}</p>
            </div>

            {/* Pricing */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--primary-500)' }}>Pricing</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg p-3.5 bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">Original Price</p>
                  <p className="text-lg font-bold text-gray-900">₹{fmt(bundle.bundlePrice)}</p>
                </div>
                <div className="rounded-lg p-3.5" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }}>
                  <p className="text-xs text-gray-400 mb-0.5">Offer Price</p>
                  <p className="text-lg font-bold" style={{ color: '#047857' }}>₹{fmt(bundle.bundleOfferPrice)}</p>
                  {discount > 0 && <p className="text-xs font-medium" style={{ color: '#059669' }}>{discount}% OFF</p>}
                </div>
                <div className="rounded-lg p-3.5" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                  <p className="text-xs text-gray-400 mb-0.5">Final Price</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>₹{fmt(bundle.finalBundlePrice)}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--primary-600)' }}>
                    {bundle.isGstApplicable ? `Incl. ${bundle.gstPercentage}% GST` : 'No GST'}
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--primary-500)' }}>
                Included Services ({bundle.services?.length || 0})
              </p>
              <div className="space-y-2">
                {bundle.services?.map((svc, i) => (
                  <div
                    key={svc.serviceId}
                    className="flex items-start justify-between p-3.5 rounded-lg border"
                    style={{ borderColor: 'var(--primary-100)', backgroundColor: 'var(--primary-50)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-gray-900">{svc.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 ml-7">{svc.description}</p>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0 ml-3" style={{ color: 'var(--color-primary)' }}>
                      ₹{fmt(svc.offerPrice || svc.individualPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GetBundleList({ bundles = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [filters, setFilters] = useState({ sortBy: 'newest', gstStatus: 'all' });
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
      await axiosInstance.delete(`/bundle/${deleteItem.id}`);
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
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 rounded-full animate-spin mb-3" style={{ borderColor: 'var(--primary-100)', borderTopColor: 'var(--color-primary)' }} />
        <p className="text-sm text-gray-400">Loading bundles…</p>
      </div>
    );
  }

  return (
    <>
      <BundleDetailModal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedBundle(null); }} bundle={selectedBundle} />
      <DeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} itemName={deleteItem?.name} />

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
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none transition-all"
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
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--primary-50)' }}>
            <Package className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Bundles Found</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
            {searchQuery ? 'No bundles match your search.' : 'Create your first bundle to get started.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/add-bundle-service')}
              className="px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              <Plus className="w-4 h-4" /> Create Your First Bundle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBundles.map(bundle => {
            const discount = calcDiscount(bundle);
            return (
              <div
                key={bundle.bundleId}
                className="bg-white rounded-xl border border-gray-100 p-5 transition-all"
                style={{ boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-200)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f1f5'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--primary-100)' }}>
                      <Package className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-none">{bundle.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">{bundle.bundleId?.substring(0, 8)}…</p>
                    </div>
                  </div>
                  {discount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #bbf7d0' }}>
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{bundle.description || 'No description'}</p>

                {/* Pricing */}
                <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>₹{fmt(bundle.bundleOfferPrice)}</span>
                      {bundle.bundlePrice > bundle.bundleOfferPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{fmt(bundle.bundlePrice)}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-700">₹{fmt(bundle.finalBundlePrice)}</p>
                      <p className="text-xs text-gray-400">Final</p>
                    </div>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: 'var(--primary-600)' }}>
                    {bundle.isGstApplicable ? `Incl. ${bundle.gstPercentage}% GST` : 'No GST'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{bundle.services?.length || 0} Services</span>
                  <span>{fmtDate(bundle.createdAt)}</span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => { setSelectedBundle(bundle); setShowDetailsModal(true); }}
                    className="flex-1 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/bundle/edit/${bundle.bundleId}`)}
                    className="p-2 rounded-lg text-gray-400 transition-colors"
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--primary-50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setDeleteItem({ id: bundle.bundleId, name: bundle.name }); setShowDeleteModal(true); }}
                    className="p-2 rounded-lg text-gray-400 transition-colors"
                    onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}