
'use client';

import React, { useState, useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, Phone, MapPin, ArrowRight, Info, CreditCard, UploadCloud, CheckCircle, Briefcase, Star, Wrench, X, Loader2 } from 'lucide-react';
import { useForm, FormProvider, type SubmitHandler, useFormState as useReactHookFormFormState } from 'react-hook-form';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { getServiceCategories } from '@/lib/data';
import type { ServiceCategory } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { registerPartner } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  currentAddress: z.string().min(5, { message: 'Please enter a valid address.' }),
});
type PersonalInfoForm = z.infer<typeof PersonalInfoSchema>;


const DocumentsSchema = z.object({
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Please enter a valid 12-digit Aadhar number.' }),
  aadharFront: z.any().refine((files) => files?.length === 1, 'Aadhar front picture is required.'),
  aadharBack: z.any().refine((files) => files?.length === 1, 'Aadhar back picture is required.'),
  selfie: z.any().refine((files) => files?.length === 1, 'Selfie with Aadhar is required.'),
});
type DocumentsForm = z.infer<typeof DocumentsSchema>;


const ExperienceSchema = z.object({
  primarySkill: z.string().min(1, { message: 'Please select your primary skill.' }),
  totalExperience: z.string().min(1, { message: 'Please select your total experience.' }),
});
type ExperienceForm = z.infer<typeof ExperienceSchema>;

type FullFormData = PersonalInfoForm & DocumentsForm & ExperienceForm;

