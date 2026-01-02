
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, Copy, CopyCheck, Gift } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import BookingTrackerModal from './BookingTrackerModal';

export default function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const referralCode = searchParams.get('referralCode');
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      toast({
          title: "Copied!",
          description: toastMessage,
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const getWhatsAppLink = () => {
    if (!referralCode) return "https://wa.me/910000000000";
    const message = `Hey! I booked a service from SEVASETU.\nUse my referral code ${referralCode} and get ₹100 off.\nBook now 👉 https://sevasetu.in`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }


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
            <Button variant="ghost" size="icon" onClick={() => handleCopy(bookingId, "Booking ID has been copied.")} aria-label="Copy booking ID">
                {isCopied ? <CopyCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {referralCode && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <div className='flex items-center justify-center gap-2 text-blue-600 dark:text-blue-300'>
                    <Gift className="h-5 w-5" />
                    <p className="font-semibold">Invite friends & earn rewards 🎁</p>
                </div>
                <p className="text-sm text-muted-foreground">Your Referral Code:</p>
                <div className="flex items-center justify-center gap-2">
                    <p className="text-2xl font-bold font-mono tracking-wider text-primary">{referralCode}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(referralCode, "Referral code has been copied.")} aria-label="Copy referral code">
                        {isCopied ? <CopyCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
        )}
        
        <p className="text-xs text-muted-foreground px-4">
            Please save this ID. You will need it to track your service request.
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button asChild variant="outline">
          <Link href={getWhatsAppLink()} target="_blank">
            <MessageSquare className="mr-2" />
            {referralCode ? 'Share on WhatsApp' : t('whatsappSupport')}
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
