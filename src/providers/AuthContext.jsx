// AuthContext.jsx
// src/providers/AuthContext.jsx

import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role,        setRole]        = useState(() => localStorage.getItem("role")        || null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);

  // USER login stores userId; ADMIN/STAFF login stores employeeId.
  // We keep both separately so neither overwrites the other.
  const [userId,     setUserId]     = useState(() => localStorage.getItem("userId")     || null);
  const [employeeId, setEmployeeId] = useState(() => localStorage.getItem("employeeId") || null);

  /**
   * loginUser — called after a successful /user/login
   *   @param {string} token
   *   @param {string} userRole   — should be "USER"
   *   @param {string} id         — userId from backend
   */
  const loginUser = useCallback((token, userRole, id) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role",        userRole);
    localStorage.setItem("userId",      id);
    setAccessToken(token);
    setRole(userRole);
    setUserId(id);
  }, []);

  /**
   * loginEmployee — called after a successful /staff/login (ADMIN or STAFF)
   *   @param {string} token
   *   @param {string} userRole   — "ADMIN" or "STAFF"
   *   @param {string} id         — employeeId from backend
   */
  const loginEmployee = useCallback((token, userRole, id) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role",        userRole);
    localStorage.setItem("employeeId",  id);
    setAccessToken(token);
    setRole(userRole);
    setEmployeeId(id);
  }, []);

  /**
   * logout — clears everything for both user types
   */
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeId");
    setAccessToken(null);
    setRole(null);
    setUserId(null);       // ← was missing before
    setEmployeeId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        accessToken,
        userId,        // populated after USER login
        employeeId,    // populated after ADMIN / STAFF login
        loginUser,
        loginEmployee,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};