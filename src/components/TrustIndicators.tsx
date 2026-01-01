
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { Wrench, ReceiptText, ShieldCheck } from 'lucide-react';

export default function TrustIndicators() {
  const { t } = useTranslation();
  
  const indicators = [
    {
      icon: Wrench,
      title: t('trustIndicator1Title'),
      description: t('trustIndicator1Desc'),
    },
    {
      icon: ReceiptText,
      title: t('trustIndicator2Title'),
      description: t('trustIndicator2Desc'),
    },
    {
      icon: ShieldCheck,
      title: t('trustIndicator3Title'),
      description: t('trustIndicator3Desc'),
    },
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-headline text-center">{t('whyChooseUs')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
        {indicators.map((indicator, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow bg-card border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <indicator.icon className="w-8 h-8 md:w-10 md:h-10 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">{indicator.title}</h3>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
