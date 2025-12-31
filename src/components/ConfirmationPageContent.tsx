
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, Copy, CopyCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import BookingTrackerModal from './BookingTrackerModal';

export default function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId).then(() => {
        setIsCopied(true);
        toast({
            title: "Copied!",
            description: "Booking ID has been copied to your clipboard.",
        });
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };


  if (!bookingId) {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="items-center text-center">
                <CheckCircle2 className="w-16 h-16 text-destructive mb-4" />
                <CardTitle className="text-2xl font-headline">{t('bookingIdMissingTitle')}</CardTitle>
                <CardDescription>{t('bookingIdMissingDescription')}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/">{t('goToHomepage')}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="items-center text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <CardTitle className="text-2xl font-headline">{t('bookingConfirmedTitle')}</CardTitle>
        <CardDescription>{t('bookingConfirmedDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">{t('yourBookingId')}</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold font-mono tracking-wider text-primary">{bookingId}</p>
            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy booking ID">
                {isCopied ? <CopyCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground px-4">
            Please save this ID. You will need it to track your service request.
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button asChild variant="outline">
          <Link href="https://wa.me/910000000000" target="_blank">
            <MessageSquare className="mr-2" />
            {t('whatsappSupport')}
          </Link>
        </Button>
        <BookingTrackerModal asChild={true}>
            <Button>
                {t('trackBooking')}
            </Button>
        </BookingTrackerModal>
      </CardFooter>
    </Card>
  );
}
