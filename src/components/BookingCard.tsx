'use client';

import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Clock, Calendar, Download, Tag, CheckCircle, XCircle, Image as ImageIcon, KeyRound, IndianRupee, Gift, CreditCard, User, Phone, MessageSquare, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Booking, RepairQuote } from '@/lib/types/booking';
import { getTechnicianById, submitRating } from '@/app/actions';
import { Technician } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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

    let variantClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    let Icon = Clock;

    if (isCompleted || isRepairCompleted) {
        variantClass = 'bg-green-100 text-green-800 border-green-200';
        Icon = CheckCircle;
    } else if (isCancelled) {
        variantClass = 'bg-red-100 text-red-800 border-red-200';
        Icon = XCircle;
    } else if (isQuotationShared) {
        variantClass = 'bg-blue-100 text-blue-800 border-blue-200';
        Icon = Clock;
    } else if (isQuotationApproved) {
        variantClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
        Icon = CheckCircle;
    }

    return (
        <Badge
            variant="outline"
            className={cn('font-bold capitalize text-[10px] px-2.5 py-0.5 h-6 rounded-full shadow-sm', variantClass)}
        >
            <Icon className="mr-1.5 h-3 w-3" />
            {status.replace(/_/g, ' ')}
        </Badge>
    );
};

