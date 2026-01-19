
'use client';

// import { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from './ui/button';
// import { Separator } from './ui/separator';
// import { IndianRupee, Wrench, Check, X, Loader2, AlertTriangle } from 'lucide-react';
// import { acceptQuote, rejectQuote } from '@/app/actions';
// import { useToast } from '@/hooks/use-toast';
// import type { RepairQuote } from '@/lib/types/booking';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { IndianRupee, Wrench, Check, X, Loader2, FileText, ClipboardList, Wallet } from 'lucide-react';
import { acceptQuote, rejectQuote } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { RepairQuote } from '@/lib/types/booking';
import { cn } from '@/lib/utils';

type QuotationModalProps = {
  quote: RepairQuote & { booking_id: string };
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (bookingId: string, newStatus: 'quotation_approved' | 'cancelled', finalAmount?: number) => void;
};

export default function QuotationModal({ quote, isOpen, onClose, onStatusChange }: QuotationModalProps) {
  const [isLoading, setIsLoading] = useState<'accept' | 'reject' | null>(null);
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsLoading('accept');
    const result = await acceptQuote(quote);
    if (result.success) {
      toast({ title: 'Quote Accepted', description: 'The repair is now in progress.' });
      onStatusChange(quote.booking_id, 'quotation_approved', (result as any).final_amount_to_be_paid);
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
      <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-3xl bg-transparent shadow-2xl">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-900/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

            <div className="relative z-10 text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-white/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Repair Estimate</h2>
              <p className="text-indigo-100 font-medium text-xs mt-1 opacity-90">Please review the charges below</p>
            </div>
          </div>

          <div className="p-6">
            {/* Bill Card */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 mb-6 relative">
              {/* Decorative punch holes */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-gray-100 shadow-inner z-[1]"></div>
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-gray-100 shadow-inner z-[1]"></div>

              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5" />
                Cost Breakdown
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">Labor Charges</span>
                  <span className="text-sm font-black text-gray-900 flex items-center bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                    {quote.labor_cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">Parts Cost</span>
                  <span className="text-sm font-black text-gray-900 flex items-center bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                    {quote.parts_cost.toFixed(2)}
                  </span>
                </div>

                <div className="my-3 border-t-2 border-dashed border-gray-200"></div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-indigo-900">Total Payable</span>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Incl. all taxes</span>
                  </div>
                  <span className="text-2xl font-black text-indigo-600 flex items-center">
                    <IndianRupee className="w-5 h-5 mr-0.5 stroke-[3px]" />
                    {quote.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Technician Note */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 mb-6 border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-indigo-500" />
                <h4 className="font-black text-xs text-indigo-900 uppercase tracking-wider">Technician's Report</h4>
              </div>
              <p className="text-sm font-medium text-indigo-900/80 leading-relaxed">
                "{quote.notes || 'Standard repair procedure required based on diagnosis.'}"
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleAccept}
                disabled={!!isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl h-14 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading === 'accept' ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Check className="w-5 h-5 mr-2 stroke-[3px]" />
                )}
                <span className="font-black text-sm tracking-wide">APPROVE ESTIMATE</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleReject}
                disabled={!!isLoading}
                className="w-full border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-gray-400 rounded-xl h-11 transition-all"
              >
                {isLoading === 'reject' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                <span className="font-bold text-xs uppercase tracking-wider">Decline Repair</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

