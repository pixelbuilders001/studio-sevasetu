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
          className="bg-white hover:bg-white/90 text-[#1e1b4b] font-black text-sm md:text-md px-6 py-2.5 h-auto rounded-full shadow-2xl transition-all flex items-center gap-4 group active:scale-95"
        >
          <span className="ml-2 uppercase tracking-tight">BOOK REPAIR NOW</span>
          <span className="w-10 h-10 bg-[#6366f1] rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] flex flex-col rounded-t-3xl md:h-[80vh] md:max-w-3xl md:mx-auto md:rounded-3xl md:bottom-10 md:inset-x-10 border-none shadow-2xl overflow-hidden p-0"
      >
        <AllServicesSheet />
      </SheetContent>
    </Sheet>
  );
}
