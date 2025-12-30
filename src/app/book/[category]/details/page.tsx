'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, Suspense, useState, useEffect } from 'react';
import type { ServiceCategory } from '@/lib/data';

function BookingDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const { category: categoryId } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, getTranslatedCategory } = useTranslation();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      try {
        const originalCategory = await getServiceCategory(categoryId as string);
        if (!originalCategory) {
          notFound();
          return;
        }
        const translatedCategory = getTranslatedCategory(originalCategory);
        setCategory(translatedCategory);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId, getTranslatedCategory]);
  
  const selectedProblemNames = useMemo(() => {
    if (!category || !problemIds) return '';
    const ids = problemIds.split(',');
    return ids.map(id => category.problems.find(p => p.id === id)?.name).filter(Boolean).join(', ');
  }, [category, problemIds]);


  if (loading || !category || !selectedProblemNames) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  const problemDescription = selectedProblemNames;

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
