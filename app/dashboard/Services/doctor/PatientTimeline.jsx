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
        console.log('Fetching timeline data...');
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        
        // Using the endpoint that returns patient history records based on console output
        const response = await fetch(`https://epilepsy-pa0n.onrender.com/api/v1/checklists/patients/1`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('API Response:', result);

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch timeline data');
        }

        if (result.success) {
          // Transform the patient history data into timeline format
          const transformedData = result.data.flatMap(item => {
            const events = [];

            if (item.first_seizure_date) {
              events.push({
                id: `${item.id}-first-seizure`,
                type: 'First Seizure',
                date: item.first_seizure_date,
                details: `Patient's first recorded seizure.`,
              });
            }

            if (item.most_recent_seizure_date) {
              events.push({
                id: `${item.id}-most-recent-seizure`,
                type: 'Most Recent Seizure',
                date: item.most_recent_seizure_date,
                details: `Patient's most recent recorded seizure.`,
              });
            }

            if (item.submission_date) {
              events.push({
                id: `${item.id}-submission`,
                type: 'Record Submission',
                date: item.submission_date,
                details: `A record was submitted for patient ID ${item.patient_id}.`,
              });
            }
            return events;
          }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

          setTimelineData(transformedData);
        } else {
          throw new Error(result.message || 'Failed to load timeline data');
        }
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setError(error.message || 'Failed to load timeline data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      console.log('User ID:', user.id);
      fetchTimelineData();
    } else {
      console.log('No user ID found');
      setLoading(false);
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
              <div key={item.id || index} className="relative pl-12">
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

                  {/* Details based on transformed data */}
                  <div className="space-y-2">
                    <p className="text-gray-700">{item.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}