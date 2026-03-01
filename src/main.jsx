// main.jsx  (or index.jsx — wherever ReactDOM.createRoot is)
// AuthProvider lives HERE at the very top so every component in the tree
// including login pages, is guaranteed to be inside it.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './providers/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>   {/* ← wraps everything, no component can ever be outside */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);