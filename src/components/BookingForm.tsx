'use client';

import { useActionState, useEffect, useRef } from 'react';
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

export function BookingForm({ category, problem }: { category: string; problem: string }) {
  const { t, language } = useTranslation();
  const initialState: FormState = { message: '', errors: {}, success: false };
  
  const translatedBookService = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    formData.append('lang', language);
    return bookService(prevState, formData);
  }

  const [state, dispatch] = useActionState(translatedBookService, initialState);
  const { errors } = state;

  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success && Object.keys(errors || {}).length > 0) {
      toast({
        variant: 'destructive',
        title: t('bookingError'),
        description: state.message,
      });
    }
    if (state.success) {
        formRef.current?.reset();
    }
  }, [state, errors, toast, t]);

  const isOtherProblem = problem.toLowerCase() === 'other issue' || problem === 'अन्य समस्या';

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="problem" value={problem} />
      
      <div>
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required />
        {errors?.name && <p className="text-sm font-medium text-destructive mt-1">{errors.name[0]}</p>}
      </div>

      <div>
        <Label htmlFor="mobile">{t('mobileLabel')}</Label>
        <Input id="mobile" name="mobile" type="tel" required />
        {errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{errors.mobile[0]}</p>}
      </div>

      <div>
        <Label htmlFor="address">{t('addressLabel')}</Label>
        <Textarea id="address" name="address" required />
        {errors?.address && <p className="text-sm font-medium text-destructive mt-1">{errors.address[0]}</p>}
      </div>

      <div>
        <Label htmlFor="landmark">{t('landmarkLabel')}</Label>
        <Input id="landmark" name="landmark" />
      </div>

      {isOtherProblem && (
        <div>
            <Label htmlFor="problemDescription">{t('describeProblemLabel')}</Label>
            <Textarea id="problemDescription" name="problemDescription" required />
            {errors?.problemDescription && <p className="text-sm font-medium text-destructive mt-1">{errors.problemDescription[0]}</p>}
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
        {errors?.timeSlot && <p className="text-sm font-medium text-destructive mt-1">{errors.timeSlot[0]}</p>}
      </div>

      <div>
        <Label htmlFor="media">{t('mediaLabel')}</Label>
        <Input id="media" name="media" type="file" accept="image/jpeg,image/png,video/mp4" />
        <p className="text-sm text-muted-foreground mt-1">{t('mediaHelpText')}</p>
        {errors?.media && <p className="text-sm font-medium text-destructive mt-1">{errors.media[0]}</p>}
      </div>
      
      {state.message && !state.success && Object.keys(errors || {}).length > 0 && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
