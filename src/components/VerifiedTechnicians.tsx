'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';

const technicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Mobile Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    ratingValue: 4.9,
    jobs: '1.2k+',
    location: 'Indiranagar',
    tags: ['FAST', 'SMART']
  },
  {
    name: 'Suresh Singh',
    expertise: 'AC Specialist',
    imageUrl: 'https://picsum.photos/seed/tech2/300/300',
    ratingValue: 4.8,
    jobs: '850+',
    location: 'Koramangala',
    tags: ['EXPERT', 'POLITE']
  },
  {
    name: 'Vikas Sharma',
    expertise: 'Appliance Pro',
    imageUrl: 'https://picsum.photos/seed/tech3/300/300',
    ratingValue: 4.7,
    jobs: '2k+',
    location: 'HSR Layout',
    tags: ['QUICK', 'RELIABLE']
  },
  {
    name: 'Anjali Gupta',
    expertise: 'TV & Audio',
    imageUrl: 'https://picsum.photos/seed/tech4/300/300',
    ratingValue: 4.9,
    jobs: '900+',
    location: 'Whitefield',
    tags: ['CERTIFIED', 'PROFESSIONAL']
  },
  {
    name: 'Prakash Rao',
    expertise: 'Washing Machine',
    imageUrl: 'https://picsum.photos/seed/tech5/300/300',
    ratingValue: 4.8,
    jobs: '1.5k+',
    location: 'Jayanagar',
    tags: ['TRUSTED']
  }
];

function TechnicianCard({ technician, index }: { technician: typeof technicians[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="inline-block w-[240px] md:w-[280px]"
    >
      <div className="bg-white dark:bg-card border border-border/50 rounded-[2rem] p-4 shadow-soft hover:shadow-xl transition-all duration-300 group">
        {/* Header / Image Section */}
        <div className="relative mb-4">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3">
            <Image
              src={technician.imageUrl}
              alt={technician.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black">{technician.ratingValue}</span>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <div>
            <h3 className="font-black text-lg font-headline leading-tight text-foreground truncate">{technician.name}</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{technician.expertise}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {technician.tags.map((tag, idx) => (
              <span key={idx} className="text-[8px] font-black px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full border border-border/40 uppercase tracking-tighter">
                {tag}
              </span>
            ))}
          </div>

          <div className="h-px bg-border/40 w-full" />

          {/* Footer Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="w-3 h-3" />
              <span className="text-[10px] font-bold">{technician.jobs} Jobs</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-bold">{technician.location}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifiedTechnicians({ t }: { t: TranslationFunc }) {
  return (
    <section className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12 px-2">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
            >
              <div className="w-6 h-px bg-primary" />
              Premium Service
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-foreground">
              Top Experts <span className="text-primary">Near You</span>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-black text-primary hover:gap-3 transition-all">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrolling List */}
        <div className="relative -mx-4 px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-8 snap-x snap-mandatory">
            {technicians.map((technician, index) => (
              <div key={index} className="snap-center first:pl-2 last:pr-4">
                <TechnicianCard technician={technician} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="md:hidden text-center mt-2">
          <button className="inline-flex items-center gap-2 text-xs font-black text-primary bg-primary/5 px-6 py-3 rounded-full border border-primary/10 active:scale-95 transition-all">
            SEE ALL TECHNICIANS <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