const ReferralCard = ({ code, onShare }: { code: string, onShare: () => void }) => {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-4 mt-4 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-yellow-300" />
                    <h3 className="font-black text-sm text-white italic">Refer & Earn ₹50</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex items-center justify-between gap-3 border border-white/20">
                    <p className="text-base font-black text-white tracking-widest font-mono ml-2">{code}</p>
                    <Button size="sm" onClick={onShare} className="bg-white text-indigo-700 hover:bg-white/90 font-black text-[10px] px-4 h-8 rounded-lg shadow-sm">
                        SHARE
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface BookingCardProps {
    booking: Booking;
    onQuoteAction?: (quote: RepairQuote & { booking_id: string }) => void;
    onCancel?: (bookingId: string) => void;
    onShare?: (code: string) => void;
    onDownloadInvoice?: (booking: Booking) => void;
}

export default function BookingCard({ booking, onQuoteAction, onCancel, onShare, onDownloadInvoice }: BookingCardProps) {
    const ServiceIcon = iconMap[booking.categories.name] || Laptop;
    const isQuotationShared = booking.status.toLowerCase() === 'quotation_shared';
    const isCodeSent = booking.status.toLowerCase() === 'code_sent';
    const isCompleted = booking.status.toLowerCase() === 'completed';
    const quote = booking.repair_quotes?.[0];
    const isCancelable = ['pending', 'confirmed', 'assigned'].includes(booking.status.toLowerCase());
    const isRepairCompleted = booking.status.toLowerCase() === 'repair_completed';
    const showTechnicianDetails = ['assigned', 'accepted', 'on_the_way'].includes(booking.status.toLowerCase());
    console.log(booking);
    const [technician, setTechnician] = useState<Technician | null>(null);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [hasSubmittedRating, setHasSubmittedRating] = useState(!!booking.user_rating);
    const { toast } = useToast();

    useEffect(() => {
        if (showTechnicianDetails && booking.technician_id && !technician) {
            getTechnicianById(booking.technician_id).then(data => {
                if (data) setTechnician(data);
            });
        }
    }, [showTechnicianDetails, booking.technician_id, technician]);

    const handleRatingSubmit = async () => {
        if (!booking.technician_id || selectedRating === 0) {
            toast({
                title: "Error",
                description: "Please select a rating",
                variant: "destructive"
            });
            return;
        }

        setIsSubmittingRating(true);
        try {
            const result = await submitRating(booking.technician_id, selectedRating, booking.id);

            if (!result.success) {
                throw new Error(result.error || 'Failed to submit rating');
            }

            setHasSubmittedRating(true);
            toast({
                title: "Success",
                description: "Thank you for your rating!",
            });
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit rating. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmittingRating(false);
        }
    };

    return (
        <Card className={cn(
            "rounded-[2rem] shadow-sm border-2 border-gray-200 bg-white overflow-hidden relative transition-all duration-300 hover:shadow-xl group",
            isRepairCompleted ? "ring-2 ring-green-100 border-green-200" : "ring-1 ring-gray-100"
        )}>
            {/* Header / Top Band */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b-2 border-gray-100 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-indigo-50/50 to-transparent" />
                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <ServiceIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 leading-none mb-1 tracking-wider uppercase">Order #{booking.order_id}</p>
                        <h2 className="text-sm font-black text-[#1e1b4b] capitalize leading-tight">{booking.categories.name.toLowerCase()} Service</h2>
                    </div>
                </div>
                <div className="relative z-10">
                    <StatusBadge status={booking.status} />
                </div>
            </div>

            <CardContent className="p-5">
                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-xs font-bold text-gray-700">{format(new Date(booking.created_at), 'dd MMM yyyy')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Time</p>
                            <p className="text-xs font-bold text-gray-700">{format(new Date(booking.created_at), 'hh:mm a')}</p>
                        </div>
                    </div>
                </div>

                {/* Issue Details */}
                <div className="flex items-start gap-4 mb-6 p-4 rounded-2xl bg-white border-2 border-dashed border-gray-100 hover:border-indigo-100 transition-colors">
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <Tag className="w-4 h-4" />
                    </div>
                    <div className="flex-grow">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">REPORTED ISSUE</p>
                        <p className="text-sm font-bold text-[#1e1b4b] leading-snug">{booking.issues.title}</p>
                    </div>
                    {booking.media_url && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex-shrink-0 w-12 h-12 cursor-pointer hover:scale-105 transition-transform">
                                    <Image
                                        src={booking.media_url}
                                        alt="Issue"
                                        width={48}
                                        height={48}
                                        className="rounded-xl object-cover w-full h-full shadow-sm border border-white ring-2 ring-gray-100"
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="p-0 border-0 max-w-lg bg-transparent shadow-none">
                                <Image
                                    src={booking.media_url}
                                    alt="Issue photo"
                                    width={800}
                                    height={800}
                                    className="rounded-3xl object-contain w-full h-full shadow-2xl"
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Technician Info */}
                {showTechnicianDetails && technician && (
                    <div className="mb-6 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                    <AvatarImage src={technician.selfie_url || undefined} alt={technician.full_name} className="object-cover" />
                                    <AvatarFallback className="bg-indigo-600 text-white font-black">
                                        {technician.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-sm font-black text-[#1e1b4b] leading-none mb-1">{technician.full_name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-bold text-gray-500">4.8 • Tech</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href={`tel:${technician.mobile}`}>
                                    <Button size="icon" className="h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1">
                            <div className={cn(
                                "h-2 w-2 rounded-full animate-pulse",
                                booking.status === 'on_the_way' ? "bg-green-500" : "bg-indigo-500"
                            )} />
                            <p className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                booking.status === 'on_the_way' ? "text-green-600" : "text-indigo-600"
                            )}>
                                {booking.status === 'on_the_way' ? 'Arriving Now' :
                                    booking.status === 'accepted' ? 'Accepted Request' :
                                        'Expert Assigned'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading state for technician */}
                {showTechnicianDetails && booking.technician_id && !technician && (
                    <div className="mb-6 pt-2 flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {(isCompleted || isRepairCompleted) && (booking.final_amount_paid !== undefined || booking.final_amount_to_be_paid !== undefined) && (
                    <div className="mb-5">
                        <div className="p-4 bg-green-50/50 rounded-2xl flex justify-between items-center border border-green-100/50">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-green-700 mb-0.5">Total Paid</p>
                                <div className="flex items-center gap-1 text-green-600/70">
                                    <CreditCard className="w-3 h-3" />
                                    <p className="text-[9px] font-bold uppercase">{booking.payment_method}</p>
                                </div>
                            </div>
                            <p className="text-2xl font-black text-green-700 flex items-center">
                                <IndianRupee className="w-5 h-5 mr-0.5" strokeWidth={3} />
                                {booking.final_amount_paid || booking.final_amount_to_be_paid}
                            </p>
                        </div>
                    </div>
                )}

                {isCodeSent && booking.completion_code && (
                    <div className="p-4 bg-slate-900 rounded-2xl text-center mb-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-20 -mr-10 -mt-10" />
                        <div className="relative z-10">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">PROVIDER CODE</p>
                            <div className="text-3xl font-black tracking-[0.25em] text-white font-mono mb-1">{booking.completion_code}</div>
                            <p className="text-[9px] text-gray-500 font-bold">Show this to start repair</p>
                        </div>
                    </div>
                )}

                {isRepairCompleted && !hasSubmittedRating && (
                    <div className="mb-5 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100">
                        <div className="text-center mb-4">
                            <h3 className="text-sm font-black text-[#1e1b4b] mb-1">Rate Your Experience</h3>
                            <p className="text-[10px] text-gray-500 font-medium">How was the service?</p>
                        </div>

                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setSelectedRating(rating)}
                                    onMouseEnter={() => setHoveredRating(rating)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-all duration-200 hover:scale-110 active:scale-95"
                                    disabled={isSubmittingRating}
                                >
                                    <Star
                                        className={cn(
                                            "w-10 h-10 transition-all duration-200",
                                            (hoveredRating >= rating || selectedRating >= rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-300"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>

                        {selectedRating > 0 && (
                            <Button
                                onClick={handleRatingSubmit}
                                disabled={isSubmittingRating}
                                className="w-full font-black text-xs h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {isSubmittingRating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>Submit Rating</>
                                )}
                            </Button>
                        )}
                    </div>
                )}

                {(isRepairCompleted || isCompleted) && hasSubmittedRating && (
                    <div className="mb-5 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 text-center">
                        <div className="flex justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-6 h-6",
                                        (booking.user_rating || selectedRating) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-200 text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <h3 className="text-sm font-black text-green-800 mb-1">
                            {booking.user_rating ? "You rated this work" : "Thank You!"}
                        </h3>
                        {/* <p className="text-[10px] text-green-600 font-medium">
                            {booking.user_rating ? `You rated this service ${booking.user_rating} stars` : "Your rating has been submitted"}
                        </p> */}
                    </div>
                )}

                {isQuotationShared && quote && onQuoteAction && (
                    <Button onClick={() => onQuoteAction({ ...quote, booking_id: booking.id })} className="w-full font-black text-xs h-12 rounded-xl bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">
                        View Quotation Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )}

                {isCancelable && onCancel && (
                    <Button variant="ghost" onClick={() => onCancel(booking.id)} className="w-full font-bold text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 h-9 rounded-xl transition-all uppercase tracking-wider">
                        Cancel Booking
                    </Button>
                )}

                {(quote?.status === 'quotation_approved' && !isRepairCompleted) && quote?.final_amount_to_be_paid && (
                    <div className="p-4 rounded-2xl flex justify-between items-center mb-5 border border-indigo-100 bg-indigo-50/50">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800">
                            Estimated Total
                        </span>
                        <span className="text-xl font-black text-indigo-900 flex items-center">
                            <IndianRupee className="w-4 h-4" strokeWidth={3} />
                            {typeof quote.final_amount_to_be_paid === 'string'
                                ? parseFloat(quote.final_amount_to_be_paid).toFixed(2)
                                : quote.final_amount_to_be_paid.toFixed(2)}
                        </span>
                    </div>
                )}

                {(isCompleted || isRepairCompleted) && onDownloadInvoice && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownloadInvoice(booking)}
                        className="w-full font-bold text-xs h-11 rounded-xl bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Download className="h-4 w-4" />
                        Download Invoice PDF
                    </Button>
                )}

                {isRepairCompleted && booking.referral_code && onShare && (
                    <ReferralCard code={booking.referral_code} onShare={() => onShare(booking.referral_code!)} />
                )}
            </CardContent>
        </Card>
    );
}
