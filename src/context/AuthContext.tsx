
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
            try {
                // 1. Try standard cookie-based session
                let { data: { session }, error: sessionError } = await supabase.auth.getSession();
                console.log('AuthContext: Initial getSession:', session ? 'Found' : 'Missing', sessionError?.message || '');

                // 2. If no session, try a small delay and check again (sometimes cookies take a moment)
                if (!session) {
                    console.log('AuthContext: Waiting 300ms for potential hydration...');
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const secondCheck = await supabase.auth.getSession();
                    session = secondCheck.data.session;
                    if (session) console.log('AuthContext: Session found on second check');
                }

                // 3. Fallback to localStorage re-hydration (PWA helper)
                if (!session && typeof window !== 'undefined') {
                    const storageKey = 'sb-session-auth';
                    const savedSessionContent = localStorage.getItem(storageKey);
                    console.log('AuthContext: localStorage fallback check:', savedSessionContent ? 'Found' : 'Missing');

                    if (savedSessionContent) {
                        try {
                            const parsed = JSON.parse(savedSessionContent);
                            if (parsed && parsed.access_token && parsed.refresh_token) {
                                console.log('AuthContext: Manually re-hydrating from localStorage');
                                const { data: restored, error: restoreError } = await supabase.auth.setSession({
                                    access_token: parsed.access_token,
                                    refresh_token: parsed.refresh_token
                                });
                                if (restoreError) {
                                    console.error('AuthContext: Restore Error:', restoreError.message);
                                } else if (restored.session) {
                                    console.log('AuthContext: Restore Success!');
                                    session = restored.session;
                                }
                            }
                        } catch (e) {
                            console.error('AuthContext: Failed to parse saved session', e);
                        }
                    }
                }

                if (session?.user) {
                    const restricted = await checkRestricted(supabase, session.user.id);
                    console.log('AuthContext: Final Session User:', session.user.email, '| Restricted:', restricted);
                    if (restricted) {
                        setSession(null);
                        setUser(null);
                        setIsRestricted(true);
                    } else {
                        setSession(session);
                        setUser(session.user);
                        setIsRestricted(false);
                    }
                } else {
                    // FINAL FALLBACK: Check localStorage one last time before giving up
                    // This handles cases where cookies are missing but valid session data exists in storage
                    if (typeof window !== 'undefined') {
                        const storageKey = 'sb-session-auth';
                        const savedSessionContent = localStorage.getItem(storageKey);
                        if (savedSessionContent) {
                            console.log('AuthContext: Last-ditch local storage check found data. Attempting restore...');
                            try {
                                const parsed = JSON.parse(savedSessionContent);
                                if (parsed && parsed.access_token && parsed.refresh_token && parsed.user) {
                                    // FORCE HYDRATION: Set state immediately from local data to unblock UI
                                    // This bypasses the network delay of setSession which might be timing out
                                    const localSession = {
                                        access_token: parsed.access_token,
                                        refresh_token: parsed.refresh_token,
                                        expires_in: 3600, // approximate
                                        token_type: 'bearer',
                                        user: parsed.user
                                    };

                                    console.log('AuthContext: Force-restoring local session state immediately');
                                    setSession(localSession as Session);
                                    setUser(parsed.user);
                                    setIsRestricted(false); // Assume false for initial render, validate later if needed
                                    setLoading(false);

                                    // Background validation: Sync with Supabase client
                                    supabase.auth.setSession({
                                        access_token: parsed.access_token,
                                        refresh_token: parsed.refresh_token
                                    }).then(({ data, error }) => {
                                        if (error) console.error('AuthContext: Background validation failed', error);
                                        if (data.session) console.log('AuthContext: Background validation success');
                                    });

                                    return;
                                }
                            } catch (e) {
                                console.error('AuthContext: Failed to parse fallback session', e);
                            }
                        }
                    }
                    console.log('AuthContext: No session finalized.');
                    setSession(null);
                    setUser(null);
                    setIsRestricted(false);
                }
            } catch (error) {
                console.error('AuthContext: Critical initialization error:', error);
            } finally {
                // Ensure loading is only set to false when we are absolutely done
                console.log('AuthContext: Initialization finished, loading=false');
                setLoading(false);
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
