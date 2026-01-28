'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ChevronRight, Star, Clock, Mic, Command } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategoriesAction } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import FullScreenLoader from './FullScreenLoader';

interface SearchResult {
    type: 'category' | 'problem';
    id: string;
    name: string;
    categoryName: string;
    categorySlug: string;
    description?: string;
    categoryIcon: string;
    problemId?: string;
}

export default function DesktopSearch() {
    const { t } = useTranslation();
    const router = useRouter();
    const { isServiceable, setDialogOpen } = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['service-categories'],
        queryFn: getServiceCategoriesAction,
    });

    const results = useMemo(() => {
        if (!searchQuery.trim() || categories.length === 0) return [];

        const query = searchQuery.toLowerCase().trim();
        const keywords = query.split(/\s+/).filter(word => word.length > 2);

        const foundResults: SearchResult[] = [];
        const seenIds = new Set<string>();

        const matchesQuery = (text: string | undefined) => {
            if (!text) return false;
            const lowerText = text.toLowerCase();
            if (lowerText.includes(query)) return true;
            return keywords.some(word => lowerText.includes(word));
        };

        categories.forEach(cat => {
            if (matchesQuery(cat.name)) {
                const resultId = `category-${cat.id}`;
                if (!seenIds.has(resultId)) {
                    foundResults.push({
                        type: 'category',
                        id: cat.id,
                        name: cat.name,
                        categoryName: cat.name,
                        categorySlug: cat.slug,
                        categoryIcon: cat.image.imageUrl
                    });
                    seenIds.add(resultId);
                }
            }

            cat.problems?.forEach(prob => {
                if (matchesQuery(prob.name)) {
                    const resultId = `problem-${prob.id}`;
                    if (!seenIds.has(resultId)) {
                        foundResults.push({
                            type: 'problem',
                            id: prob.id,
                            name: prob.name,
                            categoryName: cat.name,
                            categorySlug: cat.slug,
                            categoryIcon: cat.image.imageUrl,
                            problemId: prob.id
                        });
                        seenIds.add(resultId);
                    }
                }
            });
        });

        return foundResults.slice(0, 6);
    }, [searchQuery, categories]);

    const handleResultClick = (result: SearchResult) => {
        if (!isServiceable) {
            setDialogOpen(true);
            return;
        }

        setIsNavigating(true);
        setIsFocused(false);

        const path = result.type === 'category'
            ? `/book/${result.categorySlug}`
            : `/book/${result.categorySlug}/estimate?problems=${result.problemId}`;

        setTimeout(() => {
            router.push(path);
        }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && selectedIndex < results.length) {
                handleResultClick(results[selectedIndex]);
            } else if (results.length > 0) {
                handleResultClick(results[0]);
            }
        } else if (e.key === 'Escape') {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [results]);

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl group">
            {isNavigating && <FullScreenLoader />}

            {/* Search Input Container */}
            <motion.div
                animate={{
                    scale: isFocused ? 1.01 : 1,
                    y: isFocused ? -2 : 0
                }}
                className={cn(
                    "relative flex items-center bg-white/10 backdrop-blur-3xl border transition-all duration-500 rounded-[1.5rem] px-6 py-4",
                    isFocused
                        ? "border-primary/40 shadow-[0_20px_80px_-15px_rgba(99,102,241,0.25)] bg-white/20"
                        : "border-white/10 shadow-2xl hover:bg-white/15"
                )}
            >
                <Search className={cn(
                    "w-6 h-6 transition-colors duration-500",
                    isFocused ? "text-primary" : "text-white/30"
                )} />

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for repair services... (e.g. AC Repair, iPhone Screen)"
                    value={searchQuery}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 px-4 text-lg font-bold tracking-tight"
                />

                <div className="flex items-center gap-3">
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="p-1 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <button className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Results Dropdown */}
            <AnimatePresence>
                {isFocused && (searchQuery.trim() || results.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 15, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 right-0 top-full z-[100] bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            {results.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recommended Services</span>
                                        <span className="text-[10px] font-bold text-slate-300">{results.length} results</span>
                                    </div>
                                    <div className="space-y-1">
                                        {results.map((result, index) => (
                                            <motion.div
                                                key={`${result.type}-${result.id}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleResultClick(result)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={cn(
                                                    "group flex items-center gap-5 p-4 rounded-[1.75rem] cursor-pointer transition-all duration-200",
                                                    selectedIndex === index ? "bg-indigo-50/50 shadow-inner" : "hover:bg-slate-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center relative flex-shrink-0 transition-all",
                                                    selectedIndex === index ? "bg-white scale-105 shadow-md" : "bg-slate-50"
                                                )}>
                                                    <Image
                                                        src={result.categoryIcon}
                                                        alt={result.categoryName}
                                                        fill
                                                        className="object-contain p-2.5"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-colors shrink-0",
                                                            selectedIndex === index ? "bg-primary text-white" : "bg-indigo-50 text-indigo-600"
                                                        )}>
                                                            {result.type === 'category' ? 'Service' : 'Repair'}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 capitalize truncate">
                                                            in {result.categoryName}
                                                        </span>
                                                    </div>
                                                    <div className='flex items-left gap-2'>
                                                        <span className="font-black md:align-left text-base text-slate-800 tracking-tight leading-none truncate mt-0.5">
                                                            {result.name}
                                                        </span>
                                                    </div>

                                                </div>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-all",
                                                    selectedIndex === index ? "bg-primary border-primary text-white translate-x-1" : "bg-white text-slate-300"
                                                )}>
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            ) : searchQuery.trim() ? (
                                <div className="py-12 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <h3 className="font-black text-slate-800 mb-1">No services found</h3>
                                    <p className="text-sm text-slate-400 font-bold px-8">We couldn't find any results for "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {categories.slice(0, 4).map((cat, idx) => (
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
                                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:shadow-sm transition-all group"
                                            >
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Image src={cat.image.imageUrl} alt={cat.name} width={24} height={24} className="object-contain" />
                                                </div>
                                                <span className="text-xs font-black text-slate-700">{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Tips */}
                        {/* <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-black shadow-sm">↑↓</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Navigate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-black shadow-sm">ENTER</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Select</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-black shadow-sm">ESC</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Close</span>
                            </div>
                        </div> */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
