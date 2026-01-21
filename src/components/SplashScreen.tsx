'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HellofixoLogo } from './HellofixoLogo';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }}
                        className="flex flex-col items-center relative z-10"
                    >
                        {/* Logo Icon Container */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative mb-6"
                        >
                            <img
                                src="/logo-image.png"
                                alt="Hellofixo"
                                className="w-56 md:w-72 h-auto object-contain"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Bottom Progress/Loading Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 1.2, duration: 0.8 }
                        }}
                        className="absolute bottom-16 flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ left: '-100%' }}
                                animate={{ left: '100%' }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-1/2 h-full bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                            />
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                            PREPARING YOUR SERVICE
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
