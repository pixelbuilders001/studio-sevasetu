'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AlertCircle, Wrench, Hammer, ArrowLeft, CheckCircle, ShieldCheck, Wallet, Package, Tag, Loader2, IndianRupee } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

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
  const [referralStatus, setReferralStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [referralMessage, setReferralMessage] = useState('');
  const [discount, setDiscount] = useState(0);

  const verifyReferralCode = async () => {
    setReferralStatus('verifying');
    setReferralMessage('');
    setDiscount(0);
    
    await new Promise(res => setTimeout(res, 1000));
    
    if (referralCode.trim().toLowerCase() === 'SEVA50'.toLowerCase()) {
      setReferralStatus('success');
      setReferralMessage('Referral Applied! You saved ₹50');
      setDiscount(50);
    } else {
      setReferralStatus('error');
      setReferralMessage('Invalid referral code.');
    }
  };

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

  const netPayable = Math.max(199 - discount, 0);


  if (loading) {
    return <PriceEstimationSkeleton />;
  }

  if (!category || !problemIds || selectedProblems.length === 0) {
    notFound();
  }
  
  const detailsLink = `/book/${categorySlug}/details?problems=${problemIds}&referral_code=${encodeURIComponent(referralCode)}&discount=${discount}`;


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

       <div className="mb-8">
        <Card className="p-4 bg-white/90 dark:bg-gray-800/80 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between gap-2">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="HAVE A REFERRAL CODE?"
              value={referralCode}
              onChange={e => {
                setReferralCode(e.target.value.toUpperCase());
                setReferralStatus('idle');
                setReferralMessage('');
                setDiscount(0);
              }}
              className="flex-grow border-0 bg-transparent text-base font-semibold placeholder:text-muted-foreground placeholder:font-semibold focus-visible:ring-0"
              style={{ boxShadow: 'none' }}
              autoComplete="off"
              disabled={referralStatus === 'success'}
            />
            <Button
              type="button"
              variant={referralStatus === 'success' ? 'ghost' : 'default'}
              className="rounded-full h-9 px-6 font-semibold shadow-none text-sm"
              disabled={referralStatus === 'verifying' || !referralCode.trim()}
              onClick={verifyReferralCode}
            >
              {referralStatus === 'verifying' ? <Loader2 className="h-4 w-4 animate-spin" /> : (referralStatus === 'success' ? 'APPLIED' : 'APPLY')}
            </Button>
          </div>
        </Card>
        {referralStatus === 'success' && (
          <div className="flex items-center gap-2 mt-2 text-green-600 font-medium px-2">
            <CheckCircle className="w-5 h-5" />
            <span>{referralMessage}</span>
          </div>
        )}
        {referralStatus === 'error' && (
          <div className="flex items-center gap-2 mt-2 text-red-600 font-medium px-2">
            <AlertCircle className="w-5 h-5" />
            <span>{referralMessage}</span>
          </div>
        )}
      </div>

      <Card className="bg-gray-800 text-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold uppercase tracking-wider">Payment Breakdown</h2>
             <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-blue-600/80 text-white">Pay after service</span>
          </div>
          <div className="bg-white/95 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 p-4 rounded-lg space-y-3">
             <div className="flex justify-between items-center text-base">
              <span className="font-medium text-gray-600 dark:text-gray-400">Visiting Fee</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">₹199</span>
            </div>

            {discount > 0 && (
                 <div className="flex justify-between items-center text-base text-green-600 dark:text-green-400">
                    <span className="font-medium">Referral Discount</span>
                    <span className="font-semibold">-₹{discount}</span>
                </div>
            )}
            
            <Separator className="bg-gray-200 dark:bg-gray-700"/>

            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-800 dark:text-gray-200">Net Payable Visit Fee</span>
              <span className="font-extrabold text-gray-900 dark:text-gray-100 flex items-center"><IndianRupee className="w-5 h-5" />{netPayable}</span>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
              *Parts cost will be quoted separately by technician after physical inspection.
            </p>
          </div>
        </CardContent>
      </Card>
      
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
