
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

const AnimatedHeroText = ({ className, highlightColor = "text-primary" }: AnimatedHeroTextProps) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % services.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col items-center justify-center font-black tracking-tighter text-white leading-none", className)}>
      <div className="flex items-center gap-4">
        <span>We Fix</span>
        <div className="relative h-[1.2em] w-24 md:w-44 overflow-hidden flex items-center">
          <div
            key={services[wordIndex]}
            className={cn("animate-fade-in-up absolute left-0 whitespace-nowrap drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]", highlightColor)}
            style={{
              textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
            }}
          >
            {services[wordIndex]}
          </div>
        </div>
      </div>
      <span className="mt-2 opacity-90">At Your Doorstep</span>
    </div>
  );
};

export default AnimatedHeroText;
