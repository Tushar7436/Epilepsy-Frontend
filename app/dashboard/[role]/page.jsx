'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './Sidebar';
import DynamicSection from './DynamicSection';

function Page() {
  const [activeService, setActiveService] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const params = useParams();
  const role = params?.role; // this comes from the URL: /dashboard/[role]

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ensure token is stored here
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decoding the JWT
      const extractedRole = decoded.role;

      console.log('Decoded role from JWT:', extractedRole);

      // Redirect if roles don't match
      if (!extractedRole || extractedRole !== role) {
        router.push('/auth');
      } else {
        setUserRole(extractedRole);
      }
    } catch (err) {
      console.error('JWT decoding error:', err);
      router.push('/auth');
    }
  }, [role, router]);

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold capitalize">{userRole} Dashboard</h1>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar 
          role={userRole} 
          onSelectService={setActiveService}
          isMobile={false}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <DynamicSection role={userRole} activeService={activeService} />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <Sidebar 
          role={userRole} 
          onSelectService={setActiveService}
          isMobile={true}
        />
      </div>
    </div>
  );
}

export default Page;
