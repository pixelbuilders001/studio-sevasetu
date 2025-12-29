'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
        />
      ))}
    </div>
  );

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'Priya S.',
      location: 'Pune',
      avatar: 'PS',
      rating: 5,
      comment: t('testimonial1'),
    },
    {
      name: 'Amit K.',
      location: 'Pune',
      avatar: 'AK',
      rating: 5,
      comment: t('testimonial2'),
    },
    {
      name: 'Sunita D.',
      location: 'Pune',
      avatar: 'SD',
      rating: 5,
      comment: t('testimonial3'),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-headline text-center">{t('whatOurCustomersSay')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardContent className="pt-6">
                <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
              </CardContent>
              <CardHeader className="mt-auto pt-4 flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}`} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <div className='flex justify-between items-center w-full'>
                    <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
