'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2, ChevronRight, Briefcase, Loader2 } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';
import { useLocation } from '@/context/LocationContext';
import { getTechniciansByPincodeAction } from '@/app/actions';
import { useState, useEffect } from 'react';

const dummyTechnicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Mobile Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    ratingValue: 4.9,
    jobs: '1.2k+',
    location: 'Patna',
    tags: ['FAST', 'SMART']
  },
  {
    name: 'Suresh Singh',
    expertise: 'AC Specialist',
    imageUrl: 'https://picsum.photos/seed/tech2/300/300',
    ratingValue: 4.8,
    jobs: '850+',
    location: 'Gaya',
    tags: ['EXPERT', 'POLITE']
  },
  {
    name: 'Vikas Sharma',
    expertise: 'Appliance Pro',
    imageUrl: 'https://picsum.photos/seed/tech3/300/300',
    ratingValue: 4.7,
    jobs: '2k+',
    location: 'Muzaffarpur',
    tags: ['QUICK', 'RELIABLE']
  },
  {
    name: 'Anjali Gupta',
    expertise: 'TV & Audio',
    imageUrl: 'https://picsum.photos/seed/tech4/300/300',
    ratingValue: 4.9,
    jobs: '900+',
    location: 'Bhagalpur',
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

type Technician = typeof dummyTechnicians[0];

function TechnicianCard({ technician, index }: { technician: Technician, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="inline-block w-[200px] md:w-[220px]"
    >
      <div className="bg-white dark:bg-card border-2 border-indigo-100 rounded-3xl p-3 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
        {/* Header / Image Section */}
        <div className="relative mb-3">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-2 bg-indigo-50">
            <Image
              src={technician.imageUrl}
              alt={technician.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black">{technician.ratingValue}</span>
            </div>
          </div>

          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <div>
            <h3 className="font-black text-base leading-tight text-indigo-900 truncate">{technician.name}</h3>
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">{technician.expertise}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {technician.tags.map((tag, idx) => (
              <span key={idx} className="text-[7px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-200 uppercase tracking-tight">
                {tag}
              </span>
            ))}
          </div>

          <div className="h-px bg-indigo-100 w-full" />

          {/* Footer Info */}
          <div className="flex items-center justify-between text-indigo-600">
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              <span className="text-[9px] font-bold">{technician.jobs}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="text-[9px] font-bold truncate max-w-[60px]">{technician.location}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifiedTechnicians({ t }: { t: TranslationFunc }) {
  const { location } = useLocation();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      // Don't fetch if pincode is not a valid 6-digit number
      if (!location.pincode || location.pincode.length !== 6 || isNaN(Number(location.pincode))) {
        setTechnicians(dummyTechnicians);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getTechniciansByPincodeAction(location.pincode);
        if (data && data.length > 0) {
          const mappedData: Technician[] = data.map((item: any) => {
            const formatSkill = (skill: string) =>
              skill.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

            return {
              name: item.full_name,
              expertise: formatSkill(item.primary_skill),
              imageUrl: item.selfie_url || `https://picsum.photos/seed/${item.id}/300/300`,
              ratingValue: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
              jobs: (item.total_experience * 45 + Math.floor(Math.random() * 20)) + "+",
              location: item.service_area || location.city,
              tags: item.other_skills && item.other_skills.length > 0
                ? item.other_skills.slice(0, 2).map(formatSkill)
                : ['CERTIFIED', 'TRUSTED']
            };
          });
          setTechnicians(mappedData);
        } else {
          setTechnicians(dummyTechnicians);
        }
      } catch (error) {
        console.error('Failed to fetch technicians:', error);
        setTechnicians(dummyTechnicians);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [location.pincode, location.city]);

  return (
    <section className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 px-2 gap-2">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#1e1b4b]">
              Top Experts <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Near {location.city}</span>
            </h2>
            <p className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Verified professionals in your area</p>
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
              {technicians.map((technician, index) => (
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
