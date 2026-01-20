'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    ShieldCheck,
    Wallet,
    Package,
    IndianRupee,
    Info,
    Shield,
    Clock,
    Zap,
    CheckCircle2,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ServiceCategory, Problem } from '@/lib/data';
import { useTranslation } from '@/hooks/useTranslation';

interface DesktopEstimateViewProps {
    category: ServiceCategory;
    selectedProblems: Problem[];
    inspectionFee: number;
    totalRepairCost: number;
    totalEstimatedPrice: number;
    handleConfirmVisit: () => void;
    router: any;
}

export default function DesktopEstimateView({
    category,
    selectedProblems,
    inspectionFee,
    totalRepairCost,
    totalEstimatedPrice,
    handleConfirmVisit,
    router
}: DesktopEstimateViewProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50/20 pt-8 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Navigation & Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-semibold text-xs uppercase tracking-wider mb-4 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to selection
                    </button>
                    <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                                Order <span className="text-primary">Summary</span>
                            </h1>
                            <p className="text-slate-500 text-sm">Review your booking details and estimated pricing.</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-none mb-0.5">Protection</p>
                                <p className="text-xs font-bold text-slate-700">30-Day Warranty</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">

                    {/* Detailed Breakdown Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* Selected Service Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center p-3 border border-slate-50">
                                        <Image
                                            src={category.image.imageUrl}
                                            alt={category.name}
                                            width={48}
                                            height={48}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Service Category</p>
                                        <h3 className="text-xl font-bold text-slate-900">{category.name} Repair</h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Issues</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedProblems.map((problem) => (
                                            <div key={problem.id} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 group transition-colors">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border border-slate-100">
                                                    <Image
                                                        src={problem.image.imageUrl}
                                                        alt={problem.name}
                                                        width={28}
                                                        height={28}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-700">{problem.name}</span>
                                                    <span className="text-[9px] font-bold text-primary/70 uppercase">Identified</span>
                                                </div>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Important Info Footer */}
                            <div className="bg-blue-50/30 p-5 px-6 border-t border-slate-100 flex items-start gap-3">
                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    <span className="font-bold text-slate-700">Note:</span> If no repair is performed after diagnosis, only the <span className="text-primary font-bold">₹{inspectionFee} visiting charge</span> will be applicable.
                                </p>
                            </div>
                        </div>

                        {/* Feature Highlights Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Clock, title: "60 Min Visit", desc: " Bihar's fastest response", color: "text-indigo-600", bg: "bg-indigo-50/50" },
                                { icon: Shield, title: "Spare Warranty", desc: "Genuine parts coverage", color: "text-emerald-600", bg: "bg-emerald-50/50" },
                                { icon: Zap, title: "Transparent", desc: "No hidden costs guaranteed", color: "text-amber-600", bg: "bg-amber-50/50" }
                            ].map((f, i) => (
                                <div key={i} className={cn("p-5 rounded-2xl border border-transparent transition-all", f.bg)}>
                                    <f.icon className={cn("w-6 h-6 mb-3", f.color)} />
                                    <h5 className={cn("text-xs font-bold uppercase tracking-tight mb-1", f.color)}>{f.title}</h5>
                                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sticky Price Column */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden">
                                <div className="p-6 border-b border-slate-50">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-primary" />
                                        Payment Estimate
                                    </h2>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-semibold">Visiting Charges</span>
                                            <div className="flex items-center font-bold text-slate-800">
                                                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                {inspectionFee}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-semibold">Repair Fee Estimation</span>
                                            <div className="flex items-center font-bold text-slate-800">
                                                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                {totalRepairCost}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-primary uppercase tracking-tight">Total Estimate</span>
                                                <div className="flex items-center text-2xl font-bold text-primary tracking-tight">
                                                    <IndianRupee className="w-5 h-5 mr-0.5" />
                                                    {totalEstimatedPrice}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium">Estimated final amount payable after service</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleConfirmVisit}
                                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm tracking-wide shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
                                    >
                                        CONFIRM BOOKING
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>

                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Pay After Service</p>
                                    </div>
                                </div>
                            </div>

                            {/* Loyalty/Referral Hint */}
                            <div className="bg-slate-900 p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h5 className="text-white text-xs font-bold tracking-tight">Refer & Earn ₹50</h5>
                                        <p className="text-white/40 text-[10px] font-medium">Share with friends and family</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
