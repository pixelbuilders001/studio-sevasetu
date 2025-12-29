'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrustIndicators from '@/components/TrustIndicators';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { useTranslation } from '@/hooks/useTranslation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const { t, getTranslatedCategory } = useTranslation();
  const categories = serviceCategories.map(getTranslatedCategory);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <>
      <section className="bg-background">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in-up text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 font-headline">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-8">
                {t('heroSubtitle')}
              </p>
              <div className="animate-fade-in">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg">
                  <a href="#services">{t('bookRepairNow')}</a>
                </Button>
              </div>
            </div>
            {heroImage && (
              <div className="relative h-80 md:h-full w-full animate-fade-in rounded-lg overflow-hidden hidden md:block">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                  sizes="50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 font-headline text-center">{t('ourServices')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link href={`/book/${category.id}`} key={category.id} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                    <div className="relative w-full aspect-video">
                      <Image
                        src={category.image.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                        data-ai-hint={category.image.imageHint}
                      />
                    </div>
                    <div className="p-4 text-center w-full bg-card">
                      <category.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-bold text-base md:text-lg">{category.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
