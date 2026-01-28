'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Award, CheckCircle2, Snowflake, Bike, Sparkles, Zap, Droplets, Hammer } from 'lucide-react';
import AnimatedHeroText from './AnimatedHeroText';
import HeroCTA from './HeroCTA';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import DesktopSearch from './DesktopSearch';

const SERVICES = [
    { name: 'AC Repair', icon: Snowflake, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Bike Service', icon: Bike, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Cleaning', icon: Sparkles, color: 'text-teal-500', bg: 'bg-teal-50' },
    { name: 'Electrician', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Geyser Repair', icon: Droplets, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Carpentry', icon: Hammer, color: 'text-red-500', bg: 'bg-red-50' },
];
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
        <section className="relative h-[85vh] min-h-[700px] w-full bg-[#1e1b4b]">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
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

            <div className="container relative z-[50] mx-auto px-12 h-full flex flex-col items-center justify-center text-center">
                {/* Headline Area */}
                <div className="max-w-4xl space-y-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="drop-shadow-2xl"
                    >
                        <AnimatedHeroText
                            className="text-4xl lg:text-5xl leading-[1.2] tracking-tighter"
                            highlightColor="text-primary"
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/60 text-lg font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Premium doorstep home services & repairs for your <span className="text-white">appliances, electronics & vehicles</span>.
                        Professional technicians at your convenience.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-2xl flex flex-col items-center"
                >
                    <div className="w-full">
                        <DesktopSearch />
                    </div>

                    {/* <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
                        {['30 Days Warranty', 'Spare Parts Included', 'Fix at Home'].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{item}</span>
                            </div>
                        ))}
                    </div> */}

                    <div className="w-full max-w-4xl mt-6 overflow-hidden relative marquee-mask pb-6">
                        <div className="flex gap-6 animate-marquee hover:pause-animation whitespace-nowrap px-4">
                            {[...SERVICES, ...SERVICES, ...SERVICES].map((service, idx) => (
                                <div
                                    key={idx}
                                    className="inline-flex items-center gap-3 px-2 py-2 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:bg-white/20 transition-all duration-500 cursor-pointer group shadow-xl"
                                >
                                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${service.bg} group-hover:scale-110 transition-transform duration-500`}>
                                        <service.icon className={`w-4 h-4 ${service.color}`} />
                                    </div>
                                    <span className="text-sm text-white tracking-tight group-hover:text-primary transition-colors pr-2">
                                        {service.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </motion.div>
                <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
                    {['30 Days Warranty', 'Spare Parts Included', 'Fix at Home'].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{item}</span>
                        </div>
                    ))}
                </div>
                {/* Simplified Background Accent */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Modern Wave Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1b4b] to-transparent pointer-events-none" />
        </section>
    );
}
