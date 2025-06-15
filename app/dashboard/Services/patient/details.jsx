'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';

export default function PatientDetails() {
  const { user } = useUser();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://epilepsy-api-gateway.onrender.com/gatewayApi/api/v1/patients/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }

        const result = await response.json();
        if (result.success) {
          setPatientData(result.data);
        } else {
          throw new Error('Failed to load patient data');
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
        setError('Failed to load patient details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPatientDetails();
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

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">No patient data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900">{patientData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-gray-900">{new Date(patientData.dob).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-gray-900">{patientData.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900">{patientData.phone}</p>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">First Seizure Date</p>
            <p className="text-gray-900">{patientData.first_seizure_date ? new Date(patientData.first_seizure_date).toLocaleDateString() : 'Not recorded'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Most Recent Seizure</p>
            <p className="text-gray-900">{patientData.most_recent_seizure_date ? new Date(patientData.most_recent_seizure_date).toLocaleDateString() : 'Not recorded'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seizure Frequency</p>
            <p className="text-gray-900">{patientData.seizure_frequency || 'Not recorded'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Medications</p>
            <p className="text-gray-900">{patientData.medication_details || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Family History</p>
            <p className="text-gray-900">{patientData.family_history ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Previous Medical Care</p>
            <p className="text-gray-900">{patientData.visited_doctor_before ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Social Challenges</p>
            <p className="text-gray-900">{patientData.social_challenges || 'None reported'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Work Capability</p>
            <p className="text-gray-900">{patientData.can_work || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 