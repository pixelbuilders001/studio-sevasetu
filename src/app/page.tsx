
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
import { ArrowRight, Award, ShieldCheck, Clock, Shield, Zap, Briefcase, ChevronRight, Search, IndianRupee } from 'lucide-react';
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


function ServiceCardSkeleton() {
  return (
    <Card className="bg-white dark:bg-card border-none shadow-soft h-full flex flex-col items-center justify-center p-4">
      <Skeleton className="w-16 h-16 mb-3 rounded-2xl" />
      <Skeleton className="h-4 w-20 mb-1 rounded" />
      <Skeleton className="h-3 w-12 rounded-full" />
    </Card>
  );
}

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
      // Small delay to ensure loader renders before navigation starts (React batching)
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
          <h3 className="font-semibold text-sm text-foreground text-center leading-tight mb-1">{category.name}</h3>
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

const HeroHouse = () => (
  <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 opacity-20">
    <path d="M80 0L160 50V140H0V50L80 0Z" fill="white" fillOpacity="0.1" />
    <path d="M105 115V95H115V115H130V85L80 55L30 85V115H45V105H55V115H70V95H95V115H105Z" fill="white" fillOpacity="0.2" />
    <path d="M90 105H100V115H90V105Z" fill="#FF9933" />
  </svg>
)

export default function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { lang } = use(searchParams);
  const { t } = useTranslation();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getServiceCategoriesAction();
        setCategories(data);
      } finally {
        setLoading(false);
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
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-card pb-8 rounded-b-[2.5rem] shadow-soft overflow-hidden">
        <div className="container mx-auto px-4 pt-6">


          {/* Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[1.6/1] sm:aspect-[2/1] md:aspect-[3/1] group transition-all duration-500 hover:shadow-primary/20">
            {/* Animated WebP Background */}
            <div className="absolute inset-0">
              <Image
                src="/hero-video.webp"
                alt="SevaSetu Hero"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Smart Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-primary/10 transition-colors duration-700" />
            </div>

            <div className="relative h-full flex items-center p-5 sm:p-8 md:p-12 text-white z-20">
              <div className="max-w-[85%] sm:max-w-[70%] space-y-3 sm:space-y-5">
                <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  <AnimatedHeroText className="text-2xl sm:text-4xl md:text-6xl font-black leading-[1.1] tracking-tight" highlightColor="text-yellow-400" />
                </div>
                <p className="text-white/95 text-xs sm:text-base md:text-lg font-medium max-w-md leading-relaxed drop-shadow-md">
                  Professional doorstep repairs with Bihar's most trusted technicians.
                  <span className="hidden sm:inline"> Quality guaranteed.</span>
                </p>

                <div className="pt-2 sm:pt-4">
                  <HeroCTA />
                </div>
              </div>

              {/* Decorative side element */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none overflow-hidden hidden md:block">
                <div className="absolute right-[-10%] bottom-[-20%] w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Services Grid */}
      <section id="services" className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold text-foreground">Our Services</h2>
            <p className="text-xs text-muted-foreground">Select a category to book</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 h-8 text-xs font-medium">
                {t('viewAll', { defaultValue: 'View All' })}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-3xl">
              <AllServicesSheet />
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : categories.slice(0, 6).map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))
          }
        </div>
      </section>


      {/* Referral Banner */}
      <section className="container mx-auto px-4 mb-8">
        <ReferralBanner />
      </section>
      {/* Quick Features - Grid Layout */}
      <section className="py-4 -mt-2 mb-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {featureCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center justify-center bg-white dark:bg-card py-4 px-2 rounded-2xl shadow-soft border border-border/40 text-center transition-all hover:shadow-md active:scale-95">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                  <card.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-tight text-foreground leading-none">{card.title}</span>
                  <span className="text-[7px] md:text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] leading-none">{card.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-white dark:bg-card rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] pt-8 pb-12">
        <div id="how-it-works">
          <HowItWorks t={t} />
        </div>
        {/* Live Tracking Card */}
        <section className="container mx-auto px-4 mb-8">
          <BookingTrackerModal asChild={true}>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg active:scale-98 transition-transform cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Search className="w-24 h-24 -mr-8 -mt-8" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/90">Live Status</p>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Track Your Repair</h3>
                  <p className="text-white/80 text-xs">Check current status of your booking</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </BookingTrackerModal>
        </section>


        <VerifiedTechnicians t={t} />

        <section id="why-choose-us" className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <TrustIndicators t={t} />
          </div>
        </section>

        <Testimonials t={t} />

        <BecomePartner />

        {/* Mobile-only Footer Signature */}
        <div className="md:hidden mt-8 pb-12 text-center border-t border-border/50 pt-8 px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-lg font-bold text-foreground">SevaSetu</span>
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
            &copy; {new Date().getFullYear()} SevaSetu &bull; Crafted with love
          </p>
        </div>
      </div>
    </div>
  );
}

