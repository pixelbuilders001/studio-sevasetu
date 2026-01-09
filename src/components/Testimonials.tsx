import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Quote } from 'lucide-react';
import type { TranslationFunc } from '@/lib/get-translation';

export default function Testimonials({ t }: { t: TranslationFunc }) {
  const testimonials = [
    {
      name: 'Priya S.',
      location: 'Pune',
      avatar: 'PS',
      comment: t('testimonial1'),
      rating: 5
    },
    {
      name: 'Amit K.',
      location: 'Pune',
      avatar: 'AK',
      comment: t('testimonial2'),
      rating: 5
    },
    {
      name: 'Sunita D.',
      location: 'Pune',
      avatar: 'SD',
      comment: t('testimonial3'),
      rating: 4
    },
    {
      name: 'Rohan V.',
      location: 'Mumbai',
      avatar: 'RV',
      comment: "My washing machine wasn't working. The technician fixed it in no time. Very professional service.",
      rating: 5
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground">Loved by Locals</h2>
            <p className="text-xs text-muted-foreground mt-1">Real stories from real neighbors</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>
            ))}
          </div>
        </div>

        <ScrollArea className="w-full whitespace-nowrap -mx-4 px-4 pb-4">
          <div className="flex w-max space-x-4 pb-2 pl-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-[280px] shrink-0">
                <Card className="bg-secondary/20 border-0 rounded-[2rem] h-full relative overflow-hidden group hover:bg-secondary/40 transition-colors duration-300">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Quote className="w-16 h-16 text-primary rotate-180" />
                  </div>

                  <CardContent className="p-6 relative z-10 flex flex-col h-[220px]">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}&backgroundColor=2563eb`} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm text-foreground">{testimonial.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{testimonial.location}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < testimonial.rating ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                      ))}
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-normal line-clamp-4 italic">
                      "{testimonial.comment}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
    </section>
  );
}
