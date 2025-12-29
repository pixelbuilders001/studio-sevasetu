import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LocationProvider } from '@/context/LocationContext';

export const metadata: Metadata = {
  title: 'SevaSetu - Trusted Local Repair',
  description: 'Trusted Local Repair for Phones & Home Appliances',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <LocationProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LocationProvider>
        <Toaster />
      </body>
    </html>
  );
}
