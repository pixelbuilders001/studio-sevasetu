
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
      {/* Desktop Hero (md+) */}
      <div className="hidden md:block">
        <DesktopHero />
      </div>

      {/* Mobile Hero (md hidden) */}
      <div className="md:hidden">
        {/* Hero Section with Integrated Header */}
        <section className="relative h-[50vh] rounded-b-[2rem] shadow-2xl overflow-hidden group">
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
          <div className="relative h-full container mx-auto px-6 z-20 flex flex-col justify-end pb-12">
            <div className="max-w-xl space-y-5">
              {/* Headline */}
              <div className="space-y-4">
                <div className="drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
                  <AnimatedHeroText
                    className="text-4xl sm:text-5xl leading-tight tracking-tighter"
                    highlightColor="text-primary"
                  />
                </div>

                <p className="text-white/90 text-sm font-bold max-w-xl leading-relaxed drop-shadow-md">
                  Premium doorstep repairs with Bihar&apos;s most trusted certified technicians. Affordable, fast & guaranteed.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <div className="scale-100 origin-left">
                  <HeroCTA />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Services Grid */}
      <section id="services" className="container mx-auto px-4 md:px-8 mt-12 md:mt-24">
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
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : categories.slice(0, 6).map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))
          }
        </div>
      </section>

      {/* Referral Banner */}
      <section className="container mx-auto px-4 md:px-8 mt-12 md:mt-24">
        <ReferralBanner />
      </section>

      {/* Quick Features */}
      <section className="py-6 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8">
            {featureCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center justify-center bg-white py-5 px-2 md:py-10 md:px-6 rounded-3xl md:rounded-3xl shadow-soft border border-indigo-50/50 text-center transition-all hover:shadow-glow hover:-translate-y-1">
                <div className="w-11 h-11 md:w-16 md:h-16 rounded-2xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 md:mb-6">
                  <card.icon className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] md:text-xl font-black uppercase tracking-tight text-indigo-950 leading-tight">{card.title}</span>
                  <span className="text-[8px] md:text-xs text-indigo-600 font-bold uppercase tracking-wider leading-tight">{card.description}</span>
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
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl md:rounded-[3rem] p-6 md:p-16 shadow-2xl active:scale-98 transition-all cursor-pointer relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Search className="w-40 h-40 md:w-64 md:h-64 -mr-10 -mt-10 text-white" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-6">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <p className="text-[10px] md:text-base font-black uppercase tracking-[0.2em] text-white/70">Live Tracker</p>
                  </div>
                  <h3 className="text-2xl md:text-5xl font-black mb-3 text-white tracking-tighter">Track Your <span className="text-indigo-200">Repair</span></h3>
                  <p className="text-white/60 text-sm md:text-lg font-medium max-w-xl">Get real-time updates on your service request status.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl group-hover:bg-white transition-all duration-500 border border-white/20">
                  <ChevronRight className="w-8 h-8 md:w-12 md:h-12 text-white group-hover:text-indigo-600" />
                </div>
              </div>
            </div>
          </BookingTrackerModal>
        </section>

        <div className="mt-20 md:mt-24">
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

