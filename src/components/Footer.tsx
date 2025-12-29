'use client';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
    const { t } = useTranslation();
    return (
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('footerAllRightsReserved')}</p>
        </div>
      </footer>
    );
  }
  