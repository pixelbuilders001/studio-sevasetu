
'use client';
import { type Problem, type ServiceCategory, ICONS } from '@/lib/data';
import { useRouter, notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from '@/context/LocationContext';
import { IndianRupee } from 'lucide-react';
import FullScreenLoader from '@/components/FullScreenLoader';

type ClientCategory = Omit<ServiceCategory, 'icon'> & { iconName: string };

export default function ProblemSelectionClient({ category }: { category: ClientCategory }) {
  const { t, getTranslatedCategory } = useTranslation();
  const router = useRouter();
  const { location } = useLocation();

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!category) {
    notFound();
  }

  const translatedCategory = getTranslatedCategory(category as any);


  const toggleProblemSelection = (problem: Problem) => {
    setSelectedProblems((prevSelected) => {
      const isSelected = prevSelected.some((p) => p.id === problem.id);
      if (isSelected) {
        return prevSelected.filter((p) => p.id !== problem.id);
      } else {
        return [...prevSelected, problem];
      }
    });
  };

  const handleBookRepair = () => {
    if (selectedProblems.length === 0) {
      return;
    }
    setIsLoading(true);
    const problemIds = selectedProblems.map(p => p.id).join(',');
    router.push(`/book/${category.slug}/estimate?problems=${problemIds}`);
  };

  const removeProblem = (problemId: string) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== problemId));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Background Accent */}
      <div className="bg-primary/5 pt-6 pb-8 rounded-b-[2rem]">
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
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold font-headline tracking-tight">
                {t('select_all_issues', { defaultValue: "Select all issues you are facing" })}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6">
        <div className="max-w-xl mx-auto space-y-4">
          {translatedCategory.problems.map((problem, index) => {
            const isSelected = selectedProblems.some((p) => p.id === problem.id);
            const dynamicPrice = problem.base_min_fee * location.repair_multiplier;
            const isOther = problem.name === 'Other / Not sure';

            if (isOther) {
              return (
                <div
                  key={problem.id}
                  onClick={() => toggleProblemSelection(problem)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer animate-fade-in-up',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/5'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-md',
                    'bg-muted/20'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-4 flex items-center gap-5">
                    <div className={cn(
                      "relative w-16 h-16 rounded-xl flex items-center justify-center p-3 transition-colors duration-300",
                      isSelected ? "bg-primary/10" : "bg-muted/40 group-hover:bg-primary/5"
                    )}>
                      <HelpCircle className="w-8 h-8 text-muted-foreground" />
                    </div>

                    <div className="flex-grow space-y-1">
                      <h3 className={cn(
                        "font-semibold text-sm md:text-base transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {problem.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t('other_problem_description', { defaultValue: "Select this if you can't find your issue. A technician will call you to diagnose." })}
                      </p>
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isSelected
                        ? "bg-primary border-primary scale-110"
                        : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                    )}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={problem.id}
                onClick={() => toggleProblemSelection(problem)}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer animate-fade-in-up',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/5'
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-4 flex items-center gap-5">
                  <div className={cn(
                    "relative w-16 h-16 rounded-xl flex items-center justify-center p-3 transition-colors duration-300",
                    isSelected ? "bg-primary/10" : "bg-muted/40 group-hover:bg-primary/5"
                  )}>
                    <Image
                      src={problem.image.imageUrl}
                      alt={problem.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-grow space-y-0.5">
                    <h3 className={cn(
                      "font-semibold text-sm md:text-base transition-colors",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {problem.name}
                    </h3>
                    {problem.base_min_fee > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="text-[10px] uppercase tracking-wider opacity-60">Estimated:</span>
                        <div className="flex items-center text-primary font-bold">
                          <IndianRupee className="w-3 h-3" />
                          <span>{dynamicPrice}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isSelected
                      ? "bg-primary border-primary scale-110"
                      : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                  )}>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (FAB) Style Footer */}
      {selectedProblems.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 px-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-xl mx-auto">
            <div className="glass shadow-2xl shadow-primary/20 rounded-full p-2 flex items-center gap-3 border border-primary/20">
              <div className="flex -space-x-2 ml-3 overflow-hidden">
                {selectedProblems.slice(0, 3).map((p, i) => (
                  <div key={p.id} className="w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center text-[9px] text-white font-bold">
                    {i === 2 && selectedProblems.length > 3 ? `+${selectedProblems.length - 2}` : i + 1}
                  </div>
                ))}
              </div>

              <div className="flex-grow">
                <p className="text-xs font-bold text-foreground">
                  {selectedProblems.length} {selectedProblems.length > 1 ? 'Issues' : 'Issue'} Selected
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none">
                  Ready for estimate
                </p>
              </div>

              <Button
                onClick={handleBookRepair}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 shadow-lg shadow-primary/25 h-10 flex items-center gap-2 group"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <FullScreenLoader />}
    </div>
  );
}
