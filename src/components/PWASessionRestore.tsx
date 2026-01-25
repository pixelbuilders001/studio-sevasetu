'use client';

import { useEffect, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

/**
 * Component to ensure session is properly restored in PWA context
 * This fixes the issue where users get logged out after refreshing in installed PWA
 */
export default function PWASessionRestore() {
  const isRestoringRef = useRef(false);

  useEffect(() => {
    // Check if we're in a PWA context
    const isStandalone = typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    );

    const supabase = createSupabaseBrowserClient();

    // Force session refresh on PWA load/refresh
    const restoreSession = async () => {
      // Prevent multiple simultaneous restorations
      if (isRestoringRef.current) {
        return;
      }

      isRestoringRef.current = true;

      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Session restore error:', error);
          isRestoringRef.current = false;
          return;
        }

        // If we have a session, validate and refresh if needed
        if (session) {
          // Check if session is expired or about to expire (within 5 minutes)
          const expiresAt = session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          const fiveMinutes = 5 * 60;

          if (expiresAt && (expiresAt - now) < fiveMinutes) {
            // Session is about to expire, refresh it
            const { data: { session: refreshedSession }, error: refreshError } =
              await supabase.auth.refreshSession();

            if (refreshError) {
              console.warn('Session refresh error:', refreshError);
            } else if (refreshedSession) {
              console.debug('Session refreshed successfully in PWA');
            }
          } else {
            console.debug('Session is valid, no refresh needed');
          }
        }
      } catch (error) {
        console.error('Error restoring session in PWA:', error);
      } finally {
        isRestoringRef.current = false;
      }
    };

    // Restore session immediately on mount
    if (isStandalone) {
      // Small delay to ensure localStorage is ready
      setTimeout(() => {
        restoreSession();
      }, 100);
    }

    // Also restore on visibility change (when user switches back to the app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isStandalone) {
        restoreSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for focus events (when PWA comes to foreground)
    const handleFocus = () => {
      if (isStandalone) {
        restoreSession();
      }
    };

    window.addEventListener('focus', handleFocus);

    // Listen for pageshow event (handles back/forward navigation and refresh)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (isStandalone && e.persisted) {
        // Page was loaded from cache (back/forward navigation)
        restoreSession();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return null; // This component doesn't render anything
}
