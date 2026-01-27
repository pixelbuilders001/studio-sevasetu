'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    SheetHeader,
    SheetTitle,
    SheetContent,
} from '@/components/ui/sheet';
import { Search, X, ChevronRight, Star, Clock, ShieldCheck, MapPin, ArrowLeft, Mic } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategoriesAction } from '@/app/actions';
import { ServiceCategory } from '@/lib/data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import FullScreenLoader from './FullScreenLoader';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface SearchResult {
    type: 'category' | 'problem';
    id: string;
    name: string;
    categoryName: string;
    categorySlug: string;
    icon?: string;
    categoryIcon: string;
    problemId?: string;
}

export default function GlobalSearchSheet() {
    const { t, language } = useTranslation();
    const router = useRouter();
    const { isServiceable, setDialogOpen } = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [isNavigating, setIsNavigating] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Voice recognition logic
    const startVoiceSearch = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const { data: categories = [], isLoading: loading } = useQuery({
        queryKey: ['service-categories'],
        queryFn: getServiceCategoriesAction,
    });

    const results = useMemo(() => {
        if (!searchQuery.trim() || categories.length === 0) return [];

        const query = searchQuery.toLowerCase();
        const foundResults: SearchResult[] = [];

        categories.forEach(cat => {
            // Match Category
            if (cat.name.toLowerCase().includes(query)) {
                foundResults.push({
                    type: 'category',
                    id: cat.id,
                    name: cat.name,
                    categoryName: cat.name,
                    categorySlug: cat.slug,
                    categoryIcon: cat.image.imageUrl
                });
            }

            // Match Problems
            cat.problems?.forEach(prob => {
                if (prob.name.toLowerCase().includes(query)) {
                    foundResults.push({
                        type: 'problem',
                        id: prob.id,
                        name: prob.name,
                        categoryName: cat.name,
                        categorySlug: cat.slug,
                        categoryIcon: cat.image.imageUrl,
                        problemId: prob.id
                    });
                }
            });
        });

        return foundResults.slice(0, 10); // Limit results for performance
    }, [searchQuery, categories]);

    const handleResultClick = (result: SearchResult) => {
        if (!isServiceable) {
            setDialogOpen(true);
            return;
        }

        setIsNavigating(true);
        // Manual sheet close workaround
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        const path = result.type === 'category'
            ? `/book/${result.categorySlug}`
            : `/book/${result.categorySlug}/estimate?problems=${result.problemId}`;

        setTimeout(() => {
            router.push(path);
        }, 100);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {isNavigating && <FullScreenLoader />}

            {/* Search Header */}
            <div className="px-4 pt-6 pb-4 border-b border-slate-100 sticky top-0 bg-white z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all outline-none"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search for repair services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-slate-50 border-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/20 text-sm font-medium"
                        />
                        {searchQuery ? (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 z-10"
                            >
                                <X className="h-3 w-3 text-slate-500" />
                            </button>
                        ) : (
                            <button
                                onClick={startVoiceSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-200 text-primary active:scale-95 transition-all z-10"
                            >
                                <Mic className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
                {!searchQuery.trim() ? (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                                Popular Searches
                            </h4>
                            <div className="flex flex-wrap gap-2 px-1">
                                {['AC Service', 'Screen Repair', 'Motor Repair', 'Water Tank'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        className="px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 active:scale-95 transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Service Categories (as mini cards) */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                                Quick Access
                            </h4>
                            <div className="grid grid-cols-2 gap-3 pb-4">
                                {categories.slice(0, 4).map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => handleResultClick({
                                            type: 'category',
                                            id: cat.id,
                                            name: cat.name,
                                            categoryName: cat.name,
                                            categorySlug: cat.slug,
                                            categoryIcon: cat.image.imageUrl
                                        })}
                                        className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                            <Image src={cat.image.imageUrl} alt={cat.name} width={24} height={24} className="object-contain" />
                                        </div>
                                        <span className="text-[11px] font-black text-slate-700 leading-tight line-clamp-2">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                            Recommended for you
                        </h4>
                        {results.map((result) => (
                            <div
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleResultClick(result)}
                                className="group bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm hover:border-primary/20 hover:shadow-md transition-all active:scale-[0.98]"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center p-2 relative flex-shrink-0 overflow-hidden group-hover:bg-indigo-50 transition-colors">
                                    <Image
                                        src={result.categoryIcon}
                                        alt={result.categoryName}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-[8px] font-black uppercase tracking-wider text-indigo-600">
                                            {result.type === 'category' ? 'Service' : 'Problem'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 capitalize">
                                            in {result.categoryName}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-sm text-slate-800 leading-tight">
                                        {result.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-bold">
                                        <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 4.8</span>
                                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> 60 Min</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-slate-200" />
                        </div>
                        <h3 className="text-base font-black text-slate-800 mb-2">No results found</h3>
                        <p className="text-xs text-slate-400 font-medium">
                            We couldn't find any services matching "{searchQuery}". Try something else or browse popular repairs.
                        </p>
                    </div>
                )}
            </div>
            {/* Listening Overlay */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                        <div className="relative mb-8">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20"
                            >
                                <Mic className="w-10 h-10 text-primary" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 rounded-full bg-primary/20"
                            />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mb-2">Listening...</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">Try saying "AC Repair" or "Mobile Screen"</p>

                        <button
                            onClick={() => setIsListening(false)}
                            className="mt-12 px-8 py-3 rounded-full bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
