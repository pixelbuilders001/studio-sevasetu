
'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { Smartphone, UserCheck, Wrench, IndianRupee } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Smartphone,
      title: 'BOOK IN SECONDS',
      description: "Choose your device and the problem you're facing. Get an instant estimate.",
      bgColor: 'bg-blue-500',
    },
    {
      icon: UserCheck,
      title: 'EXPERT ASSIGNED',
      description: "We'll assign a verified technician near you. Arrives in 60 mins.",
      bgColor: 'bg-indigo-500',
    },
    {
      icon: Wrench,
      title: 'DOORSTEP REPAIR',
      description: 'Technician repairs your device right in front of you. Safe & secure.',
      bgColor: 'bg-teal-500',
    },
    {
      icon: IndianRupee,
      title: 'PAY POST REPAIR',
      description: 'Satisfied? Pay only after the job is done. Online or Cash.',
      bgColor: 'bg-green-500',
    },
  ];
  
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">How SevaSetu Works</h2>
            <p className="text-muted-foreground uppercase text-sm font-semibold tracking-wider">SIMPLE 4-STEP PROCESS</p>
        </div>
        
        <div className="relative">
            {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-6 md:gap-8 relative pb-12">
                    {index < steps.length - 1 && (
                        <div className="absolute left-7 top-7 h-full border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                    )}
                    <div className="relative z-10">
                        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${step.bgColor} text-white shadow-lg`}>
                            <step.icon className="w-7 h-7" />
                        </div>
                         <div className="absolute -top-2 -right-2 bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-muted/30">
                            0{index + 1}
                        </div>
                    </div>
                    <div className="pt-1">
                        <h3 className="font-bold text-lg uppercase tracking-wide text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
