
'use client';

import { useActionState, useEffect, useRef, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { bookService } from '@/app/actions';
import type { FormState } from '@/lib/types';
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
import { getServiceCategory, getTranslatedCategory, type Problem } from '@/lib/data';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {t('confirmBooking')}
    </Button>
  );
}

export function BookingForm({ categoryId, problemIds, totalEstimate }: { categoryId: string; problemIds: string; totalEstimate: number; }) {
  const { t, language } = useTranslation();
  const { location } = useLocation();
  const initialState: FormState = { message: '', errors: {}, success: false };
  
  const bookServiceWithLang = bookService.bind(null, { lang: language, categoryId, problemIds, pincode: location.pincode });
  const [state, dispatch] = useActionState(bookServiceWithLang, initialState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const problemDescription = "General Checkup";
  const otherIssueStrings = ['other issue', 'अन्य समस्या'];
  const isOtherProblem = useMemo(() => {
    return otherIssueStrings.includes(problemDescription.toLowerCase());
  }, [problemDescription]);

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: state.errors && Object.keys(state.errors).length > 0 ? t('bookingError') : t('errorTitle'),
        description: state.message,
      });
    }
    if (state.success) {
        formRef.current?.reset();
    }
  }, [state, toast, t]);


  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      
      <div>
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required />
        {state?.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
      </div>

      <div>
        <Label htmlFor="mobile">{t('mobileLabel')}</Label>
        <Input id="mobile" name="mobile" type="tel" required />
        {state?.errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{state.errors.mobile[0]}</p>}
      </div>

      <div>
        <Label htmlFor="address">{t('addressLabel')}</Label>
        <Textarea id="address" name="address" required />
        {state?.errors?.address && <p className="text-sm font-medium text-destructive mt-1">{state.errors.address[0]}</p>}
      </div>

      <div>
        <Label htmlFor="landmark">{t('landmarkLabel')}</Label>
        <Input id="landmark" name="landmark" />
      </div>

      {isOtherProblem && (
        <div>
            <Label htmlFor="problemDescription">{t('describeProblemLabel')}</Label>
            <Textarea id="problemDescription" name="problemDescription" required />
            {state?.errors?.problemDescription && <p className="text-sm font-medium text-destructive mt-1">{state.errors.problemDescription[0]}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="timeSlot">{t('timeSlotLabel')}</Label>
        <Select name="timeSlot" required>
            <SelectTrigger id="timeSlot">
                <SelectValue placeholder={t('selectTimeSlotPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="morning">{t('timeSlotMorning')}</SelectItem>
                <SelectItem value="afternoon">{t('timeSlotAfternoon')}</SelectItem>
                <SelectItem value="evening">{t('timeSlotEvening')}</SelectItem>
            </SelectContent>
        </Select>
        {state?.errors?.timeSlot && <p className="text-sm font-medium text-destructive mt-1">{state.errors.timeSlot[0]}</p>}
      </div>

      <div>
        <Label htmlFor="media">{t('mediaLabel')}</Label>
        <Input id="media" name="media" type="file" accept="image/jpeg,image/png,video/mp4" />
        <p className="text-sm text-muted-foreground mt-1">{t('mediaHelpText')}</p>
        {state?.errors?.media && <p className="text-sm font-medium text-destructive mt-1">{state.errors.media[0]}</p>}
      </div>
      
      {state.message && !state.success && Object.keys(state.errors || {}).length === 0 && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

       <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
        <p>Total Estimated Cost</p>
        <p className="font-bold text-foreground">Rs. {totalEstimate}</p>
      </div>

      <SubmitButton />
    </form>
  );
}
