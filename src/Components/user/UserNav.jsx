// UserNav.jsx
import React, { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  Package,
  FileText,
  MessageSquare,
  CreditCard,
  Bell,
  UserCircle,
  Settings,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const UserNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/my-services', icon: Package, label: 'My Services' },
    { path: '/services', icon: Briefcase, label: 'Browse Services' }, // Changed from /user/service-hub
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
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
                ServicePortal
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    john.doe@email.com
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

export default UserNav;