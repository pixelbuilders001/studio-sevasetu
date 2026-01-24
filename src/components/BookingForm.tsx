
'use client';

import { useEffect, useActionState, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, User, Phone, MapPin, LocateFixed, Camera, Clock, ArrowRight, Flag, CheckCircle, IndianRupee, Tag, Gift, X, Calendar as CalendarIcon, CloudCog, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import { bookService, verifyReferralCode as verifyReferralCodeAction, saveAddress, getSavedAddresses, getWalletBalance, getUserProfile } from '@/app/actions';
import Image from 'next/image';
import { Card } from './ui/card';
import FullScreenLoader from '@/components/FullScreenLoader';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBooking } from '@/context/BookingContext';


const initialState = {
  message: "",
  error: "",
  bookingId: undefined,
  referralCode: undefined,
};

export function BookingForm({ categoryId, problemIds, inspectionFee, totalEstimatedPrice, gstAmount, grandTotal }: { categoryId: string; problemIds: string; inspectionFee: number; totalEstimatedPrice: number; gstAmount: number; grandTotal: number; }) {
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

  const { media, secondaryMedia } = useBooking();

  // grandTotal includes GST
  const initialPayable = Math.max(grandTotal - discount, 0);
  const walletDeduction = useWallet ? Math.min(walletBalance, initialPayable) : 0;
  const finalPayable = Math.max(initialPayable - walletDeduction, 0);

  const boundBookService = bookService.bind(null, categoryId, problemIds, location.pincode, referralStatus === 'success' ? referral : undefined, totalEstimatedPrice, finalPayable, useWallet ? walletDeduction : null);
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

      // Auto-select is_default address
      const defaultAddr = addresses.find((addr: any) => addr.is_default);
      if (defaultAddr) {
        setAddress(defaultAddr.full_address);
      }
      setIsLoadingAddresses(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 18) {
      toast({
        title: "Booking for Today Closed",
        description: "Same-day service is unavailable after 6 PM. Please select a booking for tomorrow or a future date.",
      });
    }
  }, [toast]);


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
          } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Could not fetch address details.',
            });
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch address.',
          });
        } finally {
          setIsGpsLoading(false);
        }
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'GPS Error',
          description: error.message,
        });
        setIsGpsLoading(false);
      }
    );
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
      // Refresh addresses list after saving
      const addresses = await getSavedAddresses();
      setSavedAddresses(addresses);
    }
  };

  const handleSelectSavedAddress = (addrId: string) => {
    const selected = savedAddresses.find(a => a.id === addrId);
    if (selected) {
      setAddress(selected.full_address);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB check
        toast({
          variant: 'destructive',
          title: 'Image Too Large',
          description: 'Please select an image smaller than 1MB.',
        });
        event.target.value = ''; // Reset input
        setImagePreview(null);
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const verifyReferralCode = async () => {
    setReferralStatus('verifying');
    setReferralMessage('');
    const code = referral.trim();
    const mobile_number = mobile.trim() || (mobileInputRef.current?.value || '');
    if (!code) {
      setReferralStatus('error');
      setReferralMessage('Enter referral code');
      return;
    }
    try {
      const { valid, message, discount } = await verifyReferralCodeAction(code);

      if (valid) {
        setReferralStatus('success');
        // Note: verifyReferralCodeAction needs to return discount too if the original API did. 
        // Based on the original code, the API returned 'discount'. I should check if my action returns it.
        // My action only returns { valid, message }. I need to update the action to return discount if valid.
        // Wait, I should first update the action to return the full data.
        // Let's assume for now I'll fix the action in the next step or right now.
        // Actually, looking at the previous step, I only returned { valid, message }.
        // The original code used `data.discount`.
        // I must update `actions.ts` to return `data` or `discount`.
        // I will do that first. 
        // ABORTING THIS EDIT to fix action first.

        // Wait, I can't abort comfortably here. I will complete this edit assuming I'll fix the action immediately after.
        // Or I can just write the correct code here and then fix the action.

        setReferralMessage(message || `REFERRAL APPLIED!`);
        setDiscount(discount || 0);
        // The discount logic depends on the API response.
        // I'll update the action to return the whole data object or specifically the discount.
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

  const removeReferralCode = () => {
    setReferral('');
    setReferralStatus('idle');
    setReferralMessage('');
    setDiscount(0);
  };

  const onDateChange = (newDate: any) => {
    setDate(newDate);
    setIsCalendarOpen(false);
  };
  const getMinDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 18) {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return tomorrow;
    }
    return now;
  };

  return (
    <>
      <form action={(formData) => {
        if (media) formData.append('media', media);
        if (secondaryMedia) formData.append('secondary_media', secondaryMedia);
        formAction(formData);
      }} className="space-y-6 pb-36">

        {/* Contact Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-2 px-1 mb-3">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Information</h2>
          </div>
          <div className="bg-card rounded-2xl border p-2 space-y-1 shadow-sm">
            <Input
              icon={User}
              id="user_name"
              name="user_name"
              placeholder="Enter Full Name"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border-0 bg-transparent text-sm focus-visible:ring-0 h-11"
            />
            <div className="h-px bg-border/50 mx-4" />
            <Input
              icon={Phone}
              id="mobile_number"
              name="mobile_number"
              type="tel"
              placeholder="Enter Mobile Number"
              required
              ref={mobileInputRef}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border-0 bg-transparent text-sm focus-visible:ring-0 h-11"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Address</h2>
            </div>
            <Button type="button" onClick={handleUseGps} disabled={isGpsLoading} variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-7 text-[10px] font-bold uppercase tracking-wider px-2">
              {isGpsLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <LocateFixed className="mr-1 h-3 w-3" />}
              GPS
            </Button>
          </div>
          <div className="bg-card rounded-2xl border p-2 space-y-1 shadow-sm">
            {savedAddresses.length > 0 && (
              <>
                <div className="px-2 pt-1 pb-2">
                  <Select onValueChange={handleSelectSavedAddress}>
                    <SelectTrigger className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-primary/5 border-primary/10">
                      <SelectValue placeholder="CHOOSE FROM SAVED ADDRESSES" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAddresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id} className="text-xs">
                          {addr.full_address.length > 40 ? addr.full_address.substring(0, 40) + '...' : addr.full_address}
                          {addr.is_default && " (Default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-px bg-border/50 mx-4" />
              </>
            )}
            <Textarea
              icon={MapPin}
              id="full_address"
              name="full_address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat No, House Name, Street Address..."
              required
              className="border-0 bg-transparent text-sm min-h-[80px] focus-visible:ring-0 py-3"
            />
            <div className="h-px bg-border/50 mx-4" />
            <Input icon={Flag} id="landmark" name="landmark" placeholder="Nearest Landmark (Optional)" className="border-0 bg-transparent text-sm focus-visible:ring-0 h-11" />
            <div className="px-2 pb-2">
              <Button
                type="button"
                onClick={handleSaveAddress}
                disabled={!address.trim() || isSavingAddress || savedAddresses.some(a => a.full_address === address)}
                variant="outline"
                size="sm"
                className="w-full text-blue-700 bg-blue-50/50 border-blue-200/50 hover:bg-blue-100/50 hover:border-blue-300/50 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSavingAddress ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle className="h-3 w-3" />
                )}
                Save Address for next time
              </Button>
            </div>
          </div>
        </div>

        {/* Photos Section (Removed as it is now in Problem Selection) */}

        {/* Time Selection Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 px-1 mb-3">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Date & Time</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 rounded-2xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  onChange={onDateChange}
                  value={date}
                  minDate={getMinDate()} // Prevents selecting past dates
                />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setSelectedTimeSlot} value={selectedTimeSlot}>
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9 AM-12 PM">9 AM - 12 PM</SelectItem>
                <SelectItem value="12 PM-2 PM">12 PM - 2 PM</SelectItem>
                <SelectItem value="2 PM-5 PM">2 PM - 5 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <input type="hidden" name="preferred_service_date" value={date ? date.toISOString().split('T')[0] : ''} />
          <input type="hidden" name="preferred_time_slot" value={selectedTimeSlot} />
        </div>


        {/* Referral Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center gap-2 px-1 mb-3">
            <Tag className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Coupons & Offers</h2>
          </div>

          <div className={cn(
            "relative flex items-center bg-card rounded-2xl border transition-all duration-300 h-14 pr-1 px-1 shadow-sm",
            referralStatus === 'success' ? "border-green-500/50 bg-green-50/50" : referralStatus === 'error' ? "border-red-500/50 bg-red-50/50" : "focus-within:border-primary/50"
          )}>
            <Tag className={cn(
              "w-5 h-5 mx-3 shrink-0",
              referralStatus === 'success' ? "text-green-500" : referralStatus === 'error' ? "text-red-500" : "text-muted-foreground"
            )} />
            <Input
              type="text"
              placeholder="HAVE A REFERRAL CODE?"
              name="referral_code_input"
              value={referral}
              onChange={e => {
                setReferral(e.target.value.toUpperCase());
                if (referralStatus !== 'idle') {
                  setReferralStatus('idle');
                  setReferralMessage('');
                  setDiscount(0);
                }
              }}
              className="flex-grow border-0 bg-transparent text-sm font-bold placeholder:text-muted-foreground/60 placeholder:font-bold focus-visible:ring-0 p-0 h-auto"
              style={{ boxShadow: 'none' }}
              autoComplete="off"
              disabled={referralStatus === 'success'}
            />
            {referralStatus !== 'success' ? (
              <Button
                type="button"
                className="rounded-xl h-10 px-6 font-bold text-xs shadow-none hover:bg-primary/90"
                disabled={referralStatus === 'verifying' || !referral.trim()}
                onClick={verifyReferralCode}
              >
                {referralStatus === 'verifying' ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : 'APPLY'}
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl h-10 px-4 font-bold text-[10px] shadow-none uppercase tracking-wider flex items-center gap-1.5"
                onClick={removeReferralCode}
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </Button>
            )}
          </div>

          {referralStatus === 'success' && (
            <div className="flex items-center gap-2 mt-2.5 text-green-600 text-xs font-bold px-3">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{referralMessage}</span>
            </div>
          )}
          {referralStatus === 'error' && (
            <div className="flex items-center gap-2 mt-2.5 text-red-600 text-xs font-bold px-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{referralMessage}</span>
            </div>
          )}

          {referralStatus !== 'success' && (
            <div className="mt-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none">Special Offer</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Apply a friend's code to get <span className="font-black text-foreground">₹50 OFF</span> on visit fee!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Section */}
        {walletBalance > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 px-1 mb-3">
              <Wallet className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wallet Credits</h2>
            </div>
            <div
              onClick={() => setUseWallet(!useWallet)}
              className={cn(
                "relative flex items-center justify-between bg-card rounded-2xl border p-4 cursor-pointer transition-all duration-300 shadow-sm",
                useWallet ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-inner",
                  useWallet ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black">₹{walletBalance}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Available</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Use credits to pay for this booking</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                useWallet ? "bg-primary" : "bg-muted"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out transform",
                  useWallet ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
              {useWallet && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg animate-bounce uppercase tracking-tighter">
                  -₹{walletDeduction} Applied
                </div>
              )}
            </div>
          </div>
        )}

        {state?.error && (
          <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-50/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-bold">Booking Failed</AlertTitle>
            <AlertDescription className="text-xs">{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Floating Bottom Bar */}
        <div className="fixed bottom-4 left-0 right-0 px-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-xl mx-auto">
            <div className="glass shadow-2xl shadow-primary/20 rounded-full p-2 flex items-center gap-3 border border-primary/20">
              <div className="flex-grow pl-5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider leading-none mb-1">Net Payable Visit Fee</span>
                  <div className="flex items-center text-primary font-black text-xl">
                    <IndianRupee className="w-4 h-4 mr-0.5" strokeWidth={3} />
                    <span>{finalPayable}</span>
                    {(discount > 0 || useWallet) && (
                      <div className="flex flex-col ml-2">
                        <span className="text-[9px] text-muted-foreground line-through decoration-red-500/50 opacity-50 font-bold leading-none">
                          ₹{grandTotal}
                        </span>
                        {useWallet && (
                          <span className="text-[8px] bg-green-500 text-white px-1 rounded-sm mt-0.5 font-black uppercase tracking-tighter leading-none">
                            Wallet Applied
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending || finalPayable === null}
                className="bg-[#1e1b4b] hover:bg-primary text-white font-black rounded-full px-8 shadow-lg shadow-indigo-100 h-11 flex items-center gap-2 group min-w-[140px] uppercase text-xs tracking-widest transition-all"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Finish Booking</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
