'use client';
import { serviceCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Wrench } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PriceEstimationPage({ params }: { params: { category: string; problem: string } }) {
  const { category: categoryId, problem: problemId } = params;
  const { t, getTranslatedCategory } = useTranslation();
  
  const originalCategory = serviceCategories.find((c) => c.id === categoryId);
  
  if (!originalCategory) {
    notFound();
  }
  
  const category = getTranslatedCategory(originalCategory);
  const problem = category?.problems.find((p) => p.id === problemId);

  if (!category || !problem) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('priceEstimateTitle')}</CardTitle>
          <CardDescription>{t('priceEstimateDescription', { category: category.name, problem: problem.name })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Wrench className="w-6 h-6 text-primary" />
              <span className="font-semibold">{t('fixedInspectionCharge')}</span>
            </div>
            <span className="text-lg font-bold">199 /-</span>
          </div>

          <div className="flex items-start gap-3 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>{t('finalPriceNote')}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Link href={`/book/${categoryId}/${problemId}/details`}>{t('proceedToBook')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
