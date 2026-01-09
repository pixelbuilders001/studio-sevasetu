import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/AppShell';

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
