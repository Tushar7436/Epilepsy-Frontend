'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Something went wrong');
        }

        setAnalyticsData(result);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      {loading && <p>Loading analytics...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {analyticsData && (
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          {JSON.stringify(analyticsData, null, 2)}
        </pre>
      )}
    </div>
  );
}
