
'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const services = [
    'Laptop',
    'Bike',
    'Fridge',
    'Mobile',
    'TV',
    'and more'
];

const AnimatedHeroText = () => {
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState(services[0]);
    const [isAnimating, setIsAnimating] = useState(true);

    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setWordIndex((prev) => (prev + 1) % services.length);
      }, 2800);
      return () => clearInterval(interval);
    }, [services.length]);

    useEffect(() => {
        if (isAnimating) {
            setDisplayedText(services[index]);
        }
    }, [index, isAnimating]);

    return (
        <>
            Repair{' '}
            <div className="relative inline-flex flex-col h-[1.2em] overflow-hidden min-w-[140px]">
                    <span 
                      key={services[wordIndex]} 
                      className="text-blue-400 animate-smooth-slide-up block whitespace-nowrap"
                    >
                      {services[wordIndex]}
                    </span>
                  </div>
            <br />
        </>
    );
};

export default AnimatedHeroText;
