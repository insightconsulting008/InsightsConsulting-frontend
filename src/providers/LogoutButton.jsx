// LogoutButton.jsx
import { useState } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LogOut, Smartphone, Globe, X, AlertCircle } from "lucide-react";

export default function LogoutButton({ variant = "default" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const doLogout = async (endpoint, message) => {
    try {
      await axiosInstance.post(endpoint);
    } catch (err) {
      console.warn("Logout request failed:", err?.message);
    } finally {
      logout();
      navigate("/");
    }
  };

  // Different button styles based on variant
  const buttonStyles = {
    default: "w-full bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm",
    icon: "p-2 text-neutral-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors",
    outline: "border border-primary text-primary hover:bg-primary-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2",
    sidebar: "w-full bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm",
    mobile: "w-full bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={buttonStyles[variant] || buttonStyles.default}
        aria-label="logout"
      >
        <LogOut size={variant === "icon" ? 18 : 20} />
        {variant !== "icon" && "Logout"}
      </button>

      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}
        >
          <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
            style={{ 
              maxWidth: 'min(100%, 28rem)',
              margin: 0
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 rounded-t-2xl p-4 sm:p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Logout Options</h2>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-neutral-500 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <p className="text-sm text-neutral-600 mb-4 sm:mb-6 hidden md:hidden">
                Choose how you'd like to logout from your account.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* This Device Only */}
                <button
                  onClick={() => doLogout("/auth/logout", "this device")}
                  className="w-full flex items-center gap-3 sm:gap-4 p-4 rounded-xl border border-neutral-200 hover:border-primary hover:bg-primary-50 transition-all group active:bg-primary-100 active:scale-[0.98]"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                    <Smartphone size={20} className="text-primary group-hover:text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-neutral-900 text-sm sm:text-base">This Device Only</p>
                    <p className="text-xs text-neutral-500 mt-0.5">End session on this device</p>
                  </div>
                </button>

                {/* All Devices */}
                <button
                  onClick={() => doLogout("/auth/logout-all", "all devices")}
                  className="w-full flex items-center gap-3 sm:gap-4 p-4 rounded-xl border border-neutral-200 hover:border-primary hover:bg-primary-50 transition-all group active:bg-primary-100 active:scale-[0.98]"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                    <Globe size={20} className="text-primary group-hover:text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-neutral-900 text-sm sm:text-base">All Devices</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Logout from every device</p>
                  </div>
                </button>

                {/* Warning Message */}
                <div className="md:flex items-start gap-3 p-4 bg-warning-50 rounded-xl mt-4 sm:mt-6 hidden">
                  <AlertCircle size={18} className="text-warning-600 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                  <p className="text-xs sm:text-sm text-warning-700 leading-relaxed">
                    Logging out will end your current session. Make sure you've saved all your work.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-neutral-200 rounded-b-2xl p-4 sm:p-6 hidden md:block">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 sm:py-3.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-lg transition-colors active:bg-neutral-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}