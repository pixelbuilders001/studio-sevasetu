
'use client';

import { useState, useEffect } from 'react';
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

type PostalInfo = {
  Name: string;
  District: string;
  State: string;
  Pincode: string;
};

export default function LocationSelector() {
  const { location, setLocation, isServiceable, checkServiceability, dialogOpen, setDialogOpen } = useLocation();
  const { t } = useTranslation();

  const [pincode, setPincode] = useState(location.pincode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [postalData, setPostalData] = useState<PostalInfo[]>([]);
  const [currentIsServiceable, setCurrentIsServiceable] = useState(isServiceable);
  const [selectedArea, setSelectedArea] = useState<PostalInfo | null>(
    location.area ? { ...location.area, Pincode: location.pincode } : null
  );
  const [multipliers, setMultipliers] = useState({ inspection_multiplier: 1, repair_multiplier: 1 });

  useEffect(() => {
    setCurrentIsServiceable(isServiceable);
  }, [isServiceable]);

  const handlePincodeSearch = async () => {
    if (pincode.length !== 6) {
      setError(t('errorInvalidPincode'));
      setPostalData([]);
      setCurrentIsServiceable(false);
      return;
    }
    setError('');
    setIsLoading(true);
    setCurrentIsServiceable(false);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        const district = postOffices[0]?.District;

        if (!district) {
          throw new Error("Could not determine district from pincode.");
        }

        const serviceableCityData = await checkServiceability(district);

        if (serviceableCityData) {
          setPostalData(postOffices);
          setSelectedArea(postOffices[0] || null);
          setCurrentIsServiceable(true);
          setMultipliers({
            inspection_multiplier: serviceableCityData.inspection_multiplier,
            repair_multiplier: serviceableCityData.repair_multiplier
          });
        } else {
          setError(`Sorry, we do not currently service ${district}.`);
          setPostalData([]);
          setCurrentIsServiceable(false);
        }

      } else {
        setError(data[0].Message || t('errorCouldNotFindPincode'));
        setPostalData([]);
        setCurrentIsServiceable(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errorFailedToFetchLocation');
      setError(message);
      setPostalData([]);
      setCurrentIsServiceable(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationConfirm = () => {
    if (selectedArea && currentIsServiceable) {
      setLocation({
        pincode: selectedArea.Pincode,
        city: selectedArea.District,
        area: {
          Name: selectedArea.Name,
          District: selectedArea.District,
          State: selectedArea.State,
        },
        isServiceable: true,
        inspection_multiplier: multipliers.inspection_multiplier,
        repair_multiplier: multipliers.repair_multiplier,
      });
    }
    setDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset state on close
      setPincode(location.pincode);
      setPostalData([]);
      setError('');
      setCurrentIsServiceable(isServiceable);
      setSelectedArea(location.area ? { ...location.area, Pincode: location.pincode } : null);
    }
  }

  const truncatedCity = location.city.length > 5 ? `${location.city.slice(0, 5)}...` : location.city;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-muted/50 border rounded-full h-10">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="text-left hidden md:block">
            <div className="text-xs text-muted-foreground leading-tight">SERVICE IN</div>
            <div className="font-semibold text-sm leading-tight">{truncatedCity}</div>
          </div>
          <span className='md:hidden font-semibold'>{truncatedCity}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-6">
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
              className="flex-grow rounded-xl h-11"
            />
            <Button onClick={handlePincodeSearch} disabled={isLoading} className="rounded-xl h-11">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('searchButton')}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {postalData.length > 0 && currentIsServiceable && (
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
        <DialogFooter className="flex-row gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1 rounded-full h-11">{t('cancelButton')}</Button>
          </DialogClose>
          <Button onClick={handleLocationConfirm} disabled={!selectedArea || !currentIsServiceable} className="flex-1 rounded-full h-11 bg-primary">
            {t('confirmLocationButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
