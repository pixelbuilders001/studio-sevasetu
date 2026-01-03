
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { History, Wallet, Sparkles, ArrowUpRight, Gift, Copy, Share2, IndianRupee } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const WalletPage = () => {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="mb-6">
          <h1 className="text-3xl font-bold font-headline">Your Wallet</h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your earnings on referrals</p>
        </header>

        <Card className="bg-gray-900 dark:bg-gray-800 text-white border-0 rounded-3xl shadow-2xl mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Wallet className="w-5 h-5" />
              <span>TOTAL BALANCE</span>
            </div>
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-bold flex items-center"><IndianRupee className="w-9 h-9" />250</span>
              <span className="text-lg font-semibold text-gray-400 ml-2">POINTS</span>
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm uppercase flex items-center gap-2 text-muted-foreground tracking-wider"><History className="w-5 h-5"/>Recent History</h2>
            <Button variant="link" className="text-primary font-bold h-auto p-0">VIEW ALL</Button>
          </div>
          <Card className="rounded-2xl shadow-sm">
             <CardContent className="p-4">
               <div className="flex items-center">
                 <div className="p-3 bg-green-100 rounded-xl mr-4">
                    <ArrowUpRight className="w-6 h-6 text-green-600" />
                 </div>
                 <div className="flex-grow">
                    <p className="font-bold">Welcome Bonus</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-green-600 flex items-center justify-end"><span className="text-lg">+</span><IndianRupee className="w-4 h-4" />250</p>
                    <p className="text-xs font-semibold text-green-500/80 uppercase">Success</p>
                 </div>
               </div>
             </CardContent>
          </Card>
        </section>

        <Card className="bg-indigo-600 text-white border-0 rounded-3xl shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Gift className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Refer & Earn <IndianRupee className="inline w-5 h-5" />100</h3>
                        <p className="text-sm opacity-80">For every friend who books their first repair</p>
                    </div>
                </div>
                <div className="bg-white/10 p-2 rounded-xl flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-lg ml-2 tracking-widest">SEVA100</span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/90 text-indigo-600 hover:bg-white rounded-lg h-9 w-9"
                            onClick={() => handleCopy('SEVA100')}
                        >
                            <Copy className="w-5 h-5" />
                        </Button>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/20 text-white hover:bg-white/30 rounded-lg h-9 w-9"
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default WalletPage;
