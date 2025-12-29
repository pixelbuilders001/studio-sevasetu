'use client';
import { serviceCategories } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, Suspense } from 'react';

function BookingDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const { category: categoryId } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, getTranslatedCategory } = useTranslation();

  const originalCategory = serviceCategories.find((c) => c.id === categoryId);

  if (!originalCategory) {
    notFound();
  }

  const category = getTranslatedCategory(originalCategory);
  
  const selectedProblemNames = useMemo(() => {
    if (!category || !problemIds) return '';
    const ids = problemIds.split(',');
    return ids.map(id => category.problems.find(p => p.id === id)?.name).filter(Boolean).join(', ');
  }, [category, problemIds]);


  if (!category || !selectedProblemNames) {
    // This can happen if the query param is missing or invalid
    // Or if the component renders before client-side navigation is complete
    // We could show a loading state or redirect
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
