'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';

export default function Sidebar({ role, onSelectService, isMobile }) {
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
      <aside className={`${isMobile ? 'p-2' : 'p-4'} bg-white`}>
        <div className="animate-pulse">
          {!isMobile && <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (isMobile) {
    return (
      <nav className="flex items-center justify-around p-2 bg-white">
        {services.map(service => (
          <button
            key={service.key}
            onClick={() => onSelectService(service.key)}
            className="flex flex-col items-center p-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            {service.icon && (
              <span className="text-xl mb-1">
                {service.icon}
              </span>
            )}
            <span className="text-xs">{service.name}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <svg 
            className="w-6 h-6 mb-1" 
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
          <span className="text-xs">Logout</span>
        </button>
      </nav>
    );
  }

  return (
    <aside className="w-64 flex flex-col h-full bg-white border-r">
      {/* Desktop Role Title */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg capitalize">{role} Dashboard</h2>
      </div>

      {/* Services List */}
      <div className="flex-grow p-4">
        <ul className="space-y-2">
          {services.map(service => (
            <li key={service.key}>
              <button
                onClick={() => onSelectService(service.key)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-3"
              >
                {service.icon && (
                  <span className="text-gray-500">
                    {service.icon}
                  </span>
                )}
                <span className="text-gray-700">{service.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-colors"
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