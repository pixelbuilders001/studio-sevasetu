
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, Suspense, useState, useEffect } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="min-h-screen bg-background pb-28">
        <div className="bg-primary/5 pt-6 pb-8 rounded-b-[2rem]">
          <div className="container mx-auto px-6">
            <div className="w-10 h-10 rounded-full bg-muted mb-4" />
            <Skeleton className="h-7 w-1/2 mb-2" />
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8">
          <div className="max-w-xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!details) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Background Accent */}
      <div className="bg-primary/5 pt-6 pb-10 rounded-b-[2rem]">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-background/50 backdrop-blur-sm border-primary/10 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-2xl font-bold font-headline tracking-tight">
                Final Details
              </h1>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                Complete your booking for {details.category.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6">
        <div className="max-w-xl mx-auto">
          <BookingForm
            categoryId={details.category.id}
            problemIds={problemIds!}
            inspectionFee={details.inspectionFee}
            totalEstimatedPrice={details.totalEstimatedPrice}
          />
        </div>
      </div>
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
