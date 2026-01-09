
'use client';

import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 flex-shrink-0">
    <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
      <span className="text-2xl font-bold text-primary-foreground">S</span>
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-primary leading-tight">SevaSetu</span>
      <span className="text-xs font-semibold text-muted-foreground leading-tight tracking-wide">TRUSTED REPAIR</span>
    </div>
  </Link>
)

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/10 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          <div className="flex items-center gap-3">
            <LocationSelector />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
