'use client';
import { type Problem, getServiceCategory } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ServiceCategory } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function CategorySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto border-0 shadow-none">
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                  <div className="relative w-full aspect-video bg-muted/30">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-3 text-center w-full bg-card">
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ProblemSelectionPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const { t, getTranslatedCategory } = useTranslation();
  const router = useRouter();

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const originalCategory = await getServiceCategory(categoryId as string);
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

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, getTranslatedCategory]);


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
    const problemIds = selectedProblems.map((p) => p.id).join(',');
    router.push(`/book/${categoryId}/details?problems=${problemIds}`);
  };

  const removeProblem = (problemId: string) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== problemId));
  };
  
  if (loading) {
    return <CategorySkeleton />;
  }

  if (!category) {
    notFound();
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-headline">
            {t('whatsTheProblemWithYour')} {category.name}?
          </CardTitle>
          <CardDescription>{t('select_all_issues', {defaultValue: "Select all issues you are facing."})}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
            {category.problems.map((problem) => {
              const isSelected = selectedProblems.some((p) => p.id === problem.id);
              return (
                <Card
                  key={problem.id}
                  onClick={() => toggleProblemSelection(problem)}
                  className={`cursor-pointer overflow-hidden group transition-all duration-300 h-full flex flex-col hover:shadow-lg relative ${
                    isSelected ? 'border-accent shadow-lg' : 'border-border'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                  <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                    <div className="relative w-full aspect-video bg-muted/30">
                      <Image
                        src={problem.image.imageUrl}
                        alt={problem.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-105 p-4"
                        data-ai-hint={problem.image.imageHint}
                      />
                    </div>
                    <div className="p-3 text-center w-full bg-card">
                      <h3 className="font-semibold text-sm md:text-base">{problem.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {selectedProblems.length > 0 && (
         <div className="mt-8">
            <div className="container mx-auto px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 bg-background border shadow-lg p-4 rounded-lg">
                    <div className="flex-grow flex items-center gap-2 overflow-hidden">
                       <p className="font-semibold hidden sm:inline">{t('selected_issues', { defaultValue: 'Selected:'})}</p>
                       <div className="flex gap-2 overflow-x-auto">
                         {selectedProblems.map(p => (
                             <Badge key={p.id} variant="secondary" className="flex items-center gap-1.5 whitespace-nowrap">
                                 {p.name}
                                 <button onClick={() => removeProblem(p.id)} className="rounded-full hover:bg-muted-foreground/20">
                                     <X className="w-3 h-3" />
                                 </button>
                             </Badge>
                         ))}
                       </div>
                    </div>
                    <Button onClick={handleBookRepair} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shrink-0">
                      {t('bookRepairNow')}
                    </Button>
                </div>
            </div>
         </div>
      )}
    </div>
  );
}
