import type { NextConfig } from 'next';
const withPWA = require('@ducanh2912/next-pwa').default;

const pwaConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/v1\/.*/i,
        handler: 'NetworkOnly',
        options: {
          cacheName: 'supabase-auth',
          expiration: {
            maxEntries: 0,
          },
        },
      },
      {
        urlPattern: /\/auth\/.*/i,
        handler: 'NetworkOnly',
        options: {
          cacheName: 'app-auth',
          expiration: {
            maxEntries: 0,
          },
        },
      },
      {
        urlPattern: /\/api\/auth\/.*/i,
        handler: 'NetworkOnly',
        options: {
          cacheName: 'api-auth',
          expiration: {
            maxEntries: 0,
          },
        },
      },
      {
        urlPattern: ({ request }: { request: Request }) => request.headers.get('authorization') !== null,
        handler: 'NetworkOnly',
        options: {
          cacheName: 'auth-requests',
          expiration: {
            maxEntries: 0,
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: ({ url }: { url: URL }) => {
          // Only cache same-origin requests, exclude auth
          return !url.pathname.includes('/auth/') &&
                 !url.pathname.startsWith('/api/auth') &&
                 !url.searchParams.has('code') &&
                 !url.searchParams.has('access_token') &&
                 !url.searchParams.has('refresh_token');
        },
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dv09dhgcrv5ld6ct.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'studio-sevasetu.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'whirlpoolindia.vtexassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.padminiappliances.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'quickinsure.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upoafhtidiwsihwijwex.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // CAUTION: This is an experimental feature.
  // Note that the cloud IDE domains are temporary and will change.
  allowedDevOrigins: [
    'https://6000-firebase-studio-1767068471018.cluster-ulqnojp5endvgve6krhe7klaws.cloudworkstations.dev',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:9002', 'https://rnbkwzl7-9002.inc1.devtunnels.ms'],
    },
  },
};

export default pwaConfig(nextConfig);
