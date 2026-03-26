import React, { useState, useRef } from 'react';
import {
  Search, Loader2, Trash2, X, Package,
  AlertTriangle, Copy, Check, ChevronRight, ChevronLeft,
  ChevronsLeft, ChevronsRight, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Delete Modal Component (exactly like the Bundle page)
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

          <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Service?</h3>
          <p className="text-sm text-gray-500 text-center mb-5">
            This action cannot be undone. Type the service name <span className="font-semibold text-gray-700 text-base">{itemName}</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center align-middle hover:opacity-70 transition-opacity"
              title="Copy service name"
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
              placeholder={`Type service name to confirm…`}
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
              Delete Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ServiceList({ services = [], categories = [], subcategories = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const navigate = useNavigate();

  /* ── helpers ── */
  const filteredServices = services.filter(srv =>
    srv?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    srv?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedServices = filteredServices.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSearch = e => { setSearchQuery(e.target.value); setCurrentPage(1); };

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

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      setActionLoading(true);
      await axiosInstance.delete(`/service/${deleteItem.serviceId}`, {
        data: { serviceId: deleteItem.serviceId, confirmName: deleteItem.name },
      });
      setShowDeleteModal(false);
      setDeleteItem(null);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting service');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Pagination ── */
  const PaginationBar = () => {
    if (filteredServices.length === 0) return null;
    const start = (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, filteredServices.length);

    const windowSize = 5;
    let winStart = Math.max(1, safePage - Math.floor(windowSize / 2));
    let winEnd = Math.min(totalPages, winStart + windowSize - 1);
    if (winEnd - winStart + 1 < windowSize) winStart = Math.max(1, winEnd - windowSize + 1);
    const pages = Array.from({ length: winEnd - winStart + 1 }, (_, i) => winStart + i);

    const NavBtn = ({ onClick, disabled, children, title }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold transition-all
          ${disabled
            ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed opacity-40'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:border-primary-200 cursor-pointer'
          }`}
      >
        {children}
      </button>
    );

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 bg-primary-50">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-primary-700 m-0">
            Showing <strong>{start}–{end}</strong> of <strong>{filteredServices.length}</strong> services
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-primary-700">Rows:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="text-xs font-semibold border border-primary-200 rounded-lg px-1.5 py-1 bg-white text-primary-700 cursor-pointer outline-none"
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <NavBtn onClick={() => setCurrentPage(1)} disabled={safePage === 1} title="First page"><ChevronsLeft size={13} /></NavBtn>
            <NavBtn onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1} title="Previous"><ChevronLeft size={13} /></NavBtn>

            {winStart > 1 && (
              <>
                <button onClick={() => setCurrentPage(1)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-primary-50 hover:border-primary-200 transition-all">1</button>
                {winStart > 2 && <span className="text-xs text-gray-400 px-0.5">…</span>}
              </>
            )}

            {pages.map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold transition-all
                  ${p === safePage
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:border-primary-200'
                  }`}
              >
                {p}
              </button>
            ))}

            {winEnd < totalPages && (
              <>
                {winEnd < totalPages - 1 && <span className="text-xs text-gray-400 px-0.5">…</span>}
                <button onClick={() => setCurrentPage(totalPages)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-primary-50 hover:border-primary-200 transition-all">{totalPages}</button>
              </>
            )}

            <NavBtn onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} title="Next"><ChevronRight size={13} /></NavBtn>
            <NavBtn onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages} title="Last page"><ChevronsRight size={13} /></NavBtn>
          </div>
        )}
      </div>
    );
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 flex flex-col items-center justify-center shadow-sm">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-400">Loading services…</p>
      </div>
    );
  }

  /* ── Mobile Cards ── */
  const MobileCards = () => (
    <div className="flex flex-col gap-3">
      {pagedServices.map(service => (
        <div key={service.serviceId} className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm">

          {/* Top */}
          <div className="flex items-start gap-3 mb-3">
            {service.photoUrl && (
              <img
                src={service.photoUrl}
                alt={service.name}
                className="w-24 h-full rounded-xl object-cover flex-shrink-0 border border-primary-100"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate mb-0.5 m-0">{service.name}</p>
              <p className="text-xs text-gray-400 truncate mb-1.5 m-0">{service.description || '—'}</p>
              <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 border border-primary-200">
                {getServiceTypeDisplay(service)}
              </span>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-b border-gray-100 py-2.5 mb-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5 m-0">Category</p>
              <p className="text-xs font-medium text-gray-700 truncate m-0">{getCategoryName(service.subCategoryId)}</p>
              <p className="text-[11px] text-gray-400 truncate m-0">{getSubcategoryName(service.subCategoryId)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5 m-0">Price</p>
              <p className="text-sm font-bold text-gray-900 m-0">₹{service.finalIndividualPrice || service.individualPrice || '0'}</p>
              {service.offerPrice && service.offerPrice !== service.individualPrice && (
                <p className="text-[11px] text-gray-400 line-through m-0">₹{service.individualPrice}</p>
              )}
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5 m-0">Last Updated</p>
              <p className="text-xs text-gray-600 m-0">{formatDate(service.updatedAt || service.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/services/edit/${service.serviceId}`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-primary-50 text-primary border border-primary-200 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
            >
              <Eye size={13} strokeWidth={2.2} /> View
            </button>
            <button
              onClick={() => {
                setDeleteItem({ serviceId: service.serviceId, name: service.name });
                setShowDeleteModal(true);
              }}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={13} strokeWidth={2.2} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Main ── */
  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteItem(null);
        }}
        onConfirm={handleDelete}
        itemName={deleteItem?.name}
      />

      <div className="bg-white rounded-xl md:border border-gray-100 overflow-hidden md:shadow-sm">

        {/* Header */}
        <div className="md:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-0.5">Service List</h2>
          <p className="text-xs text-gray-400 mb-3 mt-0">Overview of all services and key information</p>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services…"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Empty */}
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 md:px-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-primary-50">
              <Package className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">No Services Found</p>
            <p className="text-xs text-gray-400 text-center">
              {searchQuery ? 'No services match your search' : 'No services added yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-50 border-b border-primary-100">
                    {['Service Name', 'Type', 'Category', 'Price', 'Last Update', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-primary-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedServices.map(service => (
                    <tr key={service.serviceId} className="border-b border-gray-50 hover:bg-primary-50 transition-colors">

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {service.photoUrl && (
                            <img
                              src={service.photoUrl}
                              alt={service.name}
                              className="w-24 h-full rounded-lg flex-shrink-0 object-cover border border-primary-100"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 m-0">{service.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px] m-0">{service.description || '—'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-md font-medium bg-primary-50 text-primary-700 border border-primary-200">
                          {getServiceTypeDisplay(service)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-700 m-0">{getCategoryName(service.subCategoryId)}</p>
                        <p className="text-xs text-gray-400 m-0">{getSubcategoryName(service.subCategoryId)}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-gray-900 m-0">
                          ₹{service.finalIndividualPrice || service.individualPrice || '0'}
                        </p>
                        {service.offerPrice && service.offerPrice !== service.individualPrice && (
                          <p className="text-xs text-gray-400 line-through m-0">₹{service.individualPrice}</p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-gray-400">
                        {formatDate(service.updatedAt || service.createdAt)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/services/edit/${service.serviceId}`)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 text-primary border border-primary-200 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                          >
                            <Eye size={12} strokeWidth={2.2} /> View
                          </button>
                          <button
                            onClick={() => {
                              setDeleteItem({ serviceId: service.serviceId, name: service.name });
                              setShowDeleteModal(true);
                            }}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-200 transition-all disabled:opacity-50 cursor-pointer leading-none"
                            title="Delete service"
                          >
                            <Trash2 size={14} strokeWidth={2.2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden">
              <MobileCards />
            </div>
          </>
        )}

        <PaginationBar />
      </div>
    </>
  );
}