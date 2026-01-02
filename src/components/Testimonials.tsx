import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { TranslationFunc } from '@/context/LanguageContext';

export default function Testimonials({ t }: { t: TranslationFunc }) {
  const testimonials = [
    {
      name: 'Priya S.',
      location: 'Pune',
      avatar: 'PS',
      comment: t('testimonial1'),
    },
    {
      name: 'Amit K.',
      location: 'Pune',
      avatar: 'AK',
      comment: t('testimonial2'),
    },
    {
      name: 'Sunita D.',
      location: 'Pune',
      avatar: 'SD',
      comment: t('testimonial3'),
    },
     {
      name: 'Rohan V.',
      location: 'Mumbai',
      avatar: 'RV',
      comment: "My washing machine wasn't working. The technician fixed it in no time. Very professional service.",
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 font-headline">Loved by Locals</h2>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            <ScrollArea className="w-full whitespace-nowrap md:whitespace-normal">
              <div className="flex w-max space-x-4 md:space-x-0 md:grid">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-[300px] md:w-auto">
                    <Card className="flex flex-col bg-card shadow-lg border-0 h-full">
                      <CardHeader className="flex-row items-center gap-4">
                        <Avatar className="rounded-md h-12 w-12">
                          <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}&backgroundColor=228be6`} alt={testimonial.name} />
                          <AvatarFallback className="rounded-md">{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider">{testimonial.location}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground italic whitespace-normal">"{testimonial.comment}"</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="md:hidden" />
            </ScrollArea>
        </div>
      </div>
    </section>
  );
}
