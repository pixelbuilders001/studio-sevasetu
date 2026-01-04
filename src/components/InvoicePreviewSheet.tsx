
'use client';

import React from 'react';
import type { Booking } from '@/app/history/page';
import {
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
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
      <span className="text-lg font-bold text-primary leading-tight">SevaSetu</span>
      <span className="text-xs font-semibold text-muted-foreground leading-tight tracking-wide">REPAIR & SOLUTIONS</span>
    </div>
  </div>
);


const InvoicePreviewContent = ({ booking }: { booking: Booking }) => {
    
    // Using dummy data as requested, since full data isn't fetched.
    const finalAmountPaid = booking.final_amount_paid || 499;
    const netInspectionFee = booking.net_inspection_fee || 199;
    const sparePartsLaborCost = Math.max(0, finalAmountPaid - netInspectionFee);
    const technicianName = booking.technicians?.full_name || 'Ramesh Kumar';

    return (
        <div id={`invoice-${booking.order_id}`} className="bg-white dark:bg-gray-950 p-6 md:p-8 rounded-t-2xl">
             <div className="p-8 max-w-lg mx-auto bg-card rounded-2xl shadow-lg border">
                <div className="flex justify-between items-start mb-8">
                    <Logo />
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">INVOICE NO.</p>
                        <p className="font-bold text-lg">{booking.order_id}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-sm text-muted-foreground">SERVICE DATE</p>
                        <p className="font-semibold">{format(new Date(booking.created_at), 'dd MMM yyyy')}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-sm text-muted-foreground">STATUS</p>
                         <Badge className="bg-green-100 text-green-700 border-green-200 font-bold" variant="outline">PAID</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl mb-8">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">CUSTOMER</p>
                        <p className="font-semibold">{booking.user_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.full_address}</p>
                    </div>
                     <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">EXPERT TECHNICIAN</p>
                        <p className="font-semibold">{technicianName}</p>
                        <p className="text-sm text-muted-foreground">Verified Professional</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-muted-foreground tracking-wider uppercase mb-4">SERVICE BREAKDOWN</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span>{booking.categories.name} Service Repair Visit</span>
                            <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4" />{netInspectionFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Spare Parts / Labor Cost</span>
                            <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4" />{sparePartsLaborCost}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST (Included)</span>
                            <span className="font-medium">0.00</span>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Total Paid</span>
                        <span className="font-extrabold text-2xl flex items-center"><IndianRupee className="w-6 h-6" />{finalAmountPaid}</span>
                    </div>
                </div>

                 <div className="text-center mt-8">
                    <Badge variant="secondary" className="bg-gray-200 text-gray-600 font-bold">30 DAYS POST-REPAIR WARRANTY INCLUDED</Badge>
                    <p className="text-xs text-muted-foreground mt-4">
                        This is a computer generated invoice and does not require a physical signature.
                    </p>
                </div>
            </div>
        </div>
    );
};


export default function InvoicePreviewSheet({ booking }: { booking: Booking }) {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <style type="text/css" media="print">
                {`
                    @page { size: auto; margin: 0; }
                    body { -webkit-print-color-adjust: exact; }
                    .invoice-print-area {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }
                    .hide-on-print { display: none !important; }
                `}
            </style>
            <div className="hide-on-print">
                <SheetHeader className="text-left px-2">
                    <SheetTitle className="flex items-center gap-2"><Receipt className="w-5 h-5"/>Invoice Preview</SheetTitle>
                </SheetHeader>
            </div>
            <div className="flex-grow overflow-y-auto -mx-6 px-0 pt-4 invoice-print-area">
                <InvoicePreviewContent booking={booking} />
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 border-t bg-background -mb-6 -mx-6 mt-4 hide-on-print">
                <Button variant="outline" size="lg" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> PRINT</Button>
                <Button size="lg" onClick={handlePrint}><Download className="w-4 h-4 mr-2" /> DOWNLOAD</Button>
            </div>
        </>
    )
}
