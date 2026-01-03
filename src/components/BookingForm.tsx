
'use client';

import { useEffect, useActionState, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, User, Phone, MapPin, LocateFixed, Camera, Clock, ArrowRight, Flag, CheckCircle, IndianRupee, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';
import { bookService } from '@/app/actions';
import Image from 'next/image';
import { Card } from './ui/card';

const initialState = {
  message: "",
  error: "",
  bookingId: undefined,
};

export function BookingForm({ categoryId, problemIds }: { categoryId: string; problemIds: string; }) {
  const { t } = useTranslation();
  const { location } = useLocation();
  const { toast } = useToast();
  const router = useRouter();

  const [referral, setReferral] = useState('');
  const [mobile, setMobile] = useState('');
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [referralMessage, setReferralMessage] = useState('');
  const [discount, setDiscount] = useState(0);

  const boundBookService = bookService.bind(null, categoryId, problemIds, location.pincode, referralStatus === 'success' ? referral : undefined);
  const [state, formAction, isPending] = useActionState(boundBookService, initialState);
   
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedTime, setSelectedTime] = useState('best');
  const [address, setAddress] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.error) {
      toast({
          variant: 'destructive',
          title: t('errorTitle'),
          description: state.error,
      });
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
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
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


  const finalPayable = Math.max(199 - discount, 0);

  return (
    <form action={formAction} className="space-y-8 pb-28">
      
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
              ref={mobileInputRef}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border-0 bg-transparent text-base" 
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

      <div className="mb-8">
        <Card className="p-4 bg-white/90 dark:bg-gray-800/80 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between gap-2">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="HAVE A REFERRAL CODE?"
              name="referral_code_input"
              value={referral}
              onChange={e => {
                setReferral(e.target.value.toUpperCase());
                setReferralStatus('idle');
                setReferralMessage('');
                setDiscount(0);
              }}
              className="flex-grow border-0 bg-transparent text-base font-semibold placeholder:text-muted-foreground placeholder:font-semibold focus-visible:ring-0"
              style={{ boxShadow: 'none' }}
              autoComplete="off"
              disabled={referralStatus === 'success'}
            />
            <Button
              type="button"
              variant={referralStatus === 'success' ? 'ghost' : 'default'}
              className="rounded-full h-9 px-6 font-semibold shadow-none text-sm"
              disabled={referralStatus === 'verifying' || !referral.trim()}
              onClick={verifyReferralCode}
            >
              {referralStatus === 'verifying' ? <Loader2 className="h-4 w-4 animate-spin" /> : (referralStatus === 'success' ? 'APPLIED' : 'APPLY')}
            </Button>
          </div>
        </Card>
        {referralStatus === 'success' && (
          <div className="flex items-center gap-2 mt-2 text-green-600 font-medium px-2">
            <CheckCircle className="w-5 h-5" />
            <span>{referralMessage}</span>
          </div>
        )}
        {referralStatus === 'error' && (
          <div className="flex items-center gap-2 mt-2 text-red-600 font-medium px-2">
            <AlertCircle className="w-5 h-5" />
            <span>{referralMessage}</span>
          </div>
        )}
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
        <input type="hidden" name="preferred_time_slot" value={`${selectedDay}-best`} />
      </div>

       {state?.error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
          <div className="max-w-md mx-auto flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-muted-foreground">NET PAYABLE (VISIT FEE)</span>
               <span className="font-extrabold text-2xl text-gray-900 dark:text-gray-100 flex items-center"><IndianRupee className="w-6 h-6" />{finalPayable}</span>
          </div>
          <Button type="submit" disabled={isPending} size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finish Booking'}
            {!isPending && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
      </div>
    </form>
  );
}
