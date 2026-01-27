'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, HelpCircle, Package, IndianRupee, Info, Search, Camera, Plus, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Problem, ServiceCategory } from '@/lib/data';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';

type ClientCategory = Omit<ServiceCategory, 'icon'> & { iconName: string };

interface DesktopProblemSelectionProps {
    category: ClientCategory;
    translatedCategory: any;
    selectedProblems: Problem[];
    toggleProblemSelection: (problem: Problem) => void;
    handleBookRepair: () => void;
    router: any;
    technicians?: any[];
    isTechniciansLoading?: boolean;
}


export default function DesktopProblemSelection({
    category,
    translatedCategory,
    selectedProblems,
    toggleProblemSelection,
    handleBookRepair,
    router,
    technicians = [],
    isTechniciansLoading = false
}: DesktopProblemSelectionProps) {
    const { t } = useTranslation();
    const { location } = useLocation();
    const { setMedia, setSecondaryMedia } = useBooking();

    // Photo upload state
    const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null]);
    const photoInputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const inspectionFee = category.base_inspection_fee * location.inspection_multiplier;

    // Photo upload handlers
    const handlePhotoSlotClick = (index: number) => {
        photoInputsRef.current[index]?.click();
    };

    const handlePhotoChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (index === 0) {
            setMedia(file || null);
        } else if (index === 1) {
            setSecondaryMedia(file || null);
        }

        setPhotoPreviews((prev) => {
            const updated = [...prev];
            if (updated[index]) {
                URL.revokeObjectURL(updated[index] as string);
            }
            updated[index] = file ? URL.createObjectURL(file) : null;
            return updated;
        });
    };

    // Filter problems to show only 4 (3 primary + 1 "other")
    const problems = translatedCategory?.problems ?? [];
    const otherProblem = problems.find((p: Problem) =>
        p.name.toLowerCase().includes('other') || p.name.toLowerCase().includes('not sure')
    );
    const primaryProblems = problems.filter((p: Problem) => p.id !== otherProblem?.id).slice(0, 3);
    const displayProblems = [...primaryProblems, ...(otherProblem ? [otherProblem] : [])];

    return (
        <div className="min-h-screen bg-slate-50/20">
            <div className="container mx-auto px-6 max-w-7xl pt-8">

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

                <div className="grid grid-cols-12 gap-8 pb-20">

                    {/* Main Issues Grid */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* Visual Diagnosis Upload Section */}
                        <section className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Visual diagnosis</p>
                                </div>
                                <span className="text-xs text-slate-400">Upload up to 2 photos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[0, 1].map((slot) => (
                                    <div
                                        key={slot}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handlePhotoSlotClick(slot)}
                                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handlePhotoSlotClick(slot)}
                                        className={cn(
                                            "group relative aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 overflow-hidden cursor-pointer",
                                            photoPreviews[slot] ? "border-primary bg-white" : ""
                                        )}
                                    >
                                        {photoPreviews[slot] ? (
                                            <>
                                                <Image
                                                    src={photoPreviews[slot] as string}
                                                    alt={`Photo ${slot + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-semibold text-slate-700">
                                                    Retake
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm">
                                                    <Camera className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Add photo</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 text-center px-4 leading-tight">
                                                    Click to upload
                                                </p>
                                            </>
                                        )}
                                        <input
                                            ref={(el) => {
                                                photoInputsRef.current[slot] = el;
                                                return undefined;
                                            }}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handlePhotoChange(slot, e)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Problems Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displayProblems.map((problem: Problem, index: number) => {
                                const isSelected = selectedProblems.some((p) => p.id === problem.id);
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
                                                        src={problem.image.imageUrl ? problem.image.imageUrl : '/logo-image.png'}
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
                                                <p className="text-xs text-slate-500">Click to select this issue</p>
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

                        {/* Available Pros Nearby */}
                        {(isTechniciansLoading || technicians.length > 0) && (
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                            {category.name} Expert Near You
                                        </p>
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Live near you
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {isTechniciansLoading ? (
                                        [1, 2].map((i) => (
                                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 animate-pulse">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-200 rounded w-24" />
                                                    <div className="h-3 bg-slate-200 rounded w-16" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        technicians.map((tech) => (
                                            <div key={tech.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex flex-col gap-4 group hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-full ring-4 ring-slate-50 shadow-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                            <Image
                                                                src={tech.selfie_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                                                alt={tech.full_name}
                                                                fill
                                                                className="object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <span className="absolute -right-0.5 -bottom-0.5 bg-primary text-white p-1 rounded-full ring-2 ring-white">
                                                            <CheckCircle className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-base text-[#1e1b4b]">{tech.full_name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={cn("w-3.5 h-3.5", i < 4 ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")} />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-600">4.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                            <Star className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Experience</p>
                                                            <p className="text-xs font-black text-slate-700">{tech.total_experience}+ Years</p>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Verified Pro
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Sticky Summary Card */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-6">
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
                                                <span className="text-slate-500 font-semibold">Inspection Fee</span>
                                                <div className="flex items-center text-lg font-bold text-primary tracking-tight">
                                                    <IndianRupee className="w-4 h-4 mr-0.5" />
                                                    {inspectionFee}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleBookRepair}
                                                className="w-full h-12 rounded-xl bg-[#1e1b4b] hover:bg-primary text-white font-black text-xs tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] uppercase"
                                            >
                                                CONTINUE
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>

                                            <p className="text-[10px] text-center text-slate-400 font-medium">Repair charges will be estimated in the next step</p>
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
