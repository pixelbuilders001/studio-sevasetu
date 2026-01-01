'use client';

import { useState, ComponentProps } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, Phone, MapPin, ArrowRight, Info, CreditCard, UploadCloud, CheckCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

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

const DocumentsSchema = z.object({
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Please enter a valid 12-digit Aadhar number.' }),
  aadharFront: z.any().refine(file => file?.length == 1, 'Aadhar front picture is required.'),
  aadharBack: z.any().refine(file => file?.length == 1, 'Aadhar back picture is required.'),
  selfie: z.any().refine(file => file?.length == 1, 'Selfie with Aadhar is required.'),
});

type DocumentsForm = z.infer<typeof DocumentsSchema>;


function FileUpload({ field, label, isUploaded }: { field: any, label: string, isUploaded: boolean }) {
  return (
    <FormItem className="w-full">
      <FormControl>
        <label className={cn(
          "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer",
          isUploaded ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        )}>
          {isUploaded ? (
            <div className="text-center text-green-600">
              <CheckCircle className="mx-auto mb-1 w-8 h-8" />
              <span className="font-semibold text-sm">UPLOADED</span>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <UploadCloud className="mx-auto mb-1 w-8 h-8" />
              <span className="font-semibold text-sm">{label}</span>
            </div>
          )}
          <Input type="file" className="hidden" {...field} />
        </label>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function DocumentsStep({ onNext }: { onNext: () => void }) {
  const form = useForm<DocumentsForm>({
    resolver: zodResolver(DocumentsSchema),
  });

  const onSubmit = (data: DocumentsForm) => {
    console.log('Documents Info:', data);
    onNext();
  };
  
  const aadharFrontWatch = form.watch('aadharFront');
  const aadharBackWatch = form.watch('aadharBack');
  const selfieWatch = form.watch('selfie');

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Identity Documents</h2>
        </div>
        
        <FormField
          control={form.control}
          name="aadharNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input icon={CreditCard} placeholder="Aadhar Card Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="aadharFront"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                 <FileUpload 
                    field={{ onChange, onBlur, name, ref }} 
                    label="Aadhaar Front" 
                    isUploaded={!!aadharFrontWatch && aadharFrontWatch.length > 0} 
                 />
              )}
            />
            <FormField
              control={form.control}
              name="aadharBack"
               render={({ field: { onChange, onBlur, name, ref } }) => (
                 <FileUpload 
                    field={{ onChange, onBlur, name, ref }} 
                    label="Aadhaar Back" 
                    isUploaded={!!aadharBackWatch && aadharBackWatch.length > 0}
                 />
              )}
            />
        </div>

        <div>
            <Label className="text-muted-foreground font-semibold ml-1 mb-2 block">Selfie with Aadhaar</Label>
            <FormField
              control={form.control}
              name="selfie"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                 <FileUpload 
                    field={{ onChange, onBlur, name, ref }} 
                    label="Upload Selfie"
                    isUploaded={!!selfieWatch && selfieWatch.length > 0}
                 />
              )}
            />
        </div>
        
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
      case 2:
        return <DocumentsStep onNext={handleNext} />;
      // Add case 3 for other steps later
      default:
        return <PersonalInfoStep onNext={handleNext} />;
    }
  }

  const getStepTitle = () => {
    switch (step) {
        case 1: return "Personal Info";
        case 2: return "Documents";
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
