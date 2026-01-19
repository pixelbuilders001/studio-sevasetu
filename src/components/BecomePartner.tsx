'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Briefcase, Zap, Clock, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BecomePartner() {
  const stats = [
    {
      icon: Wallet,
      value: '₹40k+',
      label: 'Monthly Earnings',
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
      label: 'Joining Fee',
    }
  ];

  return (
    <section className="py-8 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl overflow-hidden shadow-2xl">
          {/* Decorative Backdrops */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center">
            {/* Visual Part - Left on Desktop */}
            <div className="w-full lg:w-5/12 relative aspect-[2/1] lg:aspect-auto self-stretch min-h-[180px] md:min-h-[300px]">
              <Image
                src="/partner-on-scooter.png"
                alt="SevaSetu Partner"
                fill
                className="object-cover object-top scale-110 lg:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/10 to-indigo-600 lg:hidden" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-indigo-600 to-transparent hidden lg:block" />
            </div>

            {/* Content Part - Right on Desktop */}
            <div className="w-full lg:w-7/12 p-6 md:p-12 lg:pl-0 text-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-4 md:mb-6 border border-white/20"
              >
                <Briefcase className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-black tracking-widest uppercase">Join Our Fleet</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-5xl font-black font-headline mb-3 md:mb-4 leading-[1.1] tracking-tight"
              >
                Earn Big with <br />
                <span className="text-yellow-300 italic">SevaSetu</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-indigo-50/80 mb-6 max-w-lg text-xs md:text-lg font-medium leading-relaxed"
              >
                Join the fastest growing service network in Bihar. Start earning from day one.
              </motion.p>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 md:p-4 rounded-[1.25rem] md:rounded-[1.5rem] flex flex-col items-center justify-center transition-all hover:bg-white/20">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white mb-1.5 md:mb-2 opacity-90" />
                    <span className="font-black text-lg md:text-xl leading-none mb-1">{stat.value}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-white/60 text-center">{stat.label}</span>
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
                  className="w-full md:w-auto bg-white text-indigo-700 hover:bg-indigo-50 font-black text-sm md:text-lg h-12 md:h-16 rounded-2xl px-8 md:px-10 shadow-xl transition-all group active:scale-95"
                  onClick={() => {
                    window.open('https://studio-technician.vercel.app/signup', '_blank');
                  }}
                >
                  Register as Partner
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Accent for Desktop */}
        <div className="hidden lg:block mt-20 text-center">
          <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-border" />
            Bihar's #1 Service Provider Network
            <span className="w-8 h-px bg-border" />
          </p>
        </div>
      </div>
    </section>
  );
}
