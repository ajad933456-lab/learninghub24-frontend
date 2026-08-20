'use client'

export const dynamic = 'force-dynamic';


/**
 * /auth-redirect — Smart redirect page.
 *
 * After login/register, we land here. We read the AuthContext user and redirect
 * to the correct destination based on role + profileStatus.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IconLoader2 } from '@tabler/icons-react';

export default function AuthRedirectPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.isActive) {
      router.replace('/suspended');
      return;
    }

    // Step 2: email must be verified before anything else
    if (!firebaseUser?.emailVerified) {
      router.replace('/verify-email');
      return;
    }

    // Step 3: profile setup / approval
    switch (user.profileStatus) {
      case 'pending_details':
        router.replace(`/setup/${user.role}`);
        break;
      case 'pending_approval':
        router.replace('/pending-approval');
        break;
      case 'active':
      case 'rejected':
      default:
        router.replace(`/${user.role}`);
        break;
    }
  }, [user, firebaseUser, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <IconLoader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm">Setting up your dashboard…</p>
      </div>
    </div>
  );
}
