import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../providers/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ success state
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.password) return setError("Password is required"), false;
    if (form.password.length < 6)
      return setError("Minimum 6 characters required"), false;
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match"), false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: form.password,
      });

      // ✅ switch UI to success screen
      setIsSuccess(true);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">

        {/* ✅ SUCCESS SCREEN */}
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="text-green-600 text-4xl mb-3">✔</div>

            <h2 className="text-lg font-semibold">
              Password Updated
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your password has been successfully changed.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-5 w-full bg-[#f13c20] text-white py-2 rounded"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {/* FORM */}
            <h2 className="text-xl font-bold mb-4 text-center">
              Reset Password
            </h2>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                type="password"
                name="password"
                placeholder="New password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f13c20] text-white py-2 rounded"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}