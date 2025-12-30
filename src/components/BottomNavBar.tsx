'use client';
import Link from 'next/link';
import { Home, LayoutGrid, MessageSquare } from 'lucide-react';
import BookingTrackerModal from './BookingTrackerModal';
import { useTranslation } from '@/hooks/useTranslation';
import { Dialog, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Bike } from 'lucide-react';

export default function BottomNavBar() {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t shadow-t-lg md:hidden z-50">
      <nav className="h-full">
        <ul className="flex justify-around items-center h-full">
          <li className="flex-1">
            <Link href="/" className="flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link href="/#services" className="flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
              <LayoutGrid className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{t('ourServices')}</span>
            </Link>
          </li>
          <li className="flex-1">
             <BookingTrackerModal isMobile={true} asChild={true}>
                <button className="w-full flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
                    <Bike className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">{t('trackBooking')}</span>
                </button>
             </BookingTrackerModal>
          </li>
          <li className="flex-1">
            <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{t('whatsappSupport')}</span>
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
