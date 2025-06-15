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
    <div className="flex h-screen">
      <Sidebar role={userRole} onSelectService={setActiveService} />
      <div className="flex-grow p-6">
        <DynamicSection role={userRole} activeService={activeService} />
      </div>
    </div>
  );
}

export default Page;
