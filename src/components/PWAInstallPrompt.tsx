'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, PlusSquare, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

    useEffect(() => {
        // 1. Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) {
            console.log('App is in standalone mode');
            return;
        }

        // 2. Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        }

        // 3. Listen for beforeinstallprompt (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e);

            // Check if user has already dismissed it this session
            const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
            if (!isDismissed) {
                // Delay showing the prompt slightly for better UX
                setTimeout(() => setShowPrompt(true), 3000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 4. For iOS, show after a delay since there's no event
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setTimeout(() => {
                // Check if user has already dismissed it this session
                const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
                if (!isDismissed) setShowPrompt(true);
            }, 5000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-24 left-4 right-4 z-[9999] md:hidden"
            >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-800 p-4 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />

                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Smartphone className="w-6 h-6 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                Install Hellofixo App
                            </h3>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                                {platform === 'ios'
                                    ? "Fast access from your home screen"
                                    : "Faster bookings & real-time updates"
                                }
                            </p>
                        </div>

                        {platform === 'android' ? (
                            <Button
                                onClick={handleInstallClick}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-0 h-9 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                            >
                                <Download className="w-3 h-3 mr-1.5" />
                                Install
                            </Button>
                        ) : platform === 'ios' ? (
                            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-indigo-100 dark:border-slate-700">
                                <Share className="w-3.5 h-3.5 text-indigo-600" />
                                <span className="text-[9px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tighter">Tap Share & Add to Home</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
