import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, Wrench, Smile } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Select Your Service',
    description: 'Choose your device and describe the problem you are facing.',
  },
  {
    icon: Calendar,
    title: '2. Schedule a Visit',
    description: 'Pick a convenient time slot for our technician to visit your location.',
  },
  {
    icon: Wrench,
    title: '3. Get It Repaired',
    description: 'Our expert technician will diagnose the issue and repair your device.',
  },
  {
    icon: Smile,
    title: '4. Pay After Service',
    description: 'Make the payment only after your device is repaired to your satisfaction.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-headline text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-0 bg-transparent shadow-none">
              <CardHeader className="items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <step.icon className="w-8 h-8" />
                </div>
                <CardTitle className="font-bold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
