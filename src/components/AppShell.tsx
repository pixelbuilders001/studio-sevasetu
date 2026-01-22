
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavBar from '@/components/BottomNavBar';
import { Toaster } from '@/components/ui/toaster';
import { LocationProvider } from '@/context/LocationContext';
import { LanguageProvider } from '@/context/LanguageContext';
import SplashScreen from '@/components/SplashScreen';
import { DesktopNavbar } from '@/components/DesktopNavbar';
import OfflineDetector from '@/components/OfflineDetector';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import PWASessionRestore from '@/components/PWASessionRestore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = ['/', '/wallet', '/history'].includes(pathname);

  return (
    <LanguageProvider>
      <LocationProvider>
        <PWASessionRestore />
        <SplashScreen />
        <OfflineDetector />
        <PWAInstallPrompt />
        {/* Desktop Navigation */}
        <DesktopNavbar />

        {pathname !== '/' && <Header />}
        <main className={`flex-grow ${pathname === '/' ? 'pt-0 md:pt-0' : 'pt-16 md:pt-20'} pb-24`}>{children}</main>
        <Footer />
        {showBottomNav && <BottomNavBar />}
      </LocationProvider>
    </LanguageProvider>
  );
}
