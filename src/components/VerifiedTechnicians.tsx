
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowRight, Star } from 'lucide-react';

const technicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Phone & Laptop Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    imageHint: 'male technician portrait',
    rating: 5,
  },
  {
    name: 'Suresh Singh',
    expertise: 'AC & Fridge Specialist',
    imageUrl: 'https://picsum.photos/seed/tech2/300/300',
    imageHint: 'male technician smiling',
    rating: 5,
  },
  {
    name: 'Vikas Sharma',
    expertise: 'Appliance Repair Pro',
    imageUrl: 'https://picsum.photos/seed/tech3/300/300',
    imageHint: 'technician portrait',
    rating: 4,
  },
  {
    name: 'Anjali Gupta',
    expertise: 'TV & Audio Expert',
    imageUrl: 'https://picsum.photos/seed/tech4/300/300',
    imageHint: 'female technician',
    rating: 5,
  },
  {
    name: 'Prakash Rao',
    expertise: 'Washing Machine Pro',
    imageUrl: 'https://picsum.photos/seed/tech5/300/300',
    imageHint: 'male technician tools',
    rating: 5,
  }
];

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
);

function TechnicianCard({ technician }: { technician: typeof technicians[0] }) {
  const { t } = useTranslation();
  return (
    <Card className="bg-card border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center overflow-hidden h-full">
      <CardContent className="p-4 flex flex-col items-center justify-start">
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary/10">
          <Image
            src={technician.imageUrl}
            alt={technician.name}
            fill
            sizes="128px"
            className="object-cover"
            data-ai-hint={technician.imageHint}
          />
        </div>
        <h3 className="font-bold text-lg text-foreground">{technician.name}</h3>
        <p className="text-sm text-accent-foreground font-semibold mt-1">{technician.expertise}</p>
        <div className="mt-2">
            <StarRating rating={technician.rating} />
        </div>
      </CardContent>
      <div className="p-4 bg-card pt-2">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
          <Link href="#services">
            {t('bookRepairNow')} <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default function VerifiedTechnicians() {
    const { t } = useTranslation();
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold font-headline">{t('verifiedTechniciansTitle', {defaultValue: "Our Verified Technicians"})}</h2>
                </div>
                <div>
                    <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                        <div className="flex w-max space-x-4 pb-4 px-1">
                            {technicians.map((technician, index) => (
                                <div key={index} className="w-[240px] shrink-0">
                                    <TechnicianCard technician={technician} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
        </section>
    );
}
