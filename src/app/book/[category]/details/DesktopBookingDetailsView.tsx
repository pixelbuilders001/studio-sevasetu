'use client';

import { ServiceCategory, Problem } from '@/lib/data';
import { ArrowLeft, Clock, ShieldCheck, MapPin, Calendar, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesktopBookingForm } from '@/components/DesktopBookingForm';

interface DesktopBookingDetailsViewProps {
    category: ServiceCategory;
    problemIds: string;
    inspectionFee: number;
    totalRepairCost: number;
    totalEstimatedPrice: number;
    gstAmount: number;
    grandTotal: number;
    selectedProblems: Problem[];
    router: any;
}

export default function DesktopBookingDetailsView({
    category,
    problemIds,
    inspectionFee,
    totalRepairCost,
    totalEstimatedPrice,
    gstAmount,
    grandTotal,
    selectedProblems,
    router
}: DesktopBookingDetailsViewProps) {
    return (
        <div className="min-h-screen bg-slate-50/20 pt-8 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Navigation & Header */}
                <div className="mb-0">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-semibold text-xs uppercase tracking-wider mb-4 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to estimate
                    </button>
                    <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                                Final <span className="text-primary">Booking Details</span>
                            </h1>
                            {/* <p className="text-slate-500 text-sm">Provide your contact and service address to confirm.</p> */}
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-none mb-0.5">Security</p>
                                    <p className="text-xs font-bold text-slate-700">Protected Booking</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                <Clock className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-none mb-0.5">Availability</p>
                                    <p className="text-xs font-bold text-slate-700">Verified Pros</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Form Sections */}
                        <div className="lg:col-span-12">
                            <DesktopBookingForm
                                categoryId={category.id}
                                problemIds={problemIds}
                                inspectionFee={inspectionFee}
                                totalEstimatedPrice={totalEstimatedPrice}
                                gstAmount={gstAmount}
                                grandTotal={grandTotal}
                                categoryName={category.name}
                                selectedProblems={selectedProblems}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
