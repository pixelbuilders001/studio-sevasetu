'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, Calendar, Wrench, Smile } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Search,
      title: t('howItWorksStep1Title'),
      description: t('howItWorksStep1Desc'),
    },
    {
      icon: Calendar,
      title: t('howItWorksStep2Title'),
      description: t('howItWorksStep2Desc'),
    },
    {
      icon: Wrench,
      title: t('howItWorksStep3Title'),
      description: t('howItWorksStep3Desc'),
    },
    {
      icon: Smile,
      title: t('howItWorksStep4Title'),
      description: t('howItWorksStep4Desc'),
    },
  ];
  
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-headline text-center">{t('howItWorksTitle')}</h2>
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
