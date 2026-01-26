'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2, ChevronRight, Briefcase, Loader2, Clock } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';
import { useLocation } from '@/context/LocationContext';
import { getTechniciansByPincodeAction } from '@/app/actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const dummyTechnicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Mobile Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    ratingValue: 4.9,
    jobs: '1.2k+',
    location: 'Near you',
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
    location: 'Near you',
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
    location: 'Near you',
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
    location: 'Near you',
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
    location: 'Near you',
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
      className="inline-block w-[280px] md:w-[320px]"
    >
      <div className="bg-white dark:bg-card border border-slate-100 dark:border-slate-800 rounded-[2rem] p-4 shadow-xl shadow-indigo-50/50 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 group">
        <div className="flex items-start gap-4 mb-4">
          {/* Circular Image with Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-indigo-50 ring-4 ring-indigo-50 dark:ring-slate-800">
              <Image
                src={technician.imageUrl}
                alt={technician.name}
                fill
                className="object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full shadow-lg border-2 border-white ring-2 ring-indigo-100">
              <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </div>
          </div>

          {/* Name, Skill and Rating */}
          <div className="flex-grow pt-1 min-w-0">
            <h3 className="font-black text-lg md:text-xl leading-tight text-indigo-950 truncate mb-1">
              {technician.name}
            </h3>
            <p className="text-[10px] md:text-xs font-black text-indigo-600/70 uppercase tracking-wider mb-2">{technician.expertise}</p>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.floor(technician.ratingValue) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs md:text-sm font-black text-slate-500">{technician.ratingValue}</span>
            </div>
          </div>
        </div>

        {/* Distance / Time Info */}
        <div className="flex items-center gap-6 mb-4 px-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-50" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">10 min away</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-50" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">{technician.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-indigo-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 flex items-center justify-center gap-2 text-indigo-600 transition-colors group-hover:bg-indigo-100">
            <Briefcase className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs font-black truncate">{technician.jobs} Works</span>
          </div>
          {!technician.isDummy && (
            <button
              onClick={() => router.push(`/book/${technician.skillSlug}`)}
              className="flex-[1.2] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 font-black text-xs md:text-sm shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifiedTechnicians({ t }: { t: TranslationFunc }) {
  const { location } = useLocation();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  console.log(technicians);
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
              Top Experts <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Near {technicians?.[0]?.location ? technicians?.[0]?.location : "You"}</span>
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
