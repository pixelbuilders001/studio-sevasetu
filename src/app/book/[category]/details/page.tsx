
'use client';
import { getServiceCategory, getTranslatedCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, Suspense, useState, useEffect } from 'react';
import type { ServiceCategory } from '@/lib/data';
import { getTranslations } from '@/lib/get-translation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function BookingDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const { category: categorySlug } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, language } = useTranslation();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categorySlug) return;
      try {
        const originalCategory = await getServiceCategory(categorySlug as string);
        if (!originalCategory) {
          notFound();
          return;
        }
        const trans = getTranslations(language)
        const translatedCategory = getTranslatedCategory(originalCategory, trans);
        setCategory(translatedCategory);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categorySlug, language]);
  
  const selectedProblems = useMemo(() => {
    if (!category || !problemIds) return [];
    const ids = problemIds.split(',');
    return ids.map(id => category.problems.find(p => p.id === id)).filter(Boolean);
  }, [category, problemIds]);

  const selectedProblemNames = useMemo(() => {
    return selectedProblems.map(p => p?.name).join(', ');
  }, [selectedProblems]);

  const totalEstimate = useMemo(() => {
    if (!selectedProblems.length) return 0;
    const problemsPrice = selectedProblems.reduce((sum, p) => sum + (p?.estimated_price || 0), 0);
    return 199 + problemsPrice;
  }, [selectedProblems]);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }
  
  if (!category) {
    return notFound();
  }

  const problemDescription = selectedProblemNames || category.problems[0]?.name || 'General Checkup';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('yourDetailsTitle')}</CardTitle>
          <CardDescription>
            {t('yourDetailsDescription', { categoryName: category.name })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-3">
             <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                <p className="font-semibold text-muted-foreground">{t('selected_issues')}</p>
                 <div className="flex flex-wrap justify-end gap-1">
                    {selectedProblems.map(p => p && <Badge key={p.id} variant="secondary">{p.name}</Badge>)}
                </div>
             </div>
             <Separator />
             <div className="flex justify-between items-center p-3">
                <p className="text-lg font-bold">Total Estimated Cost</p>
                <p className="text-xl font-bold text-primary">Rs. {totalEstimate}</p>
             </div>
          </div>
          <BookingForm category={category.name} problem={problemDescription} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingDetailsContent />
    </Suspense>
  );
}
