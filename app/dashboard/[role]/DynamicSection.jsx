'use client';

import { useState, useEffect } from 'react';

export default function DynamicSection({ role, activeService }) {
  const [ServiceComponent, setServiceComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServiceComponent = async () => {
      if (!activeService) {
        setServiceComponent(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Map the service name to the correct file name
        const serviceMap = {
          'patients': 'PatientList',
          'patient-report': 'PatientReport',
          // Add other mappings as needed
        };

        const fileName = serviceMap[activeService] || activeService;
        
        // Dynamically import the service component
        const module = await import(`../Services/${role}/${fileName}`);
        setServiceComponent(() => module.default);
      } catch (err) {
        console.error(`Error loading service component:`, err);
        setError('Failed to load service component. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadServiceComponent();
  }, [role, activeService]);

  if (!activeService) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <p className="text-gray-500 text-center">Select a service from the menu</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please try selecting the service again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50 pb-16 md:pb-0">
      {ServiceComponent && <ServiceComponent />}
    </div>
  );
}