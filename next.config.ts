
import type { NextConfig } from 'next';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    disableDevLogs: true,
    runtimeCaching: [
      // 🔐 SUPABASE — NEVER CACHE
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/i,
        handler: 'NetworkOnly',
      },
      // 🏠 START URL (Fix for ReferenceError)
      {
        urlPattern: '/',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'start-url',
          plugins: [
            {
              cacheWillUpdate: async ({ response }) => {
                if (response && response.type === 'opaqueredirect') {
                  return new Response(response.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: response.headers,
                  });
                }
                return response;
              },
            },
          ],
        },
      },

      // 🔐 NEXT API ROUTES — NEVER CACHE
      {
        urlPattern: /\/api\/.*$/i,
        handler: 'NetworkOnly',
      },

      // ✅ NEXT PAGES / NAVIGATION
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          networkTimeoutSeconds: 5,
        },
      },

      // ✅ STATIC IMAGES
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-images',
        },
      },

      // ✅ NEXT IMAGE OPTIMIZATION
      {
        urlPattern: /\/_next\/image\?url=.*$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-images',
        },
      },

      // ✅ JS FILES
      {
        urlPattern: /\.(?:js)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-js',
        },
      },

      // ✅ CSS FILES
      {
        urlPattern: /\.(?:css)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-css',
        },
      },

      // ✅ NEXT DATA
      {
        urlPattern: /\/_next\/data\/.*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'next-data',
        },
      },
    ]
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
};

export default withPWA(nextConfig);
