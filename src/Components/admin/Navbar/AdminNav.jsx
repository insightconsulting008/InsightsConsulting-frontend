// AdminNav.jsx
// Fix: /admin/dashboard → /admin-dashboard  (to match AdminPage route AND AdminLogin navigate target)

import React, { useState, useEffect } from 'react';
import {
  Home, Briefcase, Users, CheckSquare, Bell,
  FileText, UserCircle, BarChart3, Settings, Menu, X, Plus
} from 'lucide-react';
import { HiUserPlus } from "react-icons/hi2";
import axios from 'axios';
import AddDepartmentModal from '../employee_repo/popup/AddDepartment';
import { useNavigate, useLocation } from "react-router-dom";

const AdminNav = ({ setRefreshDepartmentsTrigger }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [isDeptOpen,  setIsDeptOpen]  = useState(false);
  const [isOpen,      setIsOpen]      = useState(false);

  // departments
  const [departments,  setDepartments]  = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [deptError,    setDeptError]    = useState(null);
  const [deptPageSize]                  = useState(10);

  // ─────────────────────────────────────────────────────────────
  //  NAV ITEMS  —  paths must match AdminPage <Route path="…">
  // ─────────────────────────────────────────────────────────────
  const navItems = [
    { path: '/admin-dashboard', icon: Home,        label: 'Dashboard'  }, // ← was /admin/dashboard (WRONG)
    { path: '/services',        icon: Briefcase,   label: 'Services'   },
    { path: '/orders',          icon: Users,       label: 'Orders'     },
    { path: '/employees',       icon: BarChart3,   label: 'Employees'  },
    { path: '/customers',       icon: UserCircle,  label: 'Customers'  },
    { path: '/tasks',           icon: CheckSquare, label: 'Tasks'      },
    { path: '/compliance',      icon: Bell,        label: 'Compliance' },
    { path: '/documents',       icon: FileText,    label: 'Documents'  },
    { path: '/amendment',        icon: Settings,    label: 'Amendment'   },
    { path: '/reports',         icon: FileText,    label: 'Reports'    },
    { path: '/settings',        icon: Settings,    label: 'Settings'   },
  ];

  const handleNavClick = (path) => {
    setActiveRoute(path);
    navigate(path);
  };

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  /* ── Fetch departments ── */
  const fetchDepartments = async (page = 1, limit = deptPageSize) => {
    setLoadingDepts(true);
    setDeptError(null);
    try {
      const res = await axios.get(
        'https://insightsconsult-backend.onrender.com/department',
        { params: { page, limit } }
      );
      const payload = res?.data ?? {};
      let list = [];
      let pagination = null;

      if (Array.isArray(payload)) {
        list = payload;
      } else if (Array.isArray(payload.data)) {
        list = payload.data;
        pagination = payload.pagination ?? payload.meta ?? null;
      } else if (Array.isArray(payload.departments)) {
        list = payload.departments;
        pagination = payload.pagination ?? payload.meta ?? null;
      } else {
        const maybeArray = Object.values(payload).find(Array.isArray);
        list = maybeArray ?? [];
      }

      setDepartments(list);
    } catch (err) {
      console.error('Error fetching departments', err);
      setDeptError('Failed to load departments');
      setDepartments([]);
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => { fetchDepartments(1, deptPageSize); }, []);

  const handleDeptCreated = (created) => {
    if (!created) { fetchDepartments(); return; }
    const raw = created?.data ?? created;
    const dept = {
      departmentId:   raw?.departmentId || raw?.id || raw?._id || `tmp-${Date.now()}`,
      name:           raw?.name || raw?.departmentName || '',
      departmentCode: raw?.departmentCode || raw?.code || '',
      labelColor:     raw?.labelColor || raw?.color || '#CBD5E1',
      ...raw,
    };
    setDepartments(prev => [dept, ...prev]);
  };

  /* ────────────────────────── RENDER ────────────────────────── */
  return (
    <div className="flex">
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center border-b border-gray-200 px-4 flex-shrink-0">
          <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center w-full' : 'justify-start'}`}>
            <button
              onClick={() => setIsOpen(p => !p)}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="toggle sidebar"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className={`font-bold text-indigo-600 ${!isOpen ? 'hidden' : 'inline'}`}>
              Gridlines UI
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="py-4 overflow-y-auto flex-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = activeRoute === path;
            return (
              <button
                key={path}
                onClick={() => handleNavClick(path)}
                title={!isOpen ? label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${!isOpen ? 'justify-center' : ''}`}
              >
                <Icon size={20} />
                <span className={!isOpen ? 'hidden' : 'inline'}>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <UserCircle size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                <p className="text-xs text-gray-500 truncate">Admin@company.com</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Department modal */}
      {isDeptOpen && (
        <AddDepartmentModal
          open={isDeptOpen}
          onClose={() => setIsDeptOpen(false)}
          onSubmit={async (data) => {
            try {
              handleDeptCreated(data);
              await fetchDepartments(1, deptPageSize);
            } catch (e) {
              console.error('Dept submit error:', e);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminNav;