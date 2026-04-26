// AdminNav.jsx
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../providers/api";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // NEW

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/blogs/list", icon: FileText, label: "Blog List" },
    { path: "/blogs/add-blogs", icon: FilePlus, label: "Add Blogs" },
  ];

  const isRouteActive = (routePath) => {
    const currentPath = location.pathname;
    if (routePath === "/dashboard") return currentPath === routePath || currentPath.startsWith('/dashboard');
    if (routePath === "/contact") return currentPath === routePath || currentPath.startsWith('/contact');
    if (routePath === "/blogs") return currentPath === routePath || currentPath.startsWith('/blogs');
    return currentPath === routePath;
  };

  const handleNavClick = (path) => {
    setActiveRoute(path);
    navigate(path);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // backend clears cookie
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      navigate('/login');
    }
  };

  useEffect(() => {
    const activeNavItem = navItems.find(item => isRouteActive(item.path));
    if (activeNavItem) setActiveRoute(activeNavItem.path);
    else setActiveRoute(location.pathname);
  }, [location.pathname]);

  const sidebarWidth = isOpen || isHovered ? "w-64" : "w-20";

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // NEW: Logout Confirmation Modal
  const LogoutModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 mx-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fde8e4' }}>
            <LogOut size={18} style={{ color: '#f13c20' }} />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">Confirm logout</h2>
        </div>
        <p className="text-md text-neutral-800 mb-5 leading-relaxed">
          Are you sure you want to logout ? 
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 text-sm rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLogoutModal(false);
              handleLogout();
            }}
            className="px-4 py-2 text-sm rounded-lg font-medium text-white transition-colors cursor-pointer"
            style={{ backgroundColor: '#f13c20' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d63418'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f13c20'}
          >
            Yes, logout
          </button>
        </div>
      </div>
    </div>
  );

  const DesktopSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out hidden md:flex md:flex-col ${sidebarWidth}`}
      style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-16 flex items-center border-b border-neutral-200 px-4 flex-shrink-0">
        <div className={`flex items-center gap-3 ${!(isOpen || isHovered) ? "justify-center w-full" : "justify-between w-full"}`}>
          {(isOpen || isHovered) && (
            <span className="font-extrabold text-lg tracking-tight animate-fadeIn" style={{ color: '#f13c20' }}>
              Admin Portal
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors text-neutral-600 cursor-pointer"
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fde8e4'; e.currentTarget.style.color = '#f13c20'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
            aria-label={isOpen ? "collapse sidebar" : "expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      <nav className="py-6 overflow-y-auto flex-1 px-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = isRouteActive(path);
          return (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              title={!(isOpen || isHovered) ? label : ""}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all mb-1 cursor-pointer ${!(isOpen || isHovered) ? "justify-center" : ""}`}
              style={
                isActive
                  ? { backgroundColor: '#f13c20', color: '#ffffff', boxShadow: '0 1px 3px rgba(241,60,32,0.4)' }
                  : { color: '#525252' }
              }
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#fde8e4'; e.currentTarget.style.color = '#f13c20'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#525252'; } }}
            >
              <Icon size={20} />
              <span className={`${!(isOpen || isHovered) ? "hidden" : "text-sm font-medium"} transition-all duration-200`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 p-4 flex-shrink-0">
        {isOpen || isHovered ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#fde8e4' }}>
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f13c20&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <span className="text-sm font-semibold" style={{ color: '#f13c20' }}>
                    {getInitials(profile?.name)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{profile?.name}</p>
                <p className="text-xs text-neutral-500 truncate">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)} // CHANGED
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fde8e4' }} title={profile?.name}>
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f13c20&color=fff&size=128`;
                  }}
                />
              ) : (
                <span className="text-sm font-semibold" style={{ color: '#f13c20' }}>{getInitials(profile?.name)}</span>
              )}
            </div>
            <button
              onClick={() => setShowLogoutModal(true)} // CHANGED
              title="Logout"
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const MobileTopNav = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-30 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fde8e4'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; }}
        >
          <Menu size={24} style={{ color: '#f13c20' }} />
        </button>
        <span className="font-bold text-lg" style={{ color: '#f13c20' }}>Admin Portal</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fde8e4' }}>
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f13c20&color=fff&size=128`;
              }}
            />
          ) : (
            <span className="text-xs font-semibold" style={{ color: '#f13c20' }}>{getInitials(profile?.name)}</span>
          )}
        </div>
        <button
          onClick={() => setShowLogoutModal(true)} // CHANGED
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 z-30 px-2 flex items-center justify-around shadow-lg">
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = isRouteActive(path);
        return (
          <button
            key={path}
            onClick={() => handleNavClick(path)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors cursor-pointer"
            style={{ color: isActive ? '#f13c20' : '#737373' }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );

  const MobileMenu = () => (
    <div
      className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
      <div
        className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <span className="font-bold text-lg" style={{ color: '#f13c20' }}>Admin Portal</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <X size={20} className="text-neutral-600" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = isRouteActive(path);
              return (
                <button
                  key={path}
                  onClick={() => handleNavClick(path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-1 cursor-pointer"
                  style={
                    isActive
                      ? { backgroundColor: '#f13c20', color: '#ffffff', boxShadow: '0 1px 3px rgba(241,60,32,0.4)' }
                      : { color: '#525252' }
                  }
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#fde8e4'; e.currentTarget.style.color = '#f13c20'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#525252'; } }}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-neutral-200 p-4">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fde8e4' }}>
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f13c20&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <span className="text-sm font-semibold" style={{ color: '#f13c20' }}>{getInitials(profile?.name)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{profile?.name}</p>
                <p className="text-xs text-neutral-500 truncate">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={() => { setIsMobileMenuOpen(false); setShowLogoutModal(true); }} // CHANGED
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileTopNav />
      <MobileBottomNav />
      <MobileMenu />
      {showLogoutModal && <LogoutModal />} {/* NEW */}
      <div className={`hidden md:block transition-all duration-300 ${isOpen || isHovered ? "ml-64" : "ml-20"}`} />
      <div className="md:hidden h-16" />
    </>
  );
};

export default AdminNav;