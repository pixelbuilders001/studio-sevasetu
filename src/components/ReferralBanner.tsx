'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Share2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserAuthSheet from './UserAuthSheet';
import { getReferralCode } from '@/app/actions';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ReferralBanner() {
    const [session, setSession] = useState<Session | null>(null);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const { toast } = useToast();
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);

            if (data.session) {
                const code = await getReferralCode();
                setReferralCode(code);
            }
            setLoading(false);
        };
        init();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session) {
                const code = await getReferralCode();
                setReferralCode(code);
                setSheetOpen(false);
            } else {
                setReferralCode(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!referralCode) return;

        const shareMessage = `Get flat Rs. 50 OFF on your first repair with SevaSetu! Use my referral code: ${referralCode}`;

        if (navigator.share) {
            navigator.share({
                title: 'SevaSetu Referral',
                text: shareMessage,
                url: window.location.origin,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareMessage);
            toast({
                title: "Code Copied!",
                description: "Share it with your friends to get rewards.",
            });
        }
    };

    if (loading) {
        return (
            <div className="w-full h-24 bg-muted animate-pulse rounded-[2.5rem]" />
        );
    }

    const BannerContent = () => (
        <div className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-4 sm:p-6 overflow-hidden shadow-xl active:scale-[0.98] transition-all group cursor-pointer border border-white/10">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6 flex-1">
                    {/* Left Icon Panel */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner flex-shrink-0">
                        <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-400/90 text-[10px] font-black uppercase tracking-tight text-blue-900 border border-white/20">
                                DUAL REWARD
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white italic tracking-tight mb-0.5 leading-none">
                            Gift ₹50, Get ₹50!
                        </h3>
                        <p className="text-white/80 text-[11px] sm:text-xs font-semibold max-w-[200px] sm:max-w-none leading-tight">
                            Your friend gets <span className="text-white font-black">Flat ₹50 OFF</span>. You get <span className="text-white font-black">₹50 Bonus</span> on your next fix!
                        </p>
                    </div>
                </div>

                {/* Right Action Panel */}
                <div className="flex-shrink-0">
                    {session && referralCode ? (
                        <div
                            onClick={handleShare}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform border-4 border-white/20"
                        >
                            <Share2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                            <ArrowIcon />
                        </div>
                    )}
                </div>
            </div>

            {session && referralCode && (
                <div className="mt-3 px-1 flex items-center gap-2">
                    <p className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase leading-none">Your Code:</p>
                    <p className="text-xs font-black text-white tracking-widest bg-white/10 px-2 py-0.5 rounded border border-white/10">{referralCode}</p>
                </div>
            )}
        </div>
    );

    return (
        <>
            {session ? (
                <BannerContent />
            ) : (
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <div className="w-full">
                            <BannerContent />
                        </div>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="rounded-t-3xl h-[80dvh] inset-x-0 bottom-0 border-t bg-white p-0 flex flex-col"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        <UserAuthSheet setSheetOpen={setSheetOpen} />
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}

function ArrowIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    );
}
