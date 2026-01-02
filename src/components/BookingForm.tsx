'use client';

import { useMemo, useEffect, useActionState, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, User, Phone, MapPin, LocateFixed, Camera, Clock, ArrowRight, Flag, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import { bookService } from '@/app/actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const initialState = {
  message: "",
  error: "",
  bookingId: undefined,
};

export function BookingForm({ categoryId, problemIds, totalEstimate, referralCode = '' }: { categoryId: string; problemIds: string; totalEstimate: number; referralCode?: string; }) {
  const { t } = useTranslation();
  const { location } = useLocation();
  const { toast } = useToast();
  const router = useRouter();

  const boundBookService = bookService.bind(null, categoryId, problemIds, location.pincode);
  const [state, formAction, isPending] = useActionState(boundBookService, initialState);
  
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedTime, setSelectedTime] = useState('best');
  const [address, setAddress] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [referral, setReferral] = useState(referralCode);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [referralMessage, setReferralMessage] = useState('');
  const [mobile, setMobile] = useState('');
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (state?.error) {
      toast({
          variant: 'destructive',
          title: t('errorTitle'),
          description: state.error,
      });
    }
    if (state?.bookingId) {
      router.push(`/confirmation?bookingId=${state.bookingId}`);
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
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // Referral code verification function
  const verifyReferralCode = async () => {
    setReferralStatus('verifying');
    setReferralMessage('');
    const code = referral.trim();
    const mobile_number = mobile.trim() || (mobileInputRef.current?.value || '');
    if (!code || !mobile_number) {
      setReferralStatus('error');
      setReferralMessage('Enter referral code and mobile number');
      return;
    }
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '',
        'Content-Type': 'application/json',
      };
      const res = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/check-referral', {
        method: 'POST',
        headers,
        body: JSON.stringify({ referral_code: code, mobile_number }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setReferralStatus('success');
        setReferralMessage('Referral code applied!');
        setDiscount(data.discount || 0);
      } else {
        setReferralStatus('error');
        setReferralMessage(data.message || 'Invalid referral code.');
        setDiscount(0);
      }
    } catch (e) {
      setReferralStatus('error');
      setReferralMessage('Could not verify referral code.');
      setDiscount(0);
    }
  };

  const handleRemoveReferral = () => {
    setReferral('');
    setReferralStatus('idle');
    setReferralMessage('');
    setDiscount(0);
  };

  const finalPayable = Math.max(totalEstimate - discount, 0);

  return (
    <form action={formAction} className="space-y-8">
      
      <div>
        <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Contact Information</h2>
        <div className="bg-card rounded-xl border p-2 space-y-2">
            <Input icon={User} id="user_name" name="user_name" placeholder="Full Name" required className="border-0 bg-transparent text-base" />
            <div className="h-px bg-border" />
            <Input 
              icon={Phone} 
              id="mobile_number" 
              name="mobile_number" 
              type="tel" 
              placeholder="Mobile Number" 
              required 
              className="border-0 bg-transparent text-base" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              ref={mobileInputRef}
            />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold uppercase text-muted-foreground">Service Address</h2>
            <Button type="button" onClick={handleUseGps} disabled={isGpsLoading} variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 text-primary border-blue-200 h-7 text-xs">
                {isGpsLoading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="mr-1.5 h-3.5 w-3.5"/>}
                Use GPS
            </Button>
        </div>
        <div className="bg-card rounded-xl border p-2 space-y-2">
            <Textarea 
                icon={MapPin}
                id="full_address" 
                name="full_address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No, Building, Area..." 
                required 
                className="border-0 bg-transparent text-base min-h-[60px]"
            />
             <div className="h-px bg-border" />
            <Input icon={Flag} id="landmark" name="landmark" placeholder="Landmark (Optional)" className="border-0 bg-transparent text-base" />
        </div>
      </div>
      
       <div>
        <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Add Problem Photos (Optional)</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="media" className="relative flex flex-col items-center justify-center w-32 h-32 cursor-pointer bg-card border-2 border-dashed rounded-xl hover:bg-muted/50">
              <Camera className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm font-semibold text-muted-foreground">Add Photo</span>
              <Input id="media" name="media" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          </label>
          {imagePreview && (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border">
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Pick a Time</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
            <Button type="button" variant={selectedDay === 'today' ? 'default' : 'outline'} onClick={() => setSelectedDay('today')}>Today</Button>
            <Button type="button" variant={selectedDay === 'tomorrow' ? 'default' : 'outline'} onClick={() => setSelectedDay('tomorrow')}>Tomorrow</Button>
        </div>
        {/* <div className="bg-card rounded-xl border p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary"/>
                <span className="font-semibold">Best Available Slot</span>
            </div>
            <span className="text-sm font-bold text-primary">WITHIN 60 MINS</span>
        </div> */}
        <input type="hidden" name="preferred_time_slot" value={`${selectedDay}-${selectedTime}`} />
      </div>

      {/* Referral code field */}
      <div className="mb-4 flex gap-2 items-center">
        {referral && referralStatus === 'success' ? (
          <span className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2">
            {referral}
            <button type="button" className="ml-2 text-blue-500 hover:text-red-500" onClick={handleRemoveReferral} aria-label="Remove referral code">&times;</button>
          </span>
        ) : (
          <>
            <Input
              icon={Flag}
              id="referral_code"
              name="referral_code"
              placeholder="Referral Code (Optional)"
              value={referral}
              onChange={e => {
                setReferral(e.target.value);
                setReferralStatus('idle');
                setReferralMessage('');
              }}
              className="rounded-l-full border-r-0 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all h-12 text-base bg-white dark:bg-gray-900"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="default"
              className="rounded-r-full h-12 px-6 font-semibold text-base shadow-none"
              disabled={referralStatus === 'verifying' || !referral.trim()}
              onClick={verifyReferralCode}
            >
              {referralStatus === 'verifying' ? (
                <span className="flex items-center gap-1"><span className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>Verifying...</span>
              ) : 'Verify'}
            </Button>
          </>
        )}
      </div>
      {referralStatus === 'success' && (
        <div className="flex items-center gap-2 mt-1 text-green-600 font-medium">
          <CheckCircle className="w-5 h-5" />
          <span>{referralMessage}</span>
          {discount > 0 && <span className="ml-2 text-green-700">Discount: ₹{discount}</span>}
        </div>
      )}
      {referralStatus === 'error' && (
        <div className="flex items-center gap-2 mt-1 text-red-600 font-medium">
          <AlertCircle className="w-5 h-5" />
          <span>{referralMessage}</span>
        </div>
      )}

      {/* Final payable amount */}
      <div className="mb-4 flex flex-col items-end">
        <span className="text-base font-semibold text-gray-700 dark:text-gray-200">Final Payable: <span className="text-xl text-primary font-bold">₹{finalPayable}</span></span>
        {discount > 0 && <span className="text-xs text-green-600">(Discount applied: ₹{discount})</span>}
      </div>

      {state?.error && !state.bookingId && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
          <Button type="submit" disabled={isPending} size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finish Booking'}
            {!isPending && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
      </div>
    </form>
  );
}
