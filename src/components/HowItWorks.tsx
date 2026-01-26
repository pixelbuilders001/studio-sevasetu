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
    <section className="py-5 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-xl">
          {/* Background Overlay for texture */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 opacity-50" />

          {/* Header */}
          <div className="text-center mb-8 md:mb-12 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-black tracking-tight text-white mb-4"
            >
              How it <span className="text-indigo-200 italic">Works</span>
            </motion.h2>
            <div className="h-1.5 w-16 bg-white/20 mx-auto mt-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                animate={{ width: `${(activeStep + 1) * 25}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Interactive Step Navigation */}
          <div className="flex justify-between items-center mb-12 relative px-2 md:px-8 z-10">
            {/* Connecting Line Backdrop */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 md:h-1 bg-white/20 -translate-y-1/2 -z-10 rounded-full" />

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
                    "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative z-10 shadow-lg",
                    isActive
                      ? "bg-white border-white scale-110"
                      : isCompleted ? "bg-indigo-300 border-indigo-300" : "bg-indigo-900/50 border-indigo-500/50 backdrop-blur-md"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 md:w-7 md:h-7 transition-colors",
                      isActive ? "text-primary" : "text-white"
                    )} />
                  </div>
                  {/* Step Label */}
                  <div className={cn(
                    "absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-bold uppercase tracking-tight transition-opacity whitespace-nowrap",
                    isActive ? "opacity-100 text-white" : "opacity-60 text-indigo-300"
                  )}>
                    Step {index + 1}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active View Area */}
          <div className="relative min-h-[340px] md:min-h-[300px] flex flex-col items-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/20 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12"
              >
                {/* GIF Container */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-2xl border-4 border-white/20 flex-shrink-0">
                  <Image
                    src={steps[activeStep].gif}
                    alt={steps[activeStep].title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="text-center md:text-left flex-1 flex flex-col justify-center h-full py-4">
                  <h3 className="font-bold text-lg md:text-3xl mb-3 uppercase tracking-tight text-white">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-indigo-100/90 text-sm md:text-lg font-medium leading-relaxed">
                    {steps[activeStep].description}
                  </p>

                  {/* Step Progress Pills - Desktop */}
                  <div className="hidden md:flex gap-2 mt-8">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          activeStep === i ? "w-12 bg-white" : "w-2 bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Progress Pills - Mobile */}
                <div className="flex md:hidden gap-2 mt-2">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        activeStep === i ? "w-8 bg-white" : "w-1.5 bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
