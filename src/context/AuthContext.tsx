
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { checkRestricted } from '@/utils/auth';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isRestricted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRestricted, setIsRestricted] = useState(false);

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('AuthContext: Initializing...');
            let hasHydratedLocally = false;

            // 1. OPTIMISTIC RESTORE: Check localStorage immediately to unblock UI
            if (typeof window !== 'undefined') {
                const storageKey = 'sb-session-auth';
                try {
                    const savedSessionContent = localStorage.getItem(storageKey);
                    if (savedSessionContent) {
                        const parsed = JSON.parse(savedSessionContent);
                        if (parsed && parsed.access_token && parsed.refresh_token && parsed.user) {
                            console.log('AuthContext: Optimistic local restore success');
                            const localSession = {
                                access_token: parsed.access_token,
                                refresh_token: parsed.refresh_token,
                                expires_in: 3600,
                                token_type: 'bearer',
                                user: parsed.user
                            };
                            setSession(localSession as Session);
                            setUser(parsed.user);
                            setIsRestricted(false); // Validate later
                            setLoading(false); // UI is now ready!
                            hasHydratedLocally = true;
                        }
                    }
                } catch (e) {
                    console.error('AuthContext: Local restore error', e);
                }
            }

            try {
                // 2. NETWORK VALIDATION: Check standard cookie session
                let { data: { session: networkSession }, error: sessionError } = await supabase.auth.getSession();
                console.log('AuthContext: Network getSession:', networkSession ? 'Found' : 'Missing');

                if (!networkSession) {
                    // 3. Retry logic for cookies
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const secondCheck = await supabase.auth.getSession();
                    networkSession = secondCheck.data.session;
                }

                // 4. Fallback or Validation
                if (networkSession?.user) {
                    // We found a valid network session, trust it over local storage
                    const restricted = await checkRestricted(supabase, networkSession.user.id);
                    if (restricted) {
                        setSession(null);
                        setUser(null);
                        setIsRestricted(true);
                    } else {
                        setSession(networkSession);
                        setUser(networkSession.user);
                        setIsRestricted(false);
                    }
                } else if (!hasHydratedLocally) {
                    // If no network session AND no local hydration, then we are truly logged out
                    console.log('AuthContext: No session finalized (Network + Local missing)');
                    setSession(null);
                    setUser(null);
                    setIsRestricted(false);
                } else {
                    // We hydrated locally, but network turned up nothing. 
                    // This implies cookies are missing but we have a token.
                    // We should try to re-sync the session if possible.
                    console.log('AuthContext: Local session exists, but network session missing. Attempting background sync...');
                    const savedSessionContent = localStorage.getItem('sb-session-auth');
                    if (savedSessionContent) {
                        const parsed = JSON.parse(savedSessionContent);
                        await supabase.auth.setSession({
                            access_token: parsed.access_token,
                            refresh_token: parsed.refresh_token
                        });
                    }
                }

            } catch (error) {
                console.error('AuthContext: Critical initialization error:', error);
            } finally {
                // Ensure loading is false essentially always by this point
                if (!hasHydratedLocally) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            console.log('AuthContext: onAuthStateChange event:', event);

            // MANUAL PERSISTENCE BRIDGE:
            // Ensure session is written to localStorage for PWA restoration fallback
            if (typeof window !== 'undefined') {
                if (currentSession?.access_token && currentSession?.refresh_token) {
                    const sessionData = {
                        access_token: currentSession.access_token,
                        refresh_token: currentSession.refresh_token,
                        user: currentSession.user
                    };
                    localStorage.setItem('sb-session-auth', JSON.stringify(sessionData));
                    console.log('AuthContext: Manually backed up session to localStorage');
                } else if (event === 'SIGNED_OUT') {
                    localStorage.removeItem('sb-session-auth');
                    console.log('AuthContext: Removed session from localStorage');
                }
            }

            if (event === 'INITIAL_SESSION') {
                // Ignore INITIAL_SESSION as we handle initialization manually to support PWA fallback
                return;
            }

            if (currentSession?.user) {
                const restricted = await checkRestricted(supabase, currentSession.user.id);
                if (restricted) {
                    setSession(null);
                    setUser(null);
                    setIsRestricted(true);
                } else {
                    setSession(currentSession);
                    setUser(currentSession.user);
                    setIsRestricted(false);
                }
            } else {
                setSession(null);
                setUser(null);
                setIsRestricted(false);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <AuthContext.Provider value={{ session, user, loading, isRestricted }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
