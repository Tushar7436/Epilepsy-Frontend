'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';

export default function PatientTimeline() {
  const { user } = useUser();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://epilepsy-pa0n.onrender.com/api/v1/checklists/patient/1`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch timeline data');
        }

        const result = await response.json();
        if (result.success) {
          setTimelineData(result.data);
        } else {
          throw new Error('Failed to load timeline data');
        }
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setError('Failed to load timeline data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTimelineData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!timelineData.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{item.type}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Details based on type */}
                  {item.type === 'Medication' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">{item.medication_name}</p>
                      <p className="text-sm text-gray-500">Dosage: {item.dosage}</p>
                      <p className="text-sm text-gray-500">Duration: {item.duration}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                      )}
                    </div>
                  )}

                  {item.type === 'Visit' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">Doctor: {item.doctor_name}</p>
                      <p className="text-sm text-gray-500">Purpose: {item.purpose}</p>
                      {item.diagnosis && (
                        <p className="text-sm text-gray-600 mt-2">Diagnosis: {item.diagnosis}</p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                      )}
                    </div>
                  )}

                  {item.type === 'Test' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">Test: {item.test_name}</p>
                      <p className="text-sm text-gray-500">Location: {item.location}</p>
                      {item.results && (
                        <p className="text-sm text-gray-600 mt-2">Results: {item.results}</p>
                      )}
                    </div>
                  )}

                  {item.type === 'Seizure' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">Seizure Episode</p>
                      <p className="text-sm text-gray-500">Duration: {item.duration}</p>
                      <p className="text-sm text-gray-500">Type: {item.seizure_type}</p>
                      <p className="text-sm text-gray-500">Severity: {item.severity}</p>
                      {item.triggers && (
                        <p className="text-sm text-gray-500">Triggers: {item.triggers}</p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                      )}
                    </div>
                  )}

                  {/* Attachments if any */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.attachments.map((attachment, idx) => (
                          <a
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}