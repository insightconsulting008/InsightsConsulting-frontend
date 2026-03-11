import React, { useState } from 'react';
import { Search, Eye, Loader2, Edit2, Trash2, X, DollarSign, Calendar, Package, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

export default function ServiceList({ services = [], categories = [], subcategories = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const filteredServices = services.filter(srv =>
    srv?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    srv?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = d => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getSubcategoryName = id => subcategories.find(s => s.subCategoryId === id)?.subCategoryName || '—';
  const getCategoryName = id => {
    const sub = subcategories.find(s => s.subCategoryId === id);
    if (!sub) return '—';
    return categories.find(c => c.categoryId === sub.categoryId)?.categoryName || '—';
  };

  const getServiceTypeDisplay = s => {
    switch (s.serviceType) {
      case 'ONE_TIME': return 'One Time';
      case 'RECURRING': return 'Recurring';
      default: return s.serviceType || 'Standard';
    }
  };

  const getServiceStatus = s => s.status || 'active';

  const getStatusStyle = status => {
    switch (status) {
      case 'active': return { background: '#ecfdf5', color: '#047857', border: '1px solid #bbf7d0' };
      case 'inactive': return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
      case 'draft': return { background: 'var(--warning-50)', color: 'var(--warning-700)', border: '1px solid var(--warning-100)' };
      default: return { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' };
    }
  };

  const handleEditService = id => navigate(`/service/edit/${id}`);

  const handleDeleteService = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      setActionLoading(true);
      await axiosInstance.delete(`/service/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting service');
    } finally {
      setActionLoading(false);
    }
  };

  const ServiceDetailModal = () => {
    if (!showDetailsModal || !selectedService) return null;
    const s = selectedService;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden" style={{ boxShadow: 'var(--shadow-2xl)' }}>
          {/* Header */}
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: 'var(--primary-100)', background: 'linear-gradient(135deg, var(--primary-50) 0%, #fff 100%)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {s.photoUrl && (
                  <img src={s.photoUrl} alt={s.name} className="w-11 h-11 rounded-lg object-cover" style={{ border: '2px solid var(--primary-200)' }} />
                )}
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {s.serviceId} · Created {formatDate(s.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowDetailsModal(false); setSelectedService(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-76px)]">
            <div className="space-y-5">
              {/* Description */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--primary-500)' }}>Description</p>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3.5" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                  <p className="text-xs text-gray-400 mb-0.5">Service Type</p>
                  <p className="text-sm font-semibold text-gray-800">{getServiceTypeDisplay(s)}</p>
                </div>
                <div className="rounded-lg p-3.5" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                  <p className="text-xs text-gray-400 mb-0.5">Category</p>
                  <p className="text-sm font-semibold text-gray-800">{getCategoryName(s.subCategoryId)}</p>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--primary-500)' }}>Pricing</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg p-3.5 border border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400 mb-0.5">Base Price</p>
                    <p className="text-lg font-bold text-gray-900">₹{s.individualPrice}</p>
                  </div>
                  <div className="rounded-lg p-3.5" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }}>
                    <p className="text-xs text-gray-400 mb-0.5">Offer Price</p>
                    <p className="text-lg font-bold" style={{ color: '#047857' }}>₹{s.offerPrice || s.individualPrice}</p>
                  </div>
                  <div className="rounded-lg p-3.5" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                    <p className="text-xs text-gray-400 mb-0.5">Final Price</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>₹{s.finalIndividualPrice}</p>
                    {s.isGstApplicable === 'true' && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--primary-600)' }}>+{s.gstPercentage}% GST</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Input fields */}
              {s.inputFields?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--primary-500)' }}>Required Fields</p>
                  <div className="space-y-2">
                    {s.inputFields.map(f => (
                      <div key={f.fieldId} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-gray-100 bg-gray-50">
                        <div>
                          <span className="text-sm font-medium text-gray-800">{f.label}</span>
                          <span className="text-xs text-gray-400 ml-2">({f.type})</span>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-md font-medium"
                          style={f.required
                            ? { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
                            : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }
                          }
                        >
                          {f.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleEditService(s.serviceId)}
                  className="flex-1 py-2.5 text-white rounded-lg text-sm font-semibold transition-all"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                >
                  Edit Service
                </button>
                <button
                  onClick={() => handleDeleteService(s.serviceId, s.name)}
                  className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 flex flex-col items-center justify-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin mb-3"
          style={{ borderColor: 'var(--primary-100)', borderTopColor: 'var(--color-primary)' }}
        />
        <p className="text-sm text-gray-400">Loading services…</p>
      </div>
    );
  }

  return (
    <>
      <ServiceDetailModal />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Service List</h2>
              <p className="text-xs text-gray-400 mt-0.5">Overview of all services and key information</p>
            </div>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none transition-all"
              onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(104,105,172,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--primary-50)' }}>
                <Package className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No Services Found</p>
              <p className="text-xs text-gray-400 text-center">
                {searchQuery ? 'No services match your search' : 'No services added yet'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--primary-50)', borderBottom: '1px solid var(--primary-100)' }}>
                  {['Service Name', 'Type', 'Category', 'Price', 'Status', 'Last Update', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary-700)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(service => (
                  <tr
                    key={service.serviceId}
                    className="border-b border-gray-50 transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {service.photoUrl && (
                          <img src={service.photoUrl} alt={service.name} className="w-16 h-full rounded-md flex-shrink-0" style={{ border: '1px solid var(--primary-100)' }} />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{service.description || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="text-xs px-2 py-1 rounded-md font-medium"
                        style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' }}
                      >
                        {getServiceTypeDisplay(service)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">{getCategoryName(service.subCategoryId)}</p>
                      <p className="text-xs text-gray-400">{getSubcategoryName(service.subCategoryId)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-gray-900">₹{service.finalIndividualPrice || service.individualPrice || '0'}</p>
                      {service.offerPrice && service.offerPrice !== service.individualPrice && (
                        <p className="text-xs text-gray-400 line-through">₹{service.individualPrice}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full"
                        style={getStatusStyle(getServiceStatus(service))}
                      >
                        {getServiceStatus(service)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {formatDate(service.updatedAt || service.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setSelectedService(service); setShowDetailsModal(true); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => handleEditService(service.serviceId)}
                          className="p-1.5 rounded-lg text-gray-400 transition-colors"
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--primary-50)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.serviceId, service.name)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg text-gray-400 transition-colors disabled:opacity-50"
                          onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredServices.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100" style={{ backgroundColor: 'var(--primary-50)' }}>
            <p className="text-xs" style={{ color: 'var(--primary-700)' }}>
              Showing <span className="font-semibold">{filteredServices.length}</span> of{' '}
              <span className="font-semibold">{services.length}</span> services
            </p>
          </div>
        )}
      </div>
    </>
  );
}