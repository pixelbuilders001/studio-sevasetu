
import Image from 'next/image';

export default function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex flex-col items-center">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>

                {/* Scooter Image with animation */}
                <div className="relative z-10 animate-scooter-ride">
                    <Image
                        src="/images/scooter-loader.png"
                        alt="Loading..."
                        width={120}
                        height={120}
                        priority
                        className="drop-shadow-lg"
                    />
                </div>

                {/* Optional: Subtle road line */}
                <div className="w-16 h-1 bg-foreground/10 rounded-full mt-[-4px] animate-pulse"></div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 animate-pulse">
                    Loading
                </p>
            </div>
        </div>
    );
}
