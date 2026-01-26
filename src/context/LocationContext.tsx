
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


type AreaInfo = {
  Name: string;
  District: string;
  State: string;
}

type ServiceableCity = {
  city_name: string;
  inspection_multiplier: number;
  repair_multiplier: number;
} | null;

type Location = {
  pincode: string;
  city: string;
  area: AreaInfo | null;
  isServiceable: boolean;
  inspection_multiplier: number;
  repair_multiplier: number;
};

type LocationContextType = {
  location: Location;
  setLocation: (location: Location) => void;
  isServiceable: boolean;
  checkServiceability: (city: string) => Promise<ServiceableCity>;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const defaultLocation: Location = {
  pincode: '',
  city: 'Select City',
  area: {
    Name: '',
    District: '',
    State: ''
  },
  isServiceable: true,
  inspection_multiplier: 1,
  repair_multiplier: 1,
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(defaultLocation);
  const [dialogOpen, setDialogOpen] = useState(false);

  const checkServiceability = useCallback(async (city: string): Promise<ServiceableCity> => {
    if (!city) return null;
    try {
      const { data: serviceableCity, error } = await supabase
        .from("serviceable_cities")
        .select("city_name, inspection_multiplier, repair_multiplier")
        .eq("city_name", city)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error('Serviceability check error:', error);
        return null;
      }
      return serviceableCity;
    } catch (e) {
      console.error("Exception during serviceability check", e);
      return null;
    }
  }, []);

  const updateServiceability = useCallback(async (loc: Omit<Location, 'isServiceable' | 'inspection_multiplier' | 'repair_multiplier'>) => {
    const serviceableCityData = await checkServiceability(loc.city);
    if (serviceableCityData) {
      setLocationState({
        ...loc,
        isServiceable: true,
        inspection_multiplier: serviceableCityData.inspection_multiplier,
        repair_multiplier: serviceableCityData.repair_multiplier,
      });
    } else {
      setLocationState({
        ...loc,
        isServiceable: false,
        inspection_multiplier: 1,
        repair_multiplier: 1
      });
    }
  }, [checkServiceability]);

  useEffect(() => {
    try {
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        const { isServiceable, inspection_multiplier, repair_multiplier, ...rest } = parsedLocation;
        updateServiceability(rest);
      } else {
        const { isServiceable, inspection_multiplier, repair_multiplier, ...rest } = defaultLocation;
        updateServiceability(rest);
      }
    } catch (error) {
      console.error("Failed to parse location from localStorage", error);
      const { isServiceable, inspection_multiplier, repair_multiplier, ...rest } = defaultLocation;
      updateServiceability(rest);
    }
  }, [updateServiceability]);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
    try {
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
    } catch (error) {
      console.error("Failed to save location to localStorage", error);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isServiceable: location.isServiceable, checkServiceability, dialogOpen, setDialogOpen }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
