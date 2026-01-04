
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/context/LocationContext';
import { ChevronDown, Loader2, MapPin } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@supabase/supabase-js'

type PostalInfo = {
  Name: string;
  District: string;
  State: string;
  Pincode: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)


export default function LocationSelector() {
  const { location, setLocation } = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState(location.pincode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [postalData, setPostalData] = useState<PostalInfo[]>([]);
  const [isServiceable, setIsServiceable] = useState(true);
  const [selectedArea, setSelectedArea] = useState<PostalInfo | null>(
    location.area ? { ...location.area, Pincode: location.pincode } : null
  );

  const handlePincodeSearch = async () => {
    if (pincode.length !== 6) {
      setError(t('errorInvalidPincode'));
      setPostalData([]);
      setIsServiceable(false);
      return;
    }
    setError('');
    setIsLoading(true);
    setIsServiceable(false);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        const district = postOffices[0]?.District;
        
        if (!district) {
             throw new Error("Could not determine district from pincode.");
        }

        // Check serviceability
        const { data: serviceableCity, error: serviceError } = await supabase
            .from("serviceable_cities")
            .select("city_name")
            .eq("city_name", district)
            .eq("is_active", true)
            .maybeSingle();

        if (serviceError) {
            console.error('Serviceability check error:', serviceError);
            throw new Error('Could not verify serviceability.');
        }
        
        if (serviceableCity) {
            setPostalData(postOffices);
            setSelectedArea(postOffices[0] || null);
            setIsServiceable(true);
        } else {
            setError(`Sorry, we do not currently service ${district}.`);
            setPostalData([]);
            setIsServiceable(false);
        }

      } else {
        setError(data[0].Message || t('errorCouldNotFindPincode'));
        setPostalData([]);
        setIsServiceable(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errorFailedToFetchLocation');
      setError(message);
      setPostalData([]);
      setIsServiceable(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationConfirm = () => {
    if (selectedArea && isServiceable) {
      setLocation({
        pincode: selectedArea.Pincode,
        city: selectedArea.District,
        area: {
          Name: selectedArea.Name,
          District: selectedArea.District,
          State: selectedArea.State,
        },
      });
    }
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state on close
      setPincode(location.pincode);
      setPostalData([]);
      setError('');
      setIsServiceable(true);
      setSelectedArea(location.area ? { ...location.area, Pincode: location.pincode } : null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-muted/50 border rounded-full h-10">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="text-left hidden md:block">
            <div className="text-xs text-muted-foreground leading-tight">SERVICE IN</div>
            <div className="font-semibold text-sm leading-tight">{location.city}</div>
          </div>
          <span className='md:hidden font-semibold'>{location.city}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('selectYourLocation')}</DialogTitle>
          <DialogDescription>
            {t('pincodeDialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder={t('pincodeInputPlaceholder')}
              className="flex-grow"
            />
            <Button onClick={handlePincodeSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('searchButton')}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {postalData.length > 0 && isServiceable && (
            <div className="space-y-2">
              <p className="font-medium text-sm">{t('selectYourArea')}</p>
              <RadioGroup
                value={selectedArea?.Name}
                onValueChange={(value) => {
                  const area = postalData.find(p => p.Name === value);
                  if (area) setSelectedArea(area);
                }}
                className="max-h-60 overflow-y-auto space-y-1 pr-2"
              >
                {postalData.map((office) => (
                  <div key={office.Name} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <RadioGroupItem value={office.Name} id={office.Name} />
                    <Label htmlFor={office.Name} className="font-normal flex-grow cursor-pointer">
                      {office.Name}, {office.District}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button type="button" variant="outline">{t('cancelButton')}</Button>
          </DialogClose>
          <Button onClick={handleLocationConfirm} disabled={!selectedArea || !isServiceable}>
            {t('confirmLocationButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
