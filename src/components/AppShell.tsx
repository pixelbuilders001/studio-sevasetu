
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { Toaster } from '@/components/ui/toaster';
import { LocationProvider } from '@/context/LocationContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = ['/', '/wallet', '/history'].includes(pathname);

  return (
    <LanguageProvider>
      <LocationProvider>
        <Header />
        <main className="flex-grow pb-16 md:pb-0">{children}</main>
        <Footer />
        {showBottomNav && <BottomNavBar />}
      </LocationProvider>
    </LanguageProvider>
  );
}
