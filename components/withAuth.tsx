'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthComponent(props: P) {
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token found, kick them out to the login page
        router.replace('/login');
      } else {
        setVerified(true);
      }
    }, [router]);

    if (!verified) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
