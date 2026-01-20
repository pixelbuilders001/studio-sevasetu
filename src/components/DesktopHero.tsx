'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Award, CheckCircle2 } from 'lucide-react';
import AnimatedHeroText from './AnimatedHeroText';
import HeroCTA from './HeroCTA';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';

export default function DesktopHero() {
    const trustCards = [
        {
            icon: Star,
            title: '4.9/5 Rating',
            desc: 'from 50k+ customers',
            color: 'bg-amber-500'
        },
        {
            icon: ShieldCheck,
            title: 'Verified Pros',
            desc: 'Expert & Background Verified',
            color: 'bg-emerald-500'
        },
        {
            icon: Clock,
            title: '60 Min Visit',
            desc: 'Guaranteed arrival time',
            color: 'bg-indigo-500'
        }
    ];

    return (
        <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden bg-[#1e1b4b]">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-video.webp"
                    alt="Hellofixo Premium Service"
                    fill
                    className="object-cover opacity-60"
                    unoptimized
                    priority
                />
                {/* Dynamic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b] via-[#1e1b4b]/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#1e1b4b]/20 z-10" />
            </div>

            <div className="container relative z-20 mx-auto px-12 h-full">
                <div className="grid grid-cols-12 gap-8 h-full items-center">

                    {/* Left Content Column */}
                    <div className="col-span-12 lg:col-span-7 space-y-10 pt-20">
                        {/* Upper Badge/Toolbar */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Bihar's Most Trusted</span>
                            </div>
                            <LocationSelector isHero={true} />
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full h-10 px-1">
                                <LanguageSwitcher />
                            </div>
                        </motion.div> */}

                        {/* Headline Area */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="drop-shadow-2xl"
                            >
                                <AnimatedHeroText
                                    className="text-6xl lg:text-7xl leading-[0.9] tracking-tighter"
                                    highlightColor="text-primary"
                                />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/80 text-xl font-bold max-w-2xl leading-relaxed drop-shadow-md"
                            >
                                Premium doorstep repairs for all your <span className="text-white">appliances, electronics & vehicles</span>.
                                Certified technicians at your convenience.
                            </motion.p>
                        </div>

                        {/* CTA & Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex items-center gap-6">
                                <div className="scale-110 origin-left">
                                    <HeroCTA />
                                </div>
                                {/* <div className="flex flex-col border-l border-white/20 pl-6">
                                    <span className="text-white font-black text-2xl tracking-tight leading-none">50k+</span>
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Happy Users</span>
                                </div> */}
                            </div>

                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                {['30 Days Warranty', 'Spare Parts Included', 'Fix at Home'].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual/Trust Column */}
                    <div className="hidden lg:col-span-5 lg:flex flex-col gap-6 justify-center items-end relative">
                        {/* Floating Trust Cards */}
                        {trustCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + idx * 0.1, type: 'spring' }}
                                whileHover={{ scale: 1.05, x: -10 }}
                                className="w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 group cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-lg tracking-tight">{card.title}</span>
                                    <span className="text-white/50 text-xs font-bold">{card.desc}</span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Decorative Element */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50" />
                    </div>

                </div>
            </div>

            {/* Modern Wave Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1b4b] to-transparent pointer-events-none" />
        </section>
    );
}
