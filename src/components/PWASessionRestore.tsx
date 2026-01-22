'use client';

import { useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

/**
 * Component to ensure session is properly restored in PWA context
 * This fixes the issue where users get logged out after refreshing in installed PWA
 */
export default function PWASessionRestore() {
  useEffect(() => {
    // Check if we're in a PWA context
    const isStandalone = typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    );

    if (!isStandalone) {
      return; // Not in PWA, no need to do anything
    }

    const supabase = createSupabaseBrowserClient();

    // Force session refresh on PWA load/refresh
    const restoreSession = async () => {
      try {
        // First, check if we have a session stored
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session restore error:', error);
          return;
        }

        // If we have a session, refresh it to ensure it's valid
        if (session) {
          // Refresh the session to ensure it's still valid
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();

          if (refreshError) {
            console.warn('Session refresh error:', refreshError);
            // If refresh fails, the session might be expired
            // The auth state change listener will handle cleanup
          } else if (refreshedSession) {
            console.debug('Session restored successfully in PWA');
          }
        }
      } catch (error) {
        console.error('Error restoring session in PWA:', error);
      }
    };

    // Restore session immediately
    restoreSession();

    // Also restore on visibility change (when user switches back to the app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        restoreSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for storage events (localStorage changes)
    const handleStorageChange = (e: StorageEvent) => {
      // If Supabase storage changes, refresh session
      if (e.key?.startsWith('sb-')) {
        restoreSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for focus events (when PWA comes to foreground)
    const handleFocus = () => {
      restoreSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null; // This component doesn't render anything
}
