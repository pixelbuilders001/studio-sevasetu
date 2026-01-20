'use client';

import React from 'react';
import Link from 'next/link';
import {
    CheckCircle2, MessageSquare, Copy, CopyCheck, Gift, Share,
    ArrowRight, Home, LayoutDashboard, ExternalLink, ShieldCheck,
    Zap, Calendar, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BookingTrackerModal from './BookingTrackerModal';

interface DesktopConfirmationViewProps {
    bookingId: string;
    displayReferralCode: string | null;
    handleCopy: (textToCopy: string, type: 'bookingId' | 'referral') => void;
    isCopied: boolean;
    isReferralCopied: boolean;
    whatsappMessage: string;
    t: (key: string) => string;
}

export default function DesktopConfirmationView({
    bookingId,
    displayReferralCode,
    handleCopy,
    isCopied,
    isReferralCopied,
    whatsappMessage,
    t
}: DesktopConfirmationViewProps) {
    return (
        <div className="min-h-screen bg-slate-50/20 pt-12 pb-24">
            <div className="container mx-auto px-6 max-w-5xl">

                {/* Success Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                        <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/5 border border-emerald-50">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/10">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2.5} />
                            </div>
                        </div>
                        {/* Minimalist burst dots */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100" />
                        <div className="absolute -bottom-4 -left-2 w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300" />
                    </div>

                    <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-900 mb-4">
                        {t('bookingConfirmedTitle')}
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('bookingConfirmedDescription')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Booking Card (Left/Center) */}
                    <div className="lg:col-span-12 space-y-8">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                            {/* Subtle background pattern */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-45 duration-700">
                                <ShieldCheck className="w-64 h-64 text-slate-900" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="space-y-6 flex-1">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block mb-2">Order Reference</span>
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-4xl font-bold font-mono text-slate-900 tracking-wider">
                                                {bookingId}
                                            </h2>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopy(bookingId, 'bookingId')}
                                                className="h-10 w-10 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all active:scale-95"
                                            >
                                                {isCopied ? <CopyCheck className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                <Zap className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Status</p>
                                                <p className="text-sm font-bold text-slate-700">Assigned Soon</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Warranty</p>
                                                <p className="text-sm font-bold text-slate-700">30-Day Protected</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-px h-32 bg-slate-100 hidden md:block" />

                                <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
                                    <BookingTrackerModal asChild={true}>
                                        <Button className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 px-8 group transition-all active:scale-[0.98]">
                                            TRACK SERVICE REQUEST
                                            <LayoutDashboard className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    </BookingTrackerModal>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button asChild variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50">
                                            <Link href="https://wa.me/910000000000" target="_blank" className="flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-emerald-500" />
                                                SUPPORT
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50">
                                            <Link href="/" className="flex items-center gap-2">
                                                <Home className="w-4 h-4 text-indigo-500" />
                                                HOME
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Refer & Earn */}
                            {displayReferralCode && (
                                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] border border-indigo-100 p-8 flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                                                <Gift className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 leading-tight">Refer & Earn Rewards</h3>
                                                <p className="text-xs text-slate-500">Give ₹50, Get ₹100 for every friend</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 mb-8 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Your Code</p>
                                                <p className="text-2xl font-bold font-mono tracking-widest text-indigo-600">{displayReferralCode}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopy(displayReferralCode, 'referral')}
                                                className="h-12 w-12 rounded-xl border border-slate-50 hover:bg-white shadow-sm transition-all active:scale-95"
                                            >
                                                {isReferralCopied ? <CopyCheck className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button asChild className="h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-bold shadow-lg shadow-green-500/10 flex items-center justify-center gap-3 group transition-all active:scale-[0.98]">
                                        <Link href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank">
                                            <Share className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            SHARE ON WHATSAPP
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Next Steps / Helpful Info */}
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-6">What happens next?</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-100">1</div>
                                            <p className="text-sm text-slate-500 leading-relaxed"><span className="font-bold text-slate-700 italic">Technician Assigned:</span> We are matching the best professional for your category near you.</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-100">2</div>
                                            <p className="text-sm text-slate-500 leading-relaxed"><span className="font-bold text-slate-700 italic">Visit Confirmation:</span> Expect a confirmation call from our technician shortly.</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-100">3</div>
                                            <p className="text-sm text-slate-500 leading-relaxed"><span className="font-bold text-slate-700 italic">Service Visit:</span> The professional will arrive at your scheduled time slot.</p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <p className="text-xs text-slate-400 flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        All services are covered by Hellofixo Quality Guarantee
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
