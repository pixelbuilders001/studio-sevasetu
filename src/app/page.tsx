import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import TrustIndicators from '@/components/TrustIndicators';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 font-headline animate-fade-in-down">
              Trusted Local Repair for Phones & Home Appliances
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up">
              Doorstep Service • Verified Technicians • Pay After Repair
            </p>
            <div className="animate-fade-in">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg">
                <a href="#services">Book Repair Now</a>
              </Button>
            </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 font-headline text-center">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {serviceCategories.map((category) => (
              <Link href={`/book/${category.id}`} key={category.id} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                    <div className="relative w-full aspect-video">
                      <Image
                        src={category.image.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
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

      <HowItWorks />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <TrustIndicators />
        </div>
      </section>

      <Testimonials />
    </>
  );
}
