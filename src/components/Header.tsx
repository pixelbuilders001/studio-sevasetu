'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import LocationSelector from './LocationSelector';

export default function Header() {
  const { location, setLocation } = useLocation();

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            SevaSetu
          </Link>
          <LocationSelector />
        </div>
      </div>
    </header>
  );
}
