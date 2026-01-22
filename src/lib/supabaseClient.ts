import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Ensure localStorage is available and working in PWA context
  if (typeof window !== 'undefined') {
    // Test localStorage availability on initialization
    try {
      const testKey = '__pwa_storage_test__';
      window.localStorage.setItem(testKey, 'test');
      const retrieved = window.localStorage.getItem(testKey);
      window.localStorage.removeItem(testKey);
      
      if (retrieved !== 'test') {
        console.warn('localStorage may not be working correctly in PWA context');
      }
    } catch (error) {
      console.error('localStorage is not available:', error);
    }
  }

  return client;
}
