
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Wrench, Hammer, ArrowLeft, CheckCircle, ShieldCheck, Wallet, Package, Gift } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

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
  
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');

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
  
  const detailsLink = `/book/${categorySlug}/details?problems=${problemIds}${referralCode ? `&referral_code=${referralCode}` : ''}`;


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
        {selectedProblems.map(problem => (
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
              {problem.estimated_price > 0 && (
                <p className="text-sm text-primary font-semibold">RANGE: ₹{problem.estimated_price - 300} - ₹{problem.estimated_price + 300}</p>
              )}
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 text-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold uppercase tracking-wider">Estimate Receipt</h2>
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <div className="bg-white/95 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 p-4 rounded-lg space-y-4">
             <div className="flex justify-between items-center text-base">
              <span className="font-medium text-gray-600 dark:text-gray-400">Service Visit Fee</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">₹199</span>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Estimated Spare Parts</p>
                    <p className="text-xs text-blue-500 font-bold uppercase">Based on {selectedProblems.length} issues</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">Market Price</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Quote after visit</p>
                </div>
            </div>
            
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-between text-sm">
                <div>
                    <p className="font-semibold uppercase text-blue-600 dark:text-blue-300">Payment Method</p>
                    <p className="font-bold text-blue-800 dark:text-blue-200">Pay After Satisfaction</p>
                </div>
                <Wallet className="w-6 h-6 text-blue-500" />
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
              *You only pay the visit fee (₹199) if you decide not to proceed with the repair after technician's quote.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Have a Referral Code?</h2>
         <div className="bg-card rounded-xl border p-2">
            <Input 
                icon={Gift} 
                id="referral_code" 
                name="referral_code" 
                placeholder="Enter Referral Code" 
                className="border-0 bg-transparent text-base"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
            />
        </div>
      </div>
      
      <Card className="mt-8 p-4 flex items-center gap-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
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

    
