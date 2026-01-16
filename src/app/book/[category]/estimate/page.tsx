
'use client';
import { getServiceCategory } from '@/lib/data';
import { notFound, useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wrench, Hammer, ArrowLeft, ArrowRight, CheckCircle, ShieldCheck, Wallet, Package, IndianRupee, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useLocation } from '@/context/LocationContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FullScreenLoader from '@/components/FullScreenLoader';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import UserAuthSheet from '@/components/UserAuthSheet';
import { Session } from '@supabase/supabase-js';

function PriceEstimationSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="bg-primary/5 pt-6 pb-8 rounded-b-[2rem]">
        <div className="container mx-auto px-6">
          <div className="w-10 h-10 rounded-full bg-muted mb-4" />
          <Skeleton className="h-7 w-1/2 mb-2" />
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6">
        <div className="max-w-xl mx-auto space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl mt-8" />
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-6">
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-full" />
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authSheetOpen, setAuthSheetOpen] = useState(false);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (user) {
        console.log('Estimate page current user:', user.email);
      }
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setAuthSheetOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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

  const handleConfirmVisit = () => {
    if (!session) {
      setAuthSheetOpen(true);
      return;
    }
    setIsNavigating(true);
    router.push(detailsLink);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
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
                Order Summary
              </h1>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                {category.name} Repair Service
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Selected Problems Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problems Selected</h2>
            </div>
            <div className="grid gap-3">
              {selectedProblems.map((problem, index) => (
                <div
                  key={problem.id}
                  className="bg-card border border-border rounded-2xl p-3 flex items-center gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-12 h-12 bg-muted/40 rounded-xl flex items-center justify-center p-2">
                    <Image
                      src={problem.image.imageUrl}
                      alt={problem.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-sm">{problem.name}</h3>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Details Card */}
          <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div
              className="bg-gray-900 dark:bg-gray-950 text-white rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h2 className="font-bold uppercase tracking-[0.2em] text-[10px] text-white/50">Price Estimate</h2>
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
                    Pay after service
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white font-bold text-lg md:text-xl">Total Estimated Price</p>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">Includes visit charges</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-primary font-black text-2xl md:text-3xl">
                        <IndianRupee className="w-6 h-6 mr-1" strokeWidth={3} />
                        <span>{totalEstimatedPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/60 leading-relaxed italic">
                      Includes a minimum visiting fee of ₹{inspectionFee} payable after inspection, even if no repair is done.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee & Disclaimer Pins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Disclaimer</p>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Final cost depends on inspection and parts required.
                </p>
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-1" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">30-Day Guarantee</p>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Full protection on all repairs performed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) Style Footer */}
      <div className="fixed bottom-4 left-0 right-0 px-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handleConfirmVisit}
            size="lg"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group transition-all"
          >
            <span>Confirm Visit</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {isNavigating && <FullScreenLoader />}

      <Sheet open={authSheetOpen} onOpenChange={setAuthSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl h-[80dvh] inset-x-0 bottom-0 border-t bg-white p-0 flex flex-col"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <UserAuthSheet setSheetOpen={setAuthSheetOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
