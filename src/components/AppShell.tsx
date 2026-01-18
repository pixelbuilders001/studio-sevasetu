
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { Toaster } from '@/components/ui/toaster';
import { LocationProvider } from '@/context/LocationContext';
import { LanguageProvider } from '@/context/LanguageContext';
import SplashScreen from '@/components/SplashScreen';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = ['/', '/wallet', '/history'].includes(pathname);

  return (
    <LanguageProvider>
      <LocationProvider>
        <SplashScreen />
        <Header />
        <main className="flex-grow pb-24 pt-16 md:pt-20">{children}</main>
        <Footer />
        {showBottomNav && <BottomNavBar />}
      </LocationProvider>
    </LanguageProvider>
  );
}
