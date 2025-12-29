import { Card, CardContent } from '@/components/ui/card';
import { Wrench, ReceiptText, ShieldCheck } from 'lucide-react';

const indicators = [
  {
    icon: Wrench,
    title: 'Fixed Inspection Charge',
    description: 'A nominal fee of ₹199 for a complete diagnosis.',
  },
  {
    icon: ReceiptText,
    title: 'Transparent Pricing',
    description: 'Get a clear estimate before we start any repair work.',
  },
  {
    icon: ShieldCheck,
    title: '7-Day Service Warranty',
    description: 'We stand by our work with a post-service guarantee.',
  },
];

export default function TrustIndicators() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-headline">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {indicators.map((indicator, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <indicator.icon className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-bold text-lg mb-1">{indicator.title}</h3>
                  <p className="text-muted-foreground">{indicator.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
