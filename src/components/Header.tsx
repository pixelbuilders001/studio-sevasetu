
'use client';

import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import BookingTrackerModal from './BookingTrackerModal';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 flex-shrink-0">
    <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
      <span className="text-2xl font-bold text-primary-foreground">S</span>
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-primary leading-tight">SevaSetu</span>
      <span className="text-xs font-semibold text-muted-foreground leading-tight tracking-wide">TRUSTED REPAIR</span>
    </div>
  </Link>
)

export default function Header() {
  const { t } = useTranslation();
  
  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <div className="flex items-center gap-2">
              <LocationSelector />
              <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
