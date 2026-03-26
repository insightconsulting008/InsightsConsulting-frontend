// UserNav.jsx — Primary: #6869AC (from App.css --color-primary)
import React, { useState, useEffect } from 'react';
import {
  Home,
  Package,
  Briefcase,
  FileText,
  UserCircle,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '@src/providers/LogoutButton';
import axiosInstance from "@src/providers/axiosInstance";

const NAV_ITEMS = [
  { path: '/user-dashboard', icon: Home, label: 'Dashboard' },
  { path: '/my-services', icon: Package, label: 'My Services' },
  { path: '/services', icon: Briefcase, label: 'Browse Services' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
];

const UserNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [active, setActive] = useState(location.pathname);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    photoUrl: null,
    initials: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("API Response:", res.data); // For debugging
        
        const userData = res.data.data;
        
        // Generate initials from name
        const nameParts = userData.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts[1] || '';
        const initials = (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();
        
        setUserProfile({
          name: userData.name || 'User',
          email: userData.email || '',
          photoUrl: userData.photoUrl || null, // Using photoUrl from API
          initials: initials || 'U'
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserProfile({
          name: 'User',
          email: '',
          photoUrl: null,
          initials: 'U'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to check if a route is active (supports nested routes)
  const isRouteActive = (routePath) => {
    const currentPath = location.pathname;
    
    if (routePath === '/my-services') {
      // My Services active for /my-services and any /my-service/view/{id} paths
      // Note: The path in the requirement is /my-service/view/{id} (singular)
      return currentPath === routePath || 
             currentPath.startsWith('/my-service/view/');
    }
    
    if (routePath === '/services') {
      // Browse Services active for /services and any /services/* paths
      return currentPath === routePath || currentPath.startsWith('/services/');
    }
    
    if (routePath === '/documents') {
      // Documents active for /documents and any /documents/* paths
      return currentPath === routePath || currentPath.startsWith('/documents/');
    }
    
    // For all other routes, check exact match
    return currentPath === routePath;
  };

  useEffect(() => { 
    // Update active route based on current path
    const activeNavItem = NAV_ITEMS.find(item => isRouteActive(item.path));
    if (activeNavItem) {
      setActive(activeNavItem.path);
    } else {
      setActive(location.pathname);
    }
  }, [location.pathname]);

  const go = (path) => { 
    // For my-services, navigate to /my-services
    if (path === '/my-services') {
      setActive(path);
      navigate('/my-services');
    } else {
      setActive(path);
      navigate(path);
    }
    
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Navigate to profile page
  const goToProfile = () => {
    go('/profile');
  };

  // Determine sidebar width based on open state and hover
  const sidebarWidth = isOpen || isHovered ? 'w-64' : 'w-20';

  // Avatar component with image or initials fallback
  const UserAvatar = ({ size = 'md', onClick }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-9 h-9',
      lg: 'w-10 h-10'
    };

    const textSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };

    const avatarContent = userProfile.photoUrl ? (
      <img
        src={userProfile.photoUrl}
        alt={userProfile.name}
        className={`${sizeClasses[size]} rounded-xl object-cover border-2 border-primary-100`}
        referrerPolicy="no-referrer" // Important for Google profile images
        onError={(e) => {
          // Fallback if image fails to load
          e.target.onerror = null;
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `
            <div class="${sizeClasses[size]} bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm">
              <span class="${textSizes[size]} font-bold text-primary">${userProfile.initials}</span>
            </div>
          `;
        }}
      />
    ) : (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm`}>
        <span className={`${textSizes[size]} font-bold text-primary`}>
          {userProfile.initials}
        </span>
      </div>
    );

    // If onClick is provided, wrap in a button
    if (onClick) {
      return (
        <button 
          onClick={onClick}
          className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-xl"
          title="Go to profile"
        >
          {avatarContent}
        </button>
      );
    }

    return avatarContent;
  };

  // Desktop Sidebar with hover functionality
  const DesktopSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out hidden md:flex md:flex-col ${sidebarWidth}`}
      style={{ boxShadow: 'var(--shadow-md)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with logo and toggle */}
      <div className="h-16 flex items-center border-b border-neutral-200 px-4 flex-shrink-0">
        <div className={`flex items-center gap-3 ${!(isOpen || isHovered) ? 'justify-center w-full' : 'justify-between w-full'}`}>
          {(isOpen || isHovered) && (
            <span className="font-bold text-xl text-primary tracking-tight animate-fadeIn">
              ServicePortal
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-neutral-600 hover:text-primary cursor-pointer"
            aria-label={isOpen ? "collapse sidebar" : "expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="py-6 overflow-y-auto flex-1 px-3">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = isRouteActive(path);
          return (
            <button
              key={path}
              onClick={() => go(path)}
              title={!(isOpen || isHovered) ? label : ''}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all mb-1 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-primary-50 hover:text-primary'
              } ${!(isOpen || isHovered) ? 'justify-center' : ''}`}
            >
              <Icon size={20} />
              <span className={`${!(isOpen || isHovered) ? 'hidden' : 'text-sm font-medium'} transition-all duration-200`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-neutral-200 p-4 flex-shrink-0">
        {(isOpen || isHovered) ? (
          <div className="space-y-3">
            <button
              onClick={goToProfile}
              className="w-full flex items-center gap-3 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <UserAvatar size="md" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {userProfile.email}
                </p>
              </div>
            </button>
            <LogoutButton variant="sidebar" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UserAvatar size="lg" onClick={goToProfile} />
            <LogoutButton variant="icon" />
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Top Navigation
  const MobileTopNav = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-30 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
        >
          <Menu size={24} className="text-primary" />
        </button>
        <span className="font-bold text-lg text-primary">ServicePortal</span>
      </div>
      <div className="flex items-center gap-2">
        <UserAvatar size="sm" onClick={goToProfile} />
        <LogoutButton variant="icon" />
      </div>
    </div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 z-30 px-2 flex items-center justify-around shadow-lg">
      {NAV_ITEMS.slice(0, 5).map(({ path, icon: Icon, label }) => {
        const isActive = isRouteActive(path);
        return (
          <button
            key={path}
            onClick={() => go(path)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-primary' : 'text-neutral-500 hover:text-primary hover:bg-primary-50'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );

  // Mobile Slide-out Menu
  const MobileMenu = () => (
    <div
      className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 cursor-pointer"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Menu Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <span className="font-bold text-lg text-primary">ServicePortal</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} className="text-neutral-600" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const isActive = isRouteActive(path);
              return (
                <button
                  key={path}
                  onClick={() => go(path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-1 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-primary-50 hover:text-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-neutral-200 p-4">
            <button
              onClick={() => {
                goToProfile();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 bg-neutral-50 rounded-lg mb-3 cursor-pointer hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <UserAvatar size="md" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-neutral-900">
                  {userProfile.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {userProfile.email}
                </p>
              </div>
            </button>
            <LogoutButton variant="mobile" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-y-0 left-0 w-20 bg-white border-r border-neutral-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Navigation */}
      <MobileTopNav />
      <MobileBottomNav />
      <MobileMenu />

      {/* Main Content Spacer for Desktop */}
      <div className={`hidden md:block transition-all duration-300 ${isOpen || isHovered ? 'ml-64' : 'ml-20'}`} />

      {/* Main Content Spacer for Mobile — matches MobileTopNav height (h-16 = 64px) */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default UserNav;