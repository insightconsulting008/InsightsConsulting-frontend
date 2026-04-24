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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {user ? (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}