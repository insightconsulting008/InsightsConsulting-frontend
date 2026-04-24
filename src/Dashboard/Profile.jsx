// src/pages/dashboard/Profile.jsx

import React, { useEffect, useState } from "react";
import api from "../providers/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    getProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "#fde8e3", borderTopColor: "#f13c20" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#2d1308" }}>Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: "#8a4a34" }}>Your account details</p>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #f0d5cc", boxShadow: "0 2px 12px rgba(241,60,32,0.07)" }}
      >
        {/* Header strip */}
        <div className="px-6 py-5 flex items-center gap-4" style={{ background: "#fde8e3" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: "#f13c20", color: "#fff" }}
          >
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: "#2d1308" }}>{user.name}</p>
            <p className="text-sm" style={{ color: "#b45a3a" }}>{user.email}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="px-6 py-5 space-y-4">
          {[
            { label: "Full Name", value: user.name },
            { label: "Email Address", value: user.email },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#c06040" }}>
                {label}
              </span>
              <span className="text-sm font-medium" style={{ color: "#2d1308" }}>{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
