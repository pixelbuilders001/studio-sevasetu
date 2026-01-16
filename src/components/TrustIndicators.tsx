'use client';

import { motion } from 'framer-motion';
import { Gem, Award, ReceiptText, ShieldAlert, Users } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';

export default function TrustIndicators({ t }: { t: TranslationFunc }) {
  const indicators = [
    {
      icon: Gem,
      title: 'ASLI PARTS',
      description: '100% genuine spares.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Award,
      title: 'EXPERT PROS',
      description: 'Verified & certified.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: ReceiptText,
      title: 'PAKKA BILL',
      description: 'Fair, transparent fees.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: ShieldAlert,
      title: 'WARRANTY',
      description: '30-day guarantee.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

          {/* Header Section */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-4"
            >
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Trusted by 50k+</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black font-headline mb-4 leading-tight text-foreground"
            >
              Why Choose <br className="hidden md:block" />
              <span className="text-primary">SevaSetu?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-sm md:text-lg font-medium max-w-md mx-auto lg:mx-0"
            >
              We bring transparency and trust back to local home services and repairs.
            </motion.p>
          </div>

          {/* Indicators Grid */}
          <div className="w-full lg:w-7/12 grid grid-cols-2 gap-3 md:gap-4">
            {indicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="group p-4 md:p-6 bg-white dark:bg-card border border-border/50 rounded-[2rem] shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${indicator.bgColor} flex items-center justify-center mb-3 md:mb-4 group-hover:rotate-12 transition-transform`}>
                  <indicator.icon className={`w-5 h-5 md:w-6 md:h-6 ${indicator.color}`} />
                </div>
                <h3 className="font-black text-xs md:text-base text-foreground mb-1 uppercase tracking-tight">{indicator.title}</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground font-medium leading-tight">{indicator.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
