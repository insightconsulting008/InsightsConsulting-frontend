// StaffNav.jsx
import React, { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  CheckSquare,
  Bell,
  FileText,
  UserCircle,
  Settings,
  Menu,
  X,
  Calendar
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const StaffNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/staff/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/services', icon: Briefcase, label: 'Services' }, // Changed from /staff/my-services
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/compliance', icon: Bell, label: 'Compliance' }, // Shortened
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/profile', icon: UserCircle, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (path) => {
    setActiveRoute(path);
    navigate(path);
  };

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex">
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } overflow-hidden`}
      >
        {/* Rest of your component remains the same */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between border-b border-gray-200 px-4">
            <div
              className={`flex items-center gap-3 ${
                !isOpen ? 'justify-center w-full' : 'justify-start'
              }`}
            >
              <button
                onClick={() => setIsOpen(prev => !prev)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="expand sidebar"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <span
                className={`font-bold text-indigo-600 transition-all ${
                  !isOpen ? 'hidden' : 'inline'
                }`}
              >
                Staff Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="py-4 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${!isOpen ? 'justify-center' : ''}`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon size={20} />
                  <span className={`${!isOpen ? 'hidden' : 'inline'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserCircle size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Staff User
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    staff@company.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffNav;