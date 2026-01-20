'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, IndianRupee, Sparkles, Zap, ShieldCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/data';
import { useLocation } from '@/context/LocationContext';
import { Button } from '@/components/ui/button';

interface ServicesMegaMenuProps {
    isOpen: boolean;
    categories: ServiceCategory[];
    onClose: () => void;
}

export default function ServicesMegaMenu({ isOpen, categories, onClose }: ServicesMegaMenuProps) {
    const { location } = useLocation();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/5 backdrop-blur-[1px] z-40"
                    />

                    {/* Menu Content Container - Centered and matching header style */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -10, x: "-50%" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed left-1/2 top-[24px] w-full max-w-6xl bg-white rounded-b-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-50 overflow-hidden border border-slate-100"
                    >
                        <div className="px-8 pb-10 pt-[80px] max-h-[calc(100vh-40px)] overflow-y-auto">
                            {/* Categories Grid - Myntra style (compact columns) */}
                            <div className="grid grid-cols-5 gap-x-8 gap-y-10">
                                {categories.map((category) => (
                                    <div key={category.id} className="space-y-4">
                                        <Link
                                            href={`/book/${category.slug}`}
                                            onClick={onClose}
                                            className="group flex items-center gap-2"
                                        >
                                            <h3 className="text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.15em] border-b-2 border-transparent group-hover:border-primary group-hover:text-primary transition-all pb-0.5">
                                                {category.name}
                                            </h3>
                                        </Link>

                                        <ul className="space-y-2">
                                            {category.problems.slice(0, 3).map((problem) => (
                                                <li key={problem.id}>
                                                    <Link
                                                        href={`/book/${category.slug}?problems=${problem.id}`}
                                                        onClick={onClose}
                                                        className="text-[11px] font-medium text-slate-500 hover:text-primary transition-colors block leading-tight"
                                                    >
                                                        {problem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <Link
                                                    href={`/book/${category.slug}`}
                                                    onClick={onClose}
                                                    className="text-[9px] font-black text-primary/60 hover:text-primary transition-all uppercase tracking-wider"
                                                >
                                                    + More Repair
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* bottom features - Compact */}
                            <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    {[
                                        { label: "30-Day Warranty", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> },
                                        { label: "Genuine Spares", icon: <Zap className="w-3.5 h-3.5 text-primary" /> },
                                        { label: "Price Guarantee", icon: <IndianRupee className="w-3.5 h-3.5 text-indigo-100" /> }
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            {badge.icon}
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{badge.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/#how-it-works"
                                    onClick={onClose}
                                    className="text-[9px] font-black text-slate-900 hover:text-primary transition-all flex items-center gap-2 uppercase tracking-widest group"
                                >
                                    How it works
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
