'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';

/**
 * Guards a page to a specific role. Redirects unauthenticated users to /login
 * and wrong-role users to their correct dashboard.
 *
 * @param requiredRole  The role that is allowed to access this page.
 */
export function useRequireAuth(requiredRole: UserRole) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== requiredRole) {
      router.replace(`/${user.role}`);
      return;
    }

    // Teachers with pending_approval status → hold page
    if (user.profileStatus === 'pending_approval' && requiredRole === 'teacher') {
      router.replace('/pending-approval');
      return;
    }

    // Any user with pending_details → redirect to profile setup
    if (user.profileStatus === 'pending_details') {
      router.replace(`/setup/${user.role}`);
    }
  }, [user, loading, requiredRole, router]);

  return { user, loading };
}
