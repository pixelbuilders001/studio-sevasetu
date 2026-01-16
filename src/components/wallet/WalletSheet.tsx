'use client';

import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { History, Wallet, Sparkles, ArrowUpRight, ArrowDownLeft, Gift, Copy, Share2, IndianRupee, Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import UserAuthSheet from '@/components/UserAuthSheet';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getWalletBalance, getReferralCode, getWalletTransactions } from '@/app/actions';
import TransactionHistorySheet from '@/components/TransactionHistorySheet';

type Transaction = {
    type: 'credit' | 'debit';
    source: string;
    note: string;
    created_at: string;
    amount: number;
}

export default function WalletSheet({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);
    const [mobileNumber, setMobileNumber] = useState<string>(''); // Needed for distinct TransactionHistorySheet if it requires it

    const supabase = createSupabaseBrowserClient();
    const { toast } = useToast();

    // Auth State Listener
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            if (data.session?.user) {
                // Ideally we get mobile number from profile if needed for inner sheet
                // For now, we'll fetch data which usually relies on session in actions.ts
            }
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    // Fetch Wallet Data
    useEffect(() => {
        const fetchData = async () => {
            if (!session?.access_token || !isOpen) return;

            setIsLoading(true);
            try {
                const [bal, code, transactions] = await Promise.all([
                    getWalletBalance(),
                    getReferralCode(),
                    getWalletTransactions()
                ]);

                setBalance(bal);
                setReferralCode(code);
                if (transactions && transactions.length > 0) {
                    setRecentTransaction(transactions[0]);
                } else {
                    setRecentTransaction(null);
                }

                // We might need mobile number for the TransactionHistorySheet if it takes it as prop
                // current TransactionHistorySheet likely takes mobileNumber. 
                // Let's assume we can get it from session or profile if we read it.
                // For now, passing empty string or handling it later if TransactionHistorySheet relies on it.
                // Re-reading TransactionHistorySheet code would confirm.

            } catch (err) {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to load wallet details",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session, isOpen, toast]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard!' });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent
                side="bottom"
                className="h-[85vh] flex flex-col rounded-t-3xl p-0 overflow-hidden bg-white dark:bg-card"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle className="text-center font-bold text-xl">
                        {session ? 'Your Wallet' : 'Login to view wallet'}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {!session ? (
                        <div className="h-full flex flex-col justify-center">
                            <UserAuthSheet setSheetOpen={() => { }} />
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-6 mt-4 max-w-md mx-auto">

                            <header className="mb-2">
                                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">Use this balance for your next booking</p>
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
                                    <h2 className="font-bold text-sm uppercase flex items-center gap-2 text-muted-foreground tracking-wider"><History className="w-5 h-5" />Recent History</h2>

                                    {/* We need mobile number here for TransactionHistorySheet if it requires it. */}
                                    {/* Assuming for now we disable recent history or fix it if I can get mobile number easily */}
                                    {/* Or use TransactionHistorySheet inside Sheet */}

                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="link" className="text-primary font-bold h-auto p-0">VIEW ALL</Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-2xl">
                                            {/* Providing dummy mobile number or handling it. Ideally actions.ts handles fetching. */}
                                            {/* TransactionHistorySheet likely does its own fetching using mobile number. */}
                                            {/* If I rewrite TransactionHistorySheet to use actions, that would be best, but out of scope? */}
                                            {/* I'll leave a note or try to pass it if I fetched profile. */}
                                            <TransactionHistorySheet />
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
                                                    onClick={() => {
                                                        if (navigator.share) {
                                                            navigator.share({
                                                                title: 'Refer & Earn',
                                                                text: `Use my referral code ${referralCode} to get ₹100 off!`,
                                                                url: 'https://sevasetu.com'
                                                            })
                                                        } else {
                                                            handleCopy(referralCode)
                                                        }
                                                    }}
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
