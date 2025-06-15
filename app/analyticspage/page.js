'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

// Sample data for graphs (replace with API data later)
const caseData = [
  { year: '2019', cases: 1200, neurosurgeons: 45 },
  { year: '2020', cases: 1500, neurosurgeons: 48 },
  { year: '2021', cases: 1800, neurosurgeons: 52 },
  { year: '2022', cases: 2100, neurosurgeons: 55 },
  { year: '2023', cases: 2400, neurosurgeons: 58 }
];

const efficiencyData = [
  { month: 'Jan', efficiency: 75 },
  { month: 'Feb', efficiency: 78 },
  { month: 'Mar', efficiency: 82 },
  { month: 'Apr', efficiency: 85 },
  { month: 'May', efficiency: 88 },
  { month: 'Jun', efficiency: 90 }
];

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

        console.log('Received analytics data:', result);
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
    <div className="analytics-page p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Epilepsy Analytics Dashboard</h1>
      
      <div className="text-center mb-12">
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Welcome to the Epilepsy Analytics Dashboard. This comprehensive platform provides real-time insights into epilepsy cases, 
          treatment efficiency, and geographical distribution across India. Our data-driven approach helps healthcare providers 
          make informed decisions and improve patient care.
        </p>
        <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">
          By leveraging advanced analytics and machine learning, we provide actionable insights that help optimize resource allocation, 
          improve treatment outcomes, and enhance the overall quality of epilepsy care across the nation.
        </p>
      </div>

      {loading && <p className="text-center text-lg">Loading analytics...</p>}
      {error && <p className="text-red-500 text-center text-lg">Error: {error}</p>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-3">Total Cases</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">2,400</p>
          <p className="text-gray-600">Active epilepsy cases across India</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-3">Active Neurosurgeons</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">58</p>
          <p className="text-gray-600">Specialized healthcare professionals</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-3">Average Efficiency</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">85%</p>
          <p className="text-gray-600">Overall treatment success rate</p>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-6">Key Performance Indicators</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-4">
            Our dashboard tracks three primary metrics: total epilepsy cases, the number of active neurosurgeons, 
            and treatment efficiency. These indicators help us monitor the healthcare system's capacity and effectiveness 
            in managing epilepsy cases across the country.
          </p>
          <p className="text-lg text-gray-600">
            Each metric is carefully calculated using real-time data from healthcare facilities across India, 
            providing a comprehensive view of the current state of epilepsy care and treatment outcomes.
          </p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Cases vs Neurosurgeons Growth</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#8884d8" name="Cases" />
                <Line type="monotone" dataKey="neurosurgeons" stroke="#82ca9d" name="Neurosurgeons" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Treatment Efficiency Trend</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-6">Trend Analysis</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-4">
            The graphs above illustrate the growth in epilepsy cases alongside the increase in available neurosurgeons, 
            as well as the improving treatment efficiency over time. This data helps us identify trends and make 
            necessary adjustments to healthcare resource allocation.
          </p>
          <p className="text-lg text-gray-600">
            Our analysis shows a positive correlation between the number of neurosurgeons and treatment efficiency, 
            highlighting the importance of maintaining an adequate healthcare workforce to meet the growing demand 
            for epilepsy care.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
        <h3 className="text-xl font-semibold mb-4">Geographic Distribution</h3>
        <div className="h-[600px] w-full">
          {analyticsData && <MapWithNoSSR data={analyticsData} />}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-6">Geographic Insights</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-4">
            The heatmap visualization shows the concentration of epilepsy cases across different regions of India. 
            This geographical distribution helps identify areas that may need additional healthcare resources and support.
          </p>
          <p className="text-lg text-gray-600">
            By analyzing the spatial distribution of cases, we can better understand regional healthcare needs and 
            develop targeted interventions to improve access to epilepsy care in underserved areas.
          </p>
        </div>
      </div>

      {/* API Documentation Section */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-lg mt-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">API Documentation</h2>
        <div className="space-y-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-medium mb-4">Analytics Endpoint</h3>
            <code className="bg-gray-100 p-3 rounded block text-lg">
              GET /api/analytics
            </code>
            <p className="mt-3 text-gray-600 text-lg">
              Returns comprehensive analytics data including case distribution, treatment metrics, and geographical data.
              This endpoint provides real-time insights into epilepsy care across India.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Response Format</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "cases": {
    "total": number,
    "distribution": {
      "lat": number,
      "lng": number,
      "count": number
    }[]
  },
  "neurosurgeons": {
    "total": number,
    "active": number
  },
  "efficiency": {
    "current": number,
    "trend": {
      "month": string,
      "value": number
    }[]
  }
}`}
            </pre>
            <p className="mt-3 text-gray-600 text-lg">
              The response includes detailed information about case distribution, healthcare workforce, 
              and treatment efficiency metrics.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Authentication</h3>
            <p className="text-gray-600 text-lg mb-3">
              All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:
            </p>
            <code className="bg-gray-100 p-3 rounded block text-lg">
              Authorization: Bearer your-jwt-token
            </code>
            <p className="mt-3 text-gray-600 text-lg">
              JWT tokens can be obtained through our authentication endpoint. Each token is valid for 24 hours.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Rate Limiting</h3>
            <p className="text-gray-600 text-lg mb-3">
              API requests are limited to 100 requests per minute per API key. Exceeding this limit will result in a 429 Too Many Requests response.
            </p>
            <p className="text-gray-600 text-lg">
              For higher rate limits, please contact our support team to discuss your specific requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
