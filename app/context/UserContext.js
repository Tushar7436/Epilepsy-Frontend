'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // full decoded user
  const [userRole, setUserRole] = useState(null); // only the role string

  useEffect(() => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem('token'); // adjust this if you're using cookies instead

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setUserRole(decoded?.role); // assuming JWT payload has 'role' field
      } catch (error) {
        console.error('Invalid JWT token', error);
        setUser(null);
        setUserRole(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, userRole, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
