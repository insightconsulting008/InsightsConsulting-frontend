import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../providers/api';

export default function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState('checking');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get('/auth/verify'); // cookie auto sent
        setAuthStatus('ok');
      } catch (err) {
        setAuthStatus('fail');
      }
    };

    verifyAuth();
  }, []);

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#f13c20', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (authStatus === 'fail') {
    return <Navigate to="/login" replace />;
  }

  return children;
}