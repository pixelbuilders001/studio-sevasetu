
'use client';

import React from 'react';
import { useReactToPrint } from 'react-to-print';
import type { Booking } from '@/lib/types/booking';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { IndianRupee, ShieldCheck, Printer, Download, Receipt } from 'lucide-react';
import { Badge } from './ui/badge';

const Logo = () => (
    <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">S</span>
        </div>
        <div>
            <h5 className="text-lg font-bold text-primary leading-tight">helloFixo</h5>
            <span className="text-xs font-semibold text-muted-foreground leading-tight tracking-wide">REPAIR & SOLUTIONS</span>
        </div>
    </div>
);


const InvoicePreviewContent = React.forwardRef<HTMLDivElement, { booking: Booking }>(({ booking }, ref) => {

    // Using dummy data as requested, since full data isn't fetched.
    const finalAmountPaid = booking.final_amount_paid || 499;
    const netInspectionFee = booking.net_inspection_fee || 199;
    const sparePartsLaborCost = Math.max(0, finalAmountPaid - netInspectionFee);
    const technicianName = booking.technicians?.full_name || 'Ramesh Kumar';

    return (
        <div ref={ref} id={`invoice-${booking.order_id}`} className="bg-white dark:bg-gray-950 p-4 md:p-12 rounded-t-2xl min-h-full text-black">
            <style type="text/css" media="print">
                {`
                    @page { size: A4; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                `}
            </style>
            <div className="p-4 md:p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-none border border-gray-200 print:border-0 print:shadow-none">
                <div className="flex justify-between items-start mb-8">
                    <Logo />
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">INVOICE NO.</p>
                        <p className="font-bold text-lg text-gray-900">{booking.order_id}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-10 pb-8 border-b border-gray-100">
                    <div>
                        <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Service Date</p>
                        <p className="font-bold text-gray-900 text-lg">{format(new Date(booking.created_at), 'dd MMM yyyy')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">Status</p>
                        <Badge className="bg-green-100 text-green-700 border-green-200 font-bold px-4 py-1" variant="outline">PAID</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Billed To</p>
                        <p className="font-bold text-gray-900 text-lg mb-1">{booking.user_name}</p>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{booking.full_address}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Service Provider</p>
                        <p className="font-bold text-gray-900 text-lg mb-1">{technicianName}</p>
                        <p className="text-sm text-gray-500">Verified Professional</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="font-bold text-gray-900 tracking-wider uppercase mb-6 text-sm border-b border-gray-100 pb-2">Service Breakdown</h3>
                    <div className="space-y-4 text-base">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">{booking.categories.name} Service Visit</span>
                            <span className="font-bold text-gray-900 flex items-center font-mono text-lg"><IndianRupee className="w-4 h-4 mr-1" />{netInspectionFee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Spare Parts & Labor Charges</span>
                            <span className="font-bold text-gray-900 flex items-center font-mono text-lg"><IndianRupee className="w-4 h-4 mr-1" />{sparePartsLaborCost}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400 text-sm">
                            <span>GST (18% Included)</span>
                            <span className="font-mono">0.00</span>
                        </div>
                    </div>
                    <Separator className="my-6 bg-gray-200" />
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="font-bold flex items-center gap-2 text-gray-900"><ShieldCheck className="w-5 h-5 text-primary" /> Total Paid Amount</span>
                        <span className="font-black text-3xl flex items-center text-primary"><IndianRupee className="w-6 h-6 mr-1" />{finalAmountPaid}</span>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Thank you for choosing helloFixo!</p>
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest">
                        This is a computer generated invoice • Authorized by helloFixo
                    </p>
                </div>
            </div>
        </div>
    );
});
InvoicePreviewContent.displayName = 'InvoicePreviewContent';


export default function InvoicePreviewSheet({ booking }: { booking: Booking }) {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex-grow overflow-y-auto">
                {/* We render the content visible on screen so user can preview it too */}
                <div className="flex justify-center min-h-full p-2 md:p-8">
                    <div className="w-full max-w-3xl bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">
                        <InvoicePreviewContent ref={contentRef} booking={booking} />
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-white sticky bottom-0 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button variant="outline" size="lg" onClick={() => reactToPrintFn()} className="font-bold border-2 h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                        <Printer className="w-4 h-4 mr-2" /> PRINT
                    </Button>
                    <Button size="lg" onClick={() => reactToPrintFn()} className="font-bold h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4 mr-2" /> DOWNLOAD PDF
                    </Button>
                </div>
            </div>
        </div>
    )
}
