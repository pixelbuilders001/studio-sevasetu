'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Smartphone, Apple, PlayCircle, Sparkles, Zap, BellRing, Share2 } from 'lucide-react';
import ShareAppButton from '@/components/ShareAppButton';

function MobileBanner() {
    return (
        <section className="container mx-auto px-4 mt-6 mb-8 block md:hidden">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#1e1b4b] text-white p-6 shadow-lg">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/30 rounded-full blur-[60px] -mr-16 -mt-16 mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] -ml-16 -mb-16 mix-blend-screen" />

                <div className="relative z-10 flex flex-col-reverse items-center gap-6">

                    {/* Text Content */}
                    <div className="flex-1 text-center z-20 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4 text-primary"
                        >
                            <BellRing className="w-3 h-3 animate-bounce text-white" />
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">Launching Soon</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl font-black mb-3 leading-tight tracking-tight"
                        >
                            Everything Fix, <br />
                            <span className="text-indigo-200">In Your Pocket.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-indigo-200/80 text-xs font-medium max-w-md mx-auto mb-6 leading-relaxed line-clamp-2"
                        >
                            Book repairs, track status, and get instant support. All in one app.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-3"
                        >
                            {/* Play Store Button */}
                            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-[#1e1b4b] shadow-lg hover:bg-indigo-50 active:scale-95 transition-all duration-200 min-w-[130px]">
                                <Image
                                    src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                                    alt="Play Store"
                                    width={24}
                                    height={24}
                                    className="w-5 h-5"
                                />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Get it on</span>
                                    <span className="text-xs font-black tracking-tight">Google Play</span>
                                </div>
                            </button>

                            {/* App Store Button - Darker variant for contrast */}
                            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-950/50 border border-indigo-400/30 text-white shadow-lg hover:bg-indigo-900/60 active:scale-95 transition-all duration-200 min-w-[130px]">
                                <Apple className="w-5 h-5 fill-current" />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Download on</span>
                                    <span className="text-xs font-black tracking-tight">App Store</span>
                                </div>
                            </button>
                        </motion.div>
                    </div>

                    {/* Phone Mockup Image */}
                    <div className="relative w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30, rotate: 6 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="relative z-10 w-[180px] aspect-[1/2] -mb-20 rotate-6"
                        >
                            {/* Phone Frame */}
                            <div className="absolute inset-0 bg-[#0f172a] rounded-[2rem] border-[6px] border-[#1e1b4b] shadow-2xl overflow-hidden ring-1 ring-white/10">
                                {/* Screen Content */}
                                <div className="relative h-full w-full bg-slate-900">
                                    <Image
                                        src="/hero-mobile-new.jpg"
                                        alt="App Screen"
                                        fill
                                        className="object-cover opacity-80"
                                    />
                                    {/* Overlay UI elements to make it look like an app */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />

                                    {/* Fake App UI */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white/80">
                                        <div className="w-8 h-1 bg-white/30 rounded-full" />
                                    </div>

                                    <div className="absolute bottom-8 inset-x-4">
                                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 mb-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                <Smartphone className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="h-2 w-16 bg-white/40 rounded-full mb-1" />
                                                <div className="h-1.5 w-10 bg-white/20 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Glow behind phone */}
                        <div className="absolute inset-0 bg-indigo-500/30 blur-[40px] rounded-full z-0 transform translate-y-10 scale-75" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function DesktopBanner() {
    return (
        <section className="container mx-auto px-4 md:px-8 mt-6 md:mt-16 mb-8 hidden md:block">
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-[#1e1b4b] text-white p-6 md:p-10 group shadow-lg">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-primary/30 rounded-full blur-[60px] md:blur-[120px] -mr-16 -mt-16 md:-mr-32 md:-mt-32 mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[60px] md:blur-[120px] -ml-16 -mb-16 md:-ml-32 md:-mb-32 mix-blend-screen" />

                <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-12">

                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left z-20 w-full md:w-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-5xl font-black mb-3 md:mb-6 leading-tight tracking-tight"
                        >
                            Everything Fix, <br />
                            <span className="text-indigo-200">In Your Pocket.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-indigo-200/80 text-xs md:text-lg font-medium max-w-md mx-auto md:mx-0 mb-6 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-none"
                        >
                            Book repairs, track status, and get instant support. All in one app.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center md:justify-start gap-3"
                        >
                            {/* Play Store Button */}
                            <button className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-xl bg-white text-[#1e1b4b] shadow-lg hover:bg-indigo-50 active:scale-95 transition-all duration-200 min-w-[130px] md:min-w-[160px]">
                                <Image
                                    src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                                    alt="Play Store"
                                    width={24}
                                    height={24}
                                    className="w-5 h-5 md:w-7 md:h-7"
                                />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider opacity-60">Get it on</span>
                                    <span className="text-xs md:text-base font-black tracking-tight">Google Play</span>
                                </div>
                            </button>

                            {/* App Store Button - Darker variant for contrast */}
                            <button className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-xl bg-indigo-950/50 border border-indigo-400/30 text-white shadow-lg hover:bg-indigo-900/60 active:scale-95 transition-all duration-200 min-w-[130px] md:min-w-[160px]">
                                <Apple className="w-5 h-5 md:w-7 md:h-7 fill-current" />
                                <div className="text-left flex flex-col leading-none">
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider opacity-60">Download on</span>
                                    <span className="text-xs md:text-base font-black tracking-tight">App Store</span>
                                </div>
                            </button>
                        </motion.div>
                    </div>

                    {/* Phone Mockup Image */}
                    <div className="relative w-full md:w-auto flex justify-center md:block">
                        <motion.div
                            initial={{ opacity: 0, y: 30, rotate: 6 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="relative z-10 w-[180px] md:w-[320px] aspect-[1/2] -mb-20 md:-mb-32 md:-mr-10 rotate-6"
                        >
                            {/* Phone Frame */}
                            <div className="absolute inset-0 bg-[#0f172a] rounded-[2rem] md:rounded-[3rem] border-[6px] md:border-[10px] border-[#1e1b4b] shadow-2xl overflow-hidden ring-1 ring-white/10">
                                {/* Screen Content */}
                                <div className="relative h-full w-full bg-slate-900">
                                    <Image
                                        src="/hero-mobile-new.jpg" // Using existing hero image as placeholder app screen
                                        alt="App Screen"
                                        fill
                                        className="object-cover opacity-80"
                                    />
                                    {/* Overlay UI elements to make it look like an app */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />

                                    {/* Fake App UI */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white/80">
                                        <div className="w-8 h-1 bg-white/30 rounded-full" />
                                    </div>

                                    <div className="absolute bottom-8 inset-x-4">
                                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 mb-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                <Smartphone className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="h-2 w-16 bg-white/40 rounded-full mb-1" />
                                                <div className="h-1.5 w-10 bg-white/20 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Glow behind phone */}
                        <div className="absolute inset-0 bg-indigo-500/30 blur-[40px] rounded-full z-0 transform translate-y-10 scale-75" />
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
