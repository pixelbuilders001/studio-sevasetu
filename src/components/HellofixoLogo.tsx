import React from 'react';
import { Wrench, Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HellofixoLogoProps {
    className?: string;
    variant?: 'light' | 'dark';
}

export const HellofixoLogo = ({ className, variant = 'light' }: HellofixoLogoProps) => {
    const textColor = variant === 'light' ? 'text-white' : 'text-[#1e1b4b]';
    const subTextColor = variant === 'light' ? 'text-white' : 'text-[#1e1b4b]';
    const accentColor = variant === 'light' ? 'text-[#a5b4fc]' : 'text-[#6366f1]';

    return (
        <div className={cn("flex flex-col items-center justify-center select-none", className)}>
            <div className="relative flex items-center">
                {/* Hello - in White/Dark */}
                <span className={cn("text-6xl md:text-8xl font-black tracking-tight", textColor)}>
                    hello
                </span>

                {/* Fix - in Purple/Indigo */}
                <span className={cn("text-6xl md:text-8xl font-black tracking-tight", accentColor)}>
                    Fi
                </span>

                {/* X - Stylized Tools */}
                <div className="relative w-14 h-14 md:w-20 md:h-20 ml-1">
                    {/* Hammer - Crossing top-left to bottom-right */}
                    <Hammer
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -rotate text-white fill-white z-10 stroke-[1.5px] scale-x-[-1]"
                        style={{
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                            transform: 'translate(-50%, -50%) rotate(-45deg) scaleX(-1)'
                        }}
                    />
                    {/* Wrench - Crossing top-right to bottom-left */}
                    <Wrench
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-white fill-white rotate-45 z-0 stroke-[1.5px]"
                        style={{
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                            transform: 'translate(-50%, -50%) rotate(45deg)'
                        }}
                    />
                </div>

                {/* o - in Purple/Indigo */}
                <span className={cn("text-6xl md:text-8xl font-black tracking-tight", accentColor)}>
                    o
                </span>
            </div>

            {/* Home Services - Tracking Wide */}
            <span className={cn("text-sm md:text-xl font-bold tracking-[0.4em] uppercase mt-2 md:mt-4", subTextColor)}>
                Home Services
            </span>
        </div>
    );
};
