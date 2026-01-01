'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, Phone, MapPin, ArrowRight, Info } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  currentAddress: z.string().min(5, { message: 'Please enter a valid address.' }),
});

type PersonalInfoForm = z.infer<typeof PersonalInfoSchema>;

function PersonalInfoStep({ onNext }: { onNext: () => void }) {
  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      currentAddress: '',
    },
  });

  const onSubmit = (data: PersonalInfoForm) => {
    console.log('Personal Info:', data);
    onNext();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Basic Details</h2>
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input icon={User} placeholder="Full Name (As per Aadhar)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input icon={Phone} type="tel" placeholder="Mobile Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentAddress"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input icon={MapPin} placeholder="Current Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
          <Info className="h-4 w-4 !text-blue-500" />
          <AlertDescription>
           *Apna real name aur number dein kyunki hum aapki identity verify karenge.
          </AlertDescription>
        </Alert>

        <Button type="submit" size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </FormProvider>
  );
}

export default function PartnerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final submission logic
      router.push('/partner/success');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const progressValue = (step / totalSteps) * 100;

  const getStepComponent = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep onNext={handleNext} />;
      // Add case 2 and 3 for other steps later
      default:
        return <PersonalInfoStep onNext={handleNext} />;
    }
  }

  const getStepTitle = () => {
    switch (step) {
        case 1: return "Personal Info";
        case 2: return "Professional Info";
        case 3: return "Document Upload";
        default: return "Personal Info";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Partner Onboarding</h1>
          <p className="text-sm font-semibold uppercase text-primary">
            Step {step} of {totalSteps}: {getStepTitle()}
          </p>
        </div>
      </div>
      
      <Progress value={progressValue} className="mb-8 h-2" />

      {getStepComponent()}
    </div>
  );
}
