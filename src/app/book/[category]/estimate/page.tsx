
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wrench, Hammer, ArrowLeft, CheckCircle, ShieldCheck, Wallet, Package, IndianRupee, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useLocation } from '@/context/LocationContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function PriceEstimationSkeleton() {
  return (
     <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-8" />
      
      <Skeleton className="h-6 w-1/2 mb-4" />
      <div className="space-y-3 mb-8">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      <Card className="bg-gray-800 text-white dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="bg-white/90 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-4 w-2/5 mt-1" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24 mt-1" />
                </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-between">
                <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-36 mt-1" />
                </div>
                <Skeleton className="h-6 w-6" />
            </div>
             <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-16 w-full rounded-lg mt-8" />
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  )
}

export default function PriceEstimationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { category: categorySlug } = params as { category: string };
  const problemIds = searchParams.get('problems');

  const { t, getTranslatedCategory } = useTranslation();
  const { location } = useLocation();
  
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

  if (loading) {
    return <PriceEstimationSkeleton />;
  }

  if (!category || !problemIds || selectedProblems.length === 0) {
    notFound();
  }

  const inspectionFee = category.base_inspection_fee * location.inspection_multiplier;
  
  const totalRepairCost = selectedProblems.reduce((acc, problem) => {
    return acc + (problem.base_min_fee * location.repair_multiplier);
  }, 0);

  const totalEstimatedPrice = totalRepairCost + inspectionFee;

  const detailsLink = `/book/${categorySlug}/details?problems=${problemIds}`;

  return (
    <div className="container mx-auto px-4 py-8 pb-28">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Order Summary</h1>
          <p className="text-muted-foreground uppercase text-sm">{category.name} Repair Service</p>
        </div>
      </div>
      
      <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Problems Selected</h2>
      <div className="space-y-3 mb-8">
        {selectedProblems.map(problem => {
          return (
            <Card key={problem.id} className="p-4 flex items-center gap-4 bg-card">
              <div className="relative w-12 h-12 bg-muted/40 rounded-lg flex items-center justify-center p-1">
                <Image
                  src={problem.image.imageUrl}
                  alt={problem.name}
                  width={40}
                  height={40}
                  className="object-contain"
                  data-ai-hint={problem.image.imageHint}
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{problem.name}</h3>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </Card>
          )
        })}
      </div>

      <Card className="bg-gray-800 text-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold uppercase tracking-wider">Price Estimate</h2>
             <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-blue-600/80 text-white">Pay after service</span>
          </div>
          <div className="bg-white/95 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 p-4 rounded-lg space-y-3">
             <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-800 dark:text-gray-200">Total Estimated Price</span>
              <span className="font-extrabold text-gray-900 dark:text-gray-100 flex items-center"><IndianRupee className="w-5 h-5" />{totalEstimatedPrice}</span>
            </div>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
              (Includes a minimum visiting fee of ₹{inspectionFee} payable after inspection, even if no repair is done)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Alert className="mt-8 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
        <Info className="h-4 w-4 !text-blue-500" />
        <AlertTitle className="font-bold">Disclaimer</AlertTitle>
        <AlertDescription className="text-sm">
          This is an estimated price based on the selected problem(s). The final cost, including any parts, may vary after the technician's physical inspection.
        </AlertDescription>
      </Alert>

      <Card className="mt-4 p-4 flex items-center gap-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
        <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
        <div>
          <h3 className="font-bold text-green-800 dark:text-green-200">30-Day Guarantee</h3>
          <p className="text-sm text-green-700 dark:text-green-300">Full protection on repairs</p>
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
        <Button asChild size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
            <Link href={detailsLink}>Confirm Visit</Link>
        </Button>
      </div>
    </div>
  );
}
