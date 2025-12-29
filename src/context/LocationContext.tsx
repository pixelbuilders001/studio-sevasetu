'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
  const [location, setLocation] = useState<Location>(defaultLocation);

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
