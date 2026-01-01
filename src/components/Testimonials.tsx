
'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';

export default function Testimonials() {
  const { t } = useTranslation();

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
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-headline text-center">Loved by Locals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col bg-card shadow-lg border-0">
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
                <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
