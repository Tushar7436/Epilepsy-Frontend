'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';

const MapComponent = ({ data }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !data) return;

    console.log('MapComponent received data:', data);

    // Initialize map if it hasn't been initialized yet
    if (!mapInstanceRef.current) {
      // Set initial view to center of India
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        attributionControl: true
      });
      
      // Add the tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Ensure data is in the correct format
    let heatPoints = [];
    
    try {
      // Check if data is an array
      if (Array.isArray(data)) {
        heatPoints = data.map(point => {
          console.log('Processing point:', point);
          return [
            parseFloat(point.lat),
            parseFloat(point.lng),
            parseFloat(point.count || 1)
          ];
        });
      } 

      // Add points for major Indian cities and some intermediate points
      const additionalPoints = [
        // Major Cities
        { lat: 28.6139, lng: 77.2090, count: 20 },  // Delhi
        { lat: 19.0760, lng: 72.8777, count: 18 },  // Mumbai
        { lat: 22.5726, lng: 88.3639, count: 15 },  // Kolkata
        { lat: 23.0225, lng: 72.5714, count: 13 },  // Ahmedabad
        { lat: 26.9124, lng: 75.7873, count: 12 },  // Jaipur
        
        // Intermediate Points
        { lat: 25.5941, lng: 85.1376, count: 8 },   // Patna
        { lat: 15.4989, lng: 73.8278, count: 6 },   // Goa
        { lat: 11.0168, lng: 76.9558, count: 8 },   // Coimbatore
        { lat: 9.9312, lng: 76.2673, count: 7 },    // Kochi
        { lat: 8.5241, lng: 76.9366, count: 5 },    // Trivandrum
        { lat: 20.2961, lng: 85.8245, count: 6 }    // Bhubaneswar
      ];

      const additionalHeatPoints = additionalPoints.map(point => [
        parseFloat(point.lat),
        parseFloat(point.lng),
        parseFloat(point.count)
      ]);

      heatPoints = [...heatPoints, ...additionalHeatPoints];

      console.log('Processed heat points:', heatPoints);

      // Validate points
      heatPoints = heatPoints.filter(point => {
        const isValid = !isNaN(point[0]) && !isNaN(point[1]) && !isNaN(point[2]);
        if (!isValid) {
          console.warn('Invalid point found:', point);
        }
        return isValid;
      });

      // Only proceed if we have valid points
      if (heatPoints.length > 0) {
        // Create or update heat layer
        if (mapInstanceRef.current.heatLayer) {
          mapInstanceRef.current.removeLayer(mapInstanceRef.current.heatLayer);
        }

        mapInstanceRef.current.heatLayer = L.heatLayer(heatPoints, {
          radius: 40,  // Increased radius for better visibility
          blur: 25,    // Increased blur for smoother transitions
          maxZoom: 10,
          max: 1.0,
          gradient: {
            0.4: 'blue',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red'
          }
        }).addTo(mapInstanceRef.current);

        // Fit bounds to show all points
        const bounds = L.latLngBounds(heatPoints.map(point => [point[0], point[1]]));
        mapInstanceRef.current.fitBounds(bounds);
      } else {
        console.warn('No valid heat points found in data:', data);
      }
    } catch (error) {
      console.error('Error processing heat points:', error);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '100%', 
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default MapComponent; 