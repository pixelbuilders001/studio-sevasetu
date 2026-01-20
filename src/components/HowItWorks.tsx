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
    <section className="py-5 md:py-12 bg-white dark:bg-card overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-tight text-[#1e1b4b]"
          >
            How it <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent italic">Works</span>
          </motion.h2>
          <div className="h-1.5 w-16 bg-indigo-100 mx-auto mt-3 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500"
              animate={{ width: `${(activeStep + 1) * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Interactive Step Navigation */}
        <div className="flex justify-between items-center mb-10 relative px-2 md:px-8">
          {/* Connecting Line Backdrop */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-100 -translate-y-1/2 -z-10 rounded-full" />

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
                  "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative z-10 shadow-lg",
                  isActive
                    ? "bg-indigo-600 border-indigo-600 scale-110"
                    : isCompleted ? "bg-indigo-400 border-indigo-400" : "bg-white border-indigo-200"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 md:w-7 md:h-7 transition-colors",
                    isActive || isCompleted ? "text-white" : "text-indigo-300"
                  )} />
                </div>
                {/* Step Label */}
                <div className={cn(
                  "absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-black uppercase tracking-tight transition-opacity whitespace-nowrap",
                  isActive ? "opacity-100 text-indigo-600" : "opacity-60 text-indigo-400"
                )}>
                  Step {index + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active View Area */}
        <div className="relative min-h-[400px] md:min-h-[280px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 rounded-3xl p-6 md:p-6 border-2 border-indigo-200 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
            >
              {/* GIF Container */}
              <div className="relative w-56 h-56 md:w-56 md:h-56 rounded-3xl overflow-hidden bg-white shadow-2xl border-4 border-indigo-100 flex-shrink-0">
                <Image
                  src={steps[activeStep].gif}
                  alt={steps[activeStep].title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="text-center md:text-left flex-1 flex flex-col justify-center">
                <h3 className="font-black text-2xl md:text-2xl mb-3 uppercase tracking-tight text-indigo-900">
                  {steps[activeStep].title}
                </h3>
                <p className="text-indigo-600 text-sm md:text-sm font-bold leading-relaxed">
                  {steps[activeStep].description}
                </p>

                {/* Step Progress Pills - Desktop */}
                <div className="hidden md:flex gap-2 mt-6">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        activeStep === i ? "w-12 bg-indigo-600" : "w-2 bg-indigo-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Step Progress Pills - Mobile */}
              <div className="flex md:hidden gap-2 mt-4">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      activeStep === i ? "w-10 bg-indigo-600" : "w-1.5 bg-indigo-200"
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
