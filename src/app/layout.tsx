import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/AppShell';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  themeColor: '#1e1b4b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'helloFixo - Your City\'s Most Trusted Doorstep Repair Service',
    template: '%s | helloFixo',
  },
  description: 'Premium doorstep mobile, laptop, and appliance repairs across Your City. Certified technicians, 60-min visits, and 30-day warranty. Book now for affordable and reliable service.',
  keywords: [
    'mobile repair Your City',
    'laptop repair Patna',
    'AC service Your City',
    'fridge repair',
    'washing machine service',
    'home appliance repair',
    'certified technicians',
    'doorstep repair',
    'phone repair service',
    'appliance repair Your City',
    'technician near me',
    'home service Your City',
    'repair service Patna',
    'mobile repair service',
    'laptop repair service',
  ],
  authors: [{ name: 'helloFixo', url: 'https://hellofixo.in' }],
  creator: 'helloFixo',
  publisher: 'helloFixo',
  metadataBase: new URL('https://hellofixo.in'),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://hellofixo.in',
    siteName: 'helloFixo',
    title: 'helloFixo - Your City\'s Most Trusted Doorstep Repair Service',
    description: 'Get your phone, laptop, or home appliances fixed at your doorstep by certified professionals in Your City. 60-min visits, 30-day warranty, and affordable pricing.',
    images: [
      {
        url: '/og-image.png?v=2',
        width: 1200,
        height: 630,
        alt: 'helloFixo - Doorstep Repair Service in Your City',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'helloFixo - Your City\'s Most Trusted Doorstep Repair Service',
    description: 'Premium doorstep repairs for phones and appliances in Your City. Certified technicians, fast service, and guaranteed quality.',
    images: ['/og-image.png?v=2'],
    creator: '@helloFixo',
    site: '@helloFixo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
    ],
    shortcut: '/favicon.ico?v=2',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'helloFixo',
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'Home Services',
  classification: 'Repair Service',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "hellofixo",
    "image": "https://hellofixo.in/logo-image.png",
    "@id": "https://hellofixo.in",
    "url": "https://hellofixo.in",
    "telephone": "+917461824651",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "vishwakarma chowk",
      "addressLocality": "samastipur",
      "addressRegion": "Your City",
      "postalCode": "8418101",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.5941,
      "longitude": 85.1376
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://facebook.com/helloFixo",
      "https://twitter.com/helloFixo",
      "https://instagram.com/hellofixo.in"
    ]
  };

  // Enhanced structured data for better SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "helloFixo",
    "url": "https://hellofixo.in",
    "logo": "https://hellofixo.in/logo-image.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+917461824651",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      "https://facebook.com/hellofixo",
      "https://twitter.com/helloFixo",
      "https://instagram.com/hellofixo.in"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Repair Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "helloFixo"
    },
    "areaServed": {
      "@type": "State",
      "name": "Your City"
    },
    "description": "Doorstep mobile, laptop, and appliance repair services across Your City"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hellofixo.in"
      }
    ]
  };

  return (
    <html lang="en" className="h-full">
      <head>
        {/* PWA Event Capture Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPWAEvent = e;
              });
            `,
          }}
        />
        {/* Primary Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {/* Additional Meta Tags for WhatsApp, Facebook, Instagram */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:secure_url" content="https://hellofixo.in/og-image.png?v=2" />
        <meta name="twitter:image:alt" content="helloFixo - Doorstep Repair Service in Your City" />
        {/* Additional WhatsApp/Facebook meta tags */}
        <meta property="fb:app_id" content="" />
        <meta name="theme-color" content="#1e1b4b" />
        <meta name="msapplication-TileColor" content="#1e1b4b" />
        {/* WhatsApp specific */}
        <meta property="og:image" content="https://hellofixo.in/og-image.png?v=2" />
        <meta property="og:image:url" content="https://hellofixo.in/og-image.png?v=2" />
        {/* Fallback: Use logo-image.png if og-image.png doesn't exist */}
        <meta name="og:image:fallback" content="https://hellofixo.in/og-image.png?v=2" />
        {/* Additional SEO */}
        <meta name="geo.region" content="IN-BR" />
        <meta name="geo.placename" content="Samastipur" />
        <meta name="geo.position" content="25.5941;85.1376" />
        <meta name="ICBM" content="25.5941, 85.1376" />
        <link rel="alternate" hrefLang="en" href="https://hellofixo.in" />
        <link rel="alternate" hrefLang="hi" href="https://hellofixo.in?lang=hi" />
      </head>
      <body className={`${poppins.variable} font-body antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary`}>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
