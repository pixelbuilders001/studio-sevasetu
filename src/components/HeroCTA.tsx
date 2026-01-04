
'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import AllServicesSheet from './AllServicesSheet';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';

export default function HeroCTA() {
  const isMobile = useIsMobile();

  const CtaButton = () => (
    <Button size="lg" className="bg-white hover:bg-primary/90 hover:text-white text-black font-bold text-lg px-8 h-14 rounded-full">
      BOOK REPAIR NOW <ArrowRight className="w-5 h-5 ml-2" />
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <CtaButton />
        </SheetTrigger>
        <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-2xl">
            <AllServicesSheet />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Link href="/#services">
      <CtaButton />
    </Link>
  );
}
