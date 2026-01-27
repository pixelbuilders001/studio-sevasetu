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
    <section className="py-4 md:py-12 bg-white dark:bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#1e1b4b] mb-2">
            Why Choose <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Hellofixo?</span>
          </h2>
          <p className="text-xs md:text-base text-indigo-600 font-bold uppercase tracking-widest">Transparency and trust in every service</p>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {indicators.map((indicator, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                <indicator.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="font-bold text-xs md:text-base text-indigo-900 mb-1 uppercase tracking-tight">{indicator.title}</h3>
              <p className="text-[10px] md:text-sm text-indigo-600 font-medium leading-tight">{indicator.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
