'use client'

export const dynamic = 'force-dynamic';


import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconClock, IconArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function PendingApprovalPage() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  useEffect(() => {
    if (user?.profileStatus === 'active') {
      router.push(`/${user.role}`);
    }
  }, [user, router]);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <IconClock size={32} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Profile Under Review</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your teacher profile has been submitted and is currently being reviewed
            by our admin team. This typically takes{' '}
            <strong>24–48 hours</strong>.
          </p>
        </div>

        <div className="rounded-xl bg-muted/50 border border-border p-4 text-left space-y-2">
          <p className="text-sm font-medium text-foreground">What happens next?</p>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">1</span>
              Admin verifies your qualifications and experience
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">2</span>
              You receive a notification once approved
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">3</span>
              Full dashboard access is unlocked
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/setup/teacher">
            <Button variant="outline" className="w-full gap-2" id="btn-edit-profile">
              Edit Profile
              <IconArrowRight size={16} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={handleSignOut}
            id="btn-sign-out-pending"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
