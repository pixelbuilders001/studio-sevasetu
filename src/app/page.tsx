
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServiceCategoriesAction } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrustIndicators from '@/components/TrustIndicators';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { getTranslations } from '@/lib/get-translation';
import VerifiedTechnicians from '@/components/VerifiedTechnicians';
import { ArrowRight, Award, ShieldCheck, Clock, Shield, Zap, Briefcase, ChevronRight, Search, IndianRupee, Star } from 'lucide-react';
import type { ServiceCategory } from '@/lib/data';
import BecomePartner from '@/components/BecomePartner';
import HeroCTA from '@/components/HeroCTA';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import AllServicesSheet from '@/components/AllServicesSheet';
import BookingTrackerModal from '@/components/BookingTrackerModal';
import { useLocation } from '@/context/LocationContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedHeroText from '@/components/AnimatedHeroText';
import FullScreenLoader from '@/components/FullScreenLoader';
import ReferralBanner from '@/components/ReferralBanner';
import { Skeleton } from '@/components/ui/skeleton';
import LocationSelector from '@/components/LocationSelector';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProfileSheet } from '@/components/profile/ProfileSheet';
import DesktopHero from '@/components/DesktopHero';
import UserAuthSheet from '@/components/UserAuthSheet';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { User, Bell } from 'lucide-react';
import { checkRestricted } from '@/utils/auth';
import AppDownloadBanner from '@/components/AppDownloadBanner';
import { cn } from '@/lib/utils';


function ServiceCardSkeleton() {
  return (
    <Card className="bg-white dark:bg-card border-none shadow-soft h-full flex flex-col items-center justify-center p-4">
      <Skeleton className="w-16 h-16 mb-3 rounded-2xl" />
      <Skeleton className="h-4 w-20 mb-1 rounded" />
      <Skeleton className="h-3 w-12 rounded-full" />
    </Card>
  );
}

// Redesigned Service Card for Mobile Grid
// Mobile Service Card (Circular)
function MobileServiceCard({ category }: { category: ServiceCategory }) {
  const { location, isServiceable, setDialogOpen } = useLocation();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isServiceable) {
      e.preventDefault();
      setDialogOpen(true);
    } else {
      setIsNavigating(true);
      setTimeout(() => {
        router.push(`/book/${category.slug}`);
      }, 100);
    }
  };

  return (
    <>
      {isNavigating && <FullScreenLoader />}
      <div onClick={handleClick} className="group flex flex-col items-center cursor-pointer w-full p-1">
        <div className="w-[4.5rem] h-[4.5rem] rounded-[1.25rem] bg-indigo-50/80 flex items-center justify-center mb-2 overflow-hidden shadow-sm border border-indigo-100/50 transition-all active:scale-95 group-hover:bg-primary/5 group-hover:shadow-md">
          <div className="relative w-10 h-10">
            <Image
              src={category.image.imageUrl}
              alt={category.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h3 className="text-[11px] font-bold text-center text-foreground leading-tight px-1 line-clamp-2">
          {category.name}
        </h3>
      </div>
    </>
  );
}

// Desktop Service Card (Original Card Style)
function ServiceCard({ category }: { category: ServiceCategory }) {
  const { location, isServiceable, setDialogOpen } = useLocation();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isServiceable) {
      e.preventDefault();
      setDialogOpen(true);
    } else {
      setIsNavigating(true);
      setTimeout(() => {
        router.push(`/book/${category.slug}`);
      }, 100);
    }
  };

  const inspectionFee = category.base_inspection_fee * location.inspection_multiplier;

  return (
    <>
      {isNavigating && <FullScreenLoader />}
      <div onClick={handleClick} className="group block h-full cursor-pointer">
        <Card className="bg-white dark:bg-card border-none shadow-soft hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center justify-center p-4 active:scale-95">
          <div className="relative w-16 h-16 mb-3 bg-secondary/50 rounded-2xl p-3 group-hover:bg-primary/10 transition-colors">
            <Image
              src={category.image.imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 20vw, 15vw"
              className="object-contain p-1"
              data-ai-hint={category.image.imageHint}
            />
          </div>
          <h3
            className="font-black text-sm text-primary text-center leading-tight mb-1"
            style={{
              textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
            }}
          >
            {category.name}
          </h3>
          {isServiceable && (
            <div className="text-[10px] font-medium text-muted-foreground flex items-center bg-secondary px-2 py-0.5 rounded-full">
              <IndianRupee className="w-2.5 h-2.5 mr-0.5" />
              {inspectionFee}+
            </div>
          )}
        </Card>
      </div>
    </>
  );
}


