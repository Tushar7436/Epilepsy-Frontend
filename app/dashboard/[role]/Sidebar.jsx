'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';

export default function Sidebar({ role, onSelectService }) {
  const router = useRouter();
  const { setIsAuthenticated, setUserRole } = useUser();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        // Dynamically import services based on role
        const module = await import(`../Services/${role}/services`);
        setServices(module.default);
      } catch (error) {
        console.error(`Error loading services for ${role}:`, error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [role]);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update context
    setIsAuthenticated(false);
    setUserRole(null);
    
    // Redirect to home
    router.push('/');
  };

  if (loading) {
    return (
      <aside className="w-64 p-4 bg-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 p-4 bg-gray-100 flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="font-bold text-lg mb-4 capitalize">{role} Dashboard</h2>
        <ul className="space-y-2">
          {services.map(service => (
            <li key={service.key}>
              <button
                onClick={() => onSelectService(service.key)}
                className="text-left w-full hover:bg-gray-200 p-2 rounded transition-colors"
              >
                {service.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}