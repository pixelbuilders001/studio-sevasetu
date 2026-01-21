
'use client';
import { getServiceCategoryAction } from '@/app/actions';
import { notFound, useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, ShieldCheck, Wallet, Package, IndianRupee, Info, FileText, ClipboardList, Receipt, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import type { ServiceCategory, Problem } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useLocation } from '@/context/LocationContext';
import DesktopEstimateView from './DesktopEstimateView';
import FullScreenLoader from '@/components/FullScreenLoader';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import UserAuthSheet from '@/components/UserAuthSheet';
import { Session } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function PriceEstimationSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="container mx-auto px-6 pt-6">
        <Skeleton className="h-10 w-10 rounded-full mb-6" />
        <div className="max-w-md mx-auto">
          <Skeleton className="h-[500px] w-full rounded-3xl" />
        </div>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        const originalCategory = await getServiceCategoryAction(categorySlug as string);
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
    <div className="min-h-screen bg-gray-50">
      {/* Desktop View (md+) */}
      <div className="hidden md:block">
        <DesktopEstimateView
          category={category}
          selectedProblems={selectedProblems}
          inspectionFee={inspectionFee}
          totalRepairCost={totalRepairCost}
          totalEstimatedPrice={totalEstimatedPrice}
          handleConfirmVisit={handleConfirmVisit}
          router={router}
        />
      </div>

      {/* Mobile View (md hidden) */}
      <div className="md:hidden pb-32">
        {/* Navigation Header */}
        <div className="container mx-auto px-6 pt-6 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-background/50 backdrop-blur-sm border-primary/10 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-xl ml-2 md:text-2xl font-bold font-headline tracking-tight">Booking Estimate</span>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            {/* Main Ticket Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/50 mb-6">

              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 text-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-600/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <p className="text-indigo-100 font-medium text-xs opacity-90 uppercase tracking-widest">{category.name} Repair Service</p>
                </div>
              </div>

              <div className="p-6 relative">
                {/* Decorative punch holes for ticket look */}
                <div className="absolute -left-3 top-0 w-6 h-6 bg-gray-50 rounded-full z-[1]"></div>
                <div className="absolute -right-3 top-0 w-6 h-6 bg-gray-50 rounded-full z-[1]"></div>

                {/* Problems Section */}
                <div className="mb-6">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" />
                    Selected Issues
                  </h2>
                  <div className="space-y-3">
                    {selectedProblems.map((problem) => (
                      <div key={problem.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                          <Image
                            src={problem.image.imageUrl}
                            alt={problem.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <span className="font-bold text-sm text-gray-700">{problem.name}</span>
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dotted Divider */}
                <div className="border-b-2 border-dashed border-gray-100 my-6 relative">
                  <div className="absolute -left-9 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                  <div className="absolute -right-9 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5" />
                    Price Breakdown
                  </h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Visiting Charges</span>
                      <span className="font-bold text-gray-900 flex items-center bg-gray-50 px-2 py-0.5 rounded-lg">
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        {inspectionFee}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Est. Repair Cost</span>
                      <span className="font-bold text-gray-900 flex items-center bg-gray-50 px-2 py-0.5 rounded-lg">
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        {totalRepairCost}
                      </span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-indigo-900 text-base">Total Estimate</span>
                      <div className="flex items-center text-2xl font-black text-indigo-600">
                        <IndianRupee className="w-5 h-5 mr-0.5 stroke-[3px]" />
                        {totalEstimatedPrice}
                      </div>
                    </div>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider text-right">Pay After Service</p>
                  </div>
                </div>

                {/* Note */}
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
                    Final amount depends on diagnosis and parts required. Visting charges apply even if no repair is done.
                  </p>
                </div>

              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50/50 p-3 rounded-2xl border border-green-100/50 mb-8 mx-4">
              <ShieldCheck className="w-5 h-5 fill-green-100" />
              <span className="text-xs font-black uppercase tracking-wider">30-Day Service Guarantee</span>
            </div>

          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleConfirmVisit}
              size="lg"
              className="w-full h-14 bg-[#1e1b4b] hover:bg-primary text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase"
            >
              CONFIRM BOOKING
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {isNavigating && <FullScreenLoader />}

      {isMobile ? (
        <Sheet open={authSheetOpen} onOpenChange={setAuthSheetOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl h-[80dvh] inset-x-0 bottom-0 border-t bg-white p-0 flex flex-col"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <UserAuthSheet setSheetOpen={setAuthSheetOpen} />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={authSheetOpen} onOpenChange={setAuthSheetOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <UserAuthSheet setSheetOpen={setAuthSheetOpen} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
