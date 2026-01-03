
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { History, Wallet, Sparkles, ArrowUpRight, ArrowDownLeft, Gift, Copy, Share2, IndianRupee, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import TransactionHistorySheet from '@/components/TransactionHistorySheet';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

type Transaction = {
    type: 'credit' | 'debit';
    source: string;
    note: string;
    created_at: string;
    amount: number;
}

const WalletPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  const handleContinue = async () => {
    if (!mobileNumber.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const headers = {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      };

      const walletResponse = fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/wallets?mobile_number=eq.${mobileNumber}&select=mobile_number,balance`, { headers });
      const historyResponse = fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/wallet_transactions?mobile_number=eq.${mobileNumber}&select=type,source,note,created_at,amount&order=created_at.desc&limit=1`, { headers });
      const referralResponse = fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/referral_codes?mobile_number=eq.${mobileNumber}&select=referral_code`, { headers });

      const [walletRes, historyRes, referralRes] = await Promise.all([walletResponse, historyResponse, referralResponse]);

      if (!walletRes.ok) {
        throw new Error('Failed to fetch wallet details.');
      }
       if (!historyRes.ok) {
        // Don't throw, just log. History isn't critical.
        console.error('Failed to fetch recent transaction.');
      }
      if (!referralRes.ok) {
        console.error('Failed to fetch referral code.');
      }

      const walletData = await walletRes.json();
      const historyData = await historyRes.json();
      const referralData = await referralRes.json();

      if (walletData && walletData.length > 0) {
        setBalance(walletData[0].balance);
        setIsAuthenticated(true);
      } else {
        setError('No wallet found for this mobile number.');
        return; // Exit if no wallet
      }

      if (historyData && historyData.length > 0) {
        setRecentTransaction(historyData[0]);
      } else {
        setRecentTransaction(null);
      }

      if (referralData && referralData.length > 0) {
        setReferralCode(referralData[0].referral_code);
      } else {
        setReferralCode(null);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
       <div className="bg-muted/30 h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-sm">
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Access Your Wallet</CardTitle>
              <CardDescription>Please enter your mobile number to continue</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <Input
                  icon={Phone}
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="h-14 text-lg text-center tracking-widest"
                />
                {error && <p className="text-sm text-center text-destructive">{error}</p>}
                <Button onClick={handleContinue} size="lg" disabled={isLoading} className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                  {!isLoading && <ArrowRight className="ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="mb-6">
          <h1 className="text-3xl font-bold font-headline">Your Wallet</h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Use this balance for your next booking</p>
        </header>

        <Card className="bg-gray-900 dark:bg-gray-800 text-white border-0 rounded-3xl shadow-2xl mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Wallet className="w-5 h-5" />
              <span>TOTAL BALANCE</span>
            </div>
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-bold flex items-center"><IndianRupee className="w-9 h-9" />{balance ?? 0}</span>
              <span className="text-lg font-semibold text-gray-400 ml-2">POINTS</span>
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
           <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm uppercase flex items-center gap-2 text-muted-foreground tracking-wider"><History className="w-5 h-5"/>Recent History</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="link" className="text-primary font-bold h-auto p-0">VIEW ALL</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-2xl">
                 <TransactionHistorySheet mobileNumber={mobileNumber} />
              </SheetContent>
            </Sheet>
          </div>
          <Card className="rounded-2xl shadow-sm">
             {recentTransaction ? (
                <CardContent className="p-4">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-xl mr-4 ${recentTransaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {recentTransaction.type === 'credit' ? (
                                <ArrowUpRight className="w-6 h-6 text-green-600" />
                            ) : (
                                <ArrowDownLeft className="w-6 h-6 text-red-600" />
                            )}
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold capitalize">{recentTransaction.source}</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(recentTransaction.created_at), 'MMM d, yyyy')}</p>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold flex items-center justify-end ${recentTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                <span className="text-lg">{recentTransaction.type === 'credit' ? '+' : '-'}</span>
                                <IndianRupee className="w-4 h-4" />{recentTransaction.amount || 0}
                            </p>
                            <p className="text-xs font-semibold text-green-500/80 uppercase">Success</p>
                        </div>
                    </div>
                </CardContent>
             ) : (
                <CardContent className="p-4 text-center text-muted-foreground">
                    No recent history.
                </CardContent>
             )}
          </Card>
        </section>

        {referralCode && (
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
                        <span className="font-mono font-bold text-lg ml-2 tracking-widest">{referralCode}</span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-white/90 text-indigo-600 hover:bg-white rounded-lg h-9 w-9"
                                onClick={() => handleCopy(referralCode)}
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
        )}

      </div>
    </div>
  );
};

export default WalletPage;


    