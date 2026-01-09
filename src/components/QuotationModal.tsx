
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { IndianRupee, Wrench, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { acceptQuote, rejectQuote } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { RepairQuote } from '@/lib/types/booking';

type QuotationModalProps = {
  quote: RepairQuote & { booking_id: string };
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (bookingId: string, newStatus: 'in-progress' | 'cancelled') => void;
};

export default function QuotationModal({ quote, isOpen, onClose, onStatusChange }: QuotationModalProps) {
  const [isLoading, setIsLoading] = useState<'accept' | 'reject' | null>(null);
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsLoading('accept');
    const result = await acceptQuote(quote);
    if (result.success) {
      toast({ title: 'Quote Accepted', description: 'The repair is now in progress.' });
      onStatusChange(quote.booking_id, 'in-progress');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(null);
  };

  const handleReject = async () => {
    setIsLoading('reject');
    const result = await rejectQuote(quote);
    if (result.success) {
      toast({ title: 'Quote Rejected', description: 'This booking has been cancelled.' });
      onStatusChange(quote.booking_id, 'cancelled');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Wrench className="w-6 h-6 text-primary" />
            Repair Quotation
          </DialogTitle>
          <DialogDescription>
            Please review the cost breakdown for your repair.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Technician Notes:</h4>
            <p className="text-sm">{quote.notes || 'No additional notes provided.'}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Labor Cost</span>
              <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4" />{quote.labor_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Parts Cost</span>
              <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4" />{quote.parts_cost.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Total Amount</span>
              <span className="font-extrabold text-xl flex items-center"><IndianRupee className="w-5 h-5" />{quote.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleReject} disabled={!!isLoading} className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
            {isLoading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
            Reject
          </Button>
          <Button onClick={handleAccept} disabled={!!isLoading}>
            {isLoading === 'accept' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            Accept & Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

