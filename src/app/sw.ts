import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, type SerwistGlobalConfig } from "serwist";
import { NetworkOnly } from "serwist/strategies";
import { registerRoute } from "serwist/legacy";

// This declares the service worker scope
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    // User requested "dont cache precache", so we rely on runtime caching mostly
    // or defaultCache strategies which handle basic runtime caching.
    runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Register routes to exclude auth endpoints from caching
// This ensures authentication state is always fresh
registerRoute(
    ({ url, request }) => {
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
    new NetworkOnly(),
    'GET'
);

// Also exclude POST/PUT/DELETE requests to auth endpoints
registerRoute(
    ({ url }) => {
        return url.pathname.includes('/auth/') || 
               url.pathname.startsWith('/api/auth');
    },
    new NetworkOnly(),
    'POST'
);

registerRoute(
    ({ url }) => {
        return url.pathname.includes('/auth/') || 
               url.pathname.startsWith('/api/auth');
    },
    new NetworkOnly(),
    'PUT'
);

registerRoute(
    ({ url }) => {
        return url.pathname.includes('/auth/') || 
               url.pathname.startsWith('/api/auth');
    },
    new NetworkOnly(),
    'DELETE'
);
