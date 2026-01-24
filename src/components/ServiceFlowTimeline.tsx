'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Wrench, FileText, ThumbsUp, ThumbsDown, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
    id: number;
    text: string;
    icon: any;
    iconColor: string;
    iconBg: string;
    highlight?: boolean;
}

const steps: TimelineStep[] = [
    {
        id: 1,
        text: 'Technician visits your location',
        icon: Bike,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50'
    },
    {
        id: 2,
        text: 'Inspects the issue',
        icon: Wrench,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50'
    },
    {
        id: 3,
        text: 'Shares final repair price',
        icon: FileText,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50'
    },
    {
        id: 4,
        text: 'You approve → repair starts',
        icon: ThumbsUp,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        highlight: true
    },
    {
        id: 5,
        text: 'You decline → only visiting fee',
        icon: ThumbsDown,
        iconColor: 'text-slate-600',
        iconBg: 'bg-slate-50',
        highlight: true
    },
];

// Icon-specific animations
const iconAnimations = {
    0: { x: [0, 3, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
    1: { rotate: [0, -15, 15, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
    2: { y: [0, -2, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } },
    3: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } },
    4: { scale: [1, 0.95, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } },
};

export default function ServiceFlowTimeline({ inspectionFee }: { inspectionFee: number }) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    What happens next?
                </h3>
            </div>

            {/* Timeline - Vertical on mobile, Horizontal on desktop */}
            <div className="relative">
                {/* Mobile: Vertical Layout */}
                <div className="md:hidden space-y-3">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            className="relative flex gap-3 items-start"
                        >
                            {/* Vertical Timeline Line */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ delay: index * 0.08 + 0.15, duration: 0.25 }}
                                    className="absolute left-[13px] top-7 w-[2px] bg-gradient-to-b from-slate-200 to-slate-100"
                                    style={{ height: 'calc(100% + 0.5rem)' }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: index * 0.08 + 0.1,
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 15
                                }}
                                className="relative z-10 flex-shrink-0"
                            >
                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shadow-sm", step.iconBg)}>
                                    <motion.div animate={iconAnimations[index]}>
                                        <step.icon className={cn("w-3.5 h-3.5", step.iconColor)} />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Text */}
                            <div className="flex-1 pt-1">
                                <p className={cn("text-xs leading-relaxed", step.highlight ? "font-semibold text-slate-700" : "font-medium text-slate-600")}>
                                    {step.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop: Horizontal Layout */}
                <div className="hidden md:flex md:items-start md:gap-2 md:justify-between">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            className="relative flex flex-col items-center gap-2 flex-1"
                        >
                            {/* Horizontal Timeline Line */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: index * 0.08 + 0.15, duration: 0.25 }}
                                    className="absolute left-[calc(50%+14px)] top-[13px] h-[2px] bg-gradient-to-r from-slate-200 to-slate-100"
                                    style={{ width: 'calc(100% - 28px)' }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: index * 0.08 + 0.1,
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 15
                                }}
                                className="relative z-10"
                            >
                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shadow-sm", step.iconBg)}>
                                    <motion.div animate={iconAnimations[index]}>
                                        <step.icon className={cn("w-3.5 h-3.5", step.iconColor)} />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Text */}
                            <div className="text-center">
                                <p className={cn("text-[11px] leading-tight", step.highlight ? "font-semibold text-slate-700" : "font-medium text-slate-600")}>
                                    {step.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: steps.length * 0.08 + 0.15 }}
                className="mt-2 pt-0 border-t border-slate-100"
            >
                {/* <p className="text-[10px] text-slate-400 text-center font-medium">
                    Clear pricing, no hidden charges
                </p> */}
                {/* Important Info Footer */}
                <div className="bg-blue-50/30 p-5 px-2 border-t border-slate-100 flex items-start gap-3">
                    {/* <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" /> */}
                    <p className="text-xs text-slate-500 font-sm leading-relaxed">
                        <span className="font-bold text-slate-700">Note:</span> If no repair is performed after diagnosis, only the <span className="text-primary font-bold">₹{inspectionFee} visiting charge</span> will be applicable.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
