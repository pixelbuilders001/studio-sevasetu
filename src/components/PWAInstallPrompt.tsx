'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Share, PlusSquare, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [platform, setPlatform] = useState<'android' | 'ios' | 'firefox' | 'other'>('other');
    const [isMobile, setIsMobile] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [isPromptUsed, setIsPromptUsed] = useState(false);
    const pathname = usePathname();
    const criteriaMetRef = React.useRef(false);
    const deferredPromptRef = React.useRef<any>(null);

    useEffect(() => {
        // 1. Check if already installed
        const isStandalone = typeof window !== 'undefined' &&
            (window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone);
        if (isStandalone) return;

        // 2. Strict Mobile Only Check
        const checkMobile = () => {
            return typeof window !== 'undefined' &&
                (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        const mobileFlag = checkMobile();
        setIsMobile(mobileFlag);
        if (!mobileFlag) return;

        const isAlreadyInstalled = localStorage.getItem('pwa-installed') === 'true';
        if (isAlreadyInstalled) return;

        const snoozedUntil = localStorage.getItem('pwa-prompt-snoozed-until');
        if (snoozedUntil && Date.now() < parseInt(snoozedUntil)) return;

        // 3. Detect platform
        const ua = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isFirefox = /firefox|fxios/.test(ua);

        if (isFirefox) setPlatform('firefox');
        else if (isIOS) setPlatform('ios');
        else if (/android/.test(ua)) setPlatform('android');
        else setPlatform('other');

        // 4. Trace-based state
        const checkAndShow = () => {
            const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

            // Re-read snooze/install state
            const isAlreadyInstalled = localStorage.getItem('pwa-installed') === 'true';
            if (isAlreadyInstalled) return;

            const snoozedUntil = localStorage.getItem('pwa-prompt-snoozed-until');
            // If we are on the homepage or confirmation page, maybe we want to be more persistent?
            // For now, respect the snooze unless it's a fresh session and we haven't seen it yet.
            if (snoozedUntil && Date.now() < parseInt(snoozedUntil)) return;

            // Use the early-captured event if available
            const globalEvent = (window as any).deferredPWAEvent;
            if (globalEvent && !deferredPromptRef.current) {
                deferredPromptRef.current = globalEvent;
                setDeferredPrompt(globalEvent);
            }

            const isFirefox = /firefox|fxios/.test(window.navigator.userAgent.toLowerCase());

            if (criteriaMetRef.current && (isIOS || isFirefox || deferredPromptRef.current)) {
                setShowPrompt(true);
            }
        };

        const setCriteriaMet = () => {
            criteriaMetRef.current = true;
            checkAndShow();
        };

        // 5. Trigger Logic
        let timer: NodeJS.Timeout | undefined;

        if (pathname === '/') {
            // Homepage: 10s fallback timer OR 200px scroll
            timer = setTimeout(setCriteriaMet, 10000);

            const handleScroll = () => {
                if (window.scrollY > 200) {
                    setCriteriaMet();
                    window.removeEventListener('scroll', handleScroll);
                }
            };
            window.addEventListener('scroll', handleScroll);
            if (window.scrollY > 200) setCriteriaMet();

            return () => {
                if (timer) clearTimeout(timer);
                window.removeEventListener('scroll', handleScroll);
            };
        } else if (pathname === '/confirmation') {
            timer = setTimeout(setCriteriaMet, 3000);
        } else {
            // Other pages: short delay
            timer = setTimeout(setCriteriaMet, 2000);
        }

        // 6. beforeinstallprompt listener (as backup)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            deferredPromptRef.current = e;
            setDeferredPrompt(e);
            (window as any).deferredPWAEvent = e;
            checkAndShow();
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Periodic check to catch events set by the head script
        const interval = setInterval(checkAndShow, 1000);

        // Initial check immediately on mount
        checkAndShow();

        const handleResize = () => setIsMobile(checkMobile());
        window.addEventListener('resize', handleResize);

        return () => {
            if (timer) clearTimeout(timer);
            clearInterval(interval);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('resize', handleResize);
        };
    }, [pathname]);

    const handleInstallClick = async () => {
        if (isPromptUsed) {
            window.location.reload();
            return;
        }

        const promptEvent = deferredPromptRef.current || deferredPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            setIsPromptUsed(true);
            const { outcome } = await promptEvent.userChoice;

            if (outcome === 'accepted') {
                setShowPrompt(false);
                localStorage.setItem('pwa-installed', 'true');
            } else {
                // User cancelled. Keep prompt visible.
                setShowPrompt(true);
            }
        }
    };

    const handleIOSInstallClick = () => {
        setShowIOSInstructions(true);
    };

    const handleFirefoxInstallClick = () => {
        setShowIOSInstructions(true);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setShowIOSInstructions(false);
        // Snooze for 7 days
        const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem('pwa-prompt-snoozed-until', sevenDaysFromNow.toString());
    };

    const isDesktopView = !isMobile && platform === 'other';

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className={cn(
                        "fixed z-[1000] left-4 right-4",
                        isDesktopView
                            ? "top-4 md:top-6 md:left-auto md:right-6 md:max-w-md"
                            : "bottom-24"
                    )}
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-800 p-4 md:p-5 relative backdrop-blur-sm">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />

                        <button
                            onClick={handleDismiss}
                            className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all z-50 hover:scale-110 active:scale-95"
                            aria-label="Dismiss"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <AnimatePresence mode="wait">
                            {!showIOSInstructions ? (
                                <motion.div
                                    key="main-prompt"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Smartphone className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-tight">
                                            Install helloFixo App
                                        </h3>
                                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                                            {platform === 'ios' || platform === 'firefox'
                                                ? "Fast access from your home screen"
                                                : "Faster bookings & real-time updates"
                                            }
                                        </p>
                                    </div>

                                    {deferredPrompt || isPromptUsed || platform === 'android' ? (
                                        <Button
                                            onClick={handleInstallClick}
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 md:px-5 py-0 h-9 md:h-10 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                                        >
                                            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                                            {isPromptUsed ? 'Retry Install' : 'Install'}
                                        </Button>
                                    ) : platform === 'ios' ? (
                                        <Button
                                            onClick={handleIOSInstallClick}
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 md:px-5 py-0 h-9 md:h-10 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                                        >
                                            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                                            Install Now
                                        </Button>
                                    ) : platform === 'firefox' ? (
                                        <Button
                                            onClick={handleFirefoxInstallClick}
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 md:px-5 py-0 h-9 md:h-10 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                                        >
                                            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                                            How to Install
                                        </Button>
                                    ) : null}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="ios-instructions"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                            <Smartphone className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            How to Install
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {platform === 'firefox' && /android/.test(navigator.userAgent.toLowerCase()) ? (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                                        1
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        Tap the <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded mx-1"><MoreVertical className="w-3 h-3 text-slate-700 dark:text-slate-300" /></span> <strong className="text-slate-900 dark:text-slate-100 font-bold">Menu</strong> button (three dots).
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                                        2
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        Select <strong className="text-slate-900 dark:text-slate-100 font-bold">Install</strong> or <strong className="text-slate-900 dark:text-slate-100 font-bold">Add to Home Screen</strong>.
                                                    </p>
                                                </div>
                                            </>
                                        ) : platform === 'firefox' && /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) ? (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                                        1
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        Tap the <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded mx-1"><MoreVertical className="w-3 h-3 text-slate-700 dark:text-slate-300" /></span> <strong className="text-slate-900 dark:text-slate-100 font-bold">Menu</strong> button at the bottom.
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                                        2
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        Scroll down and tap <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded mx-1"><Share className="w-3 h-3 text-blue-500" /></span> <strong className="text-slate-900 dark:text-slate-100 font-bold">Share</strong>, then <strong className="text-slate-900 dark:text-slate-100 font-bold">Add to Home Screen</strong>.
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                                        1
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        Tap the <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded mx-1"><Share className="w-3 h-3 text-blue-500" /></span> <strong className="text-slate-900 dark:text-slate-100 font-bold">Share</strong> button in Safari's toolbar.
                                                    </p>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                                        2
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        Scroll down and select <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded mx-1"><PlusSquare className="w-3 h-3 text-slate-700 dark:text-slate-300" /></span> <strong className="text-slate-900 dark:text-slate-100 font-bold">Add to Home Screen</strong>.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => setShowIOSInstructions(false)}
                                        variant="outline"
                                        size="sm"
                                        className="w-full h-10 rounded-xl text-xs font-bold border-2"
                                    >
                                        Got it
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}