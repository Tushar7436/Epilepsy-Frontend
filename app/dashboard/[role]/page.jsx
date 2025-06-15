'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import Sidebar from './Sidebar';
import DynamicSection from './DynamicSection';

function Page() {
  const [activeService, setActiveService] = useState(null);
  const router = useRouter();
  const params = useParams();
  const role = params?.role;
  const { userRole, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Redirect if roles don't match
    if (!userRole || userRole !== role) {
      router.push('/auth');
    }
  }, [role, userRole, isAuthenticated, router]);

  if (!userRole || userRole !== role) {
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
