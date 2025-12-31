
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServiceCategories, ICONS } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrustIndicators from '@/components/TrustIndicators';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { getTranslations } from '@/lib/get-translation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import PaymentIcons from '@/components/PaymentIcons';
import { ShieldCheck, Truck, CreditCard, ArrowRight } from 'lucide-react';
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
            <div className="p-4 bg-card pt-0 mt-auto">
                 <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                    <Link href={`/book/${category.slug}`}>
                        {`Book Repair`} <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </Card>
    );
}


export default async function Home({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = searchParams?.lang || 'en';
  const t = getTranslations(lang);
  
  const categories: ServiceCategory[] = await getServiceCategories();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  const featureCards = [
    {
      icon: Truck,
      title: t('doorstepServiceTitle'),
      description: t('doorstepServiceDesc'),
    },
    {
      icon: ShieldCheck,
      title: t('verifiedTechniciansTitle'),
      description: t('verifiedTechniciansDesc'),
    },
    {
      icon: CreditCard,
      title: t('payAfterRepairTitle'),
      description: t('payAfterRepairDesc'),
    },
  ];

  return (
    <>
      <section className="relative bg-background text-foreground overflow-hidden">
         {heroImage && (
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          </div>
        )}
        <div className="relative container mx-auto px-4 pt-8 pb-8 md:pt-16 md:pb-12 z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in-up text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 font-headline">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-8">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in justify-center md:justify-start">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-10 w-full sm:w-auto">
                  <a href="#services">{t('bookRepairNow')}</a>
                </Button>
                <PaymentIcons />
              </div>
               <div className="mt-6 text-center md:text-left">
                  <p className="text-sm text-muted-foreground font-semibold">{t('satisfactionGuarantee')}</p>
              </div>
            </div>
             {heroImage && (
              <div className="relative h-64 md:h-full w-full animate-fade-in rounded-lg overflow-hidden hidden md:block">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-contain"
                  data-ai-hint={heroImage.imageHint}
                  sizes="50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <card.icon className="w-10 h-10 text-accent" />
                  <div>
                    <h3 className="font-bold text-lg">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
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

      <section id="why-choose-us" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <TrustIndicators />
        </div>
      </section>

      <Testimonials />
    </>
  );
}
