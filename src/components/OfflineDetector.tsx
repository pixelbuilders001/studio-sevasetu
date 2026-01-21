'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflineDetector() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Initial check
        setIsOffline(!window.navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-white/10 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="bg-white dark:bg-card max-w-sm w-full rounded-[2.5rem] p-8 shadow-2xl border border-indigo-50/50 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl" />

                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 relative group">
                            <WifiOff className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-primary/20 rounded-3xl -z-10"
                            />
                        </div>

                        <h2 className="text-2xl font-black text-indigo-950 dark:text-white mb-3 tracking-tight">
                            Connection Lost
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">
                            Oops! It looks like you're offline. Please check your internet connection and try again.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            <Button
                                onClick={handleReload}
                                className="w-full rounded-2xl py-6 font-black tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all uppercase text-xs flex items-center justify-center gap-2 group"
                            >
                                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                Try Again
                            </Button>

                            <div className="flex items-center justify-center gap-2 mt-2">
                                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/60" />
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                                    Waiting for network...
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
