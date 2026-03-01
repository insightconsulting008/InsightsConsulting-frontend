import axiosInstance from "./axiosInstance"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
 
export default function LogoutButton() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
 
  const logoutCurrent = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };
 
  const logoutAll = async () => {
    try {
      await axiosInstance.post("/auth/logout-all");
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };
 
  return (
    <>
      {/* logout button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
 
      {/* confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Logout Options
            </h2>
 
            <p className="text-sm text-gray-600 mb-5 text-center">
              Do you want to logout from this device or all devices?
            </p>
 
            <div className="space-y-2">
              <button
                onClick={logoutCurrent}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Logout This Device
              </button>
 
              <button
                onClick={logoutAll}
                className="w-full bg-red-600 text-white py-2 rounded-lg"
              >
                Logout All Devices
              </button>
 
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full border py-2 rounded-lg"
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
 