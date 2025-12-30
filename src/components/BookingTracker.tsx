
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { trackBooking, resetTrackerState } from '@/app/actions';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useTranslation();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {t('trackButton')}
        </Button>
    );
}

function ResetButton() {
    const { pending } = useFormStatus();
    const { t } = useTranslation();
    return (
         <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t('trackAnotherBooking')}
        </Button>
    )
}

export default function BookingTracker() {
    const { t, language } = useTranslation();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    
    const translatedTrackBooking = async (prevState: any, formData: FormData) => {
        formData.append('lang', language);
        return trackBooking(prevState, formData);
    }
    const [state, dispatch, isPending] = useActionState(translatedTrackBooking, {});
    
    const [resetState, resetDispatch] = useActionState(resetTrackerState, {});


    useEffect(() => {
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: state.error,
            });
        }
    }, [state, toast, t]);
    
    useEffect(() => {
        if (formRef.current && !isPending && state) {
            // Potentially reset form if needed, but state handles view change
        }
    }, [isPending, state])


    if(state?.history) {
        return (
            <section id="track-booking" className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <Card className="max-w-xl mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{t('trackYourBookingTitle')}</CardTitle>
                            <CardDescription>{t('trackYourBookingDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="mt-6 p-4 bg-green-100/50 border border-green-300 rounded-lg flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-800">{t('currentStatus')}</p>
                                    <p className="text-lg font-bold text-green-900">{state.history[state.history.length-1].status}</p>
                                </div>
                            </div>
                             <form action={resetDispatch} className='mt-4'>
                                <ResetButton />
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        )
    }

    return (
        <section id="track-booking" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <Card className="max-w-xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{t('trackYourBookingTitle')}</CardTitle>
                        <CardDescription>{t('trackYourBookingDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} action={dispatch} className="flex items-start gap-2">
                            <div className="flex-grow">
                                <Input name="phone" type="tel" placeholder={t('enterPhoneNumberPlaceholder')} required className="text-base"/>
                            </div>
                            <SubmitButton />
                        </form>
                        
                         {state?.error && (
                            <div className="mt-6 p-4 bg-red-100/50 border border-red-300 rounded-lg flex items-center gap-3">
                                <XCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <p className="font-semibold text-red-800">{t('bookingNotFound')}</p>
                                    <p className="text-muted-foreground">{state.error}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
