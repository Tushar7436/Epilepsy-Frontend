'use client';

import { useState, useEffect } from 'react';

export default function CommunityVisits() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    submission_date: new Date().toISOString().split('T')[0],
    first_seizure_date: '',
    most_recent_seizure_date: '',
    seizure_frequency: '',
    seizure_duration: '',
    time_of_day: '',
    seizure_increased: false,
    aura: false,
    aura_description: '',
    head_injury: false,
    head_injury_details: '',
    symptoms: '',
    family_history: false,
    taking_medication: false,
    medication_details: '',
    past_conditions: '',
    tests_done: false,
    test_documents: '',
    substance_use: false,
    substance_details: '',
    vaccine_history: '',
    can_work: '',
    injury_from_seizure: false,
    injury_details: '',
    social_challenges: '',
    family_support: false,
    stigma: false,
    stigma_description: '',
    visited_doctor_before: false,
    doctor_details: '',
    last_consultation_date: '',
    medication_history: '',
    missed_doses: false,
    condition_trend: '',
    hospitalized: false,
    hospitalization_details: '',
    video_url: '',
    document_urls: '',
    timestamp_annotation: '',
    consent_given: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://epilepsy-pa0n.onrender.com/api/v1/checklists/patient/1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }

        const result = await response.json();
        if (result.success) {
          setPatients(result.data);
          console.log(result.data);
        } else {
          throw new Error('Failed to load patients data');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to load patients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Only validate consent as it's a legal requirement
      if (!formData.consent_given) {
        throw new Error('Patient consent is required');
      }

      // Create a copy of formData and clean up date fields
      const cleanedFormData = { ...formData };
      
      // Clean up date fields - only include if they have valid values
      const dateFields = [
        'first_seizure_date',
        'most_recent_seizure_date',
        'last_consultation_date'
      ];

      dateFields.forEach(field => {
        if (!cleanedFormData[field] || cleanedFormData[field] === 'Invalid Date') {
          delete cleanedFormData[field];
        }
      });

      const response = await fetch('https://epilepsy-pa0n.onrender.com/api/v1/checklists/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedFormData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit assessment');
      }

      if (result.success) {
        // Reset form and show success message
        setShowForm(false);
        setCurrentPage(1);
        setFormData({
          ...formData,
          patient_name: '',
          patient_age: '',
          first_seizure_date: '',
          most_recent_seizure_date: '',
          seizure_frequency: '',
          seizure_duration: '',
          time_of_day: '',
          seizure_increased: false,
          aura: false,
          aura_description: '',
          head_injury: false,
          head_injury_details: '',
          symptoms: '',
          family_history: false,
          taking_medication: false,
          medication_details: '',
          past_conditions: '',
          tests_done: false,
          test_documents: '',
          substance_use: false,
          substance_details: '',
          vaccine_history: '',
          can_work: '',
          injury_from_seizure: false,
          injury_details: '',
          social_challenges: '',
          family_support: false,
          stigma: false,
          stigma_description: '',
          visited_doctor_before: false,
          doctor_details: '',
          last_consultation_date: '',
          medication_history: '',
          missed_doses: false,
          condition_trend: '',
          hospitalized: false,
          hospitalization_details: '',
          video_url: '',
          document_urls: '',
          timestamp_annotation: '',
          consent_given: false
        });
        alert('Assessment submitted successfully!');
      } else {
        throw new Error(result.message || 'Failed to submit assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmitError(error.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const totalPages = 5; // Updated to 5 pages

  const renderFormPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient Age
                </label>
                <input
                  type="number"
                  name="patient_age"
                  value={formData.patient_age}
                  onChange={handleInputChange}
                  placeholder="Enter patient age"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">Seizure Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Seizure Date</label>
                <input
                  type="date"
                  name="first_seizure_date"
                  value={formData.first_seizure_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Most Recent Seizure Date</label>
                <input
                  type="date"
                  name="most_recent_seizure_date"
                  value={formData.most_recent_seizure_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Seizure Frequency</label>
                <select
                  name="seizure_frequency"
                  value={formData.seizure_frequency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Seizure Duration</label>
                <input
                  type="text"
                  name="seizure_duration"
                  value={formData.seizure_duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 minute"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time of Day</label>
                <select
                  name="time_of_day"
                  value={formData.time_of_day}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="seizure_increased"
                  checked={formData.seizure_increased}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Seizure Frequency Increased</label>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Symptoms and Aura</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="e.g., frothing, jerking, blank stare"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="aura"
                  checked={formData.aura}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Aura Present</label>
              </div>
              {formData.aura && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Aura Description</label>
                  <input
                    type="text"
                    name="aura_description"
                    value={formData.aura_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="head_injury"
                  checked={formData.head_injury}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Head Injury</label>
              </div>
              {formData.head_injury && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Head Injury Details</label>
                  <input
                    type="text"
                    name="head_injury_details"
                    value={formData.head_injury_details}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="family_history"
                  checked={formData.family_history}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Family History</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="taking_medication"
                  checked={formData.taking_medication}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Currently Taking Medication</label>
              </div>
              {formData.taking_medication && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Medication Details</label>
                  <input
                    type="text"
                    name="medication_details"
                    value={formData.medication_details}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Past Conditions</label>
                <input
                  type="text"
                  name="past_conditions"
                  value={formData.past_conditions}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="tests_done"
                  checked={formData.tests_done}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Tests Done</label>
              </div>
              {formData.tests_done && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Test Documents</label>
                  <input
                    type="text"
                    name="test_documents"
                    value={formData.test_documents}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="substance_use"
                  checked={formData.substance_use}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Substance Use</label>
              </div>
              {formData.substance_use && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Substance Details</label>
                  <input
                    type="text"
                    name="substance_details"
                    value={formData.substance_details}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Vaccine History</label>
                <input
                  type="text"
                  name="vaccine_history"
                  value={formData.vaccine_history}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Social and Support Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Can Work</label>
                <select
                  name="can_work"
                  value={formData.can_work}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select option</option>
                  <option value="Fully">Fully</option>
                  <option value="Partially">Partially</option>
                  <option value="Not at all">Not at all</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="injury_from_seizure"
                  checked={formData.injury_from_seizure}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Injury from Seizure</label>
              </div>
              {formData.injury_from_seizure && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Injury Details</label>
                  <input
                    type="text"
                    name="injury_details"
                    value={formData.injury_details}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Social Challenges</label>
                <input
                  type="text"
                  name="social_challenges"
                  value={formData.social_challenges}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="family_support"
                  checked={formData.family_support}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Family Support Available</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="stigma"
                  checked={formData.stigma}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Experiences Stigma</label>
              </div>
              {formData.stigma && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Stigma Description</label>
                  <input
                    type="text"
                    name="stigma_description"
                    value={formData.stigma_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Previous Medical Care and Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="visited_doctor_before"
                  checked={formData.visited_doctor_before}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Visited Doctor Before</label>
              </div>
              {formData.visited_doctor_before && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor Details</label>
                    <input
                      type="text"
                      name="doctor_details"
                      value={formData.doctor_details}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Consultation Date</label>
                    <input
                      type="date"
                      name="last_consultation_date"
                      value={formData.last_consultation_date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Medication History</label>
                <input
                  type="text"
                  name="medication_history"
                  value={formData.medication_history}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="missed_doses"
                  checked={formData.missed_doses}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Missed Doses</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Condition Trend</label>
                <select
                  name="condition_trend"
                  value={formData.condition_trend}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select trend</option>
                  <option value="Improving">Improving</option>
                  <option value="Stable">Stable</option>
                  <option value="Worsening">Worsening</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hospitalized"
                  checked={formData.hospitalized}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Hospitalized</label>
              </div>
              {formData.hospitalized && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Hospitalization Details</label>
                  <input
                    type="text"
                    name="hospitalization_details"
                    value={formData.hospitalization_details}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Video URL</label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Document URLs</label>
                <input
                  type="text"
                  name="document_urls"
                  value={formData.document_urls}
                  onChange={handleInputChange}
                  placeholder="Comma-separated URLs"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Timestamp Annotation</label>
                <input
                  type="text"
                  name="timestamp_annotation"
                  value={formData.timestamp_annotation}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD HH:MM:SS | Latitude, Longitude"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="consent_given"
                    checked={formData.consent_given}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-700">I confirm that I have obtained consent from the patient/guardian to collect and share this information</label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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

  return (
    <div className="min-h-[200px] p-4">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => {
            setShowForm(false);
            setCurrentPage(1);
          }}
          className={`flex-1 px-4 py-2 rounded-lg border ${
            !showForm 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          View Patients
        </button>
        <button
          onClick={() => {
            setShowForm(true);
            setCurrentPage(1);
          }}
          className={`flex-1 px-4 py-2 rounded-lg border ${
            showForm 
              ? 'bg-green-600 text-white border-green-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          New Assessment
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm">
        {showForm ? (
          <form onSubmit={handleFormSubmit} className="p-4 space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {submitError}</span>
              </div>
            )}

            {renderFormPage()}
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              </div>
              <div className="flex items-center space-x-4">
                {currentPage > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Previous
                  </button>
                )}
                {currentPage < totalPages ? (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    disabled={submitting}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm text-white rounded-lg flex items-center ${
                      submitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Assessment'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">ID: {patient.id}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Gender: {patient.gender}</p>
                    <p>DOB: {new Date(patient.dob).toLocaleDateString()}</p>
                    <p>Phone: {patient.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 