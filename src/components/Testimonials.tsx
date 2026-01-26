'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote, Star } from 'lucide-react';
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
    <section className="py-6 md:py-12 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-xl">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl -ml-20 -mb-20 opacity-60 mix-blend-overlay" />

          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12 relative z-10">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2">
              Loved by <span className="text-indigo-200 italic">Locals</span>
            </h2>
            <p className="text-xs md:text-base text-indigo-100/80 font-bold uppercase tracking-widest">Join 50,000+ satisfied neighbors</p>
          </div>

          {/* Scrolling List */}
          <div className="relative z-10">
            <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-6 pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="snap-center shrink-0 w-[280px] md:w-[380px]"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:p-8 h-full relative group hover:bg-white/15 transition-all duration-300 shadow-lg">
                    {/* Quote Icon Background */}
                    <div className="absolute top-6 right-6 opacity-[0.1] group-hover:opacity-[0.15] transition-opacity">
                      <Quote className="w-12 h-12 md:w-16 md:h-16 text-white rotate-180" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-white/30 shadow-sm">
                          <AvatarImage
                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}&backgroundColor=4f46e5&fontFamily=Arial&fontWeight=700`}
                            alt={testimonial.name}
                          />
                          <AvatarFallback className="font-bold bg-white text-primary">{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-sm md:text-base text-white">{testimonial.name}</h4>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest leading-none">{testimonial.location}</span>
                            <div className="w-1 h-1 bg-white/40 rounded-full" />
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <div className="flex-grow">
                        <p className="text-xs md:text-base text-indigo-50 font-medium leading-relaxed italic">
                          "{testimonial.comment}"
                        </p>
                      </div>

                      {/* Footer Badge */}
                      <div className="mt-4 md:mt-6 flex items-center gap-2">
                        <div className="bg-white/20 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/10">
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
      </div>
    </section>
  );
}
