'use client';

import { useState, useEffect } from 'react';

export default function HealthCheck() {
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching health checks
    const fetchHealthChecks = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/health-checks');
        const data = await response.json();
        setHealthChecks(data);
      } catch (error) {
        console.error('Error fetching health checks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthChecks();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Health Checks</h2>
      <div className="bg-white shadow rounded-lg">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 border-b pb-2">
            <div>Patient</div>
            <div>Date</div>
            <div>Vitals</div>
            <div>Notes</div>
          </div>
          {healthChecks.length > 0 ? (
            healthChecks.map((check) => (
              <div key={check.id} className="grid grid-cols-4 gap-4 py-3 border-b">
                <div>{check.patientName}</div>
                <div>{check.date}</div>
                <div>
                  <div>BP: {check.vitals.bp}</div>
                  <div>Temp: {check.vitals.temperature}°C</div>
                  <div>Weight: {check.vitals.weight}kg</div>
                </div>
                <div className="text-sm text-gray-600">{check.notes}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No health checks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 