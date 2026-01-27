'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2, ChevronRight, Briefcase, Loader2, Clock } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';
import { useLocation } from '@/context/LocationContext';
import { getTechniciansByPincodeAction } from '@/app/actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const dummyTechnicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Mobile Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    ratingValue: 4.9,
    jobs: '1.2k+',
    location: 'You',
    tags: ['FAST', 'SMART'],
    skillSlug: 'phone',
    isDummy: true
  },
  {
    name: 'Suresh Singh',
    expertise: 'AC Specialist',
    imageUrl: 'https://picsum.photos/seed/tech2/300/300',
    ratingValue: 4.8,
    jobs: '850+',
    location: 'You',
    tags: ['EXPERT', 'POLITE'],
    skillSlug: 'ac',
    isDummy: true
  },
  {
    name: 'Vikas Sharma',
    expertise: 'Appliance Pro',
    imageUrl: 'https://picsum.photos/seed/tech3/300/300',
    ratingValue: 4.7,
    jobs: '2k+',
    location: 'You',
    tags: ['QUICK', 'RELIABLE'],
    skillSlug: 'fridge',
    isDummy: true
  },
  {
    name: 'Anjali Gupta',
    expertise: 'TV & Audio',
    imageUrl: 'https://picsum.photos/seed/tech4/300/300',
    ratingValue: 4.9,
    jobs: '900+',
    location: 'You',
    tags: ['CERTIFIED', 'PROFESSIONAL'],
    skillSlug: 'tv',
    isDummy: true
  },
  {
    name: 'Prakash Rao',
    expertise: 'Washing Machine',
    imageUrl: 'https://picsum.photos/seed/tech5/300/300',
    ratingValue: 4.8,
    jobs: '1.5k+',
    location: 'You',
    tags: ['TRUSTED'],
    skillSlug: 'washing-machine',
    isDummy: true
  }
];

type Technician = typeof dummyTechnicians[0];

function TechnicianCard({ technician, index }: { technician: Technician, index: number }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="inline-block w-[260px] md:w-[320px]"
    >
      <div className="bg-slate-50 dark:bg-card border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start gap-3 mb-3">
          {/* Circular Image with Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-white ring-2 ring-white dark:ring-slate-800 shadow-sm">
              <Image
                src={technician.imageUrl}
                alt={technician.name}
                fill
                className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-white">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          {/* Name, Skill and Rating */}
          <div className="flex-grow pt-0.5 min-w-0">
            <h3 className="font-bold text-base md:text-lg leading-tight text-slate-800 truncate mb-0.5">
              {technician.name}
            </h3>
            <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">{technician.expertise}</p>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.floor(technician.ratingValue) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600">{technician.ratingValue}</span>
            </div>
          </div>
        </div>

        {/* Distance / Time Info */}
        <div className="flex items-center gap-4 mb-4 px-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 opacity-70" />
            <span className="text-[10px] md:text-xs font-medium whitespace-nowrap">10 min</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 opacity-70" />
            <span className="text-[10px] md:text-xs font-medium whitespace-nowrap">{technician.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 flex items-center justify-center gap-1.5 text-slate-600 border border-slate-200/50">
            <Briefcase className="w-3 h-3" />
            <span className="text-[10px] font-bold truncate">{technician.jobs} Jobs</span>
          </div>
          {!technician.isDummy && (
            <button
              onClick={() => router.push(`/book/${technician.skillSlug}`)}
              className="flex-[1.2] bg-indigo-100/80 hover:bg-indigo-200 text-indigo-700 rounded-lg px-3 py-2 font-bold text-xs shadow-sm transition-colors"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifiedTechnicians({ t, isMobile = false }: { t: TranslationFunc, isMobile?: boolean }) {
  const { location } = useLocation();

  const { data: technicians = dummyTechnicians, isLoading: loading } = useQuery({
    queryKey: ['technicians', location.pincode],
    queryFn: async () => {
      // Don't fetch if pincode is not a valid 6-digit number
      if (!location.pincode || location.pincode.length !== 6 || isNaN(Number(location.pincode))) {
        return dummyTechnicians;
      }

      try {
        const data = await getTechniciansByPincodeAction(location.pincode);
        if (data && data.length > 0) {
          return data.map((item: any) => {
            const formatSkill = (skill: string) =>
              skill.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

            return {
              name: item.full_name,
              expertise: formatSkill(item.primary_skill),
              skillSlug: item?.slug || 'phone',
              imageUrl: item.selfie_url || `https://picsum.photos/seed/${item.id}/300/300`,
              ratingValue: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
              jobs: (item.total_experience * 45 + Math.floor(Math.random() * 20)) + "+",
              location: item.service_area,
              isDummy: false,
              tags: item.other_skills && item.other_skills.length > 0
                ? item.other_skills.slice(0, 2).map(formatSkill)
                : ['CERTIFIED', 'TRUSTED']
            };
          });
        }
        return dummyTechnicians;
      } catch (error) {
        console.error('Failed to fetch technicians:', error);
        return dummyTechnicians;
      }
    },
    enabled: !!location.pincode,
  });

  return (
    <section className={`py-6 md:py-20 ${isMobile ? 'bg-transparent px-0' : 'bg-slate-50/50 dark:bg-slate-900/20'}`}>
      <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-4'}`}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 md:mb-10 px-2 gap-2">
          <div className="space-y-1">
            <h2 className={`${isMobile ? 'text-xl text-[#1e1b4b]' : 'text-2xl md:text-4xl text-[#1e1b4b]'} font-black tracking-tight`}>
              Top Experts <span className={isMobile ? 'text-primary' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent'}>Near {technicians?.[0]?.location}</span>
            </h2>
            {!isMobile && <p className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Verified professionals in your area</p>}
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-black text-indigo-600 hover:gap-3 transition-all">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrolling List */}
        <div className="relative -mx-4 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-8 snap-x snap-mandatory">
              {technicians.map((technician: Technician, index: number) => (
                <div key={index} className="snap-center first:pl-2 last:pr-4">
                  <TechnicianCard technician={technician} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile View All */}
        {/* <div className="md:hidden text-center mt-2">
          <button className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-full border-2 border-indigo-200 active:scale-95 transition-all">
            SEE ALL TECHNICIANS <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div> */}
      </div>
    </section>
  );
}
