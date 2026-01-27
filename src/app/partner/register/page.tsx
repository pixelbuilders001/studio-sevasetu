'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, Phone, MapPin, ArrowRight, Info, CreditCard, UploadCloud, CheckCircle, Briefcase, Star, Wrench, X, Loader2, Plus, MapPinned } from 'lucide-react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { getServiceCategoriesAction } from '@/app/actions';
import type { ServiceCategory } from '@/lib/data';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/context/LocationContext';
import { useQuery } from '@tanstack/react-query';

const validationSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  current_address: z.string().min(5, { message: 'Please enter a valid address.' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'Please enter a valid 6-digit pincode.' }),
  service_area: z.string().min(1, { message: 'Service area is required.' }),
  aadhaar_number: z.string().regex(/^\d{12}$/, { message: 'Please enter a valid 12-digit Aadhar number.' }),
  aadhaar_front: z.any(),
  aadhaar_back: z.any(),
  selfie: z.any(),
  primary_skill: z.string().min(1, { message: 'Please select your primary skill.' }),
  other_skills: z.array(z.string()).max(2, { message: 'You can select a maximum of 2 other skills.' }).optional(),
  total_experience: z.string().min(1, { message: 'Please select your total experience.' }),
});

type FormData = z.infer<typeof validationSchema>;

const personalInfoFields: (keyof FormData)[] = ['full_name', 'mobile', 'current_address', 'pincode', 'service_area'];
const documentsFields: (keyof FormData)[] = ['aadhaar_number', 'aadhaar_front', 'aadhaar_back', 'selfie'];
const experienceFields: (keyof FormData)[] = ['primary_skill', 'other_skills', 'total_experience'];


function FileUpload({
  field,
  label,
}: {
  field: any,
  label: string,
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    field.onChange(e.target.files);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    const dt = new DataTransfer();
    field.onChange(dt.files);
  };

  return (
    <FormItem className="w-full">
      <Label className="text-muted-foreground font-semibold ml-1 mb-2 block">{label}</Label>
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
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <UploadCloud className="mx-auto mb-1 w-8 h-8" />
              <span className="font-semibold text-sm">Upload Photo</span>
            </div>
          )}
          <Input
            type="file"
            className="hidden"
            accept="image/*"
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            onChange={handleFileChange}
          />
        </label>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}


