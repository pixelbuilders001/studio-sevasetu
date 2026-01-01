
'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';

const technicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Mobile Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    imageHint: 'male technician portrait',
    rating: 5,
    ratingValue: 4.9,
  },
  {
    name: 'Suresh Singh',
    expertise: 'AC Expert',
    imageUrl: 'https://picsum.photos/seed/tech2/300/300',
    imageHint: 'male technician smiling',
    rating: 5,
    ratingValue: 4.8,
  },
  {
    name: 'Vikas Sharma',
    expertise: 'Appliance Pro',
    imageUrl: 'https://picsum.photos/seed/tech3/300/300',
    imageHint: 'technician portrait',
    rating: 4,
    ratingValue: 4.7,
  },
  {
    name: 'Anjali Gupta',
    expertise: 'TV & Audio Expert',
    imageUrl: 'https://picsum.photos/seed/tech4/300/300',
    imageHint: 'female technician',
    rating: 5,
    ratingValue: 4.9,
  },
  {
    name: 'Prakash Rao',
    expertise: 'Washing Machine Pro',
    imageUrl: 'https://picsum.photos/seed/tech5/300/300',
    imageHint: 'male technician tools',
    rating: 5,
    ratingValue: 4.8,
  }
];

const StarRating = ({ rating, ratingValue }: { rating: number, ratingValue: number }) => (
    <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100/50 px-3 py-1 text-sm">
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      <span className="font-bold text-yellow-600">{ratingValue.toFixed(1)}</span>
    </div>
);

function TechnicianCard({ technician }: { technician: typeof technicians[0] }) {
  return (
    <Card className="bg-card border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center overflow-hidden h-full">
      <CardContent className="p-6 flex flex-col items-center justify-start">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={technician.imageUrl}
            alt={technician.name}
            fill
            sizes="96px"
            className="object-cover rounded-xl"
            data-ai-hint={technician.imageHint}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        <h3 className="font-bold text-lg text-foreground">{technician.name}</h3>
        <p className="text-sm text-primary font-semibold mt-1">{technician.expertise.toUpperCase()}</p>
        <div className="mt-3">
            <StarRating rating={technician.rating} ratingValue={technician.ratingValue} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifiedTechnicians() {
    const { t } = useTranslation();
    return (
        <section className="py-12 md:py-16 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold font-headline">Top Local Technicians</h2>
                </div>
                <div>
                    <ScrollArea className="w-full whitespace-nowrap rounded-lg -mx-4 px-4">
                        <div className="flex w-max space-x-4 pb-4">
                            {technicians.map((technician, index) => (
                                <div key={index} className="w-[220px] shrink-0">
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
