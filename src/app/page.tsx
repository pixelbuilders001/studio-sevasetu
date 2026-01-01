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
import { ArrowRight, Award, ShieldCheck, Clock, Shield } from 'lucide-react';
import type { ServiceCategory } from '@/lib/data';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AllServicesSheet from '@/components/AllServicesSheet';

const serviceSubTexts: Record<string, string> = {
    'phone': 'Screen · Battery · Charging',
    'laptop': 'Slow · Display · Keyboard',
    'ac': 'No Cooling · Gas · Service',
    'fridge': 'Not Cooling · Noise · Gas',
    'mixer-grinder': 'Motor · Blade · Power',
    'gas-chulha': 'Burner · Gas Leak · Knob',
    'bike-repair': 'Engine · Brake · Service',
    'washing-machine': 'Not Spinning · Drain · Noise',
    'tv': 'Screen · Sound · Power',
    'wifi': 'No Internet · Slow Speed',
    'cooler': 'Not Cooling · Motor · Pump'
};


function ServiceCard({ category }: { category: ServiceCategory }) {
    const subText = serviceSubTexts[category.slug] || category.problems.slice(0, 3).map(p => p.name).join(' · ');
    return (
        <Card className="bg-card border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center overflow-hidden h-full">
            <CardContent className="p-4 md:p-6 pb-2 flex flex-col items-center justify-start">
                <div className="relative w-full h-24 md:h-28 mb-4">
                    <Image
                        src={category.image.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 30vw, 15vw"
                        className="object-contain"
                        data-ai-hint={category.image.imageHint}
                    />
                </div>
                <h3 className="font-bold text-base md:text-lg text-foreground">{category.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 h-8">
                    {subText}
                </p>
            </CardContent>
            <div className="p-4 bg-card pt-0">
                 <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                    <Link href={`/book/${category.slug}`}>
                        {`Book Repair`} <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </Card>
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
            <div className="relative bg-primary text-primary-foreground rounded-xl p-8 shadow-xl overflow-hidden">
                <HeroHouse />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-primary-foreground/20 text-primary-foreground font-semibold px-3 py-1 rounded-full text-sm mb-4">
                        <Award className="w-5 h-5"/>
                        #1 LOCAL REPAIR SERVICE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                        Doorstep Repair<br />In 60 Mins
                    </h1>
                    <p className="text-base md:text-lg text-primary-foreground/80 max-w-sm mb-8">
                       Expert technicians for Mobile, Laptop, AC & Home Appliances.
                    </p>
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-10 h-14 rounded-full">
                        <a href="#services">BOOK NOW <ArrowRight className="w-5 h-5 ml-2" /></a>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <Card key={index} className="bg-card border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                        <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm md:text-base">{card.title}</h3>
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
            <h2 className="text-3xl font-bold font-headline">{t('ourServices')}</h2>
            <AllServicesSheet>
              <Button variant="ghost">{t('viewAll', {defaultValue: 'View All'})} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </AllServicesSheet>
          </div>
          <div>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="flex w-max space-x-4 pb-4 px-1">
                    {categories.map((category) => (
                        <div key={category.id} className="w-[200px] md:w-[240px] shrink-0">
                           <ServiceCard category={category}/>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
    </>
  );
}
