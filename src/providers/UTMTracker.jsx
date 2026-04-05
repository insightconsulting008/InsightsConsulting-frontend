// src/components/UTMTracker.jsx (or inside App.jsx)
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UTMTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const utmData = {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
      utmContent: params.get('utm_content'),
      utmTerm: params.get('utm_term'),
      refCode: params.get('refCode'),
    };

    // Store only if at least one UTM parameter exists
    const hasUtm = Object.values(utmData).some(v => v);
    if (hasUtm) {
      // Optional: merge with existing data instead of overwriting
      const existing = JSON.parse(localStorage.getItem('utmData')) || {};
      localStorage.setItem('utmData', JSON.stringify({ ...existing, ...utmData }));
    }
  }, [location.search]); // re-run when query string changes

  return null; // no UI
};

export default UTMTracker;