function PersonalInfoStep({ onNext, defaultValues }: { onNext: (data: PersonalInfoForm) => void, defaultValues: Partial<PersonalInfoForm> }) {
  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues
  });

  const onSubmit = (data: PersonalInfoForm) => {
    onNext(data);
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


function FileUpload({ 
  field, 
  label, 
  previewUrl,
  onRemove
}: { 
  field: any, 
  label: string, 
  previewUrl: string | null,
  onRemove: () => void 
}) {
  return (
    <FormItem className="w-full">
      <FormControl>
        <label className={cn(
          "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer overflow-hidden",
          previewUrl ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        )}>
          {previewUrl ? (
             <>
              <Image src={previewUrl} alt={label} layout="fill" objectFit="cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 z-10 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <UploadCloud className="mx-auto mb-1 w-8 h-8" />
              <span className="font-semibold text-sm">{label}</span>
            </div>
          )}
          <Input type="file" className="hidden" {...field} accept="image/*" />
        </label>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function DocumentsStep({ onNext, defaultValues }: { onNext: (data: DocumentsForm) => void, defaultValues: Partial<DocumentsForm> }) {
  const form = useForm<DocumentsForm>({
    resolver: zodResolver(DocumentsSchema),
    defaultValues: {
      aadharNumber: defaultValues.aadharNumber || '',
      aadharFront: defaultValues.aadharFront,
      aadharBack: defaultValues.aadharBack,
      selfie: defaultValues.selfie,
    }
  });

  const getInitialPreview = (fileList: any) => {
    if (fileList && fileList.length > 0 && fileList[0] instanceof File) {
      return URL.createObjectURL(fileList[0]);
    }
    return null;
  }

  const [previews, setPreviews] = useState({
    aadharFront: getInitialPreview(defaultValues.aadharFront),
    aadharBack: getInitialPreview(defaultValues.aadharBack),
    selfie: getInitialPreview(defaultValues.selfie),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof previews) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({...prev, [fieldName]: previewUrl}));
      form.setValue(fieldName, e.target.files as any);
    }
  };

  const handleRemove = (fieldName: keyof typeof previews) => {
    if(previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName] as string);
    }
    setPreviews(prev => ({...prev, [fieldName]: null}));
    form.setValue(fieldName, null as any);
    const fileInput = document.getElementById(fieldName) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = (data: DocumentsForm) => {
    onNext(data);
  };

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
              render={({ field: { ref, onBlur, name } }) => (
                 <FileUpload 
                    field={{
                      id: name,
                      name,
                      ref,
                      onBlur,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, name)
                    }} 
                    label="Aadhaar Front" 
                    previewUrl={previews.aadharFront}
                    onRemove={() => handleRemove(name)}
                 />
              )}
            />
            <FormField
              control={form.control}
              name="aadharBack"
               render={({ field: { ref, onBlur, name } }) => (
                 <FileUpload 
                    field={{
                      id: name,
                      name,
                      ref,
                      onBlur,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, name)
                    }}
                    label="Aadhaar Back" 
                    previewUrl={previews.aadharBack}
                    onRemove={() => handleRemove(name)}
                 />
              )}
            />
        </div>

        <div>
            <Label className="text-muted-foreground font-semibold ml-1 mb-2 block">Selfie with Aadhaar</Label>
            <FormField
              control={form.control}
              name="selfie"
              render={({ field: { ref, onBlur, name } }) => (
                 <FileUpload 
                    field={{
                      id: name,
                      name,
                      ref,
                      onBlur,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, name)
                    }}
                    label="Upload Selfie"
                    previewUrl={previews.selfie}
                    onRemove={() => handleRemove(name)}
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


function ExperienceStep({
  defaultValues,
  state,
  formData
}: {
  defaultValues: Partial<ExperienceForm>;
  state: { message: string; error?: string };
  formData: Partial<FullFormData>;
}) {
  const [categories, setCategories] = useState<Omit<ServiceCategory, 'problems' | 'icon'>[]>([]);
  const { pending } = useFormStatus();

  useEffect(() => {
    async function fetchSkills() {
      const skills = await getServiceCategories();
      setCategories(skills);
    }
    fetchSkills();
  }, []);

  const experienceLevels = [
    '0-1 Year',
    '1-3 Years',
    '3-5 Years',
    '5+ Years',
  ];
  
  const form = useForm<ExperienceForm>({
    resolver: zodResolver(ExperienceSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <>
        {Object.entries(formData).map(([key, value]) => {
          if (key !== 'primarySkill' && key !== 'totalExperience' && value) {
            // Files are handled separately and already in FormData
            if (value instanceof FileList) return null;
            return <input key={key} type="hidden" name={key} value={value as string} />;
          }
          return null;
        })}
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Skills &amp; Experience</h2>
        </div>

        <FormField
          control={form.control}
          name="primarySkill"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                <FormControl>
                    <div className='relative'>
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <SelectTrigger className="pl-10 text-base h-12 rounded-lg">
                            <SelectValue placeholder="Select Primary Skill" />
                        </SelectTrigger>
                    </div>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="totalExperience"
          render={({ field }) => (
            <FormItem>
               <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                <FormControl>
                    <div className='relative'>
                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <SelectTrigger className="pl-10 text-base h-12 rounded-lg">
                            <SelectValue placeholder="Total Experience" />
                        </SelectTrigger>
                    </div>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map(exp => (
                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Alert className="bg-orange-50 border-orange-200 text-orange-800">
          <Info className="h-4 w-4 !text-orange-500" />
          <AlertDescription>
           By submitting, you agree to our <a href="#" className="font-bold underline">Partner Terms</a> and code of conduct.
          </AlertDescription>
        </Alert>
        
        {state?.error && (
            <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
                {state.error}
            </AlertDescription>
            </Alert>
        )}

        <Button type="submit" size="lg" disabled={pending} className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
            {pending ? 'Submitting...' : 'SUBMIT APPLICATION'}
        </Button>
      </>
    </FormProvider>
  );
}


export default function PartnerOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const [localFormData, setLocalFormData] = useState<Partial<FullFormData>>({
    fullName: '',
    mobileNumber: '',
    currentAddress: '',
    aadharNumber: '',
    primarySkill: '',
    totalExperience: '',
  });

  const [state, formAction] = useActionState(registerPartner, { message: "", error: undefined });


  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: state.error,
      });
    }
  }, [state, toast]);


  const totalSteps = 3;

  const handleNextStep1 = (data: PersonalInfoForm) => {
    setLocalFormData(prev => ({...prev, ...data}));
    setStep(2);
  }
  
  const handleNextStep2 = (data: DocumentsForm) => {
    setLocalFormData(prev => ({...prev, ...data}));
    setStep(3);
  }

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
        return <PersonalInfoStep onNext={handleNextStep1} defaultValues={localFormData} />;
      case 2:
        return <DocumentsStep onNext={handleNextStep2} defaultValues={localFormData} />;
      case 3:
        return (
          <form action={formAction}>
            <ExperienceStep 
              defaultValues={localFormData}
              state={state}
              formData={localFormData}
            />
          </form>
        );
      default:
        return <PersonalInfoStep onNext={handleNextStep1} defaultValues={localFormData} />;
    }
  }

  const getStepTitle = () => {
    switch (step) {
        case 1: return "Personal Info";
        case 2: return "Documents";
        case 3: return "Experience";
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
