
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

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % services.length);
                setIsAnimating(true);
            }, 500); // Time for fade-out
        }, 2500); // Time each word is displayed

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isAnimating) {
            setDisplayedText(services[index]);
        }
    }, [index, isAnimating]);

    return (
        <>
            Repair{' '}
            <span className="relative inline-block text-primary">
                <span
                    className={cn(
                        'transition-all duration-500 ease-in-out',
                        isAnimating ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    )}
                >
                    {displayedText}
                </span>
            </span>
            <br />
        </>
    );
};

export default AnimatedHeroText;
