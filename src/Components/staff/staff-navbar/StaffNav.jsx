// StaffNav.jsx
import React, { useState, useEffect } from "react";
import {
  Home,
  CheckSquare,
  Bell,
  FileText,
  UserCircle,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "@src/providers/LogoutButton";
import axiosInstance from "@src/providers/axiosInstance";

const StaffNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/staff/settings/profile');
        if (res.data.success) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─────────────────────────────────────────────────────────────
  //  NAV ITEMS  —  paths must match StaffPage <Route path="…">
  // ─────────────────────────────────────────────────────────────
  const navItems = [
    { path: "/staff/dashboard", icon: Home, label: "Dashboard" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/amendment", icon: FileText, label: "Amendment" },
    // { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/profile", icon: UserCircle, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  // Function to check if a route is active (supports nested routes)
  const isRouteActive = (routePath) => {
    const currentPath = location.pathname;
    
    if (routePath === "/tasks") {
      // Tasks active for /tasks and any /tasks/{id} paths
      return currentPath === routePath || currentPath.startsWith('/tasks/');
    }
    
    if (routePath === "/amendment") {
      // Amendment active for /amendment and any /amendment/* paths
      return currentPath === routePath || currentPath.startsWith('/amendment/');
    }
    
    if (routePath === "/profile") {
      // Profile active for /profile and any /profile/* paths
      return currentPath === routePath || currentPath.startsWith('/profile/');
    }
    
    if (routePath === "/settings") {
      // Settings active for /settings and any /settings/* paths
      return currentPath === routePath || currentPath.startsWith('/settings/');
    }
    
    // For all other routes, check exact match
    return currentPath === routePath;
  };

  const handleNavClick = (path) => {
    setActiveRoute(path);
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    // Update active route based on current path
    const activeNavItem = navItems.find(item => isRouteActive(item.path));
    if (activeNavItem) {
      setActiveRoute(activeNavItem.path);
    } else {
      setActiveRoute(location.pathname);
    }
  }, [location.pathname]);

  // Determine sidebar width based on open state and hover
  const sidebarWidth = isOpen || isHovered ? "w-64" : "w-20";

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (profile?.photoUrl) {
      return profile.photoUrl;
    }
    // Use UI Avatars as fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=22c55e&color=fff&size=128`;
  };

  // Desktop Sidebar with hover functionality
  const DesktopSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out hidden md:flex md:flex-col ${sidebarWidth}`}
      style={{ boxShadow: "var(--shadow-md)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with logo and toggle */}
      <div className="h-16 flex items-center border-b border-neutral-200 px-4 flex-shrink-0">
        <div
          className={`flex items-center gap-3 ${!(isOpen || isHovered) ? "justify-center w-full" : "justify-between w-full"}`}
        >
          {(isOpen || isHovered) && (
            <span className="font-bold text-xl text-primary tracking-tight animate-fadeIn">
              Staff Portal
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
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = isRouteActive(path);
          return (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              title={!(isOpen || isHovered) ? label : ""}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all mb-1 cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-600 hover:bg-primary-50 hover:text-primary"
              } ${!(isOpen || isHovered) ? "justify-center" : ""}`}
            >
              <Icon size={20} />
              <span
                className={`${!(isOpen || isHovered) ? "hidden" : "text-sm font-medium"} transition-all duration-200`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-neutral-200 p-4 flex-shrink-0">
        {isOpen || isHovered ? (
          <div className="space-y-3">
            <div 
              className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              onClick={() => handleNavClick('/profile')}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-primary-100">
                {profile?.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=22c55e&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {getInitials(profile?.name)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {profile?.name || 'Staff User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {profile?.email || 'staff@company.com'}
                </p>
              </div>
            </div>
            <LogoutButton variant="sidebar" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors cursor-pointer"
              onClick={() => handleNavClick('/profile')}
              title={profile?.name || 'Profile'}
            >
              {profile?.photoUrl ? (
                <img 
                  src={profile.photoUrl} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=22c55e&color=fff&size=128`;
                  }}
                />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {getInitials(profile?.name)}
                </span>
              )}
            </div>
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
        <span className="font-bold text-lg text-primary">Staff Portal</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors"
          onClick={() => handleNavClick('/profile')}
        >
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=22c55e&color=fff&size=128`;
              }}
            />
          ) : (
            <span className="text-xs font-semibold text-primary">
              {getInitials(profile?.name)}
            </span>
          )}
        </div>
        <LogoutButton variant="icon" />
      </div>
    </div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 z-30 px-2 flex items-center justify-around shadow-lg">
      {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => {
        const isActive = isRouteActive(path);
        return (
          <button
            key={path}
            onClick={() => handleNavClick(path)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? "text-primary"
                : "text-neutral-500 hover:text-primary hover:bg-primary-50"
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
        isMobileMenuOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 cursor-pointer"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Menu Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <span className="font-bold text-lg text-primary">Staff Portal</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} className="text-neutral-600" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = isRouteActive(path);
              return (
                <button
                  key={path}
                  onClick={() => handleNavClick(path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-1 cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-neutral-600 hover:bg-primary-50 hover:text-primary"
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
            <div 
              className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg mb-3 cursor-pointer hover:bg-neutral-100 transition-colors"
              onClick={() => {
                handleNavClick('/profile');
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                {profile?.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=22c55e&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {getInitials(profile?.name)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  {profile?.name || 'Staff User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {profile?.email || 'staff@company.com'}
                </p>
              </div>
            </div>
            <LogoutButton variant="mobile" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Navigation */}
      <MobileTopNav />
      <MobileBottomNav />
      <MobileMenu />

      {/* Main Content Spacer for Desktop */}
      <div
        className={`hidden md:block transition-all duration-300 ${isOpen || isHovered ? "ml-64" : "ml-20"}`}
      />

      {/* Main Content Spacer for Mobile — matches MobileTopNav height (h-16 = 64px) */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default StaffNav;