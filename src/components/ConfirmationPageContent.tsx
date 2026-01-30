
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
import Image from 'next/image';
import ShareAppButton from '@/components/ShareAppButton';

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
      {/* Mobile View - Compact No-Scroll Design */}
      <div className="md:hidden flex flex-col px-5 py-10 overflow-hidden">
        {/* Centered Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">

          {/* Success Animation/Image - Scooter */}
          <div className="relative mb-0">
            <div className="w-32 h-32 flex items-center justify-center">
              <Image
                src="/images/scooter-loader.png"
                alt="Loading..."
                width={120}
                height={120}
                priority
                className="drop-shadow-lg"
              />
            </div>
          </div>

          {/* Title & Desc */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-indigo-600 uppercase tracking-tight leading-none">Booking Confirmed!</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide max-w-[250px] mx-auto leading-tight">
              Our Fixo expert will call you for the confirmation
            </p>
          </div>

          {/* Booking ID Card */}
          <div className="w-full bg-white border border-slate-100 rounded-2xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-0.5">Booking ID</span>
              <span className="text-xl font-black font-mono text-indigo-900 tracking-widest leading-none">{bookingId}</span>
            </div>
            <button
              onClick={() => handleCopy(bookingId!, 'bookingId')}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 active:scale-95 transition-all"
            >
              {isCopied ? <CopyCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* Referral Card (Compact) */}
          {displayReferralCode && (
            <div className="w-full bg-[#1e1b4b] rounded-2xl p-4 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-xs font-black uppercase text-yellow-400 tracking-wide leading-none">Gift ₹50, Get Rewards! 🎁</h3>
                  <div className="text-[9px] text-white/80 font-medium leading-tight">
                    Share code <span className="font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-white border border-white/10">{displayReferralCode}</span>
                  </div>
                </div>
                <ShareAppButton
                  label="WhatsApp"
                  className="shrink-0 bg-[#25D366] hover:bg-[#20ba59] text-white h-9 px-3 rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  shareData={{
                    title: 'Get ₹50 OFF with helloFixo! 🛠️',
                    text: `Hey! 🎁 Get ₹50 OFF on your first doorstep repair with helloFixo!\n\nUse my referral code: ${displayReferralCode}\n\n✅ Certified technicians\n✅ 60-min doorstep service\n✅ 30-day warranty\n\nBook now:`,
                    url: `https://hellofixo.in?ref=${displayReferralCode}`
                  }}
                />
              </div>
              {/* Background deco */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none blur-xl" />
              <Gift className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5 rotate-12 pointer-events-none" />
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 space-y-3 w-full pb- safe-area-bottom">
          <BookingTrackerModal asChild={true} bookingId={bookingId || undefined}>
            <Button variant="outline" className="w-full h-12 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-all bg-transparent">
              Track Request
            </Button>
          </BookingTrackerModal>

          <Link href="/" className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors py-2">
            Back to Home
          </Link>
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
