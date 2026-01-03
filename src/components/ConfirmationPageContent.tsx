
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, Copy, CopyCheck, Gift, Share } from 'lucide-react';
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
  const [isReferralCopied, setIsReferralCopied] = useState(false);

  const handleCopy = (textToCopy: string, type: 'bookingId' | 'referral') => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (type === 'bookingId') {
        setIsCopied(true);
        toast({
            title: "Copied!",
            description: "Booking ID has been copied.",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        setIsReferralCopied(true);
        toast({
            title: "Copied!",
            description: "Referral code has been copied.",
        });
        setTimeout(() => setIsReferralCopied(false), 2000);
      }
    });
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
  
  const whatsappMessage = referralCode 
    ? `Hey! I booked a service from SEVASETU. Use my referral code ${referralCode} and get ₹100 off. Book now 👉 https://sevasetu.com`
    : `I just booked a service with SevaSetu! My Booking ID is ${bookingId}.`;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
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
              <Button variant="ghost" size="icon" onClick={() => handleCopy(bookingId, 'bookingId')} aria-label="Copy booking ID">
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
      
      {referralCode && (
        <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
           <CardHeader className="text-center items-center pb-4">
            <div className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
                <Gift className="w-6 h-6" />
                <CardTitle className="text-xl">Invite friends & earn rewards 🎁</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">Your referral code:</p>
            <div className="inline-flex items-center justify-center gap-2 bg-white dark:bg-blue-900/50 rounded-full border border-blue-300 dark:border-blue-700 p-2">
              <p className="text-2xl font-bold font-mono tracking-wider text-blue-600 dark:text-blue-300 px-4">{referralCode}</p>
              <Button variant="ghost" size="icon" onClick={() => handleCopy(referralCode, 'referral')} aria-label="Copy referral code" className="rounded-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700">
                  {isReferralCopied ? <CopyCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-blue-500" />}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground px-4 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                <p className="font-semibold">Share & get <span className="text-primary font-bold">₹100 OFF</span> on your next service</p>
                <p>Your friend gets <span className="text-primary font-bold">₹50 OFF</span> instantly</p>
            </div>
          </CardContent>
           <CardFooter>
            <Button asChild className="w-full bg-green-500 hover:bg-green-600">
              <Link href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank">
                <Share className="mr-2" />
                Share on WhatsApp
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

    </div>
  );
}
