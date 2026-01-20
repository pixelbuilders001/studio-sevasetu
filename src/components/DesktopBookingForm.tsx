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
    ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import {
    bookService, verifyReferralCode as verifyReferralCodeAction,
    saveAddress, getSavedAddresses, getWalletBalance, getUserProfile
} from '@/app/actions';
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
    categoryName: string;
    selectedProblems: Problem[];
}

export function DesktopBookingForm({
    categoryId,
    problemIds,
    inspectionFee,
    totalEstimatedPrice,
    categoryName,
    selectedProblems
}: DesktopBookingFormProps) {
    const { t } = useTranslation();
    const { location } = useLocation();
    const { toast } = useToast();
    const router = useRouter();

    const [referral, setReferral] = useState('');
    const [userName, setUserName] = useState('');
    const [mobile, setMobile] = useState('');
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const [referralStatus, setReferralStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [referralMessage, setReferralMessage] = useState('');
    const [discount, setDiscount] = useState(0);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [useWallet, setUseWallet] = useState(false);

    const initialPayable = Math.max(inspectionFee - discount, 0);
    const walletDeduction = useWallet ? Math.min(walletBalance, initialPayable) : 0;
    const finalPayable = Math.max(initialPayable - walletDeduction, 0);

    const boundBookService = bookService.bind(
        null,
        categoryId,
        problemIds,
        location.pincode,
        referralStatus === 'success' ? referral : undefined,
        totalEstimatedPrice,
        finalPayable,
        useWallet ? walletDeduction : null
    );

    const [state, formAction, isPending] = useActionState(boundBookService, initialState);

    const [date, setDate] = useState<Date | null>(() => {
        const now = new Date();
        const currentHour = now.getHours();
        if (currentHour >= 18) {
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            return tomorrow;
        }
        return now;
    });
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("9 AM-12 PM");
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

    useEffect(() => {
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: state.error,
            });
        }
        if (state?.bookingId) {
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
            const { valid, message, discount } = await verifyReferralCodeAction(code);
            if (valid) {
                setReferralStatus('success');
                setReferralMessage(message || `REFERRAL APPLIED!`);
                setDiscount(discount || 0);
            } else {
                setReferralStatus('error');
                setReferralMessage(message || 'Invalid referral code.');
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
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">

            {/* Form Fields Column */}
            <div className="lg:col-span-7 space-y-8">

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

                {/* Schedule & Photos */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date & Time */}
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
                        </div>

                        <div className="space-y-4">
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
                                            minDate={new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
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

                    {/* Problem Photos */}
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Issue Photos</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="relative flex-1 flex flex-col items-center justify-center h-32 cursor-pointer border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
                                <Plus className="w-6 h-6 text-slate-300 group-hover:text-slate-500 mb-2" />
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-wider">Add Photo</span>
                                <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} name="media" />
                            </label>

                            {imagePreview && (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 group">
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm border border-slate-100 hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 uppercase tracking-wide font-bold">
                            <ImageIcon className="w-3 h-3" />
                            Optional: Helps technician prepare
                        </p>
                    </div>
                </section>

            </div>

            {/* Summary Sidebar Column */}
            <div className="lg:col-span-5">
                <div className="sticky top-24 space-y-6">

                    {/* Booking Summary */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                Booking Summary
                            </h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{categoryName}</h4>
                                    <p className="text-xs text-slate-500">{selectedProblems.length} issue(s) selected</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {selectedProblems.map(p => (
                                    <div key={p.id} className="flex items-start justify-between text-xs py-1">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            {p.title}
                                        </span>
                                        <span className="font-semibold text-slate-900">₹{(p.base_min_fee * location.repair_multiplier).toFixed(0)}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Inspection/Visit Fee</span>
                                    <span className="font-semibold text-slate-900">₹{inspectionFee.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-slate-50/80 rounded-xl p-5 space-y-3 border border-slate-100/50 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Initial Payable</span>
                                    <span className="text-slate-900 font-semibold text-lg">₹{inspectionFee}</span>
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

                            <div className="flex justify-between items-end mb-8 px-1">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Final Payable</span>
                                    <div className="text-3xl font-bold text-slate-900 tracking-tight flex items-baseline">
                                        <span className="text-xl mr-1">₹</span>
                                        {finalPayable}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Estimated</span>
                                    <span className="text-sm font-semibold text-slate-500">₹{totalEstimatedPrice}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] group flex items-center justify-center gap-3"
                            >
                                {isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        FINISH BOOKING
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-slate-400 text-center mt-4 font-semibold uppercase tracking-wider">
                                Secure & Encrypted Checkout
                            </p>
                        </CardContent>
                    </Card>

                    {/* Offers & Wallet Card */}
                    <div className="space-y-4">
                        {/* Referral Code */}
                        <div className={cn(
                            "bg-white border rounded-xl px-4 py-3 flex items-center gap-3 transition-all",
                            referralStatus === 'success' ? "border-green-300 bg-green-50/30" : "border-slate-200"
                        )}>
                            <Tag className={cn("w-4 h-4", referralStatus === 'success' ? "text-green-500" : "text-slate-400")} />
                            <input
                                placeholder="COUPON CODE"
                                value={referral}
                                onChange={(e) => setReferral(e.target.value.toUpperCase())}
                                disabled={referralStatus === 'success' || referralStatus === 'verifying'}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 placeholder:text-slate-300 uppercase"
                            />
                            {referralStatus === 'success' ? (
                                <button type="button" onClick={() => { setReferral(''); setReferralStatus('idle'); setDiscount(0); }} className="text-slate-400 hover:text-red-500">
                                    <X className="w-4 h-4" />
                                </button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={verifyReferralCode}
                                    disabled={!referral.trim() || referralStatus === 'verifying'}
                                    className="h-8 text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                                >
                                    {referralStatus === 'verifying' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'APPLY'}
                                </Button>
                            )}
                        </div>

                        {/* Wallet Toggle */}
                        {walletBalance > 0 && (
                            <div
                                onClick={() => setUseWallet(!useWallet)}
                                className={cn(
                                    "bg-white border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50",
                                    useWallet ? "border-indigo-500 bg-indigo-50/20 ring-1 ring-indigo-500/20" : "border-slate-200"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        useWallet ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
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

                    {state?.error && (
                        <Alert variant="destructive" className="rounded-xl border-red-100 bg-red-50/30 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">Booking Failed</AlertTitle>
                            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
                        </Alert>
                    )}

                </div>
            </div>

            <input type="hidden" name="preferred_service_date" value={date ? date.toISOString().split('T')[0] : ''} />
            <input type="hidden" name="preferred_time_slot" value={selectedTimeSlot} />
        </form>
    );
}
