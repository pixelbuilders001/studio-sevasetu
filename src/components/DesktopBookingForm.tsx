'use client';

import { useEffect, useActionState, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertCircle, Loader2, User, Phone, MapPin, LocateFixed,
    Camera, Clock, ArrowRight, Flag, CheckCircle, IndianRupee,
    Tag, Gift, X, Calendar as CalendarIcon, Wallet, ChevronRight,
    Plus, ImageIcon,
    ShieldCheck, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import { useBooking } from '@/context/BookingContext';
import {
    bookService, verifyReferralCode as verifyReferralCodeAction,
    saveAddress, getSavedAddresses, getWalletBalance, getUserProfile
} from '@/app/actions';
import { OtherPincodeModal } from './OtherPincodeModal';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Problem } from '@/lib/data';

const initialState = {
    message: "",
    error: "",
    bookingId: undefined,
    referralCode: undefined,
};

interface DesktopBookingFormProps {
    categoryId: string;
    problemIds: string;
    inspectionFee: number;
    totalEstimatedPrice: number;
    gstAmount: number;
    grandTotal: number;
    categoryName: string;
    selectedProblems: Problem[];
}

export function DesktopBookingForm({
    categoryId,
    problemIds,
    inspectionFee,
    totalEstimatedPrice,
    gstAmount,
    grandTotal,
    categoryName,
    selectedProblems
}: DesktopBookingFormProps) {
    const { t } = useTranslation();
    const { location } = useLocation();
    const { toast } = useToast();
    const router = useRouter();
    const { media, secondaryMedia, clearMedia } = useBooking();

    const [showRepairInfo, setShowRepairInfo] = useState(false);

    const [referral, setReferral] = useState('');
    const [userName, setUserName] = useState('');
    const [mobile, setMobile] = useState('');
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const [referralStatus, setReferralStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [referralMessage, setReferralMessage] = useState('');
    const [discount, setDiscount] = useState(0);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [useWallet, setUseWallet] = useState(false);

    const [bookingFor, setBookingFor] = useState<'self' | 'others'>('self');
    const [otherPincode, setOtherPincode] = useState<string | undefined>(undefined);
    const [isOtherPincodeModalOpen, setIsOtherPincodeModalOpen] = useState(false);

    // grandTotal already includes GST (inspectionFee + gstAmount)
    const initialPayable = Math.max(grandTotal - discount, 0);
    const walletDeduction = useWallet ? Math.min(walletBalance, initialPayable) : 0;
    const finalPayable = Math.max(initialPayable - walletDeduction, 0);

    const boundBookService = bookService.bind(
        null,
        categoryId,
        problemIds,
        bookingFor === 'others' && otherPincode ? otherPincode : location.pincode,
        referralStatus === 'success' ? referral : undefined,
        totalEstimatedPrice,
        finalPayable,
        useWallet ? walletDeduction : null,
        bookingFor
    );

    const [state, formAction, isPending] = useActionState(boundBookService, initialState);

    const [date, setDate] = useState<Date | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [address, setAddress] = useState('');
    const [isGpsLoading, setIsGpsLoading] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingAddresses(true);
            const [addresses, balance, profile] = await Promise.all([
                getSavedAddresses(),
                getWalletBalance(),
                getUserProfile()
            ]);

            setSavedAddresses(addresses);
            setWalletBalance(balance);

            if (profile) {
                setUserName(profile.full_name || '');
                setMobile(profile.phone || '');
            }

            const defaultAddr = addresses.find((addr: any) => addr.is_default);
            if (defaultAddr) {
                setAddress(defaultAddr.full_address);
            }
            setIsLoadingAddresses(false);
        };
        fetchInitialData();
    }, []);

    const isPast6PM = new Date().getHours() >= 18;

    const getMinDate = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (currentHour >= 18) {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return tomorrow;
        }
        return today;
    };

    const isDateDisabled = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const now = new Date();
            const currentHour = now.getHours();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            if (date < today) return true;
            if (currentHour >= 18) {
                return date.getTime() === today.getTime();
            }
        }
        return false;
    };

    useEffect(() => {
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: state.error,
            });
        }
        if (state?.bookingId) {
            clearMedia();
            router.push(`/confirmation?bookingId=${state.bookingId}&referralCode=${state.referralCode || ''}`);
        }
    }, [state, t, toast, router]);

    const handleUseGps = () => {
        if (!navigator.geolocation) {
            toast({
                variant: 'destructive',
                title: 'GPS Not Supported',
                description: 'Your browser does not support geolocation.',
            });
            return;
        }

        setIsGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setAddress(data.display_name);
                    }
                } catch (error) {
                    toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch address.' });
                } finally {
                    setIsGpsLoading(false);
                }
            },
            (error) => {
                toast({ variant: 'destructive', title: 'GPS Error', description: error.message });
                setIsGpsLoading(false);
            }
        );
    };

    const verifyReferralCode = async () => {
        setReferralStatus('verifying');
        const code = referral.trim();
        if (!code) {
            setReferralStatus('error');
            setReferralMessage('Enter referral code');
            return;
        }
        try {
            const response = await verifyReferralCodeAction(code);
            if (response && response.valid) {
                setReferralStatus('success');
                setReferralMessage(response.message || `REFERRAL APPLIED!`);
                setDiscount(response.discount || 0);
            } else {
                setReferralStatus('error');
                setReferralMessage(response?.message || 'Invalid referral code.');
                setDiscount(0);
            }
        } catch (e) {
            setReferralStatus('error');
            setReferralMessage('Could not verify referral code.');
            setDiscount(0);
        }
    };

    const handleSaveAddress = async () => {
        if (!address.trim()) {
            toast({
                variant: 'destructive',
                title: 'Empty Address',
                description: 'Please enter a full address before saving.',
            });
            return;
        }

        setIsSavingAddress(true);
        try {
            const result = await saveAddress({
                full_address: address,
                city: location.city,
                state: location.area?.State,
                pincode: location.pincode,
            });

            if (result.success) {
                toast({
                    title: 'Address Saved',
                    description: 'Your address has been saved for future bookings.',
                });
                const addresses = await getSavedAddresses();
                setSavedAddresses(addresses);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error Saving Address',
                    description: result.error || 'Something went wrong.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save address.',
            });
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast({
                    variant: 'destructive',
                    title: 'Image Too Large',
                    description: 'Please select an image smaller than 1MB.',
                });
                return;
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <form action={(formData) => {
            if (!date) {
                toast({ variant: 'destructive', title: 'Date Required', description: 'Please select a service date.' });
                return;
            }
            if (!selectedTimeSlot) {
                toast({ variant: 'destructive', title: 'Time Slot Required', description: 'Please select a time slot.' });
                return;
            }
            if (media) formData.append('media', media);
            if (secondaryMedia) formData.append('secondary_media', secondaryMedia);
            formAction(formData);
        }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">

            {/* Form Fields Column */}
            <div className="lg:col-span-7 space-y-8">

                {/* Booking For */}
                <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 leading-tight">Booking For</h2>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Select service recipient</p>
                            </div>
                        </div>

                        <div className="flex bg-slate-50/80 p-1 rounded-xl border border-slate-100 gap-1 min-w-[300px]">
                            <button
                                type="button"
                                onClick={() => {
                                    setBookingFor('self');
                                    setOtherPincode(undefined);
                                }}
                                className={cn(
                                    "flex-1 h-9 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    bookingFor === 'self'
                                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                )}
                            >
                                <User className="w-3.5 h-3.5" />
                                For Myself
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOtherPincodeModalOpen(true)}
                                className={cn(
                                    "flex-1 h-9 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    bookingFor === 'others'
                                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                )}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                For Others
                            </button>
                        </div>
                    </div>

                    {bookingFor === 'others' && otherPincode && (
                        <div className="mt-4 p-3 bg-emerald-50/50 border border-emerald-100/80 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-emerald-600/80 uppercase tracking-widest leading-none mb-1">Service Location</p>
                                    <p className="text-sm font-black text-emerald-900 tracking-tight">Pincode: {otherPincode}</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsOtherPincodeModalOpen(true)}
                                className="h-8 rounded-lg text-[10px] font-black text-indigo-600 border-indigo-100 bg-white hover:bg-indigo-50 transition-all uppercase tracking-widest"
                            >
                                Change
                            </Button>
                        </div>
                    )}
                </section>

                {/* Contact Information */}
                <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">Contact Details</h2>
                            <p className="text-sm text-slate-500">How should we reach you?</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    name="user_name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="John Doe"
                                    className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    name="mobile_number"
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="9876543210"
                                    className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Address Information */}
                <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 leading-tight">Service Address</h2>
                                <p className="text-sm text-slate-500">Where do you need the service?</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleUseGps}
                            disabled={isGpsLoading}
                            className="h-9 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50 gap-2"
                        >
                            {isGpsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <LocateFixed className="w-3 h-3" />}
                            USE CURRENT LOCATION
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {savedAddresses.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Addresses</label>
                                <Select onValueChange={(id) => setAddress(savedAddresses.find(a => a.id === id)?.full_address || '')}>
                                    <SelectTrigger className="h-12 bg-indigo-50/30 border-indigo-100 text-slate-600 text-sm">
                                        <SelectValue placeholder="Quick select from saved" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {savedAddresses.map((addr) => (
                                            <SelectItem key={addr.id} value={addr.id} className="text-sm">
                                                {addr.full_address}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Address</label>
                            <Textarea
                                name="full_address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="House No, Building, Street Name..."
                                className="min-h-[100px] bg-slate-50/50 border-slate-200 focus:bg-white py-4 px-4 text-sm"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Landmark (Optional)</label>
                                <Input
                                    name="landmark"
                                    placeholder="Near City Mall"
                                    className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pincode</label>
                                <Input
                                    value={location.pincode}
                                    disabled
                                    className="h-12 bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed text-sm"
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSaveAddress}
                            disabled={!address.trim() || isSavingAddress || savedAddresses.some(a => a.full_address === address)}
                            variant="outline"
                            className="w-full h-11 border-blue-100 bg-blue-50/30 text-blue-700 hover:bg-blue-50 hover:border-blue-200 text-xs font-bold uppercase tracking-wider gap-2 rounded-xl transition-all"
                        >
                            {isSavingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Save Address for future bookings
                        </Button>
                    </div>
                </section>

                {/* Schedule */}
                <section className="w-full">
                    {/* Date & Time */}
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Date</label>
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full h-12 justify-start font-normal border-slate-200">
                                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">{date?.toLocaleDateString() || 'Select Date'}</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            onChange={(d) => { setDate(d as Date); setIsCalendarOpen(false); }}
                                            value={date}
                                            minDate={getMinDate()}
                                            tileDisabled={isDateDisabled}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {isPast6PM && (
                                    <p className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        Same-day service unavailable after 6 PM,please book for tomorrow or future dates.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Slot</label>
                                <Select onValueChange={setSelectedTimeSlot} value={selectedTimeSlot}>
                                    <SelectTrigger className="h-12 border-slate-200 text-sm">
                                        <SelectValue placeholder="Preferred time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="9 AM-12 PM" className="text-sm">Morning (9 AM - 12 PM)</SelectItem>
                                        <SelectItem value="12 PM-2 PM" className="text-sm">Afternoon (12 PM - 2 PM)</SelectItem>
                                        <SelectItem value="2 PM-5 PM" className="text-sm">Evening (2 PM - 5 PM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>



                    {/* Problem Photos (Removed as it is now in Problem Selection) */}
                </section>

            </div >

            {/* Summary Sidebar Column */}
            < div className="lg:col-span-5" >
                <div className="sticky top-24 space-y-6">

                    {/* Booking Summary */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                Booking Summary
                            </h3>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{categoryName}</h4>
                                    <p className="text-xs text-slate-500">{selectedProblems.length} issue(s) selected</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                {selectedProblems.map(p => (
                                    <div key={p.id} className="flex items-start justify-between text-xs py-1">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            {p.name}
                                        </span>
                                        {/* <span className="font-semibold text-slate-900">₹{(p.base_min_fee * location.repair_multiplier).toFixed(0)}</span> */}
                                    </div>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Inspection/Visit Fee</span>
                                    <span className="font-semibold text-slate-900">₹{inspectionFee.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs mt-2">
                                    <span className="text-slate-500">GST (4%)</span>
                                    <span className="font-semibold text-slate-900">₹{gstAmount.toFixed(0)}</span>
                                </div>

                                <div className="border-t border-dashed border-slate-200 my-2"></div>

                                <div className="flex justify-between items-start text-xs">
                                    <span className="text-slate-500 font-semibold">Repair Fee</span>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[10px] text-slate-400 italic font-medium">To be decided after inspection</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowRepairInfo(!showRepairInfo)}
                                            className="text-slate-400 hover:text-primary transition-colors"
                                            aria-label="Repair fee information"
                                        >
                                            <Info className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                {showRepairInfo && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 mt-1">
                                        <p className="text-[10px] text-slate-600 leading-relaxed">
                                            You can choose to proceed or decline after knowing the price
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-slate-50/80 rounded-xl p-4 space-y-2 border border-slate-100/50 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Final Inspection Fee</span>
                                    <span className="text-slate-900 font-semibold text-lg">₹{grandTotal}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                                        <span className="flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Coupon Discount</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}
                                {useWallet && walletDeduction > 0 && (
                                    <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                                        <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5" /> Wallet Credits</span>
                                        <span>-₹{walletDeduction}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-end mb-4 px-1">
                                {/* <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Final Payable</span>
                                    <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline">
                                        <span className="text-lg mr-1">₹</span>
                                        {finalPayable}
                                    </div>
                                </div> */}
                            </div>
                            <div className="space-y-3 mb-4">
                                {/* Coupon Code */}
                                <div className={cn(
                                    "relative flex items-center bg-white border rounded-xl transition-all duration-300 h-12 pr-1 shadow-sm",
                                    referralStatus === 'success' ? "border-green-500/50 bg-green-50/50" : referralStatus === 'error' ? "border-red-500/50 bg-red-50/50" : "border-slate-200 focus-within:border-primary/50"
                                )}>
                                    <Tag className={cn("w-4 h-4 ml-3 mx-2 shrink-0", referralStatus === 'success' ? "text-green-500" : referralStatus === 'error' ? "text-red-500" : "text-slate-400")} />
                                    <input
                                        placeholder="COUPON CODE"
                                        value={referral}
                                        onChange={(e) => {
                                            setReferral(e.target.value.toUpperCase());
                                            if (referralStatus !== 'idle') {
                                                setReferralStatus('idle');
                                                setReferralMessage('');
                                                setDiscount(0);
                                            }
                                        }}
                                        disabled={referralStatus === 'success'}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400/70 placeholder:font-bold uppercase h-full p-0"
                                    />
                                    {referralStatus === 'success' ? (
                                        <button type="button" onClick={() => { setReferral(''); setReferralStatus('idle'); setDiscount(0); }} className="px-3 text-slate-400 hover:text-red-500 h-full flex items-center justify-center">
                                            <X className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={verifyReferralCode}
                                            disabled={!referral.trim() || referralStatus === 'verifying'}
                                            className="h-8 md:h-9 text-[10px] md:text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 mr-1"
                                        >
                                            {referralStatus === 'verifying' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'APPLY'}
                                        </Button>
                                    )}
                                </div>

                                {/* Special Offer Banner */}
                                {/* {referralStatus !== 'success' && (
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                            <Gift className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Special Offer</h4>
                                            <p className="text-[10px] text-slate-500 leading-normal">
                                                Apply a friend's code to get <span className="font-bold text-slate-900">₹50 OFF</span> on visit fee!
                                            </p>
                                        </div>
                                    </div>
                                )} */}

                                {/* Wallet Toggle */}
                                {walletBalance > 0 && (
                                    <div
                                        onClick={() => setUseWallet(!useWallet)}
                                        className={cn(
                                            "bg-slate-50 border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-100",
                                            useWallet ? "border-indigo-500 bg-indigo-50/20 ring-1 ring-indigo-500/20" : "border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                useWallet ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                                            )}>
                                                <Wallet className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 leading-none">Use Wallet Balance</p>
                                                <p className="text-[10px] text-slate-500 mt-1">Available: ₹{walletBalance}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-5 rounded-full p-1 transition-colors",
                                            useWallet ? "bg-indigo-600" : "bg-slate-200"
                                        )}>
                                            <div className={cn(
                                                "w-3 h-3 rounded-full bg-white transition-transform",
                                                useWallet ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 bg-[#1e1b4b] hover:bg-primary text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] group flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                            >
                                {isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>BOOK INSPECTION</span>
                                        <div className="w-px h-4 bg-white/20" />
                                        <span className="text-sm">₹{finalPayable}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70" />
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-slate-400 text-center mt-2 font-semibold uppercase tracking-wider">
                                Secure & Encrypted Checkout
                            </p>
                        </CardContent>
                    </Card>



                    {state?.error && (
                        <Alert variant="destructive" className="rounded-xl border-red-100 bg-red-50/30 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">Booking Failed</AlertTitle>
                            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
                        </Alert>
                    )}

                </div>
            </div >

            <input type="hidden" name="preferred_service_date" value={date ? date.toISOString().split('T')[0] : ''} />
            <input type="hidden" name="preferred_time_slot" value={selectedTimeSlot} />

            <OtherPincodeModal
                isOpen={isOtherPincodeModalOpen}
                onClose={(pincode) => {
                    setIsOtherPincodeModalOpen(false);
                    if (pincode) {
                        setBookingFor('others');
                        setOtherPincode(pincode);
                        toast({
                            title: "Address Updated",
                            description: `Booking will be done for pincode: ${pincode}`,
                        });
                    }
                }}
            />
        </form >
    );
}