import { useAuth } from '@/context/AuthContext';

import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel-react';
import { useCallback } from 'react';

export default function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { lang } = use(searchParams);
  const { t } = useTranslation();
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  const banners = [
    {
      title: "Mobile Repair at Your Door",
      highlight: "Save Time",
      desc: "Get your phone fixed in 60 minutes with Bihar's top verified experts.",
      img: "/hero-mobile-new.jpg",
      gradient: "from-blue-600/80 to-transparent"
    },
    {
      title: "Expert Screen Replacement",
      highlight: "Genuine Parts",
      desc: "Fix cracked screens with original spare parts and 30 days warranty.",
      img: "/hero-screen.png",
      gradient: "from-indigo-600/80 to-transparent"
    },
    {
      title: "Professional Tech Support",
      highlight: "Verified Pros",
      desc: "Expert diagnosis and repair for all your mobile hardware issues.",
      img: "/hero-battery.png",
      gradient: "from-emerald-600/80 to-transparent"
    }
  ];

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const { session, loading: authLoading } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getServiceCategoriesAction();
        setCategories(data);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const featureCards = [
    {
      icon: ShieldCheck,
      title: t('verifiedTechniciansTitle', { defaultValue: 'Verified' }),
      description: t('verifiedTechniciansDesc', { defaultValue: 'SAFE PROS' }),
    },
    {
      icon: Clock,
      title: 'Fast',
      description: '60 MIN VISIT',
    },
    {
      icon: Shield,
      title: 'Warranty',
      description: '30 DAYS',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/10 pb-10">
      {/* Desktop Hero (md+) */}
      <div className="hidden md:block">
        <DesktopHero />
      </div>

      {/* Mobile Hero (md hidden) */}
      <div className="md:hidden bg-white">
        {/* Header / Nav */}
        <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex-1 mr-4">
            <LocationSelector isHero={false} />
          </div>
          <div className="flex-shrink-0">
            {session ? (
              <ProfileSheet isHero={false} />
            ) : (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <div className="w-9 h-9 bg-secondary/50 rounded-full flex items-center justify-center border border-border cursor-pointer active:scale-95 transition-transform">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="rounded-t-3xl h-[80dvh] inset-x-0 bottom-0 border-t bg-white p-0 flex flex-col"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <UserAuthSheet setSheetOpen={setSheetOpen} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Hero Banner Carousel */}
        <div className="relative group overflow-hidden">
          <div className="mx-4 mt-2 overflow-hidden rounded-[2rem] shadow-xl shadow-blue-100/50 aspect-[16/10]" ref={emblaRef}>
            <div className="flex">
              {banners.map((banner, index) => (
                <div key={index} className="relative flex-[0_0_100%] aspect-[16/10]">
                  <Image
                    src={banner.img}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Modern Glassy Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr flex items-center p-6",
                    banner.gradient
                  )}>
                    <div className="max-w-[80%] text-white animate-in fade-in slide-in-from-left-4 duration-700">
                      <div className="mb-2">
                        <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/20">
                          {banner.highlight}
                        </span>
                      </div>
                      <h1 className="text-2xl font-black leading-tight mb-2 drop-shadow-md">
                        {banner.title.split(' ').map((word, i) => (
                          i === 1 ? <span key={i} className="text-blue-200">{word} </span> : word + ' '
                        ))}
                      </h1>
                      <p className="text-[11px] font-medium opacity-90 mb-4 leading-relaxed line-clamp-2">
                        {banner.desc}
                      </p>
                      <HeroCTA />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-1.5 mt-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  selectedIndex === i
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-gray-200"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <section id="services" className="mt-8 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-[#1e1b4b]">
              Popular <span className="text-primary">Services</span>
            </h2>
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex items-center text-xs font-bold text-primary cursor-pointer">
                  See all <ChevronRight className="w-3 h-3 ml-0.5" />
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-3xl">
                <AllServicesSheet />
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))
              : categories.slice(0, 8).map((category) => ( // Show up to 8 items in a 4x2 grid
                <div key={category.id} className="flex flex-col items-center">
                  <MobileServiceCard category={category} />
                </div>
              ))
            }
          </div>

        </section>

        {/* Verified Technicians (Mobile) */}
        <div className="mt-4">
          <VerifiedTechnicians t={t} isMobile={true} />
        </div>
      </div >

      {/* Services Grid (Desktop Only) */}
      < section id="services-desktop" className="hidden md:block container mx-auto px-4 md:px-8 mt-12 md:mt-24" >
        <div className="flex justify-between items-end mb-6 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-6xl font-black tracking-tight text-[#1e1b4b]">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-xs md:text-xl text-indigo-600/60 font-bold mt-1 md:mt-4">Quality repairs at your doorstep</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-auto py-2 px-3 text-sm font-black flex items-center group md:text-lg md:px-8 md:py-4 md:rounded-2xl">
                <span>{t('viewAll', { defaultValue: 'View All' })}</span>
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform md:w-6 md:h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-3xl md:h-[80vh] md:max-w-4xl md:mx-auto md:rounded-[3rem] md:bottom-10 md:inset-x-10">
              <AllServicesSheet />
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8">
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : categories.slice(0, 6).map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))
          }
        </div>
      </section >

      {/* Referral Banner */}
      < section className="container mx-auto px-4 md:px-8 md:mt-24" >
        <ReferralBanner />
      </section >

      {/* Quick Features */}
      {/* Quick Features */}
      <section className="py-2 md:py-20 mb-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8">
            {featureCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center justify-center bg-slate-50 py-3 px-1 md:py-10 md:px-6 rounded-xl md:rounded-3xl border border-slate-100/50 text-center transition-all hover:shadow-sm">
                <div className="w-9 h-9 md:w-16 md:h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2 md:mb-6">
                  <card.icon className="w-4 h-4 md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] md:text-xl font-extrabold uppercase tracking-tight text-indigo-950 leading-tight">{card.title}</span>
                  <span className="text-[9px] md:text-xs text-indigo-500 font-semibold uppercase tracking-wider leading-tight">{card.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-card rounded-t-3xl md:rounded-t-[5rem] shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] pt-8 pb-12 md:pt-20 md:pb-24">
        <div id="how-it-works" className="container mx-auto px-4 md:px-8">
          <HowItWorks t={t} />
        </div>

        {/* Live Tracking Card */}
        <section className="container mx-auto px-4 md:px-8 mt-12 md:mt-24">
          <BookingTrackerModal asChild={true}>
            <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl active:scale-98 transition-all cursor-pointer relative overflow-hidden group">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 mix-blend-overlay" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl -ml-20 -mb-20 opacity-60 mix-blend-overlay" />

              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Search className="w-32 h-32 md:w-64 md:h-64 -mr-8 -mt-8 text-white" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-6">
                    <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-white"></span>
                    </span>
                    <p className="text-[9px] md:text-sm font-bold uppercase tracking-[0.2em] text-white/70">Live Tracker</p>
                  </div>
                  <h3 className="text-xl md:text-4xl font-black mb-2 text-white tracking-tight">Track Your <span className="text-indigo-200">Repair</span></h3>
                  <p className="text-white/70 text-xs md:text-lg font-medium max-w-xl">Get real-time updates on your service request status.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 md:p-6 rounded-xl md:rounded-3xl shadow-2xl group-hover:bg-white transition-all duration-500 border border-white/20">
                  <ChevronRight className="w-6 h-6 md:w-10 md:h-10 text-white group-hover:text-primary" />
                </div>
              </div>
            </div>
          </BookingTrackerModal>
        </section>

        <div className="mt-20 md:mt-24 hidden md:block">
          <VerifiedTechnicians t={t} />
        </div>

        <section id="why-choose-us" className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <TrustIndicators t={t} />
          </div>
        </section>

        <div className="mt-12 md:mt-0">
          <Testimonials t={t} />
        </div>

        <AppDownloadBanner />

        <BecomePartner />

        {/* Mobile-only Footer Signature */}
        <div className="md:hidden mt-8 pb-12 text-center border-t border-border/50 pt-8 px-6">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo-image.png"
              alt="helloFixo"
              width={120}
              height={40}
              className="h-8 w-auto object-contain opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Leading the way in doorstep mobile and appliance repairs across Bihar. Join thousands of happy customers today.
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary">Terms</Link>
            <Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary">Support</Link>
          </div>
          <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} helloFixo &bull; Crafted with love
          </p>
        </div>
      </div>
    </div >
  );
}

