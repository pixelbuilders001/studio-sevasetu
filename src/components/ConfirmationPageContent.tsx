
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
import { getReferralCode } from '@/app/actions';
import { useEffect } from 'react';
import DesktopConfirmationView from './DesktopConfirmationView';

export default function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const referralCode = searchParams.get('referralCode');
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isReferralCopied, setIsReferralCopied] = useState(false);
  const [fetchedReferralCode, setFetchedReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchRefCode = async () => {
      try {
        const code = await getReferralCode();
        if (code) setFetchedReferralCode(code);
      } catch (error) {
        console.error('Error fetching referral code:', error);
      }
    };
    fetchRefCode();
  }, []);

  const displayReferralCode = fetchedReferralCode || referralCode;

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

  const whatsappMessage = displayReferralCode
    ? `Hey! I booked a service from helloFixo. Use my referral code ${displayReferralCode} and get ₹50 off. Book now 👉 https://hellofixo.com`
    : `I just booked a service with helloFixo! My Booking ID is ${bookingId}.`;

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden max-w-md mx-auto space-y-4 pb-4 px-2">
        {/* Compact Success Ticket */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-indigo-50 dark:border-indigo-900/30 overflow-hidden shadow-2xl relative">
          {/* Top Section: Header */}
          <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 border border-white/20">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-xl font-black font-headline tracking-tighter uppercase mb-1">
                {t('bookingConfirmedTitle')}
              </h1>
              <p className="text-white/70 text-[10px] uppercase tracking-widest font-black">
                {t('bookingConfirmedDescription')}
              </p>
            </div>

            {/* Ticket Cutouts */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full border-2 border-indigo-50 dark:border-indigo-900/30" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full border-2 border-indigo-50 dark:border-indigo-900/30" />
            <div className="absolute bottom-0 left-6 right-6 border-b-2 border-dashed border-white/20" />
          </div>

          {/* Middle Section: Booking ID */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-indigo-50 dark:border-indigo-900/20">
              <div>
                <p className="text-[9px] font-black text-indigo-600/60 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="text-lg font-black font-mono tracking-widest text-indigo-950 dark:text-white uppercase">{bookingId}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(bookingId, 'bookingId')}
                className="w-10 h-10 rounded-xl border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50"
              >
                {isCopied ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-indigo-400" />}
              </Button>
            </div>

            {/* Referral Mini Card */}
            {displayReferralCode && (
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-transparent rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Gift className="w-12 h-12 text-indigo-600 rotate-12" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Refer & Earn ₹50</p>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-mono tracking-widest text-indigo-900 dark:text-indigo-300">{displayReferralCode}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(displayReferralCode, 'referral')}
                        className="w-7 h-7 rounded-lg hover:bg-indigo-100"
                      >
                        {isReferralCopied ? <CopyCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-indigo-400/50" />}
                      </Button>
                    </div>
                  </div>
                  <Button asChild className="h-9 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-500/20">
                    <a href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <Share className="w-3 h-3" />
                      Share
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer of Ticket: Support Info */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-dashed border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Booking</p>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">30 Days Warranty</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline" className="rounded-2xl h-11 border-indigo-100 dark:border-indigo-900/30 bg-white/50 dark:bg-slate-900/50 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
            <Link href="https://wa.me/910000000000" target="_blank" className="flex items-center justify-center gap-2 text-indigo-900 dark:text-indigo-300">
              <MessageSquare className="w-3.5 h-3.5" />
              Support
            </Link>
          </Button>
          <BookingTrackerModal asChild={true}>
            <Button className="rounded-2xl h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
              Track Request
            </Button>
          </BookingTrackerModal>
        </div>

        {/* Back to Home Link */}
        <div className="text-center pt-2">
          <Button asChild variant="link" className="text-indigo-600/60 dark:text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.2em] h-auto p-0 hover:text-indigo-600 transition-colors">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopConfirmationView
          bookingId={bookingId}
          displayReferralCode={displayReferralCode}
          handleCopy={handleCopy}
          isCopied={isCopied}
          isReferralCopied={isReferralCopied}
          whatsappMessage={whatsappMessage}
          t={t as any}
        />
      </div>
    </>
  );
}
