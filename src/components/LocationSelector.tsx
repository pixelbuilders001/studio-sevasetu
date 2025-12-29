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

type PostalInfo = {
  Name: string;
  District: string;
  State: string;
  Pincode: string;
};

export default function LocationSelector() {
  const { location, setLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState(location.pincode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [postalData, setPostalData] = useState<PostalInfo[]>([]);
  const [selectedArea, setSelectedArea] = useState<PostalInfo | null>(
    location.area ? { ...location.area, Pincode: location.pincode } : null
  );

  const handlePincodeSearch = async () => {
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode.');
      setPostalData([]);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data && data[0].Status === 'Success') {
        setPostalData(data[0].PostOffice);
        setSelectedArea(data[0].PostOffice[0] || null);
      } else {
        setError(data[0].Message || 'Could not find the pincode.');
        setPostalData([]);
      }
    } catch (err) {
      setError('Failed to fetch location data.');
      setPostalData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationConfirm = () => {
    if (selectedArea) {
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
      setSelectedArea(location.area ? { ...location.area, Pincode: location.pincode } : null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div className="text-left">
            <div className="font-semibold text-sm leading-tight">{location.pincode}</div>
            <div className="text-xs text-muted-foreground leading-tight truncate max-w-[150px]">
              {location.area?.Name || 'Select your location'}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Enter your pincode to find service availability in your area.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit Pincode"
              className="flex-grow"
            />
            <Button onClick={handlePincodeSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {postalData.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm">Select your area</p>
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
             <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleLocationConfirm} disabled={!selectedArea}>
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
