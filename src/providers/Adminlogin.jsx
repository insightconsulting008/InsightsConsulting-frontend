// Adminlogin.jsx
// src/providers/Adminlogin.jsx

import { useState } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const navigate          = useNavigate();
  const { loginEmployee } = useAuth(); // ← loginEmployee stores employeeId

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/staff/login", form);
      const { accessToken, role, employeeId } = res.data;

      loginEmployee(accessToken, role, employeeId); // saves employeeId to localStorage + React state

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "STAFF") {
        navigate("/staff/dashboard");
      } else {
        setError("Unrecognized role. Please contact support.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid staff/admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Admin / Staff Login</h2>

        {error && (
          <div className="mb-3 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full border p-2 mb-4 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white p-2 rounded transition-colors"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </div>
    </div>
  );
}