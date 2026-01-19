'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Calendar, Clock, Download, Tag, Phone, ArrowRight, Loader2, XCircle, CheckCircle, Image as ImageIcon, KeyRound, IndianRupee, Gift } from 'lucide-react';
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

import BookingCard from '@/components/BookingCard';

export default function BookingHistoryContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<(RepairQuote & { booking_id: string }) | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReferralCode = async () => {
            const completedBookings = bookingHistory.filter(b => b.status === 'repair_completed' && !b.referral_code);

            if (completedBookings.length > 0) {
                try {
                    const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/referral_codes?mobile_number=eq.${mobileNumber}`, {
                        headers: {
                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                        }
                    });
                    const referralData = await response.json();
                    if (referralData.length > 0) {
                        const code = referralData[0].referral_code;
                        setBookingHistory(prev => prev.map(b => (
                            b.status === 'repair_completed' ? { ...b, referral_code: code } : b
                        )));
                    }
                } catch (error) {
                    console.error('Failed to fetch referral code:', error);
                }
            }
        };

        if (isAuthenticated) {
            fetchReferralCode();
        }
    }, [bookingHistory, isAuthenticated, mobileNumber]);

    const handleContinue = async () => {
        if (!mobileNumber.match(/^[6-9]\d{9}$/)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/booking?mobile_number=eq.${mobileNumber}&select=id,order_id,technician_id,status,created_at,media_url,completion_code,final_amount_to_be_paid,categories(id,name),issues(id,title),repair_quotes(*)&order=created_at.desc`, {
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

    const handleShare = (code: string) => {
        const shareMessage = `Get flat Rs. 100 OFF on your first booking using my referral code: ${code}`;
        if (navigator.share) {
            navigator.share({ title: 'Repair Service Referral', text: shareMessage });
        } else {
            // Fallback for browsers that don't support navigator.share
            navigator.clipboard.writeText(shareMessage);
            alert('Referral message copied to clipboard!');
        }
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
                                const quote = booking.repair_quotes?.[0];
                                return (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onQuoteAction={(quote) => setSelectedQuote(quote)}
                                        onCancel={(id) => openCancelModal(id)}
                                        onShare={handleShare}
                                    />
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
