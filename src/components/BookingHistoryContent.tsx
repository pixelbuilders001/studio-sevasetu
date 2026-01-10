'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Calendar, Clock, Download, Tag, Phone, ArrowRight, Loader2, XCircle, CheckCircle, Image as ImageIcon, KeyRound, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import QuotationModal from '@/components/QuotationModal';
import { Booking, RepairQuote } from '@/lib/types/booking';
import { CancelBookingModal } from '@/components/CancelBookingModal';

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

    if (isCompleted) {
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
    } else if (isRepairCompleted) {
        variantClass = 'bg-green-100 text-green-700 border-green-300';
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

export default function BookingHistoryContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<(RepairQuote & { booking_id: string }) | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);

    const handleContinue = async () => {
        if (!mobileNumber.match(/^[6-9]\d{9}$/)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/booking?mobile_number=eq.${mobileNumber}&select=id,order_id,status,created_at,media_url,completion_code,final_amount_to_be_paid,categories(id,name),issues(id,title),repair_quotes(*)&order=created_at.desc`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch booking history.');
            }

            const data = await response.json();
            setBookingHistory(data);
            setIsAuthenticated(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuoteStatusChange = (bookingId: string, newStatus: string, finalAmount?: number | string) => {
        setBookingHistory(prev => prev.map(b => {
            if (b.id === bookingId) {
                const updatedQuotes = b.repair_quotes?.map((q, idx) =>
                    idx === 0 ? { ...q, final_amount_to_be_paid: finalAmount as any } : q
                );
                return { ...b, status: newStatus, repair_quotes: updatedQuotes };
            }
            return b;
        }));
        setSelectedQuote(null);
    };

    const openCancelModal = (bookingId: string) => {
        setBookingToCancelId(bookingId);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setBookingToCancelId(null);
        setIsCancelModalOpen(false);
    };

    const handleCancellationSuccess = () => {
        closeCancelModal();
        handleContinue(); // Refreshes the booking history
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-muted/30 flex items-center justify-center" style={{ height: 'calc(100vh - 5rem)' }}>
                <div className="container mx-auto px-4 max-w-sm">
                    <Card className="rounded-2xl shadow-lg border-0">
                        <CardContent className="px-6 pt-6 pb-6">
                            <div className="text-center mb-4">
                                <h1 className="text-2xl font-bold">View History</h1>
                                <p className="text-muted-foreground">Enter your mobile number to see past bookings.</p>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    icon={Phone}
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="h-14 text-lg text-center tracking-widest"
                                />
                                {error && <p className="text-sm text-center text-destructive">{error}</p>}
                                <Button onClick={handleContinue} size="lg" disabled={isLoading} className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                                    {!isLoading && <ArrowRight className="ml-2" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-muted/30 min-h-screen">
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold font-headline">Booking History</h1>
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            YOUR PAST SERVICE RECORDS
                        </p>
                    </header>

                    {bookingHistory.length > 0 ? (
                        <div className="space-y-6">
                            {bookingHistory.map((booking) => {
                                const ServiceIcon = iconMap[booking.categories.name] || Laptop;
                                const isQuotationShared = booking.status.toLowerCase() === 'quotation_shared';
                                const isCodeSent = booking.status.toLowerCase() === 'code_sent';
                                const isCompleted = booking.status.toLowerCase() === 'completed';
                                const quote = booking.repair_quotes?.[0];
                                const isCancelable = ['pending', 'confirmed', 'assigned'].includes(booking.status.toLowerCase());


                                const isRepairCompleted = booking.status.toLowerCase() === 'repair_completed';

                                return (
                                    <Card key={booking.id} className={cn(
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
                                                    <Calendar className="w-4 h-4" />
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

                                            {isCompleted && booking.final_amount_to_be_paid && (
                                                <div className="p-3 bg-green-50 dark:bg-green-900/40 rounded-xl flex justify-between items-center mb-4 border border-green-200 dark:border-green-800">
                                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-300">
                                                        <CheckCircle className="w-5 h-5" />
                                                        <p className="text-sm font-semibold uppercase">Final Amount Paid</p>
                                                    </div>
                                                    <p className="text-2xl font-bold text-green-800 dark:text-green-200 flex items-center">
                                                        <IndianRupee className="w-6 h-6" />
                                                        {booking.final_amount_to_be_paid}
                                                    </p>
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

                                            {isQuotationShared && quote && (
                                                <Button onClick={() => setSelectedQuote({ ...quote, booking_id: booking.id })} className="w-full font-semibold">
                                                    Open Quotation
                                                </Button>
                                            )}

                                            {isCancelable && (
                                            <Button variant="destructive" onClick={() => openCancelModal(booking.id)} className="w-full font-semibold mt-2">
                                                Cancel Booking
                                            </Button>
                                            )}


                                            {(quote?.status === 'quotation_approved' || isRepairCompleted) && quote?.final_amount_to_be_paid && (
                                                <div className={cn(
                                                    "p-3 rounded-xl flex justify-between items-center mb-4 border",
                                                    isRepairCompleted
                                                        ? "bg-green-50 border-green-100 dark:bg-green-900/40 dark:border-green-800"
                                                        : "bg-indigo-50 border-indigo-100 dark:bg-indigo-900/40 dark:border-indigo-800"
                                                )}>
                                                    <span className={cn(
                                                        "text-sm font-semibold uppercase tracking-wider",
                                                        isRepairCompleted ? "text-green-700 dark:text-green-300" : "text-indigo-700 dark:text-indigo-300"
                                                    )}>
                                                        {isRepairCompleted ? 'Total Amount Paid' : 'Final Payable Amount'}
                                                    </span>
                                                    <span className={cn(
                                                        "text-lg font-bold",
                                                        isRepairCompleted ? "text-green-900 dark:text-green-100" : "text-indigo-900 dark:text-indigo-100"
                                                    )}>
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
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-10 text-center text-muted-foreground">
                                No booking history found for this mobile number.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {selectedQuote && (
                <QuotationModal
                    quote={selectedQuote}
                    isOpen={!!selectedQuote}
                    onClose={() => setSelectedQuote(null)}
                    onStatusChange={handleQuoteStatusChange}
                />
            )}
            <CancelBookingModal
                isOpen={isCancelModalOpen}
                onClose={closeCancelModal}
                bookingId={bookingToCancelId}
                onSuccess={handleCancellationSuccess}
            />
        </>
    );
}
