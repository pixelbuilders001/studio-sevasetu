
'use client';

import { useState, useMemo, useRef, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import { bookService } from '@/app/actions';

const initialState = {
  message: "",
};


export function BookingForm({ categoryId, problemIds, totalEstimate }: { categoryId: string; problemIds: string; totalEstimate: number; }) {
  const { t } = useTranslation();
  const { location } = useLocation();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction, isPending] = useActionState(bookService, initialState);


  const problemDescription = "General Checkup";
  const otherIssueStrings = ['other issue', 'अन्य समस्या'];
  const isOtherProblem = useMemo(() => {
    return otherIssueStrings.includes(problemDescription.toLowerCase());
  }, [problemDescription]);

  useEffect(() => {
    if (state?.error) {
      toast({
          variant: 'destructive',
          title: t('errorTitle'),
          description: state.error,
      });
    }
  }, [state, t, toast]);
  
  const handleFormAction = (formData: FormData) => {
    // Append additional data not present in the form fields
    formData.append('category_id', categoryId);
    
    const issueIds = problemIds.split(',');
    if (issueIds.length > 0) {
        formData.append('issue_id', issueIds[0]);
    }
    
    if(location.pincode) {
        formData.append('pincode', location.pincode);
    }
    
    formAction(formData);
  };


  return (
    <form ref={formRef} action={handleFormAction} className="space-y-4">
      
      <div>
        <Label htmlFor="user_name">{t('nameLabel')}</Label>
        <Input id="user_name" name="user_name" required />
      </div>

      <div>
        <Label htmlFor="mobile_number">{t('mobileLabel')}</Label>
        <Input id="mobile_number" name="mobile_number" type="tel" required />
      </div>

      <div>
        <Label htmlFor="full_address">{t('addressLabel')}</Label>
        <Textarea id="full_address" name="full_address" required />
      </div>

      <div>
        <Label htmlFor="landmark">{t('landmarkLabel')}</Label>
        <Input id="landmark" name="landmark" />
      </div>

      {isOtherProblem && (
        <div>
            <Label htmlFor="problem_description">{t('describeProblemLabel')}</Label>
            <Textarea id="problem_description" name="problem_description" required />
        </div>
      )}

      <div>
        <Label htmlFor="preferred_time_slot">{t('timeSlotLabel')}</Label>
        <Select name="preferred_time_slot" required>
            <SelectTrigger id="preferred_time_slot">
                <SelectValue placeholder={t('selectTimeSlotPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="morning">{t('timeSlotMorning')}</SelectItem>
                <SelectItem value="afternoon">{t('timeSlotAfternoon')}</SelectItem>
                <SelectItem value="evening">{t('timeSlotEvening')}</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="media">{t('mediaLabel')}</Label>
        <Input id="media" name="media" type="file" accept="image/jpeg,image/png,video/mp4" />
        <p className="text-sm text-muted-foreground mt-1">{t('mediaHelpText')}</p>
      </div>
      
      {state?.error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

       <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
        <p>Total Estimated Cost</p>
        <p className="font-bold text-foreground">Rs. {totalEstimate}</p>
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {t('confirmBooking')}
      </Button>
    </form>
  );
}
