'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, PlusSquare, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [platform, setPlatform] = useState<'android' | 'ios'  | 'other'>('other');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone;
        if (isStandalone) {
            console.log('App is in standalone mode');
            return;
        }

        // 2. Detect if mobile
        const checkMobile = () => {
            return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };
        setIsMobile(checkMobile());

        // 3. Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        }
        else if (/chrome|edge|opera|firefox|safari/.test(userAgent)) {
            // Desktop browsers that support PWA
            setPlatform('other');
        }

        // 4. Listen for beforeinstallprompt (works on Chrome, Edge, Opera, etc.)
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e);

            // Check if user has already dismissed it this session
            const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
            if (!isDismissed) {
                // Delay showing the prompt slightly for better UX
                setTimeout(() => setShowPrompt(true), 2000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 5. For iOS, show after a delay since there's no event
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setTimeout(() => {
                const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
                if (!isDismissed) setShowPrompt(true);
            }, 5000);
        }

        // 6. For desktop browsers that support PWA but might not fire beforeinstallprompt immediately
        // if (platform === 'desktop' && !deferredPrompt) {
        //     // Check if PWA is installable (has manifest and service worker)
        //     const checkInstallable = () => {
        //         if ('serviceWorker' in navigator && window.matchMedia('(display-mode: browser)').matches) {
        //             setTimeout(() => {
        //                 const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
        //                 if (!isDismissed && !deferredPrompt) {
        //                     // Show prompt even without beforeinstallprompt for desktop
        //                     setShowPrompt(true);
        //                 }
        //             }, 3000);
        //         }
        //     };
        //     checkInstallable();
        // }

        const handleResize = () => {
            setIsMobile(checkMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('resize', handleResize);
        };
    }, [deferredPrompt, platform]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        } 
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!showPrompt) return null;

    const isDesktopView = !isMobile && platform === 'desktop';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: isDesktopView ? -100 : 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: isDesktopView ? -100 : 100, opacity: 0 }}
                className={cn(
                    "fixed z-[9999] left-4 right-4",
                    isDesktopView 
                        ? "top-4 md:top-6 md:left-auto md:right-6 md:max-w-md" 
                        : "bottom-24"
                )}
            >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-800 p-4 md:p-5 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />

                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        
                                <Smartphone className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                            
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-tight">
                                Install Hellofixo App
                            </h3>
                            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                                {platform === 'ios'
                                    ? "Fast access from your home screen"
                                    : 
                                     "Faster bookings & real-time updates"
                                }
                            </p>
                        </div>

                        {(platform === 'android') && deferredPrompt ? (
                            <Button
                                onClick={handleInstallClick}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 md:px-5 py-0 h-9 md:h-10 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                            >
                                <Download className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                                Install
                            </Button>
                        ): platform === 'ios' ? (
                            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-indigo-100 dark:border-slate-700">
                                <Share className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-[9px] md:text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tighter">Tap Share & Add to Home</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
