
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, Suspense, useState, useEffect } from 'react';
import type { ServiceCategory } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function BookingDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { category: categorySlug } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, getTranslatedCategory } = useTranslation();
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
  }, [categorySlug, getTranslatedCategory]);
  
  const selectedProblems = useMemo(() => {
    if (!category || !problemIds) return [];
    const ids = problemIds.split(',');
    return ids.map(id => category.problems.find(p => p.id === id)).filter(Boolean);
  }, [category, problemIds]);

  const totalEstimate = useMemo(() => {
    if (!selectedProblems.length) return 0;
    const problemsPrice = selectedProblems.reduce((sum, p) => sum + (p?.estimated_price || 0), 0);
    return 199 + problemsPrice;
  }, [selectedProblems]);

  // Get referral code from search params
  const referralCode = searchParams.get('referral_code') || '';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }
  
  if (!category || !problemIds) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingForm 
        categoryId={category.id}
        problemIds={problemIds}
        totalEstimate={totalEstimate}
        referralCode={referralCode}
      />
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
