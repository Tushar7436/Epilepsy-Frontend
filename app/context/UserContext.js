'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUserId(decoded.id);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole(null);
        setUserId(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userId, setUserId, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 