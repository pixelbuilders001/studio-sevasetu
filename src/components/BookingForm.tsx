'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
import { AlertCircle, Loader2 } from 'lucide-radix';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Confirm Booking
    </Button>
  );
}

export function BookingForm({ category, problem }: { category: string; problem: string }) {
  const initialState: FormState = { message: '', errors: {}, success: false };
  const [state, dispatch] = useFormState(bookService, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Booking Error',
        description: state.message,
      });
    }
    if (state.success) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="problem" value={problem} />
      
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
        {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
      </div>

      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input id="mobile" name="mobile" type="tel" required />
        {state.errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{state.errors.mobile[0]}</p>}
      </div>

      <div>
        <Label htmlFor="address">Full Address</Label>
        <Textarea id="address" name="address" required />
        {state.errors?.address && <p className="text-sm font-medium text-destructive mt-1">{state.errors.address[0]}</p>}
      </div>

      <div>
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input id="landmark" name="landmark" />
      </div>

      <div>
        <Label htmlFor="timeSlot">Preferred Time Slot</Label>
        <Select name="timeSlot" required>
            <SelectTrigger id="timeSlot">
                <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                <SelectItem value="afternoon">Afternoon (1pm - 4pm)</SelectItem>
                <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
            </SelectContent>
        </Select>
        {state.errors?.timeSlot && <p className="text-sm font-medium text-destructive mt-1">{state.errors.timeSlot[0]}</p>}
      </div>

      <div>
        <Label htmlFor="media">Upload Photo/Video (Optional)</Label>
        <Input id="media" name="media" type="file" accept="image/jpeg,image/png,video/mp4" />
        <p className="text-sm text-muted-foreground mt-1">Max 5MB. Helps us diagnose the problem better.</p>
        {state.errors?.media && <p className="text-sm font-medium text-destructive mt-1">{state.errors.media[0]}</p>}
      </div>
      
      {state.message && !state.success && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
