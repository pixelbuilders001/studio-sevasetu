import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/AppShell';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Hellofixo - Bihar\'s Most Trusted Doorstep Repair Service',
  description: 'Premium doorstep mobile, laptop, and appliance repairs across Bihar. Certified technicians, 60-min visits, and 30-day warranty. Book now for affordable and reliable service.',
  keywords: ['mobile repair Bihar', 'laptop repair Patna', 'AC service Bihar', 'fridge repair', 'washing machine service', 'home appliance repair', 'certified technicians', 'doorstep repair'],
  authors: [{ name: 'Hellofixo' }],
  metadataBase: new URL('https://hellofixo.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hellofixo - Bihar\'s Most Trusted Doorstep Repair Service',
    description: 'Get your phone, laptop, or home appliances fixed at your doorstep by certified professionals in Bihar.',
    url: 'https://hellofixo.in',
    siteName: 'Hellofixo',
    images: [
      {
        url: '/logo-image.png',
        width: 1200,
        height: 630,
        alt: 'Hellofixo Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hellofixo - Trusted Local Repair',
    description: 'Premium doorstep repairs for phones and appliances in Bihar.',
    images: ['/logo-image.png'],
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
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
    "name": "Hellofixo",
    "image": "https://hellofixo.in/logo-image.png",
    "@id": "https://hellofixo.in",
    "url": "https://hellofixo.in",
    "telephone": "+917461824651",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "vishwakarma chowk",
      "addressLocality": "samastipur",
      "addressRegion": "Bihar",
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
      "https://facebook.com/hellofixo",
      "https://twitter.com/hellofixo",
      "https://instagram.com/hellofixo"
    ]
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.variable} font-body antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary`}>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
