'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { endpoints } from '@/app/api/route';

// Memoized Timeline Item Component
const TimelineItem = memo(({ item, formatDate }) => {
  const hasDocuments = item.document_urls && item.document_urls.trim() !== '';
  const hasVideo = item.video_url && item.video_url.trim() !== '';

  return (
    <div className="relative pl-12">
      {/* Timeline dot */}
      <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-white"></div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Medical Assessment
          </h3>
          <span className="text-sm text-gray-500">
            {formatDate(item.submission_date)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seizure Information */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Seizure Information</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">First Seizure:</span> {formatDate(item.first_seizure_date)}</p>
              <p><span className="text-gray-600">Recent Seizure:</span> {formatDate(item.most_recent_seizure_date)}</p>
              <p><span className="text-gray-600">Frequency:</span> {item.seizure_frequency}</p>
              <p><span className="text-gray-600">Duration:</span> {item.seizure_duration}</p>
              <p><span className="text-gray-600">Time of Day:</span> {item.time_of_day}</p>
              <p><span className="text-gray-600">Symptoms:</span> {item.symptoms}</p>
              {item.aura && (
                <p><span className="text-gray-600">Aura:</span> {item.aura_description}</p>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Medical History</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Medication:</span> {item.medication_details}</p>
              <p><span className="text-gray-600">Past Conditions:</span> {item.past_conditions}</p>
              <p><span className="text-gray-600">Condition Trend:</span> {item.condition_trend}</p>
              {item.tests_done && (
                <p><span className="text-gray-600">Tests:</span> Completed</p>
              )}
            </div>
          </div>

          {/* Doctor Consultation */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Doctor Consultation</h4>
            <div className="text-sm space-y-1">
              {item.visited_doctor_before && (
                <>
                  <p><span className="text-gray-600">Doctor Details:</span> {item.doctor_details}</p>
                  <p><span className="text-gray-600">Last Consultation:</span> {formatDate(item.last_consultation_date)}</p>
                </>
              )}
            </div>
          </div>

          {/* Social Impact */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Social Impact</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Can Work:</span> {item.can_work}</p>
              <p><span className="text-gray-600">Social Challenges:</span> {item.social_challenges}</p>
              <p><span className="text-gray-600">Family Support:</span> {item.family_support ? 'Yes' : 'No'}</p>
              {item.injury_from_seizure && (
                <p><span className="text-gray-600">Injury Details:</span> {item.injury_details}</p>
              )}
            </div>
          </div>
        </div>

        {/* Attachments */}
        {(hasDocuments || hasVideo) && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-gray-800 mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {hasVideo ? (
                <a
                  href={item.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Video Recording
                </a>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                  No Video Available
                </span>
              )}
              
              {hasDocuments ? (
                item.document_urls.split(',').map((url, idx) => (
                  <a
                    key={idx}
                    href={url.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Document {idx + 1}
                  </a>
                ))
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                  No Documents Available
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';

// Memoized Patient Selection Component
const PatientSelection = memo(({ patientIds, selectedPatient, onPatientChange }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Patient
    </label>
    <div className="flex flex-wrap gap-2">
      {patientIds.map((id) => (
        <button
          key={id}
          onClick={() => onPatientChange(id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPatient === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Patient {id}
        </button>
      ))}
    </div>
  </div>
));

PatientSelection.displayName = 'PatientSelection';

export default function PatientTimeline() {
  const params = useParams();
  const router = useRouter();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Memoize patient IDs array
  const patientIds = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => i + 1),
    []
  );

  // Memoize date formatter
  const formatDate = useMemo(() => 
    (dateString) => format(new Date(dateString), 'MMM dd, yyyy'),
    []
  );

  const fetchTimelineData = async (patientId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setError('Please login to access this page');
        return;
      }

      const response = await fetch(endpoints.patientTimeline(patientId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        return;
      }

      if (response.status === 403) {
        setError('You do not have permission to access this patient\'s data');
        return;
      }

      if (response.status === 404) {
        setError('Patient data not found');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      const result = await response.json();
      if (result.success) {
        const sortedData = result.data.sort((a, b) => 
          new Date(b.submission_date) - new Date(a.submission_date)
        );
        setTimelineData(sortedData);
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

  // Initial data fetch
  useEffect(() => {
    fetchTimelineData(selectedPatient);
  }, []);

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    fetchTimelineData(patientId);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchTimelineData(selectedPatient)}
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
      <PatientSelection
        patientIds={patientIds}
        selectedPatient={selectedPatient}
        onPatientChange={handlePatientChange}
      />

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-8">
            {timelineData.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}