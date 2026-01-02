import { Card, CardContent } from '@/components/ui/card';
import type { TranslationFunc } from '@/lib/get-translation';
import { Gem, Award, ReceiptText, ShieldAlert } from 'lucide-react';

export default function TrustIndicators({t}: {t: TranslationFunc}) {
  
  const indicators = [
    {
      icon: Gem,
      title: 'ASLI PARTS',
      description: 'Only 100% genuine spare parts used.',
      bgColor: 'bg-purple-100/60 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Award,
      title: 'EXPERT PROS',
      description: 'Certified & background verified.',
      bgColor: 'bg-blue-100/60 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: ReceiptText,
      title: 'PAKKA BILL',
      description: 'Transparent pricing with no surprises.',
      bgColor: 'bg-green-100/60 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: ShieldAlert,
      title: 'WARRANTY',
      description: '30-day post-service guarantee.',
      bgColor: 'bg-orange-100/60 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline">{t('whyChooseUs')}</h2>
        <p className="text-muted-foreground uppercase text-sm font-semibold tracking-wider">RELIABLE SERVICE, GUARANTEED.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
        {indicators.map((indicator, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow bg-card border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${indicator.bgColor}`}>
                    <indicator.icon className={`w-7 h-7 ${indicator.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1 uppercase">{indicator.title}</h3>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
