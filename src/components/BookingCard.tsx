'use client';

import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Clock, Download, Tag, CheckCircle, XCircle, Image as ImageIcon, KeyRound, IndianRupee, Gift, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Booking, RepairQuote } from '@/lib/types/booking';

const iconMap: { [key: string]: React.ElementType } = {
    'MOBILE PHONES': Laptop,
    'AC': AirVent,
    'LAPTOP': Laptop,
};

const StatusBadge = ({ status }: { status: string }) => {
    const isCompleted = status.toLowerCase() === 'completed';
    const isCancelled = status.toLowerCase() === 'cancelled';
    const isQuotationShared = status.toLowerCase() === 'quotation_shared';
    const isQuotationApproved = status.toLowerCase() === 'quotation_approved';
    const isRepairCompleted = status.toLowerCase() === 'repair_completed';

    let variantClass = 'bg-yellow-100 text-yellow-700 border-yellow-300';
    let Icon = Clock;

    if (isCompleted || isRepairCompleted) {
        variantClass = 'bg-green-100 text-green-700 border-green-300';
        Icon = CheckCircle;
    } else if (isCancelled) {
        variantClass = 'bg-red-100 text-red-700 border-red-300';
        Icon = XCircle;
    } else if (isQuotationShared) {
        variantClass = 'bg-blue-100 text-blue-700 border-blue-300';
        Icon = Clock;
    } else if (isQuotationApproved) {
        variantClass = 'bg-indigo-100 text-indigo-700 border-indigo-300';
        Icon = CheckCircle;
    }

    return (
        <Badge
            variant="outline"
            className={cn('font-bold capitalize', variantClass)}
        >
            <Icon className="mr-1.5 h-3.5 w-3.5" />
            {status.replace(/_/g, ' ')}
        </Badge>
    );
};

const ReferralCard = ({ code, onShare }: { code: string, onShare: () => void }) => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-3 mb-2">
                <Gift className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-800">Refer & Earn!</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">Share your referral code with friends and get ₹50 when they complete their first service.</p>
            <div className="bg-white rounded-lg p-2 flex items-center justify-between gap-2 border border-blue-100">
                <p className="text-lg font-bold text-blue-900 tracking-wider font-mono">{code}</p>
                <Button size="sm" onClick={onShare} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 h-8">SHARE</Button>
            </div>
        </div>
    )
}

interface BookingCardProps {
    booking: Booking;
    onQuoteAction?: (quote: RepairQuote & { booking_id: string }) => void;
    onCancel?: (bookingId: string) => void;
    onShare?: (code: string) => void;
}

export default function BookingCard({ booking, onQuoteAction, onCancel, onShare }: BookingCardProps) {
    const ServiceIcon = iconMap[booking.categories.name] || Laptop;
    const isQuotationShared = booking.status.toLowerCase() === 'quotation_shared';
    const isCodeSent = booking.status.toLowerCase() === 'code_sent';
    const isCompleted = booking.status.toLowerCase() === 'completed';
    const quote = booking.repair_quotes?.[0];
    const isCancelable = ['pending', 'confirmed', 'assigned'].includes(booking.status.toLowerCase());
    const isRepairCompleted = booking.status.toLowerCase() === 'repair_completed';

    return (
        <Card className={cn(
            "rounded-2xl shadow-md border-0 overflow-hidden relative",
            isRepairCompleted && "bg-green-50/50 border border-green-100"
        )}>
            {isRepairCompleted && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-[0.08] select-none z-0">
                    <p className="text-4xl font-black border-8 border-green-600 p-4 rounded-xl text-green-600 uppercase tracking-tighter">
                        COMPLETED
                    </p>
                </div>
            )}
            <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <ServiceIcon className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground">ID: {booking.order_id}</p>
                            <h2 className="text-lg font-bold capitalize">{booking.categories.name.toLowerCase()}</h2>
                        </div>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(booking.created_at), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(booking.created_at), 'hh:mm a')}</span>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                        <Tag className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">ISSUE</p>
                            <p className="font-semibold">{booking.issues.title}</p>
                        </div>
                    </div>
                    {booking.media_url && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex-shrink-0 w-16 h-16 cursor-pointer">
                                    <Image
                                        src={booking.media_url}
                                        alt="Issue photo"
                                        width={64}
                                        height={64}
                                        className="rounded-lg object-cover w-full h-full border"
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="p-0 border-0 max-w-lg">
                                <Image
                                    src={booking.media_url}
                                    alt="Issue photo"
                                    width={800}
                                    height={800}
                                    className="rounded-lg object-contain w-full h-full"
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Separator className="my-4" />

                {(isCompleted || isRepairCompleted) && (booking.final_amount_paid !== undefined || booking.final_amount_to_be_paid !== undefined) && (
                    <div className="space-y-3 mb-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/40 rounded-2xl flex justify-between items-center border border-green-200 dark:border-green-800 shadow-sm">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <CheckCircle className="w-5 h-5" />
                                <p className="text-sm font-bold uppercase tracking-tight">Total Amount Paid</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-green-900 dark:text-green-100 flex items-center justify-end">
                                    <IndianRupee className="w-5 h-5 mr-0.5" />
                                    {booking.final_amount_paid || booking.final_amount_to_be_paid}
                                </p>
                                {booking.payment_method && (
                                    <div className="flex items-center justify-end gap-1.5 mt-1 text-green-700/70 dark:text-green-300/70">
                                        <CreditCard className="w-3 h-3" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{booking.payment_method}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isCodeSent && booking.completion_code && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-center mb-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-300">
                            <KeyRound className="w-5 h-5" />
                            <p className="text-sm font-semibold uppercase">Secret Code</p>
                        </div>
                        <p className="text-3xl font-bold tracking-widest text-blue-800 dark:text-blue-200 mt-1">{booking.completion_code}</p>
                        <p className="text-xs text-muted-foreground mt-2">Share this code with the technician if the service is done.</p>
                    </div>
                )}

                {isQuotationShared && quote && onQuoteAction && (
                    <Button onClick={() => onQuoteAction({ ...quote, booking_id: booking.id })} className="w-full font-semibold">
                        Open Quotation
                    </Button>
                )}

                {isCancelable && onCancel && (
                    <Button variant="destructive" onClick={() => onCancel(booking.id)} className="w-full font-semibold mt-2">
                        Cancel Booking
                    </Button>
                )}

                {(quote?.status === 'quotation_approved' && !isRepairCompleted) && quote?.final_amount_to_be_paid && (
                    <div className="p-3 rounded-xl flex justify-between items-center mb-4 border bg-indigo-50 border-indigo-100 dark:bg-indigo-900/40 dark:border-indigo-800">
                        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                            Final Payable Amount
                        </span>
                        <span className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                            ₹{typeof quote.final_amount_to_be_paid === 'string'
                                ? parseFloat(quote.final_amount_to_be_paid).toFixed(2)
                                : quote.final_amount_to_be_paid.toFixed(2)}
                        </span>
                    </div>
                )}

                {isCompleted && (
                    <Button variant="ghost" size="sm" className="w-full font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                    </Button>
                )}

                {isRepairCompleted && booking.referral_code && onShare && (
                    <ReferralCard code={booking.referral_code} onShare={() => onShare(booking.referral_code!)} />
                )}
            </CardContent>
        </Card>
    );
}
