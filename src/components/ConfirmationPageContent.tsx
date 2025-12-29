'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, Map } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { t } = useTranslation();

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
      <CardContent className="text-center">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{t('yourBookingId')}</p>
          <p className="text-2xl font-bold font-mono tracking-wider text-primary">{bookingId}</p>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button asChild variant="outline">
          <Link href="https://wa.me/910000000000" target="_blank">
            <MessageSquare className="mr-2" />
            {t('whatsappSupport')}
          </Link>
        </Button>
        <Button disabled>
            <Map className="mr-2" />
            {t('trackBooking')}
        </Button>
      </CardFooter>
    </Card>
  );
}
