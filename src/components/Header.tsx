'use client';

import React, { useState, useEffect } from 'react';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import UserAuthSheet from './UserAuthSheet';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { ProfileSheet } from '@/components/profile/ProfileSheet'; // Import the new ProfileSheet
import { checkRestricted } from '@/utils/auth';

export default function Header() {
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
            <LocationSelector />
            <div className="flex items-center gap-3">
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
          <LocationSelector />
          <div className="flex items-center gap-3">
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
