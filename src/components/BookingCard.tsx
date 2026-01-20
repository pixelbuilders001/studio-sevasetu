'use client';

import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Clock, Calendar, Download, Tag, CheckCircle, XCircle, Image as ImageIcon, KeyRound, IndianRupee, Gift, CreditCard, User, Phone, MessageSquare, Star } from 'lucide-react';
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
import { getTechnicianById } from '@/app/actions';
import { Technician } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

    let variantClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
    let Icon = Clock;

    if (isCompleted || isRepairCompleted) {
        variantClass = 'bg-green-50 text-green-700 border-green-200';
        Icon = CheckCircle;
    } else if (isCancelled) {
        variantClass = 'bg-red-50 text-red-700 border-red-200';
        Icon = XCircle;
    } else if (isQuotationShared) {
        variantClass = 'bg-blue-50 text-blue-700 border-blue-200';
        Icon = Clock;
    } else if (isQuotationApproved) {
        variantClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        Icon = CheckCircle;
    }

    return (
        <Badge
            variant="outline"
            className={cn('font-bold capitalize text-[10px] px-2 py-0 h-5', variantClass)}
        >
            <Icon className="mr-1 h-3 w-3" />
            {status.replace(/_/g, ' ')}
        </Badge>
    );
};

const ReferralCard = ({ code, onShare }: { code: string, onShare: () => void }) => {
    return (
        <div className="bg-indigo-50 border-2 border-dashed border-indigo-100 rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-3 mb-2">
                <Gift className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-sm text-indigo-900">Refer & Earn!</h3>
            </div>
            <p className="text-[11px] text-indigo-900/60 font-medium mb-3 leading-tight">Share your referral code with friends and get ₹50 when they complete their first service.</p>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 flex items-center justify-between gap-2 border border-indigo-50">
                <p className="text-base font-black text-indigo-900 tracking-widest font-mono ml-2">{code}</p>
                <Button size="sm" onClick={onShare} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] px-4 h-8 rounded-lg shadow-lg shadow-indigo-200">SHARE</Button>
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
    console.log("ndndnd", booking);
    const [technician, setTechnician] = useState<Technician | null>(null);

    useEffect(() => {
        if (showTechnicianDetails && booking.technician_id && !technician) {
            getTechnicianById(booking.technician_id).then(data => {
                if (data) setTechnician(data);
            });
        }
    }, [showTechnicianDetails, booking.technician_id, technician]);

    return (
        <Card className={cn(
            "rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative transition-all hover:shadow-md",
            isRepairCompleted && "bg-green-50/30 border-green-100/50"
        )}>
            {isRepairCompleted && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-[0.05] select-none z-0">
                    <p className="text-5xl font-black border-4 border-green-600 p-3 rounded-xl text-green-600 uppercase tracking-tighter">
                        COMPLETED
                    </p>
                </div>
            )}
            <CardContent className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100/50">
                            <ServiceIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 leading-none mb-1">ID: {booking.order_id}</p>
                            <h2 className="text-base font-black text-[#1e1b4b] capitalize leading-none">{booking.categories.name.toLowerCase()}</h2>
                        </div>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 mb-4 px-1">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(new Date(booking.created_at), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{format(new Date(booking.created_at), 'hh:mm a')}</span>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4 mb-4 px-1">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-[#1e1b4b]/40" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ISSUE</p>
                            <p className="text-sm font-bold text-[#1e1b4b] leading-tight">{booking.issues.title}</p>
                        </div>
                    </div>
                    {booking.media_url && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex-shrink-0 w-14 h-14 cursor-pointer hover:opacity-90 transition-opacity">
                                    <Image
                                        src={booking.media_url}
                                        alt="Issue photo"
                                        width={56}
                                        height={56}
                                        className="rounded-xl object-cover w-full h-full border border-gray-100 shadow-sm"
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

                {/* Technician Info - Inline Display */}
                {showTechnicianDetails && technician && (
                    <div className="mb-4 pt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                                "h-2 w-2 rounded-full animate-pulse",
                                booking.status === 'on_the_way' ? "bg-green-500" : "bg-indigo-500"
                            )} />
                            <p className={cn(
                                "text-xs font-black uppercase tracking-widest",
                                booking.status === 'on_the_way' ? "text-green-600" : "text-indigo-600"
                            )}>
                                {booking.status === 'on_the_way' ? 'Technician On The Way' :
                                    booking.status === 'accepted' ? 'Technician Accepted' :
                                        'Technician Assigned'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-14 w-14 border-2 border-indigo-100 shadow-md">
                                <AvatarImage src={technician.selfie_url || undefined} alt={technician.full_name} className="object-cover" />
                                <AvatarFallback className="bg-indigo-600 text-white font-black text-lg">
                                    {technician.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-black text-[#1e1b4b] leading-tight">{technician.full_name}</h3>
                                <p className="text-xs font-bold text-indigo-600 mb-0.5 capitalize">{technician.primary_skill} Specialist</p>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-bold text-gray-500">4.8 • Verified PRO</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a href={`tel:${technician.mobile}`} className="w-full">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 shadow-lg shadow-indigo-100">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span className="font-extrabold text-xs">Call Tech</span>
                                </Button>
                            </a>
                            <Button variant="outline" className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl h-11">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                <span className="font-extrabold text-xs">Chat</span>
                            </Button>
                        </div>
                    </div>
                )}
                {/* Loading state for technician */}
                {showTechnicianDetails && booking.technician_id && !technician && (
                    <div className="mb-4 pt-2 flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                <Separator className="my-4 bg-gray-50" />

                {(isCompleted || isRepairCompleted) && (booking.final_amount_paid !== undefined || booking.final_amount_to_be_paid !== undefined) && (
                    <div className="mb-4">
                        <div className="p-3.5 bg-green-50/50 rounded-2xl flex justify-between items-center border border-green-100/50">
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                <p className="text-[11px] font-black uppercase tracking-wider">Total Amount Paid</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-green-900 flex items-center justify-end">
                                    <IndianRupee className="w-4 h-4 mr-0.5" strokeWidth={3} />
                                    {booking.final_amount_paid || booking.final_amount_to_be_paid}
                                </p>
                                {booking.payment_method && (
                                    <div className="flex items-center justify-end gap-1 mt-0.5 text-green-700/60">
                                        <CreditCard className="w-2.5 h-2.5" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em]">{booking.payment_method}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isCodeSent && booking.completion_code && (
                    <div className="p-4 bg-indigo-50/50 rounded-2xl text-center mb-4 border border-indigo-100/50">
                        <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
                            <KeyRound className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.15em]">Secret Code</p>
                        </div>
                        <p className="text-2xl font-black tracking-[0.2em] text-indigo-900">{booking.completion_code}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-2">Share this code with the technician to finish service.</p>
                    </div>
                )}

                {isQuotationShared && quote && onQuoteAction && (
                    <Button onClick={() => onQuoteAction({ ...quote, booking_id: booking.id })} className="w-full font-black text-xs h-11 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
                        Open Quotation
                    </Button>
                )}

                {isCancelable && onCancel && (
                    <Button variant="ghost" onClick={() => onCancel(booking.id)} className="w-full font-black text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-10 rounded-xl mt-2 transition-all">
                        Cancel Booking
                    </Button>
                )}

                {(quote?.status === 'quotation_approved' && !isRepairCompleted) && quote?.final_amount_to_be_paid && (
                    <div className="p-3 rounded-2xl flex justify-between items-center mb-4 border border-indigo-100/50 bg-indigo-50/30">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700/70">
                            Final Payable Amount
                        </span>
                        <span className="text-lg font-black text-indigo-900 flex items-center">
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
                        className="w-full font-black text-xs h-10 rounded-xl bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        <Download className="mr-2 h-3.5 w-3.5" />
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
