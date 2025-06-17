// app/api/route.js
export const baseURL = "https://epilepsy-pa0n.onrender.com";
export const gatewayBaseURL = "https://epilepsy-api-gateway.onrender.com/gatewayApi";

// API endpoints
export const endpoints = {
    heatmap: `${baseURL}/api/v1/heatmap`,
    patientTimeline: (patientId) => `${baseURL}/api/v1/patients/${patientId}`,
    patientDetails: (userId) => `${gatewayBaseURL}/api/v1/patients/${userId}`,
    patientTimelineGateway: (userId) => `${gatewayBaseURL}/api/v1/patients/${userId}/timeline`,
    createChecklist: `${baseURL}/api/v1/checklists/create`,
    reportChecklist: `${baseURL}/api/v1/checklists/report`,
    patientList: `${baseURL}/api/v1/checklists/patient/1`
}; 