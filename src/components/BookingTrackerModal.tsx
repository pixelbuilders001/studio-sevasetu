
'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { trackBooking } from '@/app/actions';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { DialogFooter } from './ui/dialog';
import { Loader2, Search, XCircle, CheckCircle, History, Briefcase, Zap } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type View = 'form' | 'history' | 'error';
type TrackResult = { history?: { status: string; date: string, note?: string }[]; error?: string; } | null;

export default function BookingTrackerModal({ asChild = false, children }: { asChild?: boolean, children?: React.ReactNode }) {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('form');
  const [trackResult, setTrackResult] = useState<TrackResult>(null);

  const [trackState, trackDispatch, isTrackPending] = useActionState(trackBooking, {});
  const formRef = useRef<HTMLFormElement>(null);

  const trackAction = (formData: FormData) => {
    formData.append('lang', language);
    trackDispatch(formData);
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetToForm();
    }
    setIsOpen(open);
  }

  const resetToForm = () => {
    setView('form');
    setTrackResult(null);
    formRef.current?.reset();
  }

  useEffect(() => {
    if (isTrackPending) {
      return;
    }
    if (trackState?.history || trackState?.error) {
      setTrackResult(trackState);
    }
  }, [trackState, isTrackPending]);

  useEffect(() => {
    if (trackResult?.history) {
      setView('history');
    } else if (trackResult?.error) {
      setView('error');
    } else {
      setView('form');
    }
  }, [trackResult]);

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
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-card">
        {view !== 'history' && (
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 pt-7">
            <DialogHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 p-2 shadow-soft">
                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    y: [0, -3, 0],
                    x: [0, 1, -1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="/images/scooter-loader.png"
                    alt="Scooter"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>
              <DialogTitle className="text-xl font-bold font-headline leading-tight">{t('trackYourBookingTitle')}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground/80 mt-1 px-4">
                {view === 'error' ? (t('bookingNotFound') || 'Booking not found') : t('trackYourBookingDescription')}
              </DialogDescription>
            </DialogHeader>
          </div>
        )}

        {view === 'history' && (
          <div className="sr-only">
            <DialogHeader>
              <DialogTitle>{t('trackYourBookingTitle')}</DialogTitle>
            </DialogHeader>
          </div>
        )}

        <div className="px-6 pb-6">
          {view === 'form' && (
            <form ref={formRef} action={trackAction} className="space-y-3 pt-2">
              <div className="relative group">
                <Input
                  name="order_id"
                  type="text"
                  placeholder={t('enterOrderIdPlaceholder')}
                  required
                  className="h-11 pl-11 rounded-xl border-muted bg-muted/30 focus:bg-white transition-all text-sm font-medium focus:ring-2 focus:ring-primary/20"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Button
                type="submit"
                disabled={isTrackPending}
                className="w-full h-11 rounded-xl font-bold shadow-soft hover:shadow-md transition-all active:scale-[0.98] bg-primary text-primary-foreground"
              >
                {isTrackPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                {t('trackButton')}
              </Button>
            </form>
          )}

          {view === 'error' && trackResult?.error && (
            <div className="pt-4">
              <div className="p-5 bg-destructive/5 border border-destructive/10 rounded-[1.5rem] flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="font-bold text-base text-destructive">{t('bookingNotFound')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{trackResult.error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToForm}
                  className="mt-2 rounded-lg px-5 border-destructive/20 hover:bg-destructive/5 text-destructive font-semibold"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {view === 'history' && trackResult?.history && (
            <div className="pt-4">
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar">
                {trackResult.history.map((item, index) => {
                  const isLatest = index === (trackResult.history?.length ?? 0) - 1;
                  return (
                    <div key={index} className="flex gap-3 relative">
                      {index < (trackResult.history?.length ?? 0) - 1 && (
                        <div className="absolute left-[17px] top-9 bottom-[-12px] w-[2px] bg-muted-foreground/20"></div>
                      )}
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${isLatest
                          ? 'bg-primary text-primary-foreground shadow-glow animate-custom-pulse'
                          : 'bg-muted text-muted-foreground'
                          }`}>
                          {isLatest ? <CheckCircle className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                      </div>
                      <div className={`flex-grow pb-4 pt-0.5`}>
                        <div className={`p-3 rounded-xl border transition-all ${isLatest
                          ? 'bg-primary/5 border-primary/20 shadow-sm'
                          : 'bg-muted/30 border-transparent text-muted-foreground'
                          }`}>
                          <div className="flex justify-between items-start mb-0.5">
                            <p className={`font-bold ${isLatest ? 'text-foreground text-sm' : 'text-xs'}`}>
                              {item.status}
                            </p>
                            <p className="text-[9px] font-medium opacity-60 uppercase tracking-wider">
                              {item.date}
                            </p>
                          </div>
                          {item.note && (
                            <p className="text-[11px] mt-0.5 leading-tight opacity-80">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex gap-2">
                <Button
                  onClick={resetToForm}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5"
                >
                  {t('trackAnotherBooking')}
                </Button>
                <DialogClose asChild>
                  <Button
                    className="flex-1 h-11 rounded-xl font-bold bg-muted hover:bg-muted/80 text-foreground"
                  >
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
