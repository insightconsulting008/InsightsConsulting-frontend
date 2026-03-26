// ViewService.jsx — themed to match app.css (#6869AC periwinkle indigo)
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Calendar, FileText, CheckCircle, Clock,
  Package, Tag, DollarSign, Users, Shield, Layers, Edit2, Trash2
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../page-header/PageHeader';

export default function ViewService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchServiceDetails(); }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const r = await axiosInstance.get(`/service/${serviceId}`);
      if (r.data.success) setService(r.data.service);
      else setError('Service not found');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = d => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getServiceTypeDisplay = () => {
    switch (service?.serviceType) {
      case 'ONE_TIME': return 'One Time Service';
      case 'RECURRING': return 'Recurring Service';
      default: return service?.serviceType || 'Standard Service';
    }
  };

  const freqMap = { DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly', QUARTERLY: 'Quarterly', YEARLY: 'Yearly' };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--primary-100)', borderTopColor: 'var(--color-primary)' }} />
          <p className="text-sm text-gray-400">Loading service details…</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-gray-100 p-10 max-w-md w-full text-center" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Service Not Found</h3>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => navigate('/service-hub')}
            className="px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            Back to Service List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={service.name || 'Service Details'}
        subtitle="Service Details"
        onBack={() => navigate('/services-hub')}
        actions={
          <button
            onClick={() => navigate(`/services/edit/${serviceId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <Edit2 className="w-4 h-4" /> Edit Service
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Service Overview */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div
                className="px-5 py-4 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--primary-100)', background: 'linear-gradient(135deg, var(--primary-50) 0%, #fff 60%)' }}
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Service Overview</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Complete details about the service</p>
                </div>
                <span
                  className="px-2.5 py-1 text-xs font-semibold rounded-full"
                  style={service.status === 'active'
                    ? { background: '#ecfdf5', color: '#047857', border: '1px solid #bbf7d0' }
                    : { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
                  }
                >
                  {service.status || 'active'}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--primary-500)' }}>Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </div>
                {service.photoUrl && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--primary-500)' }}>Service Image</p>
                    <img src={service.photoUrl} alt={service.name} className="w-full h-56 object-cover rounded-lg" style={{ border: '1px solid var(--primary-100)' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-sm font-semibold text-gray-900 mb-4">Pricing Details</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-100)' }}>
                      <DollarSign className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <p className="text-xs text-gray-400">Base Price</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">₹{service.individualPrice}</p>
                </div>
                <div className="rounded-lg p-4" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                      <Tag className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-400">Offer Price</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: '#047857' }}>₹{service.offerPrice || service.individualPrice}</p>
                </div>
                <div className="rounded-lg p-4" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-100)' }}>
                      <Shield className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <p className="text-xs text-gray-400">Final Price</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>₹{service.finalIndividualPrice}</p>
                  {service.isGstApplicable === 'true' && (
                    <p className="text-xs mt-1" style={{ color: 'var(--primary-600)' }}>+{service.gstPercentage}% GST</p>
                  )}
                </div>
              </div>
            </div>

            {/* Input Fields */}
            {service.inputFields?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-sm font-semibold text-gray-900 mb-4">Required Information</p>
                <div className="space-y-2.5">
                  {service.inputFields.map(f => (
                    <div key={f.fieldId} className="flex items-start justify-between p-3.5 rounded-lg border" style={{ borderColor: 'var(--primary-100)', backgroundColor: 'var(--primary-50)' }}>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                          <span className="text-sm font-medium text-gray-900">{f.label}</span>
                        </div>
                        <p className="text-xs text-gray-400 ml-5">Type: {f.type}{f.placeholder ? ` · ${f.placeholder}` : ''}</p>
                        {f.options?.length > 0 && (
                          <div className="ml-5 mt-1.5 flex flex-wrap gap-1">
                            {f.options.map((o, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600 border border-gray-200">{o}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0 ml-3"
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

            {/* Track Steps */}
            {service.trackSteps?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-sm font-semibold text-gray-900 mb-4">Service Process Steps</p>
                <div className="space-y-3">
                  {[...service.trackSteps].sort((a, b) => a.order - b.order).map((step, i, arr) => (
                    <div key={step.stepId} className="flex items-start gap-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                          style={{ backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--primary-200)' }}
                        >
                          {i + 1}
                        </div>
                        {i < arr.length - 1 && <div className="w-0.5 h-6 mt-1" style={{ backgroundColor: 'var(--primary-100)' }} />}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-sm font-medium text-gray-900">{step.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Service Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--primary-500)' }}>Service Information</p>
              <div className="space-y-3">
                {[
                  { icon: <Package className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />, label: 'Service Type', value: getServiceTypeDisplay() },
                  ...(service.serviceType === 'RECURRING' ? [
                    { icon: <Clock className="w-4 h-4 text-blue-500" />, label: 'Frequency', value: freqMap[service.frequency] || service.frequency || '—' },
                    ...(service.duration ? [{ icon: <Calendar className="w-4 h-4 text-green-500" />, label: 'Duration', value: `${service.duration} ${service.durationUnit?.toLowerCase() || 'months'}` }] : []),
                  ] : []),
                  { icon: <Layers className="w-4 h-4 text-purple-500" />, label: 'Documents Required', value: service.documentsRequired === 'true' ? 'Yes' : 'No' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-50)' }}>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0" style={{ border: '1px solid var(--primary-100)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--primary-500)' }}>Timestamps</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Created On</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(service.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(service.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Service ID</p>
                  <p className="text-xs font-mono px-2 py-1.5 rounded-md" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)' }}>
                    {service.serviceId}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--primary-500)' }}>Quick Actions</p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/services/edit/${serviceId}`)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Edit Service Details
                </button>
                <button
                  onClick={() => navigate('/service-hub')}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Service List
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${service.name}"?`)) {
                      axiosInstance.delete(`/service/${serviceId}`)
                        .then(() => navigate('/service-hub'))
                        .catch(err => alert(err.response?.data?.message || 'Error deleting service'));
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}