'use client';
import { serviceCategories } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo } from 'react';

export default function BookingDetailsPage() {
  const params = useParams();
  const { category: categoryId, problem: problemIds } = params as { category: string; problem: string };
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
    notFound();
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
