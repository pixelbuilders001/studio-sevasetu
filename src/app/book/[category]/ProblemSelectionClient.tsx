
'use client';
import { type Problem, type ServiceCategory, ICONS } from '@/lib/data';
import { useRouter, notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from '@/context/LocationContext';
import { IndianRupee } from 'lucide-react';

type ClientCategory = Omit<ServiceCategory, 'icon'> & { iconName: string };

export default function ProblemSelectionClient({ category }: { category: ClientCategory }) {
  const { t, getTranslatedCategory } = useTranslation();
  const router = useRouter();
  const { location } = useLocation();

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);

  if (!category) {
    notFound();
  }

  const translatedCategory = getTranslatedCategory(category);


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
    const problemIds = selectedProblems.map(p => p.id).join(',');
    router.push(`/book/${category.slug}/estimate?problems=${problemIds}`);
  };

  const removeProblem = (problemId: string) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== problemId));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <CardHeader className="text-left px-0 py-0">
          <CardTitle className="text-2xl md:text-3xl font-headline">
             {t('whatsTheProblemWithYour', { name: translatedCategory.name })}
          </CardTitle>
          <CardDescription>{t('select_all_issues', {defaultValue: "Select one or more issues"})}</CardDescription>
        </CardHeader>
      </div>
      <Card className="max-w-xl mx-auto border-0 shadow-none">
        <CardContent className="px-0">
          <div className="space-y-3">
            {translatedCategory.problems.map((problem) => {
              const isSelected = selectedProblems.some((p) => p.id === problem.id);
              const dynamicPrice = problem.estimated_price * location.repair_multiplier;
              return (
                <Card
                  key={problem.id}
                  onClick={() => toggleProblemSelection(problem)}
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    isSelected ? 'border-primary bg-primary/5' : 'bg-card'
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative w-14 h-14 bg-muted/40 rounded-lg flex items-center justify-center p-2">
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
                      <h3 className="font-semibold text-base">{problem.name}</h3>
                       {problem.estimated_price > 0 && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          ESTIMATED: <IndianRupee className="w-4 h-4" /> {dynamicPrice}
                        </p>
                      )}
                    </div>
                     <Checkbox checked={isSelected} className="w-5 h-5 rounded-full" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {selectedProblems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
          <div className="max-w-xl mx-auto">
            <Button
              onClick={handleBookRepair}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 rounded-full"
            >
              {`Next (${selectedProblems.length} issue${selectedProblems.length > 1 ? 's' : ''})`}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
