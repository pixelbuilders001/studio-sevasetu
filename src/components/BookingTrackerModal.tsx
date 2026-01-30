
'use client';

import { useState, useEffect } from 'react';
import { getBookingTimeline, getLatestBookingId } from '@/app/actions';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Search, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import UserAuthSheet from './UserAuthSheet';

type BookingHistoryItem = { status: string; date: string; note?: string };
type View = 'loading' | 'auth' | 'history' | 'error' | 'empty';

interface BookingTrackerModalProps {
  asChild?: boolean;
  children?: React.ReactNode;
  bookingId?: string; // Optional: If passed, track this specific booking
}

export default function BookingTrackerModal({ asChild = false, children, bookingId: propBookingId }: BookingTrackerModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('loading');
  const [history, setHistory] = useState<BookingHistoryItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (authLoading) return; // Wait for auth to resolve
      if (!session) {
        setView('auth');
      } else {
        fetchTimeline();
      }
    }
  }, [isOpen, session, authLoading, propBookingId]);

  const fetchTimeline = async () => {
    setView('loading');
    setErrorMsg('');

    try {
      let targetId = propBookingId;

      if (!targetId) {
        // Fetch latest booking ID if none provided
        targetId = await getLatestBookingId();
      }

      if (!targetId) {
        setView('empty');
        return;
      }

      const result = await getBookingTimeline(targetId);

      if (result.success && result.history) {
        // If the latest status is 'repair_completed', treat it as no active booking
        if (result.history.length > 0 && result.history[0].status === 'repair_completed') {
          setView('empty');
          return;
        }
        setHistory(result.history);
        setView('history');
      } else {
        setErrorMsg(result.error || 'Failed to fetch booking details.');
        setView('error');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
      setView('error');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setTimeout(() => {
        setView('loading');
        setHistory([]);
        setErrorMsg('');
      }, 300);
    }
    setIsOpen(open);
  }

  // Wrapper for UserAuthSheet to close dialog on success (it calls setSheetOpen(false))
  const handleAuthSuccess = (open: boolean) => {
    if (!open) {
      // Assuming UserAuthSheet calls this with false on success
      // We can check if we are logged in now? 
      // Actually UserAuthSheet calls setSheetOpen(false). 
      // If we pass setIsOpen, it will close the WHOLE dialog.
      // That is probably fine? Or do we want to show timeline immediately?
      // Ideally we want to show timeline.
      // But UserAuthSheet closes the sheet.
      // Let's hook into session change.
    }
    // We actually want to keep dialog open if possible, but UserAuthSheet is designed to close it.
    // If it closes, user has to reopen. That's acceptable for v1 refactor.
    setIsOpen(open);
  }

  const Trigger = asChild ? children : (
    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 shadow-glow transition-all active:scale-95">
      <Search className="mr-2 h-4 w-4" />
      {t('trackBooking')}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild={asChild}>
        {Trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-card h-[500px] flex flex-col">

        {view !== 'auth' && (
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-2 shrink-0">
            <DialogHeader className="text-center flex flex-col items-center">
              {view === 'loading' && (
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 p-2 shadow-soft animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
              {/* {view === 'history' && (
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 p-2 shadow-soft">
                  <motion.div
                    className="relative w-full h-full"
                    animate={{ y: [0, -3, 0], x: [0, 1, -1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image src="/images/scooter-loader.png" alt="Scooter" fill className="object-contain" />
                  </motion.div>
                </div>
              )} */}

              <DialogTitle className="text-xl font-bold font-headline leading-tight mt-2">
                {view === 'history' ? t('trackYourBookingTitle') :
                  view === 'empty' ? 'No Active Bookings' :
                    view === 'error' ? 'Something went wrong' :
                      'Checking Status...'}
              </DialogTitle>
            </DialogHeader>
          </div>
        )}

        <div className="px-6 pb-6 flex-1 flex flex-col overflow-hidden">

          {view === 'auth' && (
            <div className="h-full py-4 overflow-y-auto no-scrollbar">
              {/* Reusing UserAuthSheet content. It usually expects to be in a Sheet but should render fine here. */}
              <UserAuthSheet setSheetOpen={handleAuthSuccess} />
            </div>
          )}

          {view === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
              <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Fetching latest updates...</p>
            </div>
          )}

          {view === 'empty' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium px-4">
                You don't have any bookings to track yet.
              </p>
              <Button onClick={() => setIsOpen(false)} variant="outline" className="rounded-xl">
                Close
              </Button>
            </div>
          )}

          {view === 'error' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <XCircle className="w-6 h-6" />
              </div>
              <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              <Button onClick={fetchTimeline} variant="outline" className="rounded-xl">
                Try Again
              </Button>
            </div>
          )}

          {view === 'history' && (
            <div className="pt-2 flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 overflow-y-auto pr-1 flex-1 py-2 no-scrollbar">
                {history.map((item, index) => {
                  const isLatest = index === 0; // Descending order
                  return (
                    <div key={index} className="flex gap-4 relative">
                      {index < history.length - 1 && (
                        <div className="absolute left-[17px] top-10 bottom-[-16px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                      )}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 transition-all relative ${isLatest
                          ? 'bg-primary border-primary text-white shadow-lg shadow-indigo-200 scale-110'
                          : 'bg-white border-slate-200 text-slate-300'
                          }`}>
                          {isLatest && (
                            <>
                              <span className="absolute inset-0 rounded-full bg-green-500/60 animate-ping" />
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-blink border-2 border-white shadow-sm z-20" />
                            </>
                          )}
                          {isLatest ? <CheckCircle className="w-4 h-4 relative z-10" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                      </div>
                      <div className={`flex-grow pb-2`}>
                        <div className={`p-4 rounded-2xl border transition-all ${isLatest
                          ? 'bg-white border-indigo-100 shadow-md'
                          : 'bg-slate-50 border-transparent opacity-80'
                          }`}>
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <p className={`font-black uppercase tracking-wide leading-tight ${isLatest ? 'text-[#1e1b4b] text-xs' : 'text-slate-500 text-[10px]'}`}>
                              {item.status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                              {item.date}
                            </p>
                          </div>
                          {item.note && (
                            <p className={`text-[11px] font-medium leading-relaxed ${isLatest ? 'text-slate-600' : 'text-slate-400'}`}>
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 shrink-0">
                <DialogClose asChild>
                  <Button className="w-full h-12 rounded-xl font-black bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-[0.98] transition-all uppercase tracking-widest text-xs">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
