'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { History, Loader2, MapPin } from 'lucide-react';
import { Booking, RepairQuote } from '@/lib/types/booking';
import BookingCard from '@/components/BookingCard';
import { getBookingHistory } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import QuotationModal from '@/components/QuotationModal';
import { CancelBookingModal } from '@/components/CancelBookingModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

export function BookingHistoryModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<(RepairQuote & { booking_id: string }) | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getBookingHistory();
            setBookingHistory(data || []);
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to load booking history",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

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
            navigator.clipboard.writeText(shareMessage);
            toast({ title: 'Referral message copied to clipboard!' });
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
        fetchHistory();
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-white/20 shadow-2xl rounded-[32px]">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <History className="w-5 h-5 text-primary" />
                            </div>
                            Booking History
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-6 pb-6">
                        <ScrollArea className="h-[60vh] pr-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-sm font-medium text-muted-foreground">Fetching your bookings...</p>
                                </div>
                            ) : bookingHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-4 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">No bookings yet</h3>
                                        <p className="text-sm text-gray-500">Your repair history will appear here.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-2">
                                    {bookingHistory.map((booking) => (
                                        <BookingCard
                                            key={booking.id}
                                            booking={booking}
                                            onQuoteAction={(quote) => setSelectedQuote(quote)}
                                            onCancel={(id) => openCancelModal(id)}
                                            onShare={handleShare}
                                        />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

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
