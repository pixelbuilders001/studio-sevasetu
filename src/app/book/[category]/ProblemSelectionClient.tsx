
'use client';
import { type Problem, type ServiceCategory } from '@/lib/data';
import { useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ArrowLeft, HelpCircle, Camera, Plus, Star, MapPin, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';
import DesktopProblemSelection from './DesktopProblemSelection';
import FullScreenLoader from '@/components/FullScreenLoader';
import { useBooking } from '@/context/BookingContext';

type ClientCategory = Omit<ServiceCategory, 'icon'> & { iconName: string };

export default function ProblemSelectionClient({ category }: { category: ClientCategory }) {
  const { t, getTranslatedCategory } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { media, secondaryMedia, setMedia, setSecondaryMedia } = useBooking();

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null]);
  const photoInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Sync previews with context media on mount
    const previews = [null, null] as (string | null)[];
    if (media) {
      previews[0] = URL.createObjectURL(media);
    }
    if (secondaryMedia) {
      previews[1] = URL.createObjectURL(secondaryMedia);
    }
    setPhotoPreviews(previews);

    return () => {
      // Clean up previews on unmount
      previews.forEach(p => {
        if (p) URL.revokeObjectURL(p);
      });
    };
  }, [media, secondaryMedia]);

  if (!category) {
    notFound();
  }

  const translatedCategory = getTranslatedCategory(category as any);

  const problems = translatedCategory?.problems ?? [];
  const otherProblem = problems.find((p: Problem) =>
    p.name.toLowerCase().includes('other') || p.name.toLowerCase().includes('not sure')
  );
  const primaryProblems = problems.filter((p: Problem) => p.id !== otherProblem?.id).slice(0, 3);
  const displayProblems = [...primaryProblems, ...(otherProblem ? [otherProblem] : [])];


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

    if (!media) {
      toast({
        variant: "destructive",
        title: "Photo Required",
        description: "Please upload at least one photo of the issue to proceed."
      });
      return;
    }

    setIsLoading(true);
    const problemIds = selectedProblems.map(p => p.id).join(',');
    router.push(`/book/${category.slug}/estimate?problems=${problemIds}`);
  };

  const handlePhotoSlotClick = (index: number) => {
    photoInputsRef.current[index]?.click();
  };

  const handlePhotoChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (index === 0) {
      setMedia(file || null);
    } else if (index === 1) {
      setSecondaryMedia(file || null);
    }

    setPhotoPreviews((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        URL.revokeObjectURL(updated[index] as string);
      }
      updated[index] = file ? URL.createObjectURL(file) : null;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop View (md+) */}
      <div className="hidden md:block">
        <DesktopProblemSelection
          category={category}
          translatedCategory={translatedCategory}
          selectedProblems={selectedProblems}
          toggleProblemSelection={toggleProblemSelection}
          handleBookRepair={handleBookRepair}
          router={router}
        />
      </div>

      {/* Mobile View (md hidden) */}
      <div className="md:hidden pb-24 bg-[#f8fafc]">
        {/* Header */}
        <div className="bg-white pt-6 pb-6 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between gap-4">
              <div className='flex items-center gap-2'>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                  className="w-9 h-9 rounded-full bg-background/60 border border-slate-200 hover:bg-primary/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  <h1 className="text-xl font-bold text-slate-900">Pick problems</h1>
                </div>
              </div>

              <a
                href="tel:+917033000034"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 text-xs font-semibold shadow-sm hover:bg-emerald-100 active:scale-95 transition-all"
                aria-label="Call for help"
              >
                <span className="relative inline-flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 items-center justify-center">
                    <PhoneCall className="w-2.5 h-2.5 text-white" />
                  </span>
                </span>
                Help
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-2">
          <div className="max-w-xl mx-auto space-y-6">

            {/* Visual diagnosis upload */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.05)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Visual diagnosis</p>
                </div>
                <span className="text-[11px] text-slate-400">Upload up to 2 photos</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((slot) => (
                  <div
                    key={slot}
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePhotoSlotClick(slot)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handlePhotoSlotClick(slot)}
                    className={cn(
                      "group relative aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 overflow-hidden",
                      photoPreviews[slot] ? "border-primary bg-white" : ""
                    )}
                  >
                    {photoPreviews[slot] ? (
                      <>
                        <Image
                          src={photoPreviews[slot] as string}
                          alt={`Photo ${slot + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-white/80 text-[10px] font-semibold text-slate-700">
                          Retake
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm">
                          <Camera className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <Plus className="w-3 h-3" />
                          <span>Add photo</span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center px-4 leading-tight">
                          Tap to click or upload
                        </p>
                      </>
                    )}
                    <input
                      ref={(el) => {
                        photoInputsRef.current[slot] = el;
                        return undefined;
                      }}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handlePhotoChange(slot, e)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Problems list */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pick problems</p>
                </div>
                <span className="text-[11px] text-slate-400">Select one or more</span>
              </div>

              <div className="space-y-3">
                {displayProblems.map((problem: Problem, index: number) => {
                  const isSelected = selectedProblems.some((p) => p.id === problem.id);
                  const isOther = problem.name.toLowerCase().includes('other') || problem.name.toLowerCase().includes('not sure');

                  if (isOther) {
                    return (
                      <div
                        key={problem.id}
                        onClick={() => toggleProblemSelection(problem)}
                        className={cn(
                          'group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/15 shadow-md shadow-primary/10'
                            : 'border-slate-200 bg-white hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(79,70,229,0.08)]',
                          'bg-indigo-50/40'
                        )}
                      >
                        <div className="p-4 flex items-center gap-4">
                          <div className={cn(
                            "relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                            isSelected ? "bg-primary/10" : "bg-white"
                          )}>
                            <HelpCircle className="w-7 h-7 text-primary" />
                          </div>

                          <div className="flex-grow space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm text-slate-900">{problem.name}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                Recommended
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {t('other_problem_description' as any, { defaultValue: "A technician will call to diagnose." })}
                            </p>
                          </div>

                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                            isSelected
                              ? "bg-primary border-primary scale-110 shadow-sm shadow-primary/30"
                              : "border-slate-300 bg-white"
                          )}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
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
                        'group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/15'
                          : 'border-slate-200 hover:border-primary/40 hover:shadow-[0_14px_36px_rgba(79,70,229,0.08)]'
                      )}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <div className={cn(
                          "relative w-12 h-12 rounded-xl flex items-center justify-center p-2 transition-colors duration-300 bg-slate-50",
                          isSelected ? "bg-primary/10" : "group-hover:bg-primary/5"
                        )}>
                          <Image
                            src={problem.image.imageUrl}
                            alt={problem.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-grow space-y-0.5">
                          <h3 className={cn(
                            "font-semibold text-sm transition-colors",
                            isSelected ? "text-primary" : "text-slate-900"
                          )}>
                            {problem.name}
                          </h3>
                          <p className="text-[11px] text-slate-500">Tap to select this issue</p>
                        </div>

                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                          isSelected
                            ? "bg-primary border-primary scale-110 shadow-sm shadow-primary/30"
                            : "border-slate-300 bg-white"
                        )}>
                          {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </section>

            {/* Available pros */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Available pros nearby</p>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Live near you
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                <div className="min-w-[230px] bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-2xl bg-slate-200 shadow-lg overflow-hidden"
                      style={{ backgroundImage: 'url(https://i.pravatar.cc/120?img=12)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <span className="absolute -right-1 -bottom-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-900">Suman Gupta</p>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        4.8
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Ready for visit</p>
                  </div>
                </div>
                <div className="min-w-[230px] bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-2xl bg-slate-200 shadow-lg overflow-hidden"
                      style={{ backgroundImage: 'url(https://i.pravatar.cc/120?img=47)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <span className="absolute -right-1 -bottom-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-900">Ramesh Kumar</p>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        4.9
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Ready for visit</p>
                  </div>
                </div>
              </div>
            </section>

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
                  className="bg-[#1e1b4b] hover:bg-primary text-white font-black rounded-full px-8 shadow-lg shadow-indigo-200 h-11 flex items-center gap-2 group transition-all uppercase text-xs tracking-widest"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {isLoading && <FullScreenLoader />}
    </div>
  );
}
