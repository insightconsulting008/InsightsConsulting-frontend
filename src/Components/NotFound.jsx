// NotFound.jsx
// src/components/NotFound.jsx
//
// Intentionally has NO Nav, NO sidebar, NO Footer.
// It is rendered directly by RoleRouter in App.jsx — never inside a shell.

import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = ({ dashboardPath = '/', dashboardLabel = 'Home' }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      {/* Big 404 */}
      <p className="text-[160px] md:text-[200px] font-extrabold text-gray-200 leading-none select-none">
        404
      </p>

      {/* Message */}
      <div className="-mt-4 mb-8 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Page not found
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate(dashboardPath)}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-medium"
        >
          Go to {dashboardLabel}
        </button>
      </div>
    </div>
  );
};

export default NotFound;