
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
    <div className={cn("flex flex-col font-bold leading-tight", className)}>
      <div className="flex items-center gap-1.5">
        <span>We Fix</span>
        <div className="relative h-[1.2em] w-24 md:w-32 overflow-hidden flex items-center">
          <div key={services[wordIndex]} className={cn("animate-fade-in-up absolute left-0", highlightColor)}>
            {services[wordIndex]}
          </div>
        </div>
      </div>
      <span>At Your Doorstep</span>
    </div>
  );
};

export default AnimatedHeroText;
