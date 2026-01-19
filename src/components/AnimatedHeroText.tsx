
'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const services = [
  'Ac',
  'Mobile',
  'Laptop',
  'Bike'
];

interface AnimatedHeroTextProps {
  className?: string;
  highlightColor?: string;
}

const AnimatedHeroText = ({ className, highlightColor = "text-cyan-400" }: AnimatedHeroTextProps) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % services.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col font-black leading-[1.05] tracking-tighter", className)}>
      <div className="flex items-center flex-nowrap gap-2 text-white whitespace-nowrap">
        <span>We Fix</span>
        <div className="relative h-[1.1em] w-40 md:w-80 overflow-hidden">
          <div
            key={services[wordIndex]}
            className={cn("animate-fade-in-up absolute left-0 whitespace-nowrap drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]", highlightColor)}
          >
            {services[wordIndex]}
          </div>
        </div>
      </div>
      <span className="text-white">At Your Door</span>
    </div>
  );
};

export default AnimatedHeroText;
