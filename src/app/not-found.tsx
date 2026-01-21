'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8 relative">
                {/* Decorative Background Elements */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Animated Icon Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative inline-block"
                >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-[2.5rem] flex items-center justify-center text-primary relative z-10 mx-auto">
                        <Construction className="w-12 h-12 md:w-16 md:h-16" />
                    </div>
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-xl -z-10"
                    />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter text-indigo-950/10 dark:text-white/5 absolute -top-16 left-0 right-0 select-none pointer-events-none"
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-3xl md:text-4xl font-black text-[#1e1b4b] dark:text-white tracking-tight relative z-10"
                    >
                        Lost in <span className="text-primary italic">Repair?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-muted-foreground font-medium max-w-[280px] mx-auto text-sm md:text-base"
                    >
                        We couldn't find the page you're looking for. Let's get you back on track.
                    </motion.p>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto rounded-2xl px-10 py-7 font-black tracking-widest bg-[#1e1b4b] hover:bg-primary text-white shadow-xl shadow-indigo-100 dark:shadow-none transition-all uppercase text-xs flex items-center gap-2 group">
                            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Back to Home
                        </Button>
                    </Link>

                    <Link href="/#services" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto rounded-2xl px-10 py-7 font-black tracking-widest border-2 border-indigo-50 hover:bg-indigo-50 hover:text-[#1e1b4b] transition-all uppercase text-xs flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            View Services
                        </Button>
                    </Link>
                </motion.div>

                {/* Footer Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-12"
                >
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                        Error Code: PAGE_NOT_FOUND
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
