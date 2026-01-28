'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Briefcase, Zap, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BecomePartner() {
  const stats = [
    {
      icon: Wallet,
      value: '₹40k+',
      label: 'Earnings',
    },
    {
      icon: Zap,
      value: 'Daily',
      label: 'Payouts',
    },
    {
      icon: Clock,
      value: 'Flexible',
      label: 'Timings',
    },
    {
      icon: TrendingUp,
      value: 'Zero',
      label: 'Fee',
    }
  ];

  return (
    <section className="mt-20 md:mt-40 mb-12 md:mb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-20 -mt-20 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-20 -mb-20 blur-[80px]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center">
            {/* Content Part - Priority for mobile */}
            <div className="w-full lg:w-7/12 p-8 md:p-14 lg:p-16 text-white z-20">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-6 border border-white/10"
              >
                <Briefcase className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-100">Join Your City's #1 Fleet</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-[1.1] tracking-tight"
              >
                Earn Big with <br />
                <span className="text-indigo-300 italic">helloFixo</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-indigo-100/70 mb-8 max-w-md text-sm md:text-lg font-medium leading-relaxed"
              >
                Join the fastest growing service network. Start earning from day one with daily payouts.
              </motion.p>

              {/* Stats Bar - Compact for Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/5 px-4 py-2.5 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-sm leading-none text-white">{stat.value}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-200/50">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-white text-indigo-900 hover:bg-slate-50 font-black text-sm md:text-base h-12 md:h-14 rounded-2xl px-10 shadow-xl transition-all group active:scale-95"
                  onClick={() => {
                    window.open('https://technician.hellofixo.in/signup', '_blank');
                  }}
                >
                  Register as Partner
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>

            {/* Visual Part - Premium Phone Mockup */}
            <div className="absolute top-0 right-0 w-full lg:w-5/12 h-full pointer-events-none z-10 overflow-hidden">
              {/* Phone Mockup with Expert Screen */}
              <div className="absolute top-1/2 lg:top-[15%] -right-16 lg:right-12 w-[220px] lg:w-[340px] -translate-y-1/2 lg:translate-y-0 opacity-100">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 40, delay: 0.2 }}
                  className="relative aspect-[1/2] -rotate-4"
                >
                  <div className="absolute inset-0 bg-[#0f172a] rounded-[3rem] lg:rounded-[4.5rem] border-[10px] lg:border-[16px] border-[#1e1b4b] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/10">
                    <div className="relative h-full w-full bg-slate-900">
                      <Image
                        src="/partner-screen.jpg"
                        alt="Expert App Screen"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#1e1b4b]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Wallet } from 'lucide-react';
