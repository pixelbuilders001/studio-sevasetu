import Image from 'next/image';
import { motion } from 'framer-motion';

export default function FullScreenLoader({ message = "Loading" }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex flex-col items-center">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>

                {/* Scooter Image with animation */}
                <motion.div
                    className="relative z-10"
                    animate={{
                        y: [0, -4, 0],
                        x: [0, 1, -1, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Image
                        src="/images/scooter-loader.png"
                        alt="Loading..."
                        width={120}
                        height={120}
                        priority
                        className="drop-shadow-lg"
                    />
                </motion.div>

                {/* Optional: Subtle road line */}
                <div className="w-16 h-1 bg-foreground/10 rounded-full mt-[-4px] animate-pulse"></div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 animate-pulse">
                    {message}
                </p>
            </div>
        </div>
    );
}
