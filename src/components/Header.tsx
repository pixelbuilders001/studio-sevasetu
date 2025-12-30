
'use client';

import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, Bike, ChevronDown } from 'lucide-react';
import React from 'react';
import BookingTrackerModal from './BookingTrackerModal';
import { serviceCategories } from '@/lib/data';

function ServicesMenu() {
  const { getTranslatedCategory } = useTranslation();
  const categories = serviceCategories.map(getTranslatedCategory);

  return (
    <div className="p-4">
      <div className="grid gap-4 services-mega-menu">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/book/${category.id}`}
            className="group flex items-center gap-3 p-2 rounded-md hover:bg-accent/50"
          >
            <category.icon className="w-6 h-6 text-primary" />
            <span className="font-semibold text-sm">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const navItems = [
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {t('ourServices')}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen max-w-md" align="start" sideOffset={10}>
                <ServicesMenu />
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
             <BookingTrackerModal />
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                 <LocationSelector />
              </div>
              <div className="hidden md:flex">
                <LocationSelector />
              </div>
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
                  <SheetHeader className="border-b pb-4 mb-4">
                    <SheetClose asChild>
                      <Link href="/" className="text-2xl font-bold text-primary font-headline">
                          {t('appName')}
                      </Link>
                    </SheetClose>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full">
                    <nav className="flex flex-col gap-4">
                       <SheetClose asChild>
                          <Link
                            href="/#services"
                            className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {t('ourServices')}
                          </Link>
                        </SheetClose>
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
                       <BookingTrackerModal isMobile={true} />
                    </nav>
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
