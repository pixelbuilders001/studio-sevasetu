'use client';

import AllServicesSheet from './AllServicesSheet';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';

export default function HeroCTA() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="bg-white hover:bg-primary/90 hover:text-white text-black font-bold text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          BOOK REPAIR NOW <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-full max-h-[90vh] flex flex-col rounded-t-3xl border-none shadow-2xl overflow-hidden p-0">
        <AllServicesSheet />
      </SheetContent>
    </Sheet>
  );
}
