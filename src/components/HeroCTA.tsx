
'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import AllServicesSheet from './AllServicesSheet';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Sheet, SheetTrigger } from './ui/sheet';

export default function HeroCTA() {
  const isMobile = useIsMobile();

  const CtaButton = () => (
    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-10 h-14 rounded-full">
      BOOK NOW <ArrowRight className="w-5 h-5 ml-2" />
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <CtaButton />
        </SheetTrigger>
        <AllServicesSheet />
      </Sheet>
    );
  }

  return (
    <Link href="/#services">
      <CtaButton />
    </Link>
  );
}
