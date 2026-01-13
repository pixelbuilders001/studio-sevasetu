'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import UserAuthSheet from './UserAuthSheet';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

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
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Close sheet when user logs in
      if (session && sheetOpen) {
        setSheetOpen(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleUserIconClick = () => {
    if (loading) return;
    
    if (session) {
      router.push('/profile');
    } else {
      setSheetOpen(true);
    }
  };

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/10 glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Logo />
            <div className="flex items-center gap-3">
              <LocationSelector />
              <LanguageSwitcher />
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/10 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          <div className="flex items-center gap-3">
            <LocationSelector />
            <LanguageSwitcher />
            
            {/* Show sheet only when user is NOT logged in */}
            {!session && (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleUserIconClick}>
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open login</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="rounded-t-3xl h-[80dvh] inset-x-0 bottom-0 border-t bg-white p-0 flex flex-col"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <UserAuthSheet setSheetOpen={setSheetOpen} />
                </SheetContent>
              </Sheet>
            )}
            
            {/* Show button without sheet when user IS logged in */}
            {session && (
              <Button variant="ghost" size="icon" onClick={handleUserIconClick}>
                <User className="h-5 w-5" />
                <span className="sr-only">Open profile</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
