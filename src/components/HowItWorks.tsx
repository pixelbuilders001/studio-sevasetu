'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { TranslationFunc } from '@/lib/get-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MousePointer2, UserCheck, Wrench, Wallet } from 'lucide-react';
import { useEffect } from 'react';

export default function HowItWorks({ t }: { t: TranslationFunc }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      gif: '/how-it-works/book_in_seconds.gif',
      title: 'Book in Seconds',
      description: "Choose your device and the problem you're facing. Get an instant estimate.",
      icon: MousePointer2
    },
    {
      gif: '/how-it-works/expert_assigned.gif',
      title: 'Expert Assigned',
      description: "We'll assign a verified technician near you. Arrives in 60 mins.",
      icon: UserCheck
    },
    {
      gif: '/how-it-works/door_step_repair.gif',
      title: 'Doorstep Repair',
      description: 'Technician repairs your device right in front of you. Safe & secure.',
      icon: Wrench
    },
    {
      gif: '/how-it-works/pay_post_repair.gif',
      title: 'Pay Post Repair',
      description: 'Satisfied? Pay only after the job is done. Online or Cash.',
      icon: Wallet
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-card overflow-hidden">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-tight"
          >
            How it <span className="text-primary italic">Works</span>
          </motion.h2>
          <div className="h-1 w-12 bg-primary/20 mx-auto mt-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${(activeStep + 1) * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Interactive Step Navigation */}
        <div className="flex justify-between items-center mb-8 relative px-2">
          {/* Connecting Line Backdrop */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary -translate-y-1/2 -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;

            return (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className="relative group transition-all duration-300"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative z-10",
                  isActive
                    ? "bg-white border-primary shadow-lg scale-110"
                    : isCompleted ? "bg-primary border-transparent" : "bg-secondary border-secondary"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : isCompleted ? "text-white" : "text-muted-foreground/50"
                  )} />
                </div>
                {/* Mobile Step Label - Optional, hidden for max compactness */}
                <div className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-tight transition-opacity whitespace-nowrap",
                  isActive ? "opacity-100 text-foreground" : "opacity-0"
                )}>
                  Step {index + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active View Area */}
        <div className="relative min-h-[360px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full bg-primary/5 rounded-[2.5rem] p-6 border border-primary/10 shadow-sm flex flex-col items-center"
            >
              {/* Compact GIF */}
              <div className="relative w-48 h-48 rounded-[2rem] overflow-hidden mb-6 bg-white shadow-md border-4 border-white">
                <Image
                  src={steps[activeStep].gif}
                  alt={steps[activeStep].title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-black text-xl mb-2 uppercase tracking-tight">
                  {steps[activeStep].title}
                </h3>
                <p className="text-muted-foreground text-sm font-semibold leading-relaxed px-2">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Step Progress Pills */}
              <div className="flex gap-1.5 mt-8">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      activeStep === i ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


      </div>
    </section>
  );
}
