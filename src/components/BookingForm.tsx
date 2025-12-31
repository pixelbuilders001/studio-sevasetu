
'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation } from '@/context/LocationContext';

export function BookingForm({ categoryId, problemIds, totalEstimate }: { categoryId: string; problemIds: string; totalEstimate: number; }) {
  const { t } = useTranslation();
  const { location } = useLocation();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const problemDescription = "General Checkup";
  const otherIssueStrings = ['other issue', 'अन्य समस्या'];
  const isOtherProblem = useMemo(() => {
    return otherIssueStrings.includes(problemDescription.toLowerCase());
  }, [problemDescription]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const rawData = {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        address: formData.get('address'),
        landmark: formData.get('landmark'),
        timeSlot: formData.get('timeSlot'),
        media: formData.get('media'),
        problemDescription: formData.get('problemDescription'),
    };

    if (!rawData.name || !rawData.mobile || !rawData.address || !rawData.timeSlot) {
        toast({
            variant: 'destructive',
            title: t('bookingError'),
            description: t('validation.fixErrors'),
        });
        setIsLoading(false);
        return;
    }
  
    try {
        const apiFormData = new FormData();
        apiFormData.append('user_name', rawData.name as string);
        apiFormData.append('mobile_number', rawData.mobile as string);
        apiFormData.append('full_address', rawData.address as string);
        if (rawData.landmark) {
            apiFormData.append('landmark', rawData.landmark as string);
        }
        apiFormData.append('category_id', categoryId);
        
        const issueIds = problemIds.split(',');
        if (issueIds.length > 0) {
            apiFormData.append('issue_id', issueIds[0]);
        }

        apiFormData.append('preferred_time_slot', rawData.timeSlot as string);
        
        const mediaFile = rawData.media as File;
        if (mediaFile && mediaFile.size > 0) {
            apiFormData.append('media', mediaFile);
        }
        if(location.pincode) {
            apiFormData.append('pincode', location.pincode);
        }
        if (rawData.problemDescription) {
            apiFormData.append('problem_description', rawData.problemDescription as string);
        }

        const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
                'apikey': 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
            },
            body: apiFormData,
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('API Error:', result);
            setError(result.message || t('validation.unexpectedError'));
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: result.message || t('validation.unexpectedError'),
            });
            setIsLoading(false);
            return;
        }

        const bookingId = result.bookingId || `SS-${Math.floor(100000 + Math.random() * 900000)}`;
        router.push(`/confirmation?bookingId=${bookingId}`);

    } catch (error) {
        console.error('Booking failed:', error);
        const errorMessage = error instanceof Error ? error.message : t('validation.unexpectedError');
        setError(errorMessage);
        toast({
            variant: 'destructive',
            title: t('errorTitle'),
            description: errorMessage,
        });
        setIsLoading(false);
    }
  };


  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      
      <div>
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="mobile">{t('mobileLabel')}</Label>
        <Input id="mobile" name="mobile" type="tel" required />
      </div>

      <div>
        <Label htmlFor="address">{t('addressLabel')}</Label>
        <Textarea id="address" name="address" required />
      </div>

      <div>
        <Label htmlFor="landmark">{t('landmarkLabel')}</Label>
        <Input id="landmark" name="landmark" />
      </div>

      {isOtherProblem && (
        <div>
            <Label htmlFor="problemDescription">{t('describeProblemLabel')}</Label>
            <Textarea id="problemDescription" name="problemDescription" required />
        </div>
      )}

      <div>
        <Label htmlFor="timeSlot">{t('timeSlotLabel')}</Label>
        <Select name="timeSlot" required>
            <SelectTrigger id="timeSlot">
                <SelectValue placeholder={t('selectTimeSlotPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="morning">{t('timeSlotMorning')}</SelectItem>
                <SelectItem value="afternoon">{t('timeSlotAfternoon')}</SelectItem>
                <SelectItem value="evening">{t('timeSlotEvening')}</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="media">{t('mediaLabel')}</Label>
        <Input id="media" name="media" type="file" accept="image/jpeg,image/png,video/mp4" />
        <p className="text-sm text-muted-foreground mt-1">{t('mediaHelpText')}</p>
      </div>
      
      {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

       <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
        <p>Total Estimated Cost</p>
        <p className="font-bold text-foreground">Rs. {totalEstimate}</p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {t('confirmBooking')}
      </Button>
    </form>
  );
}
