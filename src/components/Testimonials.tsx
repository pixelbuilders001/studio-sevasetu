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
    <section className="py-12 md:py-24 bg-white dark:bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow-sm"
          >
            <Heart className="w-6 h-6 fill-red-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-headline tracking-tight text-foreground mb-4"
          >
            Loved by <span className="text-primary italic">Locals</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-lg font-medium max-w-md"
          >
            Join 50,000+ satisfied neighbors who trust SevaSetu for their daily repairs.
          </motion.p>
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
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-border/50 rounded-[2.5rem] p-6 md:p-8 h-full relative group hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-soft hover:shadow-xl">
                  {/* Quote Icon Background */}
                  <div className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Quote className="w-20 h-20 text-primary rotate-180" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarImage
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}&backgroundColor=2563eb&fontFamily=Arial&fontWeight=700`}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="font-black text-primary">{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-black text-sm md:text-base text-foreground font-headline">{testimonial.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{testimonial.location}</span>
                          <div className="w-1 h-1 bg-primary/20 rounded-full" />
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
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed italic">
                        "{testimonial.comment}"
                      </p>
                    </div>

                    {/* Footer Badge */}
                    <div className="mt-6 flex items-center gap-2">
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
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
