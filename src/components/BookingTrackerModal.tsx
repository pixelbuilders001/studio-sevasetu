'use client';

import { useActionState, useState, useEffect } from 'react';
import { trackBooking, resetTrackerState } from '@/app/actions';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Search, XCircle, CheckCircle, History, Bike } from 'lucide-react';
import React from 'react';

type View = 'form' | 'history' | 'error';

export default function BookingTrackerModal({ isMobile = false }: { isMobile?: boolean }) {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('form');
  
  const [trackState, trackDispatch, isTrackPending] = useActionState(trackBooking, {});
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
      setView('form');
      // A small delay to allow the exit animation to complete before resetting the state
      setTimeout(() => {
        // This is a dummy action to reset the state.
        trackDispatch(new FormData());
      }, 300);
    }
    setIsOpen(open);
  }

  useEffect(() => {
    if (isTrackPending) return;

    if (trackState?.history) {
      setView('history');
    } else if (trackState?.error) {
      setView('error');
    }
  }, [trackState, isTrackPending]);
  
  const [resetState, resetDispatch, isResetPending] = useActionState(resetTrackerState, {});

  const TriggerButton = isMobile ? (
     <button className="text-lg font-medium text-foreground transition-colors hover:text-primary w-full text-left flex items-center gap-2">
        <Bike />
        {t('trackBooking')}
    </button>
  ) : (
    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
      <Bike className="mr-2 h-4 w-4" />
      {t('trackBooking')}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('trackYourBookingTitle')}</DialogTitle>
          <DialogDescription>{t('trackYourBookingDescription')}</DialogDescription>
        </DialogHeader>
        
        {view === 'form' && (
            <form action={(formData) => {
                trackDispatch(formData);
            }} className="space-y-4 py-4">
            <div className="flex items-start gap-2">
                <div className="flex-grow">
                <Input name="phone" type="tel" placeholder={t('enterPhoneNumberPlaceholder')} required className="text-base" />
                <input type="hidden" name="lang" value={language} />
                </div>
                <Button type="submit" disabled={isTrackPending} className="w-full sm:w-auto">
                    {isTrackPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {t('trackButton')}
                </Button>
            </div>
            </form>
        )}

        {view === 'error' && trackState?.error && (
             <div className="space-y-4 py-4">
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <div>
                        <p className="font-semibold text-destructive">{t('bookingNotFound')}</p>
                        <p className="text-sm text-muted-foreground">{trackState.error}</p>
                    </div>
                </div>
            </div>
        )}

        {view === 'history' && trackState?.history && (
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2"><History /> {t('bookingHistory')}</h3>
              <div className="relative pl-8">
                {trackState.history.map((item, index) => (
                  <div key={index} className="relative pb-8">
                    {index < trackState.history.length - 1 && (
                       <div className="absolute left-[11px] top-4 -bottom-4 w-0.5 bg-border"></div>
                    )}
                    <div className="absolute left-0 top-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index === trackState.history.length-1 ? 'bg-primary' : 'bg-muted'}`}>
                         <CheckCircle className={`w-4 h-4 ${index === trackState.history.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`}/>
                      </div>
                    </div>
                    <div className="pl-4 ml-2">
                       <p className={`font-semibold ${index === trackState.history.length-1 ? 'text-primary' : 'text-foreground'}`}>{item.status}</p>
                       <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-end gap-2 pt-4">
            {view !== 'form' && (
              <form action={() => {
                setView('form');
                resetDispatch();
              }}>
                 <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={isResetPending}>
                    {isResetPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('trackAnotherBooking')}
                </Button>
              </form>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}