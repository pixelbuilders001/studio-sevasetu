

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServiceCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrustIndicators from '@/components/TrustIndicators';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { getTranslations } from '@/lib/get-translation';
import VerifiedTechnicians from '@/components/VerifiedTechnicians';
import { ArrowRight, Award, ShieldCheck, Clock, Shield, Zap } from 'lucide-react';
import type { ServiceCategory } from '@/lib/data';
import BecomePartner from '@/components/BecomePartner';
import HeroCTA from '@/components/HeroCTA';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import AllServicesSheet from '@/components/AllServicesSheet';


function ServiceCard({ category }: { category: ServiceCategory }) {
    return (
        <Link href={`/book/${category.slug}`} className="group">
            <Card className="bg-card border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center overflow-hidden h-full aspect-square justify-center items-center bg-white">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                        <Image
                            src={category.image.imageUrl}
                            alt={category.name}
                            fill
                            sizes="(max-width: 768px) 20vw, 10vw"
                            className="object-contain"
                            data-ai-hint={category.image.imageHint}
                        />
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-foreground">{category.name}</h3>
                </CardContent>
            </Card>
        </Link>
    );
}

const HeroHouse = () => (
  <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 bottom-0 opacity-20">
    <path d="M80 0L160 50V140H0V50L80 0Z" fill="white" fillOpacity="0.1"/>
    <path d="M105 115V95H115V115H130V85L80 55L30 85V115H45V105H55V115H70V95H95V115H105Z" fill="white" fillOpacity="0.2"/>
    <path d="M90 105H100V115H90V105Z" fill="#FF9933"/>
  </svg>
)

export default async function Home({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = searchParams?.lang || 'en';
  const t = getTranslations(lang);
  
  const categories: ServiceCategory[] = await getServiceCategories();

  const featureCards = [
    {
      icon: ShieldCheck,
      title: t('verifiedTechniciansTitle', {defaultValue: 'Verified'}),
      description: t('verifiedTechniciansDesc', {defaultValue: 'SAFE PROS'}),
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
    <>
      <section className="bg-background text-foreground">
        <div className="container mx-auto px-4 pt-4 pb-8 md:pt-8 md:pb-12">
            <div 
                className="relative text-white rounded-2xl p-8 shadow-xl overflow-hidden bg-cover bg-center"
                style={{backgroundImage: "url('https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/only%20illustration%20not%20texts%20and%20all.jpg')"}}
            >
                <div className="absolute inset-0 bg-blue-900/50"></div>
                <div className="relative z-10">
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground font-bold px-3 py-2 rounded-bl-lg">
                        <span className="text-xl">60</span>
                        <span className="block text-xs leading-none">MINS</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-3 py-1.5 rounded-full text-xs mb-4">
                        <Zap className="w-4 h-4 text-yellow-300"/>
                        INDIA'S TRUSTED REPAIR APP
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                        Quick Repairs<br />
                        <span className="text-primary">At Your Doorstep</span>
                    </h1>
                    <p className="text-base text-white/80 max-w-sm mb-8">
                       Verified experts for Mobile, Laptop & AC. Fixed in 60 minutes.
                    </p>
                    <HeroCTA />
                </div>
            </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {featureCards.map((card, index) => (
              <Card key={index} className="bg-card border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
                        <card.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-xs md:text-base">{card.title}</h3>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-headline">What's broken?</h2>
              <p className="text-muted-foreground">CHOOSE YOUR DEVICE</p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">{t('viewAll', {defaultValue: 'View All'})}</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-2xl">
                 <AllServicesSheet />
              </SheetContent>
            </Sheet>
          </div>
          <div className="grid services-grid gap-4">
            {categories.slice(0, 6).map((category) => (
                <ServiceCard key={category.id} category={category}/>
            ))}
          </div>
        </div>
      </section>

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <VerifiedTechnicians />

      <section id="why-choose-us" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <TrustIndicators />
        </div>
      </section>

      <Testimonials />

      <BecomePartner />
    </>
  );
}
