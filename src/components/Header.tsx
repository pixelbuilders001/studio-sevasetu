'use client';

import Link from 'next/link';
import LocationSelector from './LocationSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            {t('appName')}
          </Link>
          <div className="flex items-center gap-4">
            <LocationSelector />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
