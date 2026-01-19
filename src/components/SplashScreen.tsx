'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }}
                        className="flex flex-col items-center"
                    >
                        {/* Logo Icon */}
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="w-20 h-20 bg-[#6366F1] rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-6"
                        >
                            <span className="text-5xl font-black text-white italic">H</span>
                        </motion.div>

                        {/* Brand Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.4, duration: 0.6 }
                            }}
                            className="text-center"
                        >
                            {/* <div className="bg-primary px-2 py-2 rounded md:rounded shadow-[0_4px_10px_rgba(99,102,241,0.25)] group-hover:shadow-[0_6px_15px_rgba(99,102,241,0.35)] transition-all duration-300">
                                <h1
                                    //  className="text-xl md:text-2xl font-[1000] text-[#1E293B] dark:text-white tracking-tighter italic leading-none"
                                    className="text-4xl md:text-[13px] font-[1000] text-white italic tracking-tighter leading-none whitespace-nowrap uppercase"
                                >
                                    FIX on Click
                                </h1>
                            </div> */}

                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">
                                Repair & Solutions
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Bottom Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 1, duration: 1 }
                        }}
                        className="absolute bottom-12 flex flex-col items-center gap-4"
                    >
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "linear"
                                }}
                                className="w-full h-full bg-primary/40"
                            />
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                            Loading your experience
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
