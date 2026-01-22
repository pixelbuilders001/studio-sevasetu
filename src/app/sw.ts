import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, type SerwistGlobalConfig } from "serwist";

// This declares the service worker scope
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

// Custom runtime caching that excludes auth endpoints
// Auth endpoints should always use network to ensure fresh authentication state
const customRuntimeCaching = [
    // Exclude auth endpoints from caching - always use network
    {
        matcher: ({ url, request }: { url: URL; request: Request }) => {
            // Match Supabase auth endpoints
            const isAuthEndpoint = url.pathname.includes('/auth/v1/') || 
                                  url.pathname.includes('/auth/callback') ||
                                  url.searchParams.has('code') ||
                                  url.searchParams.has('access_token') ||
                                  url.searchParams.has('refresh_token');
            
            // Match requests with authorization headers
            const hasAuthHeader = request.headers.get('authorization') !== null;
            
            // Match auth-related API routes
            const isAuthRoute = url.pathname.startsWith('/api/auth') ||
                               url.pathname.includes('/auth/');
            
            return isAuthEndpoint || hasAuthHeader || isAuthRoute;
        },
        handler: async ({ request }: { request: Request }) => {
            // NetworkOnly strategy - always fetch from network
            return fetch(request);
        },
    },
    // Use default cache for everything else
    ...defaultCache,
];

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    // Use custom runtime caching that excludes auth requests
    runtimeCaching: customRuntimeCaching,
});

serwist.addEventListeners();
