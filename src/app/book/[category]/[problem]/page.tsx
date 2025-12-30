'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Wrench } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function PriceEstimationSkeleton() {
  return (
     <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-7 w-20" />
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <Skeleton className="w-5 h-5 rounded-full mt-0.5 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-12 w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default function PriceEstimationPage() {
  const params = useParams();
  const { category: categoryId, problem: problemId } = params as { category: string, problem: string };
  const { t, getTranslatedCategory } = useTranslation();
  
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProblem = async () => {
      if (!categoryId || !problemId) return;
      try {
        const originalCategory = await getServiceCategory(categoryId);
        if (!originalCategory) {
          notFound();
          return;
        }
        const translatedCategory = getTranslatedCategory(originalCategory);
        const currentProblem = translatedCategory.problems.find((p) => p.id === problemId);

        if (!currentProblem) {
          notFound();
          return;
        }

        setCategory(translatedCategory);
        setProblem(currentProblem);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProblem();
  }, [categoryId, problemId, getTranslatedCategory]);

  if (loading) {
    return <PriceEstimationSkeleton />;
  }

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
