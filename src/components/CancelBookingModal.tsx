
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  onSuccess: () => void;
}

const cancellationReasons = [
  'Changed my plan',
  'Booking scheduled for wrong date/time',
  'Found a better option elsewhere',
  'Technician is late',
];

export function CancelBookingModal({ isOpen, onClose, bookingId, onSuccess }: CancelBookingModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelBooking = async () => {
    if (!reason) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a reason for cancellation.',
      });
      return;
    }

    const finalReason = reason === 'other' ? otherReason.trim() : reason;
    if (!finalReason) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please provide a reason if you select \'Other\'.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/cancel-booking', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          cancelled_by: 'customer',
          reason: finalReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unexpected error occurred.');
      }

      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking.';
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>Please let us know why you're cancelling. This helps us improve our service.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {cancellationReasons.map((r) => (
              <div key={r} className="flex items-center space-x-2">
                <RadioGroupItem value={r} id={r} />
                <Label htmlFor={r}>{r}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
          {reason === 'other' && (
            <Textarea
              placeholder="Please specify your reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="mt-2"
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={handleCancelBooking} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
