'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Smartphone, Apple, PlayCircle, Sparkles, Zap, BellRing } from 'lucide-react';

export default function AppDownloadBanner() {
    return (
        <section className="container mx-auto mb-12 px-4 md:px-8 mt-12 md:mt-24">
            <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-[#1e1b4b] text-white p-6 md:py-8 px-12 group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -mr-36 -mt-36 group-hover:bg-primary/30 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] -ml-36 -mb-36" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-20">
                    <div className="max-w-2xl text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 md:mb-8 text-primary"
                        >
                            <BellRing className="w-3.5 h-3.5 animate-bounce" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Launching Soon</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl md:text-5xl font-black mb-4 md:mb-6 leading-tight tracking-tighter"
                        >
                            Everything <span className="text-primary italic">Fix</span>, <br className="hidden md:block" /> in your <span className="text-indigo-200">Pocket.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white/60 text-sm md:text-lg font-medium max-w-md mb-8 md:mb-10 leading-relaxed"
                        >
                            Revolutionizing repairs with Bihar&apos;s most trusted certified technicians. Affordable, fast & guaranteed.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6"
                        >
                            {/* App Store Coming Soon */}
                            <div className="flex items-center gap-3 px-5 md:px-6 py-3 rounded-xl md:rounded-2xl bg-white text-slate-900 shadow-lg group/btn transition-all hover:-translate-y-1">
                                <Apple className="w-5 h-5 md:w-6 md:h-6" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Soon on</p>
                                    <p className="text-xs md:text-sm font-black tracking-tight">App Store</p>
                                </div>
                            </div>

                            {/* Play Store Coming Soon */}
                            <div className="flex items-center gap-3 px-5 md:px-6 py-3 rounded-xl md:rounded-2xl bg-slate-800 text-white shadow-lg group/btn transition-all hover:-translate-y-1 border border-white/5">
                                <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black uppercase tracking-wider text-white/40">Soon on</p>
                                    <p className="text-xs md:text-sm font-black tracking-tight">Play Store</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* App Preview Placeholder Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, type: "spring", damping: 15 }}
                        className="relative w-full max-w-[200px] md:max-w-[240px]"
                    >
                        <div className="relative aspect-[10/19] rounded-[2.5rem] border-[6px] border-white/10 shadow-2xl overflow-hidden bg-slate-900 group-hover:border-white/20 transition-colors">
                            {/* App Content: Hero Image/Video */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/hero-video.webp"
                                    alt="App Preview"
                                    fill
                                    className="object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-black/20" />
                            </div>

                            {/* App UI Overlay */}
                            <div className="absolute inset-0 z-10 p-4">
                                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                                {/* Floating Logo */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 rotate-12 transition-transform group-hover:rotate-0 duration-700">
                                        <Smartphone className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-4 right-4 space-y-2">
                                    <div className="w-2/3 h-2 bg-white/20 rounded-full" />
                                    <div className="w-full h-2 bg-white/10 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute -top-4 -right-4 bg-white p-3 rounded-[1.5rem] shadow-xl text-slate-900 rotate-12 hover:rotate-0 transition-transform duration-500 border border-slate-100 hidden md:block">
                            <p className="text-[8px] font-black uppercase tracking-widest text-primary">Vip Access</p>
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-primary p-3 rounded-[1.5rem] shadow-xl text-white -rotate-12 hover:rotate-0 transition-transform duration-500 hidden md:block">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
