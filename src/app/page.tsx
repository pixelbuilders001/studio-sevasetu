
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
import UserAuthSheet from '@/components/UserAuthSheet';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { User, Bell } from 'lucide-react';
import { checkRestricted } from '@/utils/auth';


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


export default function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { lang } = use(searchParams);
  const { t } = useTranslation();
  const router = useRouter();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  console.log("session", session, sheetOpen);


  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const isRestricted = await checkRestricted(supabase, data.session.user.id);
        if (isRestricted) {
          setSession(null);
          return;
        }
      }
      setSession(data.session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isRestricted = await checkRestricted(supabase, session.user.id);
        if (isRestricted) {
          setSession(null);
          // Do NOT close sheet
          return;
        }
      }

      setSession(session);
      if (session && sheetOpen) {
        setSheetOpen(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, sheetOpen]);

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
    <div className="min-h-screen bg-secondary/10 pb-10">
      {/* Hero Section with Integrated Header */}
      <section className="relative h-[50vh] md:h-[85vh] rounded-b-[2rem] shadow-2xl overflow-hidden group">
        {/* Main Background Video */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-video.webp"
            alt="Hellofixo Hero"
            fill
            className="object-cover"
            unoptimized
            priority
          />
          {/* Enhanced gradients for readability and depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90 z-10" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
        </div>

        {/* Integrated Floating Header Area */}
        <div className="absolute top-0 left-0 right-0 z-30 px-6 pt-6">
          <div className="container mx-auto flex items-center justify-between">
            {/* Location Pill */}
            <div className="flex-shrink-0">
              <LocationSelector isHero={true} />
            </div>

            {/* Profile Action */}
            <div className="flex items-center gap-3">
              {session ? (
                <ProfileSheet isHero={true} />
              ) : (
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <div className="w-12 h-12 bg-indigo-200/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-indigo-300/50 cursor-pointer active:scale-90 transition-transform shadow-lg group">
                      <User className="h-6 w-6 text-indigo-700 group-hover:scale-110 transition-transform" />
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
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-12 z-20">
          <div className="max-w-2xl space-y-5">


            {/* Headline */}
            <div className="space-y-4">
              <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <AnimatedHeroText
                  className="text-4xl sm:text-5xl md:text-7xl"
                  highlightColor="text-primary"
                />
              </div>

              <p className="text-white/80 text-sm md:text-lg font-medium max-w-sm leading-relaxed drop-shadow-md">
                Premium doorstep repairs with Bihar&apos;s most trusted certified technicians.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <HeroCTA />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="container mx-auto px-4 mt-12 mb-8">
        <div className="flex justify-between items-end mb-6 px-1">
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#1e1b4b]">
              Our <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xs md:text-sm text-indigo-600 font-bold mt-1">Select a category to book</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-auto py-2 px-3 text-sm font-black flex items-center group">
                <span>{t('viewAll', { defaultValue: 'View All' })}</span>
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
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
      <section className="container mx-auto px-4 mb-8 mt-12">
        <ReferralBanner />
      </section>

      {/* Quick Features - Grid Layout */}
      <section className="py-6 mb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {featureCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-5 px-2 rounded-3xl shadow-lg border-2 border-indigo-100 text-center transition-all hover:shadow-xl hover:border-indigo-200 active:scale-95">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg">
                  <card.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] md:text-xs font-black uppercase tracking-tight text-indigo-900 leading-tight">{card.title}</span>
                  <span className="text-[8px] md:text-[9px] text-indigo-600 font-bold uppercase tracking-wide leading-tight">{card.description}</span>
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
        <section className="container mx-auto px-4 mb-8 mt-12">
          <BookingTrackerModal asChild={true}>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-6 shadow-lg border-2 border-dashed border-indigo-300 active:scale-98 transition-transform cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Search className="w-24 h-24 -mr-8 -mt-8 text-indigo-600" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-600 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Live Status</p>
                  </div>
                  <h3 className="text-2xl font-black mb-1 text-indigo-900">Track Your Repair</h3>
                  <p className="text-indigo-600 text-sm font-bold">Check current status of your booking</p>
                </div>
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
                  <ChevronRight className="w-6 h-6 text-white" />
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
            <span className="text-lg font-bold text-foreground">Hellofixo</span>
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
            &copy; {new Date().getFullYear()} Hellofixo &bull; Crafted with love
          </p>
        </div>
      </div>
    </div>
  );
}

