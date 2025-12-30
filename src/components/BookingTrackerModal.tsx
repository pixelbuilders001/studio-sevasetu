
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
} from '@/components/ui/dialog';
import { DialogFooter } from './ui/dialog';
import { Loader2, Search, XCircle, CheckCircle, History, Bike } from 'lucide-react';
import React from 'react';

type View = 'form' | 'history' | 'error';
type TrackResult = { history?: { status: string; date: string }[]; error?: string; } | null;

export default function BookingTrackerModal({ isMobile = false, asChild = false, children }: { isMobile?: boolean, asChild?: boolean, children?: React.ReactNode }) {
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
    if(!open) {
      // Reset state when closing the dialog
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

  const TriggerButton = asChild ? (
    <>{children}</>
  ) : isMobile ? (
    <button className="text-lg font-medium text-foreground transition-colors hover:text-primary w-full text-left flex items-center gap-2">
      <Bike />
      {t('trackBooking')}
    </button>
  ) : (
    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
      <Bike className="mr-2" />
      {t('trackBooking')}
    </Button>
  );


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild={asChild || isMobile}>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('trackYourBookingTitle')}</DialogTitle>
          <DialogDescription>{t('trackYourBookingDescription')}</DialogDescription>
        </DialogHeader>
        
        {view === 'form' && (
            <form ref={formRef} action={trackAction} className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row items-start gap-2">
                <div className="flex-grow w-full">
                <Input name="phone" type="tel" placeholder={t('enterPhoneNumberPlaceholder')} required className="text-base" />
                </div>
                <Button type="submit" disabled={isTrackPending} className="w-full sm:w-auto">
                    {isTrackPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {t('trackButton')}
                </Button>
            </div>
            </form>
        )}

        {view === 'error' && trackResult?.error && (
             <div className="space-y-4 py-4">
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <div>
                        <p className="font-semibold text-destructive">{t('bookingNotFound')}</p>
                        <p className="text-sm text-muted-foreground">{trackResult.error}</p>
                    </div>
                </div>
            </div>
        )}

        {view === 'history' && trackResult?.history && (
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2"><History /> {t('bookingHistory')}</h3>
              <div className="relative pl-8">
                {trackResult.history.map((item, index) => (
                  <div key={index} className="relative pb-8">
                    {index < trackResult.history.length - 1 && (
                       <div className="absolute left-[11px] top-4 -bottom-4 w-0.5 bg-border"></div>
                    )}
                    <div className="absolute left-0 top-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index === trackResult.history.length-1 ? 'bg-primary' : 'bg-muted'}`}>
                         <CheckCircle className={`w-4 h-4 ${index === trackResult.history.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`}/>
                      </div>
                    </div>
                    <div className="pl-4 ml-4">
                       <p className={`font-semibold ${index === trackResult.history.length-1 ? 'text-primary' : 'text-foreground'}`}>{item.status}</p>
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
              <Button onClick={resetToForm} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  {t('trackAnotherBooking')}
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
