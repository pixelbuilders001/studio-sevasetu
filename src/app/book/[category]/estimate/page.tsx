
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Wrench, Hammer } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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
           <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-7 w-24" />
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
  const searchParams = useSearchParams();
  const { category: categorySlug } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, getTranslatedCategory } = useTranslation();
  
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProblem = async () => {
      if (!categorySlug || !problemIds) return;
      try {
        const originalCategory = await getServiceCategory(categorySlug as string);
        if (!originalCategory) {
          notFound();
          return;
        }
        const translatedCategory = getTranslatedCategory(originalCategory);
        setCategory(translatedCategory);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProblem();
  }, [categorySlug, problemIds, getTranslatedCategory]);

  const selectedProblems = useMemo(() => {
    if (!category || !problemIds) return [];
    const ids = problemIds.split(',');
    return category.problems.filter((p) => ids.includes(p.id));
  }, [category, problemIds]);

  const totalEstimate = useMemo(() => {
    if (selectedProblems.length === 0) return 199;
    const problemsTotal = selectedProblems.reduce((acc, problem) => acc + (problem.estimated_price || 0), 0);
    return 199 + problemsTotal;
  }, [selectedProblems]);


  if (loading) {
    return <PriceEstimationSkeleton />;
  }

  if (!category || !problemIds || selectedProblems.length === 0) {
    notFound();
  }

  const problemNames = selectedProblems.map(p => p.name).join(', ');

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('priceEstimateTitle')}</CardTitle>
          <CardDescription>{t('priceEstimateDescription', { category: category.name, problem: problemNames })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">{t('fixedInspectionCharge')}</span>
              </div>
              <span className="font-semibold">Rs. 199</span>
            </div>
            {selectedProblems.map(problem => (
              problem.estimated_price > 0 && (
                <div key={problem.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hammer className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">{problem.name}</span>
                  </div>
                  <span className="font-semibold">Rs. {problem.estimated_price}</span>
                </div>
              )
            ))}
          </div>
          
          <Separator />

          <div className="flex items-center justify-between p-4">
            <span className="text-lg font-bold">Total Estimated Cost</span>
            <span className="text-xl font-bold text-primary">Rs. {totalEstimate}</span>
          </div>

          <div className="flex items-start gap-3 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>{t('finalPriceNote')}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Link href={`/book/${categorySlug}/details?problems=${problemIds}`}>{t('proceedToBook')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
