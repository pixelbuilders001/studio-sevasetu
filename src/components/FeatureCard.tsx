'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
}

export default function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative flex flex-col items-center justify-center bg-white border border-slate-100 p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] text-center shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 active:scale-95"
        >
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] md:rounded-[3rem]" />

            {/* Icon Container with Glow */}
            <div className="relative mb-3 md:mb-6">
                <div className="w-10 h-10 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-indigo-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                    <Icon className="w-5 h-5 md:w-10 md:h-10" />
                </div>
                {/* Glow Element */}
                <div className="absolute inset-0 bg-primary/20 blur-[20px] rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 -z-10" />
            </div>

            <div className="relative z-10 flex flex-col gap-1">
                <h3 className="text-xs md:text-2xl font-black uppercase tracking-tight text-[#1e1b4b] group-hover:text-primary transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                    {description}
                </p>
            </div>

            {/* Bottom Glow Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform" />
        </motion.div>
    );
}
