'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import UserAuthSheet from './UserAuthSheet';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { ProfileSheet } from '@/components/profile/ProfileSheet'; // Import the new ProfileSheet
import { checkRestricted } from '@/utils/auth';

const Logo = () => (
  <Link href="/" className="flex flex-col flex-shrink-0 group transition-all duration-300 hover:scale-105 active:scale-95">
    <div className="flex items-center gap-1.5">
      <div className="bg-[#6366F1] px-1 rounded md:rounded shadow-[0_4px_10px_rgba(99,102,241,0.25)] group-hover:shadow-[0_6px_15px_rgba(99,102,241,0.35)] transition-all duration-300">
        <span
          //  className="text-xl md:text-2xl font-[1000] text-[#1E293B] dark:text-white tracking-tighter italic leading-none"
          className="text-[11px] md:text-[13px] font-[1000] text-white italic tracking-tighter leading-none whitespace-nowrap uppercase"
        >
          hello
        </span>
      </div>
      {/* <div className="bg-[#6366F1] px-2.5 py-1.2 rounded-xl md:rounded-2xl shadow-[0_4px_10px_rgba(99,102,241,0.25)] group-hover:shadow-[0_6px_15px_rgba(99,102,241,0.35)] transition-all duration-300"> */}
      <span
        className="text-md md:text-2xl font-[1000] text-[#1E293B] dark:text-white tracking-tighter leading-none -ml-1"
      // className="text-[11px] md:text-[13px] font-[1000] text-white italic tracking-tighter leading-none whitespace-nowrap uppercase"
      >
        fixo
      </span>
      {/* </div> */}
    </div>
    <div className=" flex items-center gap-1 mt-1 px-0.5">
      {/* <div className="h-[2px] w-4 bg-primary rounded-full opacity-50" /> */}
      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">
        Home Services
      </span>
    </div>
  </Link>
);

export default function Header() {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("sahdhsxhsh", session, sheetOpen);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const isRestricted = await checkRestricted(supabase, data.session.user.id);
        if (isRestricted) {
          setSession(null);
          setLoading(false);
          return;
        }
      }

      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isRestricted = await checkRestricted(supabase, session.user.id);
        if (isRestricted) {
          setSession(null);
          // Do NOT close sheet
          return;
        }
      }

      setSession(session);
      // Close login sheet only if valid user logs in
      if (session && sheetOpen) {
        setSheetOpen(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, sheetOpen]);

  // Skeleton loader for when session is being determined
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
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/10 glass md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          <div className="flex items-center gap-3">
            <LocationSelector />
            <LanguageSwitcher />

            {/* If user is logged in, show the ProfileSheet component */}
            {session ? (
              <ProfileSheet />
            ) : (
              <>
                {/* If user is not logged in, show the login sheet trigger */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
