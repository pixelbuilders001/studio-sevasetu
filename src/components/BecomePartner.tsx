'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Briefcase, Zap, Clock, TrendingUp, Wallet } from 'lucide-react';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function BecomePartner() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  return (
    <section className="py-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative bg-black text-white rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/partner-on-scooter.png"
              alt="SevaSetu Partner"
              fill
              className="object-cover opacity-40 md:opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12 text-center w-full max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold tracking-wider uppercase">Join Our Fleet</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4 leading-tight">
              Earn Big with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">SevaSetu</span>
            </h2>

            <p className="text-slate-300 mb-10 max-w-lg mx-auto text-lg drop-shadow-md">
              Join the fastest growing service network. Be your own boss and start earning today.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-20">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-black/60 transition-colors">
                <Wallet className="w-8 h-8 text-green-400 mb-2" />
                <span className="font-bold text-xl">₹40k+</span>
                <span className="text-xs text-slate-400">Monthly Earnings</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-black/60 transition-colors">
                <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                <span className="font-bold text-xl">Daily</span>
                <span className="text-xs text-slate-400">Payouts</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-black/60 transition-colors">
                <Clock className="w-8 h-8 text-blue-400 mb-2" />
                <span className="font-bold text-xl">Flexible</span>
                <span className="text-xs text-slate-400">Timings</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-black/60 transition-colors">
                <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
                <span className="font-bold text-xl">Zero</span>
                <span className="text-xs text-slate-400">Joining Fee</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full md:w-auto bg-white text-black hover:bg-slate-200 font-bold text-lg h-14 rounded-full px-10 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 relative z-20"
              onClick={() => {
                setIsNavigating(true);
                setTimeout(() => router.push('/partner/register'), 800);
              }}
            >
              Register as Partner
            </Button>

            {isNavigating && <FullScreenLoader />}
          </div>
        </div>
      </div>
    </section>
  );
}

