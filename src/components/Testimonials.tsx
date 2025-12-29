import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya S.',
    location: 'Pune',
    avatar: 'PS',
    rating: 5,
    comment:
      'Amazing service! My phone screen was replaced in under an hour at my home. The technician was very professional and polite.',
  },
  {
    name: 'Amit K.',
    location: 'Pune',
    avatar: 'AK',
    rating: 5,
    comment:
      'My laptop was running extremely slow. SevaSetu technician came and upgraded the RAM and now it works like a new machine. Highly recommended!',
  },
  {
    name: 'Sunita D.',
    location: 'Pune',
    avatar: 'SD',
    rating: 5,
    comment:
      'The AC was not cooling properly. The service person was on time, identified the gas leak, and fixed it quickly. Very satisfied with the work.',
  },
];

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
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-headline text-center">What Our Customers Say</h2>
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
