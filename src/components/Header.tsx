'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import UserAuthSheet from '@/components/UserAuthSheet';

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
);

export default function Header() {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/10 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          <div className="flex items-center gap-3">
            <LocationSelector />
            <LanguageSwitcher />
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-3xl h-[80dvh] inset-x-0 bottom-0 border-t bg-white p-0 flex flex-col"
              >
                <UserAuthSheet setSheetOpen={setSheetOpen} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
