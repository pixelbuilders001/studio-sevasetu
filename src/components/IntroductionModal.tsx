'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function IntroductionModal() {
    const [isOpen, setIsOpen] = useState(false);

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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-[400px] max-h-[90vh] md:max-w-[300px] md:max-h-[80vh] h-auto bg-white shadow-2xl overflow-hidden rounded-none flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 z-50 p-1.5 bg-black/50 hover:bg-black/70 text-white transition-all active:scale-90"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Ad Content */}
                    <div className="relative w-full aspect-[2/3] md:aspect-auto md:h-[650px] flex-grow overflow-hidden">
                        <Image
                            src="/images/intro-ad.jpg"
                            alt="helloFixo Special Offer"
                            fill
                            className="object-cover md:object-contain"
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
