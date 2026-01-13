'use client';

import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { History, Loader2, ArrowRight } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Booking, RepairQuote } from '@/lib/types/booking';
import BookingCard from '@/components/BookingCard';
import UserAuthSheet from '@/components/UserAuthSheet';
import QuotationModal from '@/components/QuotationModal';
import { CancelBookingModal } from '@/components/CancelBookingModal';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export default function BookingHistorySheet({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<(RepairQuote & { booking_id: string }) | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);
    const supabase = createSupabaseBrowserClient();
    const { toast } = useToast();

    // Auth State Listener
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    // Fetch Booking History when session is available and sheet is open
    useEffect(() => {
        const fetchHistory = async () => {
            if (!session?.access_token || !isOpen) return;

            setIsLoading(true);
            try {
                const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/booking?select=id,order_id,status,created_at,media_url,completion_code,final_amount_to_be_paid,categories(id,name),issues(id,title),repair_quotes(*)&order=created_at.asc`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch booking history.');
                }

                const data = await response.json();
                setBookingHistory(data);
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

        fetchHistory();
    }, [session, isOpen, toast]);

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
        closeCancelModal(); // Re-fetch or update local state could be better, but re-fetch is simple
        // Trigger re-fetch?
        // simple way:
        const fetchHistory = async () => {
            if (!session?.access_token) return;
            const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/booking?select=id,order_id,status,created_at,media_url,completion_code,final_amount_to_be_paid,categories(id,name),issues(id,title),repair_quotes(*)&order=created_at.asc`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBookingHistory(data);
            }
        }
        fetchHistory();
    };


    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-3xl p-0 overflow-hidden">
                <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle className="text-center font-bold text-xl">
                        {session ? 'Your Bookings' : 'Login to view your bookings'}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {!session ? (
                        <div className="h-full flex flex-col justify-center">
                            <UserAuthSheet setSheetOpen={() => { }} />
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : bookingHistory.length > 0 ? (
                        <div className="space-y-6 mt-4">
                            <BookingCard
                                key={bookingHistory[0].id}
                                booking={bookingHistory[0]}
                                onQuoteAction={(quote) => setSelectedQuote(quote)}
                                onCancel={(id) => openCancelModal(id)}
                                onShare={handleShare}
                            />
                        </div>
                    ) : (
                        <Card className="mt-4">
                            <CardContent className="p-10 text-center text-muted-foreground">
                                No booking history found.
                            </CardContent>
                        </Card>
                    )}
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
            </SheetContent>
        </Sheet>
    );
}
