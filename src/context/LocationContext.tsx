
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

type Location = {
  pincode: string;
  city: string;
  area: AreaInfo | null;
  isServiceable: boolean;
};

type LocationContextType = {
  location: Location;
  setLocation: (location: Location) => void;
  isServiceable: boolean;
  checkServiceability: (city: string) => Promise<boolean>;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const defaultLocation: Location = {
    pincode: '411001',
    city: 'Pune',
    area: {
        Name: 'Pune City',
        District: 'Pune',
        State: 'Maharashtra'
    },
    isServiceable: true, // Assuming default is serviceable, will be checked on load
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(defaultLocation);
  const [dialogOpen, setDialogOpen] = useState(false);

  const checkServiceability = useCallback(async (city: string): Promise<boolean> => {
    if (!city) return false;
    try {
        const { data: serviceableCity, error } = await supabase
            .from("serviceable_cities")
            .select("city_name")
            .eq("city_name", city)
            .eq("is_active", true)
            .maybeSingle();

        if (error) {
            console.error('Serviceability check error:', error);
            return false;
        }
        return !!serviceableCity;
    } catch (e) {
        console.error("Exception during serviceability check", e);
        return false;
    }
  }, []);

  const updateServiceability = useCallback(async (loc: Location) => {
    const serviceable = await checkServiceability(loc.city);
    setLocationState(prev => ({ ...loc, isServiceable: serviceable }));
  }, [checkServiceability]);

  useEffect(() => {
    try {
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        updateServiceability(parsedLocation);
      } else {
        updateServiceability(defaultLocation);
      }
    } catch (error) {
      console.error("Failed to parse location from localStorage", error);
      updateServiceability(defaultLocation);
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
