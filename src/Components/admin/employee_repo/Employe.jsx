// EmployeeManagement.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import {
  Plus, Download, Users, Shield, UserCheck, Grid3x3,
  Search, MoreVertical, Edit2, Trash2,
} from 'lucide-react';
import { TbUserSquareRounded } from "react-icons/tb";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { GoShieldX } from "react-icons/go";
import { PiGridFourLight } from "react-icons/pi";
import AddEmployeeModal from './popup/AddEmploye';
import AddDepartmentModal from './popup/AddDepartment';
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from 'react-icons/fa';
import axiosInstance from '@src/providers/axiosInstance';
import PageHeader from '../page-header/PageHeader';

const TAB_DEFS = [
  { key: 'employees',   label: 'Employee List'   },
  { key: 'departments', label: 'Department List' },
];

// ─────────────────────────────────────────────────────────────
// Shared sub-components (unchanged from previous version)
// ─────────────────────────────────────────────────────────────

const ActionMenu = ({ emp, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-md hover:bg-primary-50 transition-colors" aria-haspopup="true" aria-expanded={open} aria-label="Open actions">
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-8 -top-1 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-50" role="menu">
          <button onClick={() => { setOpen(false); onEdit && onEdit(emp); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-primary-50 transition-colors text-sm" role="menuitem">
            <Edit2 className="w-4 h-4 text-primary" /><span className="text-gray-700">Edit</span>
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { setOpen(false); onDelete && onDelete(emp); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-rose-50 transition-colors text-sm text-rose-600" role="menuitem">
            <Trash2 className="w-4 h-4 text-rose-500" /><span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const DeptActionMenu = ({ dept, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-md hover:bg-primary-50 transition-colors" aria-haspopup="true" aria-expanded={open} aria-label="Open actions">
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </button>
      {open && (
        <div className="absolute -top-5 -left-24 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <button onClick={() => { setOpen(false); onEdit && onEdit(dept); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-primary-50 transition-colors text-sm">
            <Edit2 className="w-4 h-4 text-primary" /><span className="text-gray-700">Edit</span>
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { setOpen(false); onDelete && onDelete(dept); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-rose-50 transition-colors text-sm text-rose-600">
            <Trash2 className="w-4 h-4 text-rose-500" /><span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ── Avatar: shows photo or coloured initials circle ───────────────────────────
const EmployeeAvatar = ({ photoUrl, name, size = 36 }) => {
  const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  const palette = [
    ['#EDE9FE','#6D28D9'], ['#DBEAFE','#1D4ED8'], ['#D1FAE5','#065F46'],
    ['#FEF3C7','#92400E'], ['#FCE7F3','#9D174D'], ['#E0F2FE','#0369A1'],
  ];
  const [bg, fg] = palette[(name || '').charCodeAt(0) % palette.length];
  if (photoUrl) {
    return (
      <img src={photoUrl} alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover',
                 border: '2px solid #e5e7eb', flexShrink: 0 }} />
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
                  border: '2px solid #e5e7eb', letterSpacing: 0 }}>
      {initials}
    </div>
  );
};

// ── Employment-status pill ─────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const active = status === 'ACTIVE';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: active ? '#D1FAE5' : '#F3F4F6',
      color:      active ? '#065F46' : '#374151',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%',
                     background: active ? '#10B981' : '#9CA3AF', flexShrink: 0 }} />
      {status || '—'}
    </span>
  );
};

// ── Invite-status pill ─────────────────────────────────────────────────────────
const InvitePill = ({ status }) => {
  if (!status) return <span style={{ color: '#9CA3AF', fontSize: 12 }}>—</span>;
  const done = status === 'COMPLETED';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: done ? '#DBEAFE' : '#FEF3C7',
      color:      done ? '#1D4ED8' : '#92400E',
    }}>
      {status}
    </span>
  );
};

