
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
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const restricted = await checkRestricted(supabase, session.user.id);
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
                    setSession(null);
                    setUser(null);
                    setIsRestricted(false);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
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
