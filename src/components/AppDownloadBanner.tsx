'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Smartphone, Apple, PlayCircle, Sparkles, Zap, BellRing, Share2 } from 'lucide-react';
import ShareAppButton from '@/components/ShareAppButton';

function MobileBanner() {
    return (
        <section className="container mx-auto px-4 mt-12 mb-12 block md:hidden">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white p-7 shadow-2xl">
                {/* Decorative Glows */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[50px] -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-200/10 rounded-full blur-[50px] -ml-10 -mb-10" />

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Text Content */}
                    <div className="z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4"
                        >
                            <BellRing className="w-3 h-3 text-white animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Launching Soon</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-black mb-3 leading-[1.1] tracking-tight"
                        >
                            Everything Fix, <br />
                            In Your Pocket.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col gap-3 mt-6"
                        >
                            {/* Google Play Button */}
                            <button className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/90 border border-white/10 text-white backdrop-blur-md active:scale-95 transition-all w-full max-w-[170px]">
                                <Image
                                    src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                                    alt="Play Store"
                                    width={22}
                                    height={22}
                                />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Get it on</span>
                                    <span className="text-sm font-black">Google Play</span>
                                </div>
                            </button>

                            {/* App Store Button */}
                            <button className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/90 border border-white/10 text-white backdrop-blur-md active:scale-95 transition-all w-full max-w-[170px]">
                                <Apple className="w-[22px] h-[22px] fill-current" />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Download on</span>
                                    <span className="text-sm font-black">App Store</span>
                                </div>
                            </button>
                        </motion.div>
                    </div>

                    {/* Phone Mockup - Aligned to bottom right for overlap */}
                    <div className="absolute top-4 -right-12 w-[160px] opacity-90">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="relative aspect-[1/2] rotate-12"
                        >
                            <div className="absolute inset-0 bg-[#0f172a] rounded-[2rem] border-[4px] border-[#1e1b4b] shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                                <div className="relative h-full w-full bg-slate-900">
                                    <Image
                                        src="/app-screen.jpg"
                                        alt="App Screen"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* App Icon Branding overlay if needed */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DesktopBanner() {
    return (
        <section className="container mx-auto px-8 mt-24 mb-24 hidden md:block">
            <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white p-12 lg:p-16 shadow-2xl group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/5 rounded-full blur-[100px] -ml-32 -mb-32" />

                <div className="relative z-10 flex items-center justify-between gap-12">
                    {/* Text Content */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-8"
                        >
                            <BellRing className="w-4 h-4 text-white animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-white">Launching Soon</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tight"
                        >
                            Everything Fix, <br />
                            In Your Pocket.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-lg font-medium max-w-lg mb-12 leading-relaxed"
                        >
                            Experience professional repairs with a single tap. Book repairs, track status, and get instant support.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-6"
                        >
                            {/* Play Store Button */}
                            <button className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/90 border border-white/10 text-white shadow-xl hover:bg-black active:scale-95 transition-all duration-300 min-w-[200px]">
                                <Image
                                    src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                                    alt="Play Store"
                                    width={28}
                                    height={28}
                                />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Get it on</span>
                                    <span className="text-xl font-black">Google Play</span>
                                </div>
                            </button>

                            {/* App Store Button */}
                            <button className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/90 border border-white/10 text-white shadow-xl hover:bg-black active:scale-95 transition-all duration-300 min-w-[200px]">
                                <Apple className="w-[28px] h-[28px] fill-current" />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Download on</span>
                                    <span className="text-xl font-black">App Store</span>
                                </div>
                            </button>
                        </motion.div>
                    </div>

                    {/* Phone Mockup Desktop */}
                    <div className="relative h-[550px] w-[300px] flex-shrink-0 mr-8 hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, y: 40, rotate: 5 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 5 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
                            className="relative z-10 h-full w-full rotate-5"
                        >
                            <div className="absolute inset-0 bg-[#0f172a] rounded-[3.5rem] border-[12px] border-[#1e1b4b] shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/20">
                                <div className="relative h-full w-full bg-slate-900">
                                    <Image
                                        src="/app-screen.jpg"
                                        alt="App Screen"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                        </motion.div>
                        {/* Shadow Glow */}
                        <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full -z-10 transform translate-y-12" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function AppDownloadBanner() {
    return (
        <>
            <MobileBanner />
            <DesktopBanner />
        </>
    );
}
