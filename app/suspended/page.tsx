'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconBan } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuspendedPage() {
  const { signOut } = useAuth(); // Assuming logOut is the method name, let's verify if it's logOut or logout
  const router = useRouter()
  const { user } = useAuth()
  useEffect(() => {
    if (user?.isActive) {
      router.push(`/${user?.role}`)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <IconBan size={48} />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Account Suspended</h1>
          <p className="text-muted-foreground">
            Your account is currently suspended and you cannot access the dashboard.
            If you believe this is an error, please contact the administrator.
          </p>
        </div>
        <div className="pt-4 space-y-3">
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign out
          </Button>
          <div className="text-sm">
            <Link href="/" className="text-primary hover:underline">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
