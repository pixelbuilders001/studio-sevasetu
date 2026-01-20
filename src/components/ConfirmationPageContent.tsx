
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
    ? `Hey! I booked a service from HELLOFIXO. Use my referral code ${displayReferralCode} and get ₹100 off. Book now 👉 https://hellofixo.com`
    : `I just booked a service with Hellofixo! My Booking ID is ${bookingId}.`;

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden max-w-md mx-auto space-y-6 pb-12">
        {/* Success Header */}
        <div className="text-center pt-4 pb-2 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative z-10 w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-headline tracking-tight mb-2">
            {t('bookingConfirmedTitle')}
          </h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
            {t('bookingConfirmedDescription')}
          </p>
        </div>

        {/* Booking ID Card */}
        <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="bg-gray-900 dark:bg-gray-950 text-white rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Your Booking ID</span>
              </div>

              <div className="flex items-center justify-center gap-3 bg-white/5 rounded-2xl py-4 px-6 border border-white/5">
                <p className="text-2xl font-black font-mono tracking-[0.15em] text-primary">{bookingId}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(bookingId, 'bookingId')}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {isCopied ? <CopyCheck className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-white/50" />}
                </Button>
              </div>

              <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/60 leading-relaxed text-left">
                  Please save this ID to track your service request or contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <Button asChild variant="outline" className="rounded-2xl h-12 border-primary/10 bg-background/50 backdrop-blur-sm font-bold text-xs uppercase tracking-wider">
            <Link href="https://wa.me/910000000000" target="_blank" className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-500" />
              Support
            </Link>
          </Button>
          <BookingTrackerModal asChild={true}>
            <Button className="rounded-2xl h-12 font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20">
              Track Request
            </Button>
          </BookingTrackerModal>
        </div>

        {/* Referral Rewards Section */}
        {displayReferralCode && (
          <div className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 rounded-3xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center rotate-3 translate-y-[-1px]">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black uppercase tracking-wider">Refer & Earn</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Rewards for you and your friends</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-1">
                      <Gift className="w-12 h-12 text-primary/5 rotate-12" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 relative z-10">Use Code Below</p>
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      <span className="text-2xl font-black font-mono tracking-[0.2em] text-primary">{displayReferralCode}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(displayReferralCode, 'referral')}
                        className="rounded-xl hover:bg-primary/10 w-8 h-8"
                      >
                        {isReferralCopied ? <CopyCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-primary/50" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-white/50 dark:border-white/5">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-1">Your Reward</p>
                      <p className="text-xs font-bold"><span className="text-primary font-black">₹100 OFF</span> Next Time</p>
                    </div>
                    <div className="bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-white/50 dark:border-white/5">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-1">Friend Gets</p>
                      <p className="text-xs font-bold"><span className="text-primary font-black">₹50 OFF</span> Instantly</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 group transition-all">
                  <Link href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank">
                    <Share className="w-4 h-4 transition-transform group-hover:scale-110" />
                    Share on WhatsApp
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <Button asChild variant="link" className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-primary">
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
          t={t}
        />
      </div>
    </>
  );
}
