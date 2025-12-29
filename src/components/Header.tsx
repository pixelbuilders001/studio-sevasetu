'use client';

import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import React from 'react';

export default function Header() {
  const { t } = useTranslation();
  const navItems = [
    { href: '#services', label: t('ourServices') },
    { href: '#how-it-works', label: t('howItWorksTitle') },
    { href: '#why-choose-us', label: t('whyChooseUs') },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            {t('appName')}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <LocationSelector />
              <LanguageSwitcher />
            </div>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <Link href="/" className="text-2xl font-bold text-primary font-headline">
                           {t('appName')}
                        </Link>
                    </div>
                    
                    <nav className="flex flex-col gap-4">
                      {navItems.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                    <div className="mt-auto border-t pt-4 space-y-4">
                        <LocationSelector />
                        <LanguageSwitcher />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
