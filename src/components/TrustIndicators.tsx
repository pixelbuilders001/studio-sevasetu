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
    <section className="py-5 md:py-20 bg-white dark:bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#1e1b4b] mb-2">
            Why Choose <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">SevaSetu?</span>
          </h2>
          <p className="text-sm md:text-base text-indigo-600 font-bold">Transparency and trust in every service</p>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {indicators.map((indicator, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-100 rounded-3xl shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <indicator.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="font-black text-sm md:text-base text-indigo-900 mb-2 uppercase tracking-tight">{indicator.title}</h3>
              <p className="text-xs md:text-sm text-indigo-600 font-bold leading-tight">{indicator.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
