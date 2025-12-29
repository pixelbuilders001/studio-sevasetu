'use client';
import { serviceCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';

export default function BookingDetailsPage({ params }: { params: { category: string; problem: string } }) {
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
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('yourDetailsTitle')}</CardTitle>
          <CardDescription>
            {t('yourDetailsDescription', { categoryName: category.name })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingForm category={category.name} problem={problem.name} />
        </CardContent>
      </Card>
    </div>
  );
}