export default function PartnerOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { location } = useLocation();

  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['service-categories'],
    queryFn: getServiceCategoriesAction,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      // ... existing default values
      full_name: '',
      mobile: '',
      current_address: '',
      pincode: '',
      service_area: '',
      aadhaar_number: '',
      aadhaar_front: undefined,
      aadhaar_back: undefined,
      selfie: undefined,
      primary_skill: '',
      other_skills: [],
      total_experience: '',
    },
    mode: "onTouched"
  });

  // Auto-fill pincode and city from global location
  useEffect(() => {
    if (location.pincode) {
      form.setValue('pincode', location.pincode);
      form.setValue('service_area', location.city); // Or location.area?.District
    }
  }, [location, form]);

  const experienceLevels = [
    '0-1 Year',
    '1-3 Years',
    '3-5 Years',
    '5+ Years',
  ];

  const totalSteps = 3;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = async () => {
    setIsValidating(true);
    try {
      let fieldsToValidate: (keyof FormData)[];
      if (step === 1) {
        fieldsToValidate = personalInfoFields;
      } else if (step === 2) {
        const docFieldsToValidate: (keyof FormData)[] = ['aadhaar_number'];
        const isValid = await form.trigger(docFieldsToValidate);

        let filesAreValid = true;
        const formValues = form.getValues();

        if (!formValues.aadhaar_front || formValues.aadhaar_front.length === 0) {
          form.setError('aadhaar_front', { type: 'manual', message: 'Aadhar front picture is required.' });
          filesAreValid = false;
        } else {
          form.clearErrors('aadhaar_front');
        }

        if (!formValues.aadhaar_back || formValues.aadhaar_back.length === 0) {
          form.setError('aadhaar_back', { type: 'manual', message: 'Aadhar back picture is required.' });
          filesAreValid = false;
        } else {
          form.clearErrors('aadhaar_back');
        }

        if (!formValues.selfie || formValues.selfie.length === 0) {
          form.setError('selfie', { type: 'manual', message: 'Selfie with Aadhar is required.' });
          filesAreValid = false;
        } else {
          form.clearErrors('selfie');
        }

        if (isValid && filesAreValid && step < totalSteps) {
          setStep(prev => prev + 1);
        }
        return;
      } else {
        fieldsToValidate = experienceFields;
      }

      const isValid = await form.trigger(fieldsToValidate);

      if (isValid && step < totalSteps) {
        setStep(prev => prev + 1);
      }
    } finally {
      setIsValidating(false);
    }
  };


  const onSubmitFull = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('mobile', data.mobile);
    formData.append('current_address', data.current_address);
    formData.append('pincode', data.pincode);
    formData.append('service_area', data.service_area);
    formData.append('aadhaar_number', data.aadhaar_number);
    formData.append('primary_skill', data.primary_skill);

    if (data.other_skills) {
      formData.append('other_skills', JSON.stringify(data.other_skills));
    }

    const experienceDigit = data.total_experience.match(/\d+/)?.[0] || '0';
    formData.append('total_experience', experienceDigit);

    if (data.aadhaar_front && data.aadhaar_front.length > 0) {
      formData.append('aadhaar_front', data.aadhaar_front[0]);
    }
    if (data.aadhaar_back && data.aadhaar_back.length > 0) {
      formData.append('aadhaar_back', data.aadhaar_back[0]);
    }
    if (data.selfie && data.selfie.length > 0) {
      formData.append('selfie', data.selfie[0]);
    }

    try {
      const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/create-technician', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(result.error_message || result.message || `An unexpected error occurred. Status: ${response.status}`);
      }

      router.push('/partner/success');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressValue = (step / totalSteps) * 100;

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

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitFull)} className="space-y-6">
          <div className={cn("space-y-6", step !== 1 && "hidden")}>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Basic Details</h2>
            </div>
            <FormField control={form.control} name="full_name" render={({ field }) => (
              <FormItem><FormControl><Input icon={User} placeholder="Full Name (As per Aadhar)" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mobile" render={({ field }) => (
              <FormItem><FormControl><Input icon={Phone} type="tel" placeholder="Mobile Number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="current_address" render={({ field }) => (
              <FormItem><FormControl><Input icon={MapPin} placeholder="Full Address (House No, Street)" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
              <Info className="h-4 w-4 !text-blue-500" />
              <AlertDescription>*Apna real name aur number dein kyunki hum aapki identity verify karenge.</AlertDescription>
            </Alert>
          </div>

          <div className={cn("space-y-6", step !== 2 && "hidden")}>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Identity Documents</h2>
            </div>
            <FormField control={form.control} name="aadhaar_number" render={({ field }) => (
              <FormItem><FormControl><Input icon={CreditCard} placeholder="Aadhar Card Number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="aadhaar_front" render={({ field }) => <FileUpload field={field} label="Aadhaar Front" />} />
              <FormField control={form.control} name="aadhaar_back" render={({ field }) => <FileUpload field={field} label="Aadhaar Back" />} />
            </div>

            <FormField control={form.control} name="selfie" render={({ field }) => <FileUpload field={field} label="Selfie with Aadhaar" />} />
          </div>

          <div className={cn("space-y-6", step !== 3 && "hidden")}>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Skills &amp; Experience</h2>
            </div>
            <FormField control={form.control} name="primary_skill" render={({ field }) => (
              <FormItem>
                <Label className="text-muted-foreground ml-1 mb-1.5 block text-xs uppercase font-bold tracking-wider">Primary Skill</Label>
                <Select onValueChange={(val) => {
                  field.onChange(val);
                  // Reset other skills if they conflict (optional, but good UX)
                  const currentOtherSkills = form.getValues('other_skills') || [];
                  if (currentOtherSkills.includes(val)) {
                    form.setValue('other_skills', currentOtherSkills.filter(s => s !== val));
                  }
                }} defaultValue={field.value}>
                  <FormControl>
                    <div className='relative'>
                      <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <SelectTrigger className="pl-10 text-base h-12 rounded-lg"><SelectValue placeholder="Select Primary Skill" /></SelectTrigger>
                    </div>
                  </FormControl>
                  <SelectContent>
                    {categories.map(cat => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="other_skills" render={({ field }) => (
              <FormItem>
                <Label className="text-muted-foreground ml-1 mb-1.5 block text-xs uppercase font-bold tracking-wider">Other Skills (Max 2)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {field.value?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1 rounded-full">
                      {skill}
                      <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => {
                        const newSkills = field.value?.filter(s => s !== skill);
                        field.onChange(newSkills);
                      }} />
                    </Badge>
                  ))}
                </div>
                {(field.value?.length || 0) < 2 && (
                  <Select onValueChange={(val) => {
                    const currentSkills = field.value || [];
                    if (!currentSkills.includes(val)) {
                      field.onChange([...currentSkills, val]);
                    }
                  }}>
                    <FormControl>
                      <div className='relative'>
                        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <SelectTrigger className="pl-10 text-base h-12 rounded-lg"><SelectValue placeholder="Add another skill" /></SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .filter(cat => cat.name !== form.getValues('primary_skill') && !(field.value || []).includes(cat.name))
                        .map(cat => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="total_experience" render={({ field }) => (
              <FormItem>
                <Label className="text-muted-foreground ml-1 mb-1.5 block text-xs uppercase font-bold tracking-wider">Total Experience</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <div className='relative'>
                      <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <SelectTrigger className="pl-10 text-base h-12 rounded-lg"><SelectValue placeholder="Total Experience" /></SelectTrigger>
                    </div>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map(exp => (<SelectItem key={exp} value={exp}>{exp}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="mt-8">
            {step < totalSteps && (
              <Button type="button" onClick={handleNext} disabled={isValidating} size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
                {isValidating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <span className="flex items-center">Continue <ArrowRight className="ml-2 h-5 w-5" /></span>}
              </Button>
            )}
            {step === totalSteps && (
              <>
                <Alert className="bg-orange-50 border-orange-200 text-orange-800 mb-6">
                  <Info className="h-4 w-4 !text-orange-500" />
                  <AlertDescription>By submitting, you agree to our <a href="#" className="font-bold underline">Partner Terms</a> and code of conduct.</AlertDescription>
                </Alert>
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                  {isSubmitting ? 'Submitting...' : 'SUBMIT APPLICATION'}
                </Button>
              </>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
