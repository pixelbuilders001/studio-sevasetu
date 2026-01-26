'use client';

import { motion } from 'framer-motion';
import { Gem, Award, ReceiptText, ShieldAlert } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';

export default function TrustIndicators({ t }: { t: TranslationFunc }) {
  const indicators = [
    {
      icon: Gem,
      title: 'ASLI PARTS',
      description: '100% genuine spares.',
    },
    {
      icon: Award,
      title: 'EXPERT PROS',
      description: 'Verified & certified.',
    },
    {
      icon: ReceiptText,
      title: 'PAKKA BILL',
      description: 'Fair, transparent fees.',
    },
    {
      icon: ShieldAlert,
      title: 'WARRANTY',
      description: '30-day guarantee.',
    },
  ];

  return (
    <section className="py-4 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-xl group">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20 opacity-40 mix-blend-overlay" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl -mr-20 -mb-20 opacity-60 mix-blend-overlay" />

          {/* Header Section */}
          <div className="text-center mb-6 md:mb-12 relative z-10">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2">
              Why Choose <span className="text-indigo-200 italic">Hellofixo?</span>
            </h2>
            <p className="text-xs md:text-base text-indigo-100/80 font-bold uppercase tracking-widest">Transparency and trust in every service</p>
          </div>

          {/* Indicators Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 relative z-10">
            {indicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl shadow-lg hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                  <indicator.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="font-bold text-xs md:text-base text-white mb-1 uppercase tracking-tight">{indicator.title}</h3>
                <p className="text-[10px] md:text-sm text-indigo-100 font-medium leading-tight">{indicator.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
