'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote, Star, Heart } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';

export default function Testimonials({ t }: { t: TranslationFunc }) {
  const testimonials = [
    {
      name: 'Priya S.',
      location: 'Patna',
      avatar: 'PS',
      comment: t('testimonial1'),
      rating: 5
    },
    {
      name: 'Amit K.',
      location: 'Danapur',
      avatar: 'AK',
      comment: t('testimonial2'),
      rating: 5
    },
    {
      name: 'Sunita D.',
      location: 'Khagaul',
      avatar: 'SD',
      comment: t('testimonial3'),
      rating: 5
    },
    {
      name: 'Rohan V.',
      location: 'Boring Road',
      avatar: 'RV',
      comment: "My washing machine wasn't working. The technician fixed it in no time. Very professional service.",
      rating: 5
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#1e1b4b] mb-2">
            Loved by <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Locals</span>
          </h2>
          <p className="text-sm md:text-base text-indigo-600 font-bold">Join 50,000+ satisfied neighbors who trust Hellofixo</p>
        </div>

        {/* Scrolling List */}
        <div className="relative">
          <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 pb-8 snap-x snap-mandatory -mx-4 px-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="snap-center shrink-0 w-[290px] md:w-[380px]"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:bg-slate-900/40 border-2 border-indigo-100 rounded-3xl p-6 md:p-8 h-full relative group hover:border-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {/* Quote Icon Background */}
                  <div className="absolute top-6 right-8 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                    <Quote className="w-20 h-20 text-indigo-600 rotate-180" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12 border-2 border-indigo-200 shadow-md">
                        <AvatarImage
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}&backgroundColor=4f46e5&fontFamily=Arial&fontWeight=700`}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="font-black bg-indigo-600 text-white">{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-black text-sm md:text-base text-indigo-900">{testimonial.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{testimonial.location}</span>
                          <div className="w-1 h-1 bg-indigo-300 rounded-full" />
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-2.5 h-2.5 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="flex-grow">
                      <p className="text-sm md:text-base text-indigo-900 font-medium leading-relaxed italic">
                        "{testimonial.comment}"
                      </p>
                    </div>

                    {/* Footer Badge */}
                    <div className="mt-6 flex items-center gap-2">
                      <div className="bg-indigo-100 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
