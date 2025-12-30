
'use client';
import { type Problem, type ServiceCategory, ICONS } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ClientCategory = Omit<ServiceCategory, 'icon'> & { iconName: string };

export default function ProblemSelectionClient({ category }: { category: ClientCategory }) {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);

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
    router.push(`/book/${category?.slug}/details?problems=${problemIds}`);
  };

  const removeProblem = (problemId: string) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== problemId));
  };
  
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
