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
import { Button } from '@/components/ui/button';
import { Menu, Bike, ChevronDown } from 'lucide-react';
import BookingTrackerModal from './BookingTrackerModal';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 flex-shrink-0">
    <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
      <span className="text-2xl font-bold text-primary-foreground">S</span>
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-primary-foreground leading-tight">SevaSetu</span>
      <span className="text-xs font-semibold text-muted-foreground leading-tight tracking-wide">TRUSTED REPAIR</span>
    </div>
  </Link>
)

export default function Header() {
  const { t } = useTranslation();
  const navItems = [
    { href: '#how-it-works', label: t('howItWorksTitle') },
    { href: '#why-choose-us', label: t('whyChooseUs') },
    { href: '#services', label: t('ourServices') },
  ];

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
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
                      <Logo />
                      <SheetTitle className="sr-only">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
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
                         <BookingTrackerModal isMobile={true} />
                      </nav>
                      <div className="mt-auto">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
            </div>
            <div className='hidden md:block'>
              <Logo />
            </div>
          </div>
          
          <div className='md:hidden'>
             <Logo />
          </div>

          <div className="flex items-center gap-2">
              <LocationSelector />
              <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
