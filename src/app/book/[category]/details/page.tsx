
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, Suspense, useState, useEffect } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';

type BookingDetailsData = {
  category: ServiceCategory;
  selectedProblems: Problem[];
  totalRepairCost: number;
  inspectionFee: number;
  totalEstimatedPrice: number;
}


function BookingDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { category: categorySlug } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, getTranslatedCategory } = useTranslation();
  const { location } = useLocation();
  
  const [details, setDetails] = useState<BookingDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!categorySlug || !problemIds) {
        notFound();
        return;
      }
      try {
        const originalCategory = await getServiceCategory(categorySlug as string);
        if (!originalCategory) {
          notFound();
          return;
        }

        const translatedCategory = getTranslatedCategory(originalCategory);
        
        const ids = problemIds.split(',');
        const selectedProblems = translatedCategory.problems.filter((p) => ids.includes(p.id));

        const inspectionFee = translatedCategory.base_inspection_fee * location.inspection_multiplier;
        const totalRepairCost = selectedProblems.reduce((acc, problem) => {
            return acc + (problem.base_min_fee * location.repair_multiplier);
        }, 0);
        
        const totalEstimatedPrice = totalRepairCost + inspectionFee;
        
        setDetails({
          category: translatedCategory,
          selectedProblems,
          totalRepairCost,
          inspectionFee,
          totalEstimatedPrice
        });

      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [categorySlug, problemIds, getTranslatedCategory, location]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }
  
  if (!details) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingForm 
        categoryId={details.category.id}
        problemIds={problemIds!}
        inspectionFee={details.inspectionFee}
        totalEstimatedPrice={details.totalEstimatedPrice}
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
