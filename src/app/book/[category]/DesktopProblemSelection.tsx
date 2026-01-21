'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, HelpCircle, Package, IndianRupee, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Problem, ServiceCategory } from '@/lib/data';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';

type ClientCategory = Omit<ServiceCategory, 'icon'> & { iconName: string };

interface DesktopProblemSelectionProps {
    category: ClientCategory;
    translatedCategory: any;
    selectedProblems: Problem[];
    toggleProblemSelection: (problem: Problem) => void;
    handleBookRepair: () => void;
    router: any;
}

export default function DesktopProblemSelection({
    category,
    translatedCategory,
    selectedProblems,
    toggleProblemSelection,
    handleBookRepair,
    router
}: DesktopProblemSelectionProps) {
    const { t } = useTranslation();
    const { location } = useLocation();

    const totalEstimatedCost = selectedProblems.reduce((acc, p) => acc + (p.base_min_fee * location.repair_multiplier), 0);

    return (
        <div className="min-h-screen bg-slate-50/20 pt-8 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-semibold text-xs uppercase tracking-wider mb-4 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to categories
                    </button>
                    <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                                Select issues for <span className="text-primary">{category.name}</span>
                            </h1>
                            <p className="text-slate-500 text-sm">Choose all applicable problems for an accurate estimate.</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div className="pr-2">
                                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-none mb-0.5">Category</p>
                                <p className="text-xs font-bold text-slate-700">{category.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">

                    {/* Main Issues Grid */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {translatedCategory.problems.map((problem: Problem, index: number) => {
                                const isSelected = selectedProblems.some((p) => p.id === problem.id);
                                const dynamicPrice = problem.base_min_fee * location.repair_multiplier;
                                const isOther = problem.name.toLowerCase().includes('other') || problem.name.toLowerCase().includes('not sure');

                                return (
                                    <motion.div
                                        key={problem.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        onClick={() => toggleProblemSelection(problem)}
                                        className={cn(
                                            "group relative overflow-hidden bg-white p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm",
                                            isSelected
                                                ? "border-primary ring-1 ring-primary/10 bg-primary/[0.01]"
                                                : "border-slate-100 hover:border-primary/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "relative w-16 h-16 rounded-xl flex items-center justify-center p-3 transition-all duration-200",
                                                isSelected ? "bg-primary/5 shadow-inner" : "bg-slate-50 group-hover:bg-primary/5"
                                            )}>
                                                {isOther ? (
                                                    <HelpCircle className="w-8 h-8 text-slate-300" />
                                                ) : (
                                                    <Image
                                                        src={problem.image.imageUrl}
                                                        alt={problem.name}
                                                        fill
                                                        className="object-contain p-3"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-grow space-y-1">
                                                <h3 className={cn(
                                                    "font-bold text-sm lg:text-base transition-colors",
                                                    isSelected ? "text-primary" : "text-slate-700"
                                                )}>
                                                    {problem.name}
                                                </h3>
                                                {problem.base_min_fee > 0 && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">Est. Fee:</span>
                                                        <div className="flex items-center text-primary font-bold text-xs">
                                                            <IndianRupee className="w-3 h-3" />
                                                            <span>{dynamicPrice}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                                isSelected
                                                    ? "bg-primary border-primary"
                                                    : "border-slate-200 bg-white group-hover:border-primary/30"
                                            )}>
                                                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sticky Summary Card */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden">
                                <div className="p-6 border-b border-slate-50">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-primary" />
                                        Booking Summary
                                    </h2>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Issues Selected ({selectedProblems.length})</p>
                                        <AnimatePresence mode="popLayout">
                                            {selectedProblems.length > 0 ? (
                                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                    {selectedProblems.map((p) => (
                                                        <motion.div
                                                            key={p.id}
                                                            initial={{ opacity: 0, x: -5 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 5 }}
                                                            className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">{p.name}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleProblemSelection(p);
                                                                }}
                                                                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                Remove
                                                            </button>
                                                        </motion.div>
                                                    ))}

                                                </div>
                                            ) : (
                                                <div className="py-8 text-center border border-dashed border-slate-100 rounded-xl">
                                                    <p className="text-xs text-slate-400 italic">No issues selected yet</p>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {selectedProblems.length > 0 && (
                                        <div className="pt-6 border-t border-slate-50 space-y-5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-semibold">Min. Est. Repair Cost</span>
                                                <div className="flex items-center text-lg font-bold text-primary tracking-tight">
                                                    <IndianRupee className="w-4 h-4 mr-0.5" />
                                                    {totalEstimatedCost}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleBookRepair}
                                                className="w-full h-12 rounded-xl bg-[#1e1b4b] hover:bg-primary text-white font-black text-xs tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] uppercase"
                                            >
                                                CONTINUE
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>

                                            <p className="text-[10px] text-center text-slate-400 font-medium">Visiting charges will be added in the next step</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Informational Panel */}
                            <div className="bg-blue-50/30 border border-blue-100/50 p-5 rounded-xl flex items-start gap-3">
                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    The repair fee shown is estimated and may vary based on exact parts required after diagnosis.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
