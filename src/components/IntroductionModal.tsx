'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldCheck, Clock, Zap, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Step {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const steps: Step[] = [
    {
        title: "Choose Your Service",
        description: "Select from mobile, laptop, or home appliance repairs. Quick and easy scheduling.",
        icon: SmartphoneIcon,
        color: "text-blue-500",
    },
    {
        title: "Instant Estimate",
        description: "Get transparent, upfront pricing. No hidden charges, no surprises after the job.",
        icon: Zap,
        color: "text-yellow-500",
    },
    {
        title: "Expert at Doorstep",
        description: "Our certified technician arrives at your location in 60 minutes with genuine parts.",
        icon: Clock,
        color: "text-indigo-500",
    },
    {
        title: "Pay After Repair",
        description: "Satisfied with the fix? Pay only after the job is done. 30-day warranty included.",
        icon: CheckCircle2,
        color: "text-emerald-500",
    }
];

function SmartphoneIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
        </svg>
    )
}

export default function IntroductionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('hellofixo-intro-seen');
        if (!hasSeenIntro) {
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('hellofixo-intro-seen', 'true');
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const activeStep = steps[currentStep];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#1e1b4b]/80 backdrop-blur-md"
                    onClick={handleClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[600px]"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 bg-[#1e1b4b]/20 hover:bg-[#1e1b4b]/40 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Left Side: Visuals (Optimized for Mobile Fit) */}
                    <div className="relative w-full md:w-8/12 h-[35vh] md:h-auto overflow-hidden bg-indigo-950">
                        <Image
                            src="/hero-video.webp"
                            alt="helloFixo Service"
                            fill
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-indigo-950/20" />

                        <div className="absolute inset-x-0 bottom-0 md:inset-0 flex flex-col items-center justify-end md:justify-center p-6 md:p-8 text-center md:text-left md:items-start bg-gradient-to-t from-indigo-950/90 md:from-transparent">
                            <div className="hidden md:flex w-16 h-16 bg-white rounded-2xl items-center justify-center mb-6 shadow-2xl">
                                <span className="text-3xl font-black text-indigo-600">H</span>
                            </div>
                            <h2 className="text-xl md:text-5xl font-black text-white leading-tight mb-1 md:mb-2 drop-shadow-lg">
                                Discover <br />
                                <span className="text-yellow-400">helloFixo</span>
                            </h2>
                            <p className="text-white/80 text-[10px] md:text-base font-bold max-w-[300px] drop-shadow-md">
                                Bihar&apos;s Most Trusted Doorstep Repair Service
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Content (Minimized Height for Mobile) */}
                    <div className="w-full md:w-4/12 p-6 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-900 border-l border-slate-50 dark:border-slate-800">
                        <div className="space-y-4 md:space-y-6">
                            {/* Progress Indicators */}
                            <div className="flex gap-2">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-500",
                                            idx <= currentStep ? "w-8 bg-indigo-600" : "w-4 bg-indigo-100 dark:bg-slate-800"
                                        )}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-2 md:space-y-4"
                                >
                                    <div className={cn("w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2 md:mb-6", activeStep.color)}>
                                        <activeStep.icon className="w-5 h-5 md:w-7 md:h-7" />
                                    </div>
                                    <h3 className="text-lg md:text-3xl font-black text-[#1e1b4b] dark:text-white tracking-tight">
                                        {activeStep.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-medium leading-relaxed">
                                        {activeStep.description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-6 md:mt-12 flex items-center justify-between gap-4">
                            <button
                                onClick={handleClose}
                                className="text-slate-400 hover:text-indigo-600 font-black text-xs md:text-sm uppercase tracking-widest transition-colors"
                            >
                                Skip
                            </button>
                            <Button
                                onClick={handleNext}
                                className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none"
                            >
                                {currentStep === steps.length - 1 ? "Start Now" : "Next Step"}
                                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </Button>
                        </div>

                        {/* Footer trust indicator */}
                        <div className="mt-6 pt-6 md:mt-8 md:pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2 md:gap-3">
                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 opacity-50" />
                            <p className="text-[8px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                Guaranteed Quality & Genuine Spare Parts
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
