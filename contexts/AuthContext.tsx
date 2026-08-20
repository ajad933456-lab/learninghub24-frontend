'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authApi } from '@/lib/api';
import type { User, UserRole } from '@/lib/types';

// ─── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
    /** MongoDB user document (null when not authenticated or loading) */
    user: User | null;
    /** Raw Firebase user */
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (
        email: string,
        password: string,
        role: UserRole,
        fullName: string,
        phone: string
    ) => Promise<void>;
    signOut: () => Promise<void>;
    /** Call after profile update to re-fetch the latest MongoDB user */
    refreshUser: () => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
    reloadFirebaseUser: () => Promise<void>;
    verifyEmailBackend: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // Prevents onAuthStateChanged from calling me() during the signup flow.
    // A brand-new user has no MongoDB document yet, so me() would 401 and
    // cause unnecessary errors/flicker before sync() has a chance to run.
    const isSigningUp = useRef(false);

    // Sync Firebase user → MongoDB user on every auth state change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser && !isSigningUp.current) {
                try {
                    // Use /auth/me for returning sessions — only /sync needs a role (new signups)
                    const res = await authApi.me();
                    setUser((res.data as { user: User }).user);
                } catch {
                    // me() failed — user might be brand-new (not synced yet); that's ok
                    setUser(null);
                }
            } else if (!fbUser) {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const res = await authApi.me();
            setUser((res.data as { user: User }).user);
        } catch {
            // silently fail
        }
    }, []);

    const signInWithEmail = useCallback(
        async (email: string, password: string) => {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            // /auth/me for existing users — sync() is only needed for brand-new signups
            const res = await authApi.me();
            setUser((res.data as { user: User }).user);
            setFirebaseUser(cred.user);
        },
        []
    );

    const signUpWithEmail = useCallback(
        async (
            email: string,
            password: string,
            role: UserRole,
            fullName: string,
            phone: string
        ) => {
            isSigningUp.current = true;
            try {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                // Send verification email immediately
                await sendEmailVerification(cred.user);
                
                // Force-refresh to ensure a valid token is available before hitting the backend
                await cred.user.getIdToken(true);
                // sync() creates the MongoDB user document on first sign-up
                const res = await authApi.sync({ role, fullName, phone });
                setUser((res.data as { user: User }).user);
                setFirebaseUser(cred.user);
            } finally {
                isSigningUp.current = false;
            }
        },
        []
    );

    const signOut = useCallback(async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setFirebaseUser(null);
    }, []);

    const resendVerificationEmail = useCallback(async () => {
        if (firebaseUser) {
            await sendEmailVerification(firebaseUser);
        }
    }, [firebaseUser]);

    const resetPassword = useCallback(async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    }, []);

    const reloadFirebaseUser = useCallback(async () => {
        if (firebaseUser) {
            await firebaseUser.reload();
            // Re-read auth.currentUser after reload — Firebase mutates the user
            // object in-place using prototype getters, so spreading the old
            // reference never picks up the updated emailVerified value.
            setFirebaseUser(auth.currentUser);
        }
    }, [firebaseUser]);

    const verifyEmailBackend = useCallback(async () => {
        try {
            const res = await authApi.verifyEmail();
            setUser((res.data as { user: User }).user);
        } catch (error) {
            console.error('Failed to verify email on backend:', error);
            throw error;
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                loading,
                signInWithEmail,
                signUpWithEmail,
                signOut,
                refreshUser,
                resendVerificationEmail,
                reloadFirebaseUser,
                verifyEmailBackend,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}
