'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IconMail, IconLoader2, IconCheck, IconRefresh } from '@tabler/icons-react';

export default function VerifyEmailPage() {
  const { user, firebaseUser, loading, resendVerificationEmail, reloadFirebaseUser, verifyEmailBackend } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [cooldown, setCooldown] = useState(0);

  // If already verified, redirect to the correct next step in the flow
  useEffect(() => {
    if (!loading && firebaseUser?.emailVerified && user) {
      const continueFlow = () => {
        if (!user.isActive) {
          router.replace('/suspended');
        } else if (user.profileStatus === 'pending_details') {
          router.replace(`/setup/${user.role}`);
        } else if (user.profileStatus === 'pending_approval') {
          router.replace('/pending-approval');
        } else {
          router.replace(`/${user.role}`);
        }
      };

      if (!user.isEmailVerified) {
        verifyEmailBackend().then(continueFlow).catch(continueFlow);
      } else {
        continueFlow();
      }
    }
  }, [firebaseUser, user, loading, router, verifyEmailBackend]);

  // Handle countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (loading || (firebaseUser && firebaseUser.emailVerified)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <IconLoader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!firebaseUser) {
    // If not logged in at all, go to login
    router.replace('/login');
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setResending(true);
    setMessage({ text: '', type: '' });
    try {
      await resendVerificationEmail();
      setMessage({ text: 'Verification email resent successfully!', type: 'success' });
      setCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      setMessage({ 
        text: err.message || 'Failed to resend email. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setMessage({ text: '', type: '' });
    try {
      await reloadFirebaseUser();
      
      // Force refresh the Firebase token so the backend receives the new email_verified claim
      if (firebaseUser) {
        await firebaseUser.getIdToken(true);
      }
      
      // Use the backend API to verify the email and sync the DB
      await verifyEmailBackend();
      
      // If successful, the useEffect above will redirect automatically
      // since user.isEmailVerified and firebaseUser.emailVerified will both be true
    } catch (err: any) {
      // Backend returns 400 if Firebase token still says unverified
      setMessage({ text: 'Email not verified yet. Please check your inbox and click the link.', type: 'error' });
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <IconMail size={32} className="text-primary" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-foreground">Verify your email</h1>
        <p className="mb-6 text-muted-foreground text-sm">
          We've sent a verification link to <span className="font-semibold text-foreground">{firebaseUser.email}</span>. 
          Please click the link to activate your account.
        </p>

        {message.text && (
          <div className={`mb-6 rounded-xl border p-4 text-sm flex items-center justify-center gap-2 ${
            message.type === 'success' 
              ? 'border-green-200 bg-green-50 text-green-700' 
              : 'border-destructive/20 bg-destructive/10 text-destructive'
          }`}>
            {message.type === 'success' && <IconCheck size={16} />}
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCheckVerification}
            disabled={checking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {checking ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconRefresh size={18} />
            )}
            I've verified my email
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {resending ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
