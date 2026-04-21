import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, ChevronDown, ChevronRight, X, Folder, FolderOpen } from 'lucide-react';
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

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, type = 'category' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete {type === 'category' ? 'Category' : 'Subcategory'}?
          </h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            Are you sure you want to delete "<span className="font-semibold text-gray-700">{itemName}</span>"?{' '}
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormModal = ({ isOpen, onClose, onSubmit, title, value, onChange, placeholder, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-100)' }}
              >
                <Folder className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {title.includes('Category') ? 'Category Name' : 'Subcategory Name'}
            </label>
            <input
              type="text"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoFocus
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none transition-all"
              style={{
                '--tw-ring-color': 'var(--color-primary)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(104,105,172,0.15)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !value.trim()}
              className="flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryList({ categories = [], subcategories = [], services = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredCategories = categories.filter(c =>
    c?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c?.categoryId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubcategoriesForCategory = id => subcategories.filter(s => s.categoryId === id);

  const getServiceCountForCategory = id => {
    const ids = subcategories.filter(s => s.categoryId === id).map(s => s.subCategoryId);
    return services.filter(s => ids.includes(s.subCategoryId)).length;
  };

  const getServiceCountForSubcategory = id => services.filter(s => s.subCategoryId === id).length;

  const toggleCategoryExpansion = id =>
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setActionLoading(true);
      await axiosInstance.post('/admin/category', { categoryName: newCategoryName });
      showToast('Category created successfully');
      onRefresh();
      setShowAddCategoryModal(false);
      setNewCategoryName('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !selectedCategory) return;
    try {
      setActionLoading(true);
      await axiosInstance.put(`/admin/category/${selectedCategory.categoryId}`, { categoryName: editCategoryName });
      showToast('Category updated successfully');
      onRefresh();
      setShowEditCategoryModal(false);
      setSelectedCategory(null);
      setEditCategoryName('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryForSubcategory) return;
    try {
      setActionLoading(true);
      await axiosInstance.post('/admin/subcategory', {
        categoryId: selectedCategoryForSubcategory.categoryId,
        subCategoryName: newSubcategoryName,
      });
      showToast('Subcategory created successfully');
      onRefresh();
      setShowAddSubcategoryModal(false);
      setNewSubcategoryName('');
      setSelectedCategoryForSubcategory(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating subcategory', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubcategory = async () => {
    if (!editSubcategoryName.trim() || !selectedSubcategory) return;
    try {
      setActionLoading(true);
      await axiosInstance.put(`/admin/subcategory/${selectedSubcategory.subCategoryId}`, { subCategoryName: editSubcategoryName });
      showToast('Subcategory updated successfully');
      onRefresh();
      setShowEditSubcategoryModal(false);
      setEditSubcategoryName('');
      setSelectedSubcategory(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating subcategory', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      setActionLoading(true);
      const endpoint = deleteItem.type === 'category' ? `/admin/category/${deleteItem.id}` : `/admin/subcategory/${deleteItem.id}`;
      await axiosInstance.delete(endpoint);
      showToast(`${deleteItem.type === 'category' ? 'Category' : 'Subcategory'} deleted successfully`);
      onRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error deleting', 'error');
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleDeleteClick = (item, type = 'category') => {
    setDeleteItem({
      id: type === 'category' ? item.categoryId : item.subCategoryId,
      name: type === 'category' ? item.categoryName : item.subCategoryName,
      type,
    });
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin mb-4"
          style={{ borderColor: 'var(--primary-100)', borderTopColor: 'var(--color-primary)' }}
        />
        <p className="text-sm text-gray-500">Loading categories…</p>
      </div>
    );
  }

  return (
    <>
      <FormModal isOpen={showAddCategoryModal} onClose={() => setShowAddCategoryModal(false)} onSubmit={handleCreateCategory} title="Add New Category" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Enter category name" loading={actionLoading} />
      <FormModal isOpen={showEditCategoryModal} onClose={() => { setShowEditCategoryModal(false); setSelectedCategory(null); setEditCategoryName(''); }} onSubmit={handleEditCategory} title="Edit Category" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} placeholder="Enter category name" loading={actionLoading} />
      <FormModal isOpen={showAddSubcategoryModal} onClose={() => { setShowAddSubcategoryModal(false); setSelectedCategoryForSubcategory(null); setNewSubcategoryName(''); }} onSubmit={handleCreateSubcategory} title="Add Subcategory" value={newSubcategoryName} onChange={e => setNewSubcategoryName(e.target.value)} placeholder="Enter subcategory name" loading={actionLoading} />
      <FormModal isOpen={showEditSubcategoryModal} onClose={() => { setShowEditSubcategoryModal(false); setSelectedSubcategory(null); setEditSubcategoryName(''); }} onSubmit={handleEditSubcategory} title="Edit Subcategory" value={editSubcategoryName} onChange={e => setEditSubcategoryName(e.target.value)} placeholder="Enter subcategory name" loading={actionLoading} />
      <DeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} itemName={deleteItem?.name} type={deleteItem?.type} />

      {/* Search + Actions */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none transition-all"
              onFocus={e => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(104,105,172,0.12)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Showing <span className="font-medium text-gray-600">{filteredCategories.length}</span> of{' '}
          <span className="font-medium text-gray-600">{categories.length}</span> categories
        </p>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--primary-50)' }}
          >
            <Folder className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Categories Found</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
            {searchQuery
              ? 'No categories match your search. Try a different term.'
              : 'Add your first category to get started.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              <Plus className="w-4 h-4" /> Add Your First Category
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.map(category => {
            const catSubs = getSubcategoriesForCategory(category.categoryId);
            const serviceCount = getServiceCountForCategory(category.categoryId);
            const isExpanded = expandedCategories.includes(category.categoryId);

            return (
              <div
                key={category.categoryId}
                className="bg-white rounded-xl border overflow-hidden transition-all"
                style={{
                  borderColor: isExpanded ? 'var(--primary-200)' : '#f1f1f5',
                  boxShadow: isExpanded ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {/* Category Header */}
                <div
                  className="px-4 py-3.5 flex items-center justify-between"
                  style={{ borderBottom: isExpanded ? '1px solid var(--primary-100)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCategoryExpansion(category.categoryId)}
                      disabled={catSubs.length === 0}
                      className="p-1 rounded-md transition-colors disabled:opacity-30"
                      style={{ color: 'var(--color-primary)' }}
                      onMouseEnter={e => catSubs.length > 0 && (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {catSubs.length > 0 ? (
                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </button>

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isExpanded ? 'var(--primary-100)' : 'var(--primary-50)' }}
                    >
                      {isExpanded
                        ? <FolderOpen className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        : <Folder className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">{category.categoryName}</p>
                      <p className="text-xs text-gray-400 font-mono">{category.categoryId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-gray-700">{catSubs.length} subcategories</p>
                      <p className="text-xs text-gray-400">{serviceCount} services</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedCategory(category); setEditCategoryName(category.categoryName); setShowEditCategoryModal(true); }}
                        className="p-1.5 rounded-lg text-gray-400 transition-colors"
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--primary-50)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category, 'category')}
                        className="p-1.5 rounded-lg text-gray-400 transition-colors"
                        onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setSelectedCategoryForSubcategory(category); setShowAddSubcategoryModal(true); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ml-1"
                        style={{ backgroundColor: 'var(--primary-50)', color: 'var(--color-primary)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--primary-100)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                      >
                        <Plus className="w-3 h-3" /> Add Sub
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {isExpanded && catSubs.length > 0 && (
                  <div className="p-3" style={{ backgroundColor: 'var(--primary-50)' }}>
                    <div className="space-y-2">
                      {catSubs.map(sub => {
                        const count = getServiceCountForSubcategory(sub.subCategoryId);
                        return (
                          <div
                            key={sub.subCategoryId}
                            className="bg-white rounded-lg border px-4 py-3 flex items-center justify-between"
                            style={{ borderColor: 'var(--primary-100)' }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{sub.subCategoryName}</p>
                                <p className="text-xs text-gray-400 font-mono">{sub.subCategoryId}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className="text-xs px-2 py-1 rounded-md font-medium"
                                style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}
                              >
                                {count} service{count !== 1 ? 's' : ''}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { setSelectedSubcategory(sub); setEditSubcategoryName(sub.subCategoryName); setShowEditSubcategoryModal(true); }}
                                  className="p-1.5 rounded-md text-gray-400 transition-colors"
                                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--primary-50)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(sub, 'subcategory')}
                                  className="p-1.5 rounded-md text-gray-400 transition-colors"
                                  onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                  onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}