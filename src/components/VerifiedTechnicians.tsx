import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';

const technicians = [
  {
    name: 'Ramesh Kumar',
    expertise: 'Mobile Expert',
    imageUrl: 'https://picsum.photos/seed/tech1/300/300',
    imageHint: 'male technician portrait',
    ratingValue: 4.9,
    jobs: '1.2k+',
    location: 'Indiranagar'
  },
  {
    name: 'Suresh Singh',
    expertise: 'AC Specialist',
    imageUrl: 'https://picsum.photos/seed/tech2/300/300',
    imageHint: 'male technician smiling',
    ratingValue: 4.8,
    jobs: '850+',
    location: 'Koramangala'
  },
  {
    name: 'Vikas Sharma',
    expertise: 'Appliance Pro',
    imageUrl: 'https://picsum.photos/seed/tech3/300/300',
    imageHint: 'technician portrait',
    ratingValue: 4.7,
    jobs: '2k+',
    location: 'HSR Layout'
  },
  {
    name: 'Anjali Gupta',
    expertise: 'TV & Audio',
    imageUrl: 'https://picsum.photos/seed/tech4/300/300',
    imageHint: 'female technician',
    ratingValue: 4.9,
    jobs: '900+',
    location: 'Whitefield'
  },
  {
    name: 'Prakash Rao',
    expertise: 'Washing Machine',
    imageUrl: 'https://picsum.photos/seed/tech5/300/300',
    imageHint: 'male technician tools',
    ratingValue: 4.8,
    jobs: '1.5k+',
    location: 'Jayanagar'
  }
];

function TechnicianCard({ technician }: { technician: typeof technicians[0] }) {
  return (
    <Card className="bg-white dark:bg-card border-none rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden group w-full max-w-[280px]">
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] text-white font-medium">
          <CheckCircle2 className="w-3 h-3" />
          VERIFIED
        </div>
      </div>
      <CardContent className="px-4 pb-4 pt-0 text-center -mt-12">
        <div className="relative w-24 h-24 mx-auto mb-3">
          <Image
            src={technician.imageUrl}
            alt={technician.name}
            fill
            sizes="96px"
            className="object-cover rounded-2xl border-4 border-white dark:border-card shadow-md group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={technician.imageHint}
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-card"></div>
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="font-bold text-lg text-foreground leading-tight">{technician.name}</h3>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">{technician.expertise}</p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-foreground">{technician.ratingValue}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="font-medium">{technician.jobs} Jobs</div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 py-2 rounded-xl">
          <MapPin className="w-3.5 h-3.5" />
          {technician.location}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifiedTechnicians({ t }: { t: TranslationFunc }) {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground">Top Experts Near You</h2>
            <p className="text-xs text-muted-foreground mt-1">Based on genuine user reviews</p>
          </div>
        </div>
        <div>
          <ScrollArea className="w-full whitespace-nowrap -mx-4 px-4 pb-4">
            <div className="flex w-max space-x-4 pb-2 pl-2">
              {technicians.map((technician, index) => (
                <TechnicianCard key={index} technician={technician} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
