import Image from 'next/image';
import type { TranslationFunc } from '@/lib/get-translation';

export default function HowItWorks({ t }: { t: TranslationFunc }) {

  const steps = [
    {
      image: '/how-it-works/step-1.png',
      title: 'BOOK IN SECONDS',
      description: "Choose your device and the problem you're facing. Get an instant estimate.",
    },
    {
      image: '/how-it-works/step-2.png',
      title: 'EXPERT ASSIGNED',
      description: "We'll assign a verified technician near you. Arrives in 60 mins.",
    },
    {
      image: '/how-it-works/step-3.png',
      title: 'DOORSTEP REPAIR',
      description: 'Technician repairs your device right in front of you. Safe & secure.',
    },
    {
      image: '/how-it-works/step-4.png',
      title: 'PAY POST REPAIR',
      description: 'Satisfied? Pay only after the job is done. Online or Cash.',
    },

  ];

  return (
    <section className="py-12 bg-white dark:bg-card rounded-[2.5rem] my-4 shadow-sm mx-2">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-headline mb-2">{t('howItWorksTitle')}</h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-xs font-medium mt-3 uppercase tracking-widest">Simple 4-Step Process</p>
        </div>

        <div className="relative pl-4">
          {/* Connecting Line */}
          <div className="absolute left-10 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-6 relative mb-8 last:mb-0 group">
              <div className="relative z-10 shrink-0">
                <div className="relative w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 bg-secondary/30 dark:bg-secondary/10 rounded-2xl p-5 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border/50 mt-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base md:text-lg text-foreground">{step.title}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground/50 bg-white dark:bg-card px-2 py-0.5 rounded-full border">
                    0{index + 1}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
