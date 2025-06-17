'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { endpoints } from '@/app/api/route';

export default function PatientReport() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [comments, setComments] = useState({});
    const [checkmarks, setCheckmarks] = useState({});
    const [showReport, setShowReport] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(endpoints.patientList, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    setPatients(response.data.data);
                    // Initialize comments and checkmarks for each patient
                    const initialComments = {};
                    const initialCheckmarks = {};
                    response.data.data.forEach(patient => {
                        initialComments[patient.id] = '';
                        initialCheckmarks[patient.id] = {
                            seizureInfo: false,
                            medicalHistory: false,
                            socialSupport: false,
                            additionalInfo: false
                        };
                    });
                    setComments(initialComments);
                    setCheckmarks(initialCheckmarks);
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

    // Add effect to prevent background scrolling when report is open
    useEffect(() => {
        if (showReport) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showReport]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCommentChange = (patientId, value) => {
        setComments(prev => ({
            ...prev,
            [patientId]: value
        }));
    };

    const handleCheckmarkToggle = (patientId, section) => {
        setCheckmarks(prev => ({
            ...prev,
            [patientId]: {
                ...prev[patientId],
                [section]: !prev[patientId][section]
            }
        }));
    };

    const handleSaveReport = async (patientId) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(endpoints.reportChecklist, {
                patientId,
                comments: comments[patientId],
                checkmarks: checkmarks[patientId]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Report saved successfully!');
        } catch (error) {
            console.error('Error saving report:', error);
            alert('Failed to save report. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleViewReport = (patient) => {
        setSelectedPatient(patient);
        setShowReport(true);
    };

    const handleCloseReport = () => {
        setShowReport(false);
        setSelectedPatient(null);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Patient Reports</h2>
            
            {/* Patient List */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seizure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">#{patient.patient_id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{formatDate(patient.submission_date)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{formatDate(patient.most_recent_seizure_date)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            patient.condition_trend === 'Stable' ? 'bg-green-100 text-green-800' : 
                                            patient.condition_trend === 'Improving' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {patient.condition_trend || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleViewReport(patient)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {selectedPatient?.id === patient.id && showReport ? (
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Close Report
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    View Report
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overlay */}
            {showReport && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleCloseReport}
                />
            )}

            {/* Detailed Patient Report - Centered Modal */}
            {showReport && selectedPatient && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div 
                        className="bg-white shadow-lg rounded-lg transform transition-all duration-300 ease-in-out"
                        style={{ 
                            width: '80%',
                            maxWidth: '1200px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Patient Report - #{selectedPatient.patient_id}</h3>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleSaveReport(selectedPatient.id)}
                                        disabled={saving}
                                        className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center ${
                                            saving ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save Report
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCloseReport}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                    >
                                        Close Report
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Seizure Information Section */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Seizure Information</h4>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={checkmarks[selectedPatient.id]?.seizureInfo}
                                                onChange={() => handleCheckmarkToggle(selectedPatient.id, 'seizureInfo')}
                                                className="form-checkbox h-5 w-5 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">Reviewed</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p><span className="font-medium">First Seizure:</span> {formatDate(selectedPatient.first_seizure_date)}</p>
                                            <p><span className="font-medium">Recent Seizure:</span> {formatDate(selectedPatient.most_recent_seizure_date)}</p>
                                            <p><span className="font-medium">Frequency:</span> {selectedPatient.seizure_frequency}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-medium">Duration:</span> {selectedPatient.seizure_duration}</p>
                                            <p><span className="font-medium">Time of Day:</span> {selectedPatient.time_of_day}</p>
                                            <p><span className="font-medium">Symptoms:</span> {selectedPatient.symptoms}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical History Section */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Medical History</h4>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={checkmarks[selectedPatient.id]?.medicalHistory}
                                                onChange={() => handleCheckmarkToggle(selectedPatient.id, 'medicalHistory')}
                                                className="form-checkbox h-5 w-5 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">Reviewed</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p><span className="font-medium">Family History:</span> {selectedPatient.family_history ? 'Yes' : 'No'}</p>
                                            <p><span className="font-medium">Past Conditions:</span> {selectedPatient.past_conditions || 'None'}</p>
                                            <p><span className="font-medium">Taking Medication:</span> {selectedPatient.taking_medication ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-medium">Current Medication:</span> {selectedPatient.medication_details}</p>
                                            <p><span className="font-medium">Medication History:</span> {selectedPatient.medication_history}</p>
                                            <p><span className="font-medium">Tests Done:</span> {selectedPatient.tests_done ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social & Support Section */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Social & Support</h4>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={checkmarks[selectedPatient.id]?.socialSupport}
                                                onChange={() => handleCheckmarkToggle(selectedPatient.id, 'socialSupport')}
                                                className="form-checkbox h-5 w-5 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">Reviewed</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p><span className="font-medium">Can Work:</span> {selectedPatient.can_work}</p>
                                            <p><span className="font-medium">Family Support:</span> {selectedPatient.family_support ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-medium">Social Challenges:</span> {selectedPatient.social_challenges || 'None'}</p>
                                            <p><span className="font-medium">Stigma:</span> {selectedPatient.stigma ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information Section */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Additional Information</h4>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={checkmarks[selectedPatient.id]?.additionalInfo}
                                                onChange={() => handleCheckmarkToggle(selectedPatient.id, 'additionalInfo')}
                                                className="form-checkbox h-5 w-5 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">Reviewed</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p><span className="font-medium">Vaccine History:</span> {selectedPatient.vaccine_history}</p>
                                            <p><span className="font-medium">Head Injury:</span> {selectedPatient.head_injury ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-medium">Last Consultation:</span> {formatDate(selectedPatient.last_consultation_date)}</p>
                                            <p><span className="font-medium">Hospitalized:</span> {selectedPatient.hospitalized ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Doctor's Comments</h4>
                                    <textarea
                                        value={comments[selectedPatient.id]}
                                        onChange={(e) => handleCommentChange(selectedPatient.id, e.target.value)}
                                        className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter your comments about this patient's condition..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}