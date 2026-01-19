'use client';

import { Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletLoader({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="relative">
                {/* Glowing background */}
                <motion.div
                    className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Wallet Icon */}
                <motion.div
                    className="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-indigo-100"
                    animate={{
                        y: [0, -8, 0],
                        rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Wallet className="w-8 h-8 text-indigo-600" />
                </motion.div>

                {/* Pulse for "money" popping out */}
                <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"
                    animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        y: [0, -20],
                        x: [0, 10],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.5,
                    }}
                />
            </div>

            <motion.p
                className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-900/40"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {message}
            </motion.p>
        </div>
    );
}
