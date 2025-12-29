
'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Search, XCircle, CheckCircle, Map, History } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {t('trackButton')}
    </Button>
  );
}

export default function BookingTrackerModal({ isMobile = false }: { isMobile?: boolean }) {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const translatedTrackBooking = async (prevState: any, formData: FormData) => {
    formData.append('lang', language);
    return trackBooking(prevState, formData);
  };

  const [state, dispatch] = useFormState(translatedTrackBooking, {});

  const resetState = () => {
    dispatch({ reset: true });
  }

  const handleOpenChange = (open: boolean) => {
    if(!open) {
        resetState();
    }
    setIsOpen(open);
  }

  useEffect(() => {
    if (state?.history) {
        // Form will not reset, modal will show history
    } else if (state?.error) {
        // Form will not reset, modal will show error
    } else {
        // Initial state or reset, do nothing
    }
  }, [state]);

  const TriggerButton = isMobile ? (
     <button className="text-lg font-medium text-foreground transition-colors hover:text-primary w-full text-left">
        {t('trackBooking')}
    </button>
  ) : (
    <Button variant="ghost">
      <Map className="mr-2" />
      {t('trackBooking')}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('trackYourBookingTitle')}</DialogTitle>
          <DialogDescription>{t('trackYourBookingDescription')}</DialogDescription>
        </DialogHeader>
        
        {!state?.history && (
            <form action={dispatch} className="space-y-4 py-4">
            <div className="flex items-start gap-2">
                <div className="flex-grow">
                <Input name="phone" type="tel" placeholder={t('enterPhoneNumberPlaceholder')} required className="text-base" />
                </div>
                <SubmitButton />
            </div>
            {state?.error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                <XCircle className="w-6 h-6 text-destructive" />
                <div>
                    <p className="font-semibold text-destructive">{t('bookingNotFound')}</p>
                    <p className="text-sm text-muted-foreground">{state.error}</p>
                </div>
                </div>
            )}
            </form>
        )}

        {state?.history && (
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2"><History /> {t('bookingHistory')}</h3>
              <div className="relative pl-6">
                {state.history.map((item, index) => (
                  <div key={index} className="relative pb-8">
                    {index < state.history.length - 1 && (
                       <div className="absolute left-[11px] top-4 -bottom-4 w-0.5 bg-border"></div>
                    )}
                    <div className="absolute left-0 top-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index === state.history.length-1 ? 'bg-primary' : 'bg-muted'}`}>
                         <CheckCircle className={`w-4 h-4 ${index === state.history.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`}/>
                      </div>
                    </div>
                    <div className="pl-4">
                       <p className={`font-semibold ${index === state.history.length-1 ? 'text-primary' : 'text-foreground'}`}>{item.status}</p>
                       <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={resetState} variant="outline" className='w-full'>{t('trackAnotherBooking')}</Button>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
                <Button type="button" variant="ghost">
                {t('closeButton')}
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