// ── Mobile card info cell ─────────────────────────────────────────────────────
const InfoCell = ({ label, value, truncate, badge, badgeStyle }) => (
  <div style={{ minWidth: 0 }}>
    <p style={{
      fontSize: 10, fontWeight: 700, color: '#9CA3AF',
      textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px',
    }}>
      {label}
    </p>
    {badge && value ? (
      <span style={{
        display: 'inline-block', padding: '2px 7px', borderRadius: 4,
        fontSize: 11, fontWeight: 600, ...badgeStyle,
      }}>
        {value}
      </span>
    ) : (
      <p style={{
        fontSize: 12, color: value ? '#374151' : '#D1D5DB', margin: 0,
        ...(truncate ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
      }}>
        {value || '—'}
      </p>
    )}
  </div>
);


const EmployeeManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');

  const [employees,        setEmployees]        = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error,            setError]            = useState(null);
  const [page,             setPage]             = useState(1);
  const pageSize = 10;
  const [serverTotalPages, setServerTotalPages] = useState(null);
  const [serverTotalDocs,  setServerTotalDocs]  = useState(null);

  const [modalOpen,         setModalOpen]         = useState(false);
  const [editingEmployee,   setEditingEmployee]   = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete,  setEmployeeToDelete]  = useState(null);
  const [deleting,          setDeleting]          = useState(false);
  const [deleteError,       setDeleteError]       = useState(null);
  const [deleteSuccess,     setDeleteSuccess]     = useState(false);

  const [departments,          setDepartments]          = useState([]);
  const [loadingDepartments,   setLoadingDepartments]   = useState(false);
  const [deptError,            setDeptError]            = useState(null);
  const [deptPage,             setDeptPage]             = useState(1);
  const deptPageSize = 10;
  const [deptServerTotalPages, setDeptServerTotalPages] = useState(null);
  const [deptServerTotalDocs,  setDeptServerTotalDocs]  = useState(null);

  const [showDeptDeleteConfirm, setShowDeptDeleteConfirm] = useState(false);
  const [deptToDelete,          setDeptToDelete]          = useState(null);
  const [deletingDept,          setDeletingDept]          = useState(false);
  const [deptDeleteError,       setDeptDeleteError]       = useState(null);
  const [deptDeleteSuccess,     setDeptDeleteSuccess]     = useState(false);

  const [activeFilter,    setActiveFilter]    = useState('All');
  const [searchQuery,     setSearchQuery]     = useState('');
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [deptFilter,      setDeptFilter]      = useState('All');
  const [deptSort,        setDeptSort]        = useState('name');
  const [employeeFilter,  setEmployeeFilter]  = useState('All');
  const [employeeSort,    setEmployeeSort]    = useState('name');

  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats,   setLoadingStats]   = useState(false);

  const [notifications, setNotifications] = useState([]);

  const stats = useMemo(() => {
    if (dashboardStats) {
      return [
        { label: 'Total Employees', value: dashboardStats.totalEmployees ?? employees.length, icon: TbUserSquareRounded },
        { label: 'Active',    value: dashboardStats.activeEmployees   ?? employees.filter((e) => e.status === 'ACTIVE').length, icon: MdOutlineVerifiedUser },
        { label: 'In Active', value: dashboardStats.inactiveEmployees ?? employees.filter((e) => e.status !== 'ACTIVE').length, icon: GoShieldX },
        { label: 'Department', value: String(dashboardStats.totalDepartments ?? departments.length).padStart(2, '0'), icon: PiGridFourLight },
      ];
    }
    const total  = employees.length;
    const active = employees.filter((e) => e.status === 'ACTIVE').length;
    return [
      { label: 'Total Employees', value: total,                                              icon: Users     },
      { label: 'Active',          value: active,                                             icon: Shield    },
      { label: 'In Active',       value: total - active,                                     icon: UserCheck },
      { label: 'Department',      value: String(departments.length).padStart(2, '0'),        icon: Grid3x3   },
    ];
  }, [dashboardStats, employees, departments]);

  const filters    = useMemo(() => ['All', ...departments.map((d) => d.name).filter(Boolean)], [departments]);
  const formatDate = (iso) => {
    if (!iso) return '—';
    try { const d = new Date(iso); if (Number.isNaN(d.getTime())) return iso; return d.toLocaleDateString(); }
    catch { return iso; }
  };

  const deptMap = useMemo(() => {
    const m = {};
    departments.forEach((d) => {
      if (d.departmentId) m[d.departmentId] = d.name || d.departmentName || '—';
      if (d._id)          m[d._id]          = d.name || d.label || d.departmentName || '—';
    });
    return m;
  }, [departments]);

  const deptCounts = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      const key = e.departmentId ?? e.department ?? '__unknown';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const fetchEmployees = useCallback(async (pageArg = page, limit = pageSize) => {
    const safePage = Math.max(1, pageArg || 1);
    setLoadingEmployees(true); setError(null);
    try {
      const res        = await axiosInstance.get('/employee', { params: { page: safePage, limit } });
      const payload    = res?.data ?? {};
      const list       = Array.isArray(payload.data) ? payload.data : [];
      const pagination = payload.pagination ?? null;
      setEmployees(list);
      setServerTotalPages(pagination?.totalPages != null ? pagination.totalPages : Math.max(1, Math.ceil((pagination?.totalEmployees ?? list.length) / limit)));
      setServerTotalDocs(pagination?.totalEmployees ?? pagination?.total ?? list.length);
    } catch (err) {
      setError('Failed to load employees'); setEmployees([]);
      setServerTotalPages(1); setServerTotalDocs(0);
    } finally { setLoadingEmployees(false); }
  }, [page, pageSize]);

  const fetchDepartments = useCallback(async (pageArg = deptPage, limit = deptPageSize) => {
    const safePage = Math.max(1, pageArg || 1);
    setLoadingDepartments(true); setDeptError(null);
    try {
      const res        = await axiosInstance.get('/department', { params: { page: safePage, limit } });
      const payload    = res?.data ?? {};
      const list       = Array.isArray(payload.data) ? payload.data : payload.departments || [];
      const pagination = payload.pagination ?? payload.meta ?? null;
      setDepartments(list);
      setDeptServerTotalPages(pagination?.totalPages != null ? pagination.totalPages : Math.max(1, Math.ceil((pagination?.total ?? list.length) / limit)));
      setDeptServerTotalDocs(pagination?.totalDepartments ?? pagination?.total ?? payload.total ?? list.length);
    } catch (err) {
      setDeptError('Failed to load departments'); setDepartments([]);
      setDeptServerTotalPages(1); setDeptServerTotalDocs(0);
    } finally { setLoadingDepartments(false); }
  }, [deptPage, deptPageSize]);

  const fetchDashboardStats = useCallback(async () => {
    setLoadingStats(true);
    try { const res = await axiosInstance.get('/dashboard/stats'); setDashboardStats(res?.data?.data ?? res?.data ?? null); }
    catch { setDashboardStats(null); }
    finally { setLoadingStats(false); }
  }, []);

  useEffect(() => { fetchEmployees(1); fetchDepartments(1); fetchDashboardStats(); }, []);
  useEffect(() => { if (activeTab === 'departments') fetchDepartments(deptPage); }, [activeTab, deptPage, fetchDepartments]);
  useEffect(() => { fetchEmployees(page); }, [page]);
  useEffect(() => { if (serverTotalPages && page > serverTotalPages) setPage(serverTotalPages); if (page < 1) setPage(1); }, [serverTotalPages, page]);
  useEffect(() => { if (deptServerTotalPages && deptPage > deptServerTotalPages) setDeptPage(deptServerTotalPages); }, [deptServerTotalPages, deptPage]);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = employees.slice();
    if (activeFilter && activeFilter !== 'All')
      list = list.filter((emp) => (deptMap[emp.departmentId] || '').toLowerCase() === activeFilter.toLowerCase());
    if (employeeFilter === 'Active')        list = list.filter((emp) => emp.status === 'ACTIVE');
    else if (employeeFilter === 'Inactive') list = list.filter((emp) => emp.status !== 'ACTIVE');
    if (q) list = list.filter((emp) => {
      const team = deptMap[emp.departmentId] || '';
      return ((emp.name || '').toLowerCase().includes(q) || (emp.employeeId || '').toLowerCase().includes(q) ||
        (emp.email || '').toLowerCase().includes(q) || (emp.mobileNumber || '').toLowerCase().includes(q) ||
        team.toLowerCase().includes(q) || (emp.designation || '').toLowerCase().includes(q));
    });
    if (employeeSort === 'name')            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (employeeSort === 'date')       list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (employeeSort === 'status')     list.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
    else if (employeeSort === 'department') list.sort((a, b) => (deptMap[a.departmentId] || '').localeCompare(deptMap[b.departmentId] || ''));
    return list;
  }, [employees, searchQuery, activeFilter, employeeFilter, employeeSort, deptMap]);

  const totalPages = serverTotalPages != null ? Math.max(1, serverTotalPages) : Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const pageItems  = filteredEmployees;

  const filteredDepartments = useMemo(() => {
    const q = deptSearchQuery.trim().toLowerCase();
    let list = departments.slice();
    if (deptFilter === 'With Employees') list = list.filter((d) => (deptCounts[d.departmentId ?? d._id ?? ''] || 0) > 0);
    else if (deptFilter === 'No Employees') list = list.filter((d) => (deptCounts[d.departmentId ?? d._id ?? ''] || 0) === 0);
    if (q) list = list.filter((d) => ((d.name || d.departmentName || '').toLowerCase().includes(q) ||
      (d.departmentCode || '').toLowerCase().includes(q) || (d.labelColor || '').toLowerCase().includes(q)));
    if (deptSort === 'name')           list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (deptSort === 'created')   list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (deptSort === 'employees') list.sort((a, b) => (deptCounts[b.departmentId ?? b._id ?? ''] || 0) - (deptCounts[a.departmentId ?? a._id ?? ''] || 0));
    return list;
  }, [departments, deptSearchQuery, deptFilter, deptSort, deptCounts]);

  const deptTotalPages = deptServerTotalPages != null ? Math.max(1, deptServerTotalPages) : Math.max(1, Math.ceil(filteredDepartments.length / deptPageSize));
  const deptPageItems  = filteredDepartments;

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  }, []);
  const removeNotification = useCallback((id) => setNotifications(prev => prev.filter(n => n.id !== id)), []);

  const downloadCSV = (rows, filename = 'employees.csv') => {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => {
      const s = String(r[k] ?? '').replace(/"/g, '""');
      return /[,"\n]/.test(s) ? `"${s}"` : s;
    }).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.setAttribute('download', filename);
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      let exportList = [];
      if (serverTotalDocs != null && serverTotalDocs > employees.length) {
        try {
          const res = await axiosInstance.get('/employee', { params: { page: 1, limit: serverTotalDocs } });
          exportList = Array.isArray(res?.data?.data) ? res.data.data : filteredEmployees.slice();
        } catch { exportList = filteredEmployees.slice(); }
      } else exportList = filteredEmployees.slice();
      if (!exportList || exportList.length === 0) exportList = employees.slice();
      const rowsForCsv = exportList.map((emp) => ({
        name: emp.name ?? '', employeeId: emp.employeeId ?? emp._id ?? '',
        email: emp.email ?? '', mobileNumber: emp.mobileNumber ?? '',
        team: deptMap[emp.departmentId] ?? deptMap[emp.department] ?? '',
        designation: emp.designation ?? '', doj: emp.createdAt ? formatDate(emp.createdAt) : '',
        status: emp.status ?? '', inviteStatus: emp.inviteStatus ?? '',
      }));
      if (rowsForCsv.length === 0) { addNotification('No data available to export', 'error'); return; }
      downloadCSV(rowsForCsv, `employees-${new Date().toISOString().slice(0, 10)}.csv`);
      addNotification(`Exported ${rowsForCsv.length} employees`, 'success');
    } catch { addNotification('Export failed. Please try again.', 'error'); }
  };

  const handleEdit   = (emp) => { setEditingEmployee(emp || null); setModalOpen(true); };
  const handleDelete = (emp) => { setEmployeeToDelete(emp); setDeleteError(null); setShowDeleteConfirm(true); };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    setDeleting(true); setDeleteError(null);
    const id = employeeToDelete._id ?? employeeToDelete.employeeId;
    if (!id) { setDeleteError('Invalid employee ID'); setDeleting(false); return; }
    try {
      await axiosInstance.delete(`/employee/${id}`);
      await fetchEmployees(page); await fetchDashboardStats();
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || err?.response?.data?.error || 'Delete failed. Please try again.');
    } finally { setDeleting(false); }
  };

  const cancelDelete           = () => { setShowDeleteConfirm(false); setEmployeeToDelete(null); setDeleteError(null); };
  const handleRefreshAfterSave = () => { fetchEmployees(page); setModalOpen(false); setEditingEmployee(null); fetchDepartments(deptPage); fetchDashboardStats(); };
  const handleViewDept         = (d) => console.log('View dept', d);
  const handleEditDept         = (d) => { setSelectedCategory(d || null); setOpen(true); };
  const handleDeleteDept       = (d) => { setDeptToDelete(d); setDeptDeleteError(null); setShowDeptDeleteConfirm(true); };

  const confirmDeleteDept = async () => {
    if (!deptToDelete) return;
    setDeletingDept(true); setDeptDeleteError(null);
    const id = deptToDelete.departmentId ?? deptToDelete._id;
    if (!id) { setDeptDeleteError('Invalid department ID'); setDeletingDept(false); return; }
    try {
      await axiosInstance.delete(`/department/${id}`);
      await fetchDepartments(1); await fetchDashboardStats();
      setDeptDeleteSuccess(true);
    } catch (err) { setDeptDeleteError(err?.response?.data?.message ?? 'Delete failed'); }
    finally { setDeletingDept(false); }
  };

  const cancelDeleteDept       = () => { setShowDeptDeleteConfirm(false); setDeptToDelete(null); setDeptDeleteError(null); };
  const handleRefreshClick     = () => { if (activeTab === 'employees') fetchEmployees(page); else fetchDepartments(deptPage); fetchDashboardStats(); };
  const refreshDepartmentsOnce = async () => { setDeptPage(1); await fetchDepartments(1); fetchDashboardStats(); };

  const handleTabChange = (tabKey) => {
    if (tabKey === 'employees') { setActiveFilter('All'); setEmployeeFilter('All'); setEmployeeSort('name'); setSearchQuery(''); setPage(1); setError(null); }
    else { setActiveFilter('null'); setDeptError(null); }
    setActiveTab(tabKey);
  };

  // ─────────────────────────────────────────────────────────────
  // Tab content
  // ─────────────────────────────────────────────────────────────
  const renderTabContent = () => {
    if (activeTab === 'employees') {
      return (
        <>
          {/* Department filter tabs */}
          <div className="flex gap-2 mb-6 py-6 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button key={filter} onClick={() => { setActiveFilter(filter); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'
                }`}>
                {filter}
              </button>
            ))}
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search employees (name, ID, email, phone, team)" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <select value={employeeFilter} onChange={(e) => { setEmployeeFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm">
                <option value="All">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
              <select value={employeeSort} onChange={(e) => { setEmployeeSort(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-primary rounded-lg text-sm">
                <option value="name">Sort: Name</option>
                <option value="date">Sort: Newest</option>
                <option value="status">Sort: Status</option>
                <option value="department">Sort: Department</option>
              </select>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              DESKTOP TABLE — redesigned
          ══════════════════════════════════════════════════ */}
          <div className="hidden md:block rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>

                {/* Column widths */}
                <colgroup>
                  <col style={{ width: '21%' }} />  {/* Employee */}
                  <col style={{ width: '18%' }} />  {/* Email */}
                  <col style={{ width: '12%' }} />  {/* Phone */}
                  <col style={{ width: '12%' }} />  {/* Team */}
                  <col style={{ width: '9%'  }} />  {/* Joined */}
                  <col style={{ width: '10%' }} />  {/* Status */}
                  <col style={{ width: '10%' }} />  {/* Invite */}
                  <col style={{ width: '8%'  }} />  {/* Actions */}
                </colgroup>

                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB' }}>
                    {[
                      { label: 'Employee',  align: 'left'   },
                      { label: 'Email',     align: 'left'   },
                      { label: 'Phone',     align: 'left'   },
                      { label: 'Team',      align: 'left'   },
                      { label: 'Joined',    align: 'left'   },
                      { label: 'Status',    align: 'center' },
                      { label: 'Invite',    align: 'center' },
                      { label: 'Actions',   align: 'center' },
                    ].map(({ label, align }, i) => (
                      <th key={i} style={{
                        textAlign: align,
                        padding: '10px 14px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#9CA3AF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        whiteSpace: 'nowrap',
                      }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loadingEmployees ? (
                    /* Skeleton rows */
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', animation: 'pulse 1.5s ease-in-out infinite' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ height: 12, background: '#F3F4F6', borderRadius: 4, width: '60%', marginBottom: 6 }} />
                              <div style={{ height: 10, background: '#F9FAFB', borderRadius: 4, width: '40%' }} />
                            </div>
                          </div>
                        </td>
                        {[1,2,3,4,5,6,7].map(j => (
                          <td key={j} style={{ padding: '14px 16px' }}>
                            <div style={{ height: 11, background: '#F3F4F6', borderRadius: 4, width: '70%' }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>{error}</td>
                    </tr>
                  ) : pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '64px 24px', textAlign: 'center' }}>
                        <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225812.png"
                          style={{ height: 112, margin: '0 auto 16px' }} alt="" />
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>No employee records found</p>
                        <p style={{ fontSize: 12, color: '#9CA3AF' }}>It looks like there are no employee details available yet.</p>
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((emp, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <tr key={emp.employeeId || emp.email || emp._id}
                          style={{
                            background: isEven ? '#FFFFFF' : '#FAFAFA',
                            borderBottom: '1px solid #F3F4F6',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
                          onMouseLeave={e => e.currentTarget.style.background = isEven ? '#FFFFFF' : '#FAFAFA'}
                        >
                          {/* Employee: avatar + name + designation */}
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              <EmployeeAvatar photoUrl={emp.photoUrl} name={emp.name} size={34} />
                              <div style={{ minWidth: 0 }}>
                                <p style={{
                                  fontSize: 14, fontWeight: 600, color: '#111827', margin: 0,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {emp.name || '—'}
                                </p>
                                <p style={{
                                  fontSize: 12, color: '#9CA3AF', margin: '2px 0 0',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {emp.designation || '—'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td style={{ padding: '10px 14px', fontSize: 14, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {emp.email || '—'}
                          </td>

                          {/* Phone */}
                          <td style={{ padding: '10px 14px', fontSize: 14, color: '#6B7280', whiteSpace: 'nowrap' }}>
                            {emp.mobileNumber || '—'}
                          </td>

                          {/* Team */}
                          <td style={{ padding: '10px 14px' }}>
                            {(deptMap[emp.departmentId] || deptMap[emp.department]) ? (
                              <span style={{
                                display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11,
                                fontWeight: 600, background: '#EDE9FE', color: '#5B21B6',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
                              }}>
                                {deptMap[emp.departmentId] || deptMap[emp.department]}
                              </span>
                            ) : <span style={{ color: '#D1D5DB', fontSize: 13 }}>—</span>}
                          </td>

                          {/* Joined */}
                          <td style={{ padding: '10px 14px', fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                            {formatDate(emp.createdAt)}
                          </td>

                          {/* Status */}
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <StatusPill status={emp.status} />
                          </td>

                          {/* Invite */}
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <InvitePill status={emp.inviteStatus} />
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <ActionMenu emp={emp} onEdit={handleEdit} onDelete={handleDelete} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', borderTop: '1px solid #E5E7EB', background: '#F8FAFC' }}>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                Page {page} of {totalPages}
                {serverTotalDocs != null && <span> · {serverTotalDocs} total</span>}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 bg-white rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <FaChevronLeft className="w-2.5 h-2.5" /> Prev
                </button>
                {/* page number buttons */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{
                        width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        border: p === page ? 'none' : '1px solid #E5E7EB',
                        background: p === page ? 'var(--color-primary, #4F46E5)' : '#fff',
                        color: p === page ? '#fff' : '#374151',
                        transition: 'all 0.15s',
                      }}>
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 bg-white rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next <FaChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              MOBILE CARDS — redesigned
          ══════════════════════════════════════════════════ */}
          <div className="md:hidden space-y-2">
            {loadingEmployees ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                  <div style={{ background: '#F8FAFC', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E5E7EB', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 11, background: '#E5E7EB', borderRadius: 3, width: '42%', marginBottom: 7 }} />
                      <div style={{ height: 9, background: '#F3F4F6', borderRadius: 3, width: '28%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ height: 18, width: 50, background: '#E5E7EB', borderRadius: 99 }} />
                      <div style={{ height: 18, width: 64, background: '#E5E7EB', borderRadius: 99 }} />
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                    {[60, 45, 70, 40].map((w, j) => (
                      <div key={j}>
                        <div style={{ height: 8, background: '#F3F4F6', borderRadius: 3, width: '35%', marginBottom: 5 }} />
                        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 3, width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : error ? (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #FECACA', padding: '32px 20px', textAlign: 'center', fontSize: 13, color: '#EF4444' }}>
                {error}
              </div>
            ) : pageItems.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: '48px 20px', textAlign: 'center' }}>
                <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225812.png" style={{ height: 80, margin: '0 auto 12px' }} alt="" />
                <p style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>No employees found</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              pageItems.map((emp) => {
                const team = deptMap[emp.departmentId] || deptMap[emp.department] || '';
                return (
                  <div key={emp.employeeId || emp.email || emp._id} style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                  }}>
                    {/* ── Header strip: avatar · name · badges · menu ── */}
                    <div style={{
                      background: '#F8FAFC',
                      borderBottom: '1px solid #F0F0F0',
                      padding: '11px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <EmployeeAvatar photoUrl={emp.photoUrl} name={emp.name} size={38} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {emp.name || '—'}
                        </p>
                        {emp.designation && (
                          <p style={{ fontSize: 10, color: '#9CA3AF', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {emp.designation}
                          </p>
                        )}
                      </div>

                      {/* Status + Invite pills — right of name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <StatusPill status={emp.status} />
                        <InvitePill status={emp.inviteStatus} />
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        <ActionMenu emp={emp} onEdit={handleEdit} onDelete={handleDelete} />
                      </div>
                    </div>

                    {/* ── Info grid: 2-column labelled fields ── */}
                    <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 8 }}>
                      <InfoCell label="Email" value={emp.email} truncate />
                      <InfoCell label="Phone" value={emp.mobileNumber} />
                      <InfoCell label="Team" value={team} badge badgeStyle={{ background: '#EDE9FE', color: '#5B21B6' }} />
                      <InfoCell label="Joined" value={formatDate(emp.createdAt)} />
                    </div>
                  </div>
                );
              })
            )}

            {/* Mobile pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 bg-white rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none">
                <FaChevronLeft className="w-3 h-3" /> Prev
              </button>
              <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 bg-white rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none">
                Next <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      );
    }

    // ── Departments tab (unchanged) ────────────────────────────
    return (
      <div>
        <div className="flex py-6 flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search departments (name, code, color)" value={deptSearchQuery}
              onChange={(e) => { setDeptSearchQuery(e.target.value); setDeptPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base" />
          </div>
          <div className="flex items-center gap-2">
            <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setDeptPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm">
              <option>All</option><option>With Employees</option><option>No Employees</option>
            </select>
            <select value={deptSort} onChange={(e) => setDeptSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-primary rounded-lg text-sm">
              <option value="name">Sort: Name</option>
              <option value="created">Sort: Newest</option>
              <option value="employees">Sort: Employees</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 border-b border-primary-200">
                <tr>
                  {['Department', 'Code', 'Created', 'Color', 'Employees', 'Actions'].map(h => (
                    <th key={h} className="px-3 py-3 text-center text-xs font-medium text-primary-800 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingDepartments ? (
                  <tr><td colSpan={6} className="px-6 py-8"><div className="flex items-center justify-center text-gray-600">Loading departments...</div></td></tr>
                ) : deptError ? (
                  <tr><td colSpan={6} className="px-6 py-8"><div className="flex flex-col items-center justify-center text-center"><h3 className="text-base font-semibold text-gray-900 mb-1">Error</h3><p className="text-xs text-gray-500">{deptError}</p></div></td></tr>
                ) : deptPageItems.length === 0 ? (
                  <tr><td colSpan={6} className="px-3 py-20"><div className="flex flex-col items-center justify-center text-center"><img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225812.png" className='h-32' alt="" /><h3 className="text-base font-semibold text-gray-900 mb-1 mt-4">No Department records found</h3><p className="text-xs text-gray-500">No department details available yet.</p></div></td></tr>
                ) : (
                  deptPageItems.map((d) => {
                    const idKey = d.departmentId ?? d._id ?? '';
                    const count = deptCounts[idKey] ?? 0;
                    return (
                      <tr key={idKey || d.name} className="hover:bg-primary-50 transition-colors">
                        <td className="px-3 py-4 text-sm border text-center text-gray-700">{d.name || d.departmentName || '—'}</td>
                        <td className="px-3 py-4 text-sm border text-center text-gray-700">{d.departmentCode ?? '—'}</td>
                        <td className="px-3 py-4 text-sm border text-center text-gray-700">{formatDate(d.createdAt)}</td>
                        <td className="px-3 py-4 border">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-6 h-6 rounded-full border" style={{ background: d.labelColor || '#eee' }} aria-hidden="true" />
                            <div className="text-xs text-gray-500">{d.labelColor || '—'}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-center border text-gray-700">{count}</td>
                        <td className="px-3 py-4 text-center border text-sm text-gray-700">
                          <DeptActionMenu dept={d} onView={handleViewDept} onEdit={handleEditDept} onDelete={handleDeleteDept} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="border-t border-gray-200 px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button onClick={() => setDeptPage((p) => Math.max(1, p - 1))} disabled={deptPage <= 1} className="w-full sm:w-auto px-4 py-2 border text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary hover:text-primary rounded-lg transition-colors disabled:opacity-50">Previous</button>
              <span className="px-4 py-2 text-sm text-gray-700">Page {deptPage} of {deptTotalPages}</span>
              <button onClick={() => setDeptPage((p) => Math.min(deptTotalPages, p + 1))} disabled={deptPage >= deptTotalPages} className="w-full border sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary hover:text-primary rounded-lg transition-colors disabled:opacity-50">Next</button>
            </div>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            {loadingDepartments ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="h-3.5 bg-primary-50 rounded w-1/2" />
                  <div className="h-3 bg-primary-50 rounded w-1/3" />
                  <div className="h-3 bg-primary-50 rounded w-2/5" />
                </div>
              ))
            ) : deptError ? (
              <div className="p-6 text-center text-sm text-red-500">{deptError}</div>
            ) : deptPageItems.length === 0 ? (
              <div className="py-14 text-center"><p className="text-gray-500 font-medium text-sm">No department records found</p></div>
            ) : (
              deptPageItems.map((d) => {
                const idKey = d.departmentId ?? d._id ?? '';
                const count = deptCounts[idKey] ?? 0;
                return (
                  <div key={idKey || d.name} className="p-4 hover:bg-primary-50/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded-full border shrink-0" style={{ background: d.labelColor || '#eee' }} />
                          <p className="font-semibold text-gray-900 text-sm truncate">{d.name || d.departmentName || '—'}</p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-500 mt-2">
                          {d.departmentCode && (<div className="flex items-center gap-1"><span className="text-gray-400">Code:</span><span className="font-mono font-medium text-gray-700">{d.departmentCode}</span></div>)}
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-medium">{count} employee{count !== 1 ? 's' : ''}</span>
                            <span className="text-gray-400">{formatDate(d.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <DeptActionMenu dept={d} onView={handleViewDept} onEdit={handleEditDept} onDelete={handleDeleteDept} />
                    </div>
                  </div>
                );
              })
            )}
            <div className="border-t border-gray-200 px-4 py-4 flex items-center justify-center gap-2">
              <button onClick={() => setDeptPage((p) => Math.max(1, p - 1))} disabled={deptPage <= 1} className="flex-1 border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 flex justify-center items-center hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"><FaChevronLeft /></button>
              <span className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{deptPage} of {deptTotalPages}</span>
              <button onClick={() => setDeptPage((p) => Math.min(deptTotalPages, p + 1))} disabled={deptPage >= deptTotalPages} className="flex-1 border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 flex justify-center items-center hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // Root render (unchanged)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {notifications.map((notification) => (
          <div key={notification.id} className="animate-slide-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
              <button onClick={() => removeNotification(notification.id)} className="ml-4 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <PageHeader
        title="Employee Management"
        subtitle="Manage employees and departments"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'employees' ? (
              <button onClick={() => { setEditingEmployee(null); setModalOpen(true); }}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Employee
              </button>
            ) : (
              <button onClick={() => { setSelectedCategory(null); setOpen(true); }}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Department
              </button>
            )}
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary hover:text-primary transition-colors text-sm font-medium whitespace-nowrap">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        }
      />

      <div className="max-w-7xl bg-white border py-10 mt-10 rounded-lg lg:px-6 p-3 mx-auto">
        {/* Stats */}
        <div className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2">
            <h2 className="text-base md:text-lg font-semibold lg:border-r-2 border-gray-300 col-span-2 lg:col-span-1 text-gray-900">Employee Database</h2>
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 lg:border-r-2 border-gray-300 last:border-r-0">
                <div className="rounded-md text-white px-2 py-2 bg-primary flex items-center justify-center flex-shrink-0">
                  <stat.icon className="text-2xl" />
                </div>
                <div><p className="text-xs md:text-sm text-gray-600">{stat.label}</p></div>
                <p className="text-sm md:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TAB_DEFS.map((t) => (
            <button key={t.key} type="button" onClick={() => handleTabChange(t.key)} role="tab" aria-selected={activeTab === t.key}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary border border-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>

      {/* Employee Delete Modal — unchanged */}
      {showDeleteConfirm && employeeToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative" style={{ boxShadow: 'var(--shadow-2xl)' }}>
            <div className="flex items-center bg-primary rounded-t-xl gap-3 p-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                <EmployeeAvatar photoUrl={employeeToDelete?.photoUrl} name={employeeToDelete?.name} size={44} />
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-semibold text-lg">{employeeToDelete?.name}</h3>
                <p className="text-sm text-primary-100">{employeeToDelete?.role} | {employeeToDelete?.designation}</p>
              </div>
            </div>
            <button onClick={() => { setShowDeleteConfirm(false); setEmployeeToDelete(null); setDeleteSuccess(false); }}
              className="absolute right-4 top-4 text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {deleteSuccess ? 'Deleted Successfully' : 'Confirm Delete'}
              </h3>
            </div>
            <div className="px-6 pb-6">
              {deleteSuccess ? (
                <div className="flex flex-col items-center text-center gap-3">
                  <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png" className="h-16" alt="" />
                  <p className="text-sm text-gray-700"><strong>{employeeToDelete.name}</strong> has been deleted successfully.</p>
                  <p className="text-xs text-gray-500">This action cannot be undone.</p>
                </div>
              ) : (
                <>
                  <div className='flex justify-center items-center mb-4'>
                    <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png" className="h-16" alt="" />
                  </div>
                  <p className='text-lg text-center mb-2'>{employeeToDelete.name} | {employeeToDelete.designation}</p>
                  <p className="text-sm text-center text-gray-700 mb-4">Are you sure you want to permanently delete this employee?</p>
                  {deleteError && <div className="text-sm text-center text-rose-600 mb-3">{deleteError}</div>}
                  <div className="flex w-[60%] mx-auto gap-3">
                    <button onClick={confirmDelete} disabled={deleting}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-60">
                      {deleting ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button onClick={cancelDelete} disabled={deleting}
                      className="flex-1 border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Department Delete Modal — unchanged */}
      {showDeptDeleteConfirm && deptToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
            <button onClick={() => { setShowDeptDeleteConfirm(false); setDeptToDelete(null); setDeptDeleteSuccess(false); }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              {deptDeleteSuccess ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png" className="h-16" alt="" />
                  <p className="text-lg text-gray-700">Department deleted successfully.</p>
                </div>
              ) : (
                <>
                  <div className='flex items-center justify-center mb-4'>
                    <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png" className="h-16" alt="" />
                  </div>
                  <p className='text-lg text-center mb-2'>{deptToDelete.name} | {deptToDelete.departmentCode}</p>
                  <p className="text-sm text-center text-gray-700 mb-4">
                    Are you sure you want to permanently delete <strong>{deptToDelete.name}</strong>?
                  </p>
                  {deptDeleteError && <div className="text-sm text-center text-rose-600 mb-3">{deptDeleteError}</div>}
                  <div className="flex w-[60%] mx-auto gap-3">
                    <button onClick={confirmDeleteDept} disabled={deletingDept}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-60">
                      {deletingDept ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button onClick={cancelDeleteDept} disabled={deletingDept}
                      className="flex-1 border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AddEmployeeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEmployee(null); }}
        initialData={editingEmployee}
        onEmployeeAdded={() => handleRefreshAfterSave()}
        onEmployeeUpdated={() => handleRefreshAfterSave()}
      />

      <AddDepartmentModal
        open={open}
        onClose={() => { setOpen(false); setSelectedCategory(null); }}
        initialData={selectedCategory}
        onSubmit={refreshDepartmentsOnce}
        onUpdate={refreshDepartmentsOnce}
      />
    </div>
  );
};

export default EmployeeManagement;