'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AreaInfo = {
    Name: string;
    District: string;
    State: string;
}

type Location = {
  pincode: string;
  city: string;
  area: AreaInfo | null;
};

type LocationContextType = {
  location: Location;
  setLocation: (location: Location) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const defaultLocation: Location = {
    pincode: '411001',
    city: 'Pune',
    area: {
        Name: 'Pune City',
        District: 'Pune',
        State: 'Maharashtra'
    }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(defaultLocation);

  useEffect(() => {
    try {
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        setLocationState(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error("Failed to parse location from localStorage", error);
    }
  }, []);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
    try {
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
    } catch (error) {
      console.error("Failed to save location to localStorage", error);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
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
