// LogoutButton.jsx
// src/providers/LogoutButton.jsx  (or wherever you import it from)

import { useState } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LogoutButton() {
  const navigate     = useNavigate();
  const { logout }   = useAuth(); // clears localStorage + React state in one call
  const [showConfirm, setShowConfirm] = useState(false);

  const doLogout = async (endpoint) => {
    try {
      await axiosInstance.post(endpoint);
    } catch (err) {
      // Even if the server call fails, clear local state and redirect
      console.warn("Logout request failed:", err?.message);
    } finally {
      logout();           // clears localStorage & role state → App renders LandingPage
      navigate("/login"); // redirect to public login page
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Logout
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-center">Logout Options</h2>
            <p className="text-sm text-gray-600 mb-5 text-center">
              Logout from this device only, or all devices?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => doLogout("/auth/logout")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                Logout This Device
              </button>

              <button
                onClick={() => doLogout("/auth/logout-all")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Logout All Devices
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-full border hover:bg-gray-50 py-2 rounded-lg transition-colors"
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