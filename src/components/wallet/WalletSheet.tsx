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
import WalletLoader from './WalletLoader';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import UserAuthSheet from '@/components/UserAuthSheet';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getWalletBalance, getReferralCode, getWalletTransactions } from '@/app/actions';
import TransactionHistorySheet from '@/components/TransactionHistorySheet';
import { cn } from '@/lib/utils';

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
        const getInitialSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            if (user) {
                console.log('WalletSheet current user:', user.email);
            }
        };
        getInitialSession();

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
                    <SheetTitle className="text-left font-black text-2xl text-[#1e1b4b]">
                        My Wallet
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4">
                    {!session ? (
                        <div className="h-full flex flex-col justify-center">
                            <UserAuthSheet setSheetOpen={() => { }} />
                        </div>
                    ) : isLoading ? (
                        <WalletLoader message="Fetching Balance" />
                    ) : (
                        <div className="space-y-6 max-w-md mx-auto">

                            {/* Balance Card */}
                            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0 rounded-[2rem] shadow-xl overflow-hidden relative">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium opacity-80 uppercase tracking-tight">Total Balance</p>
                                            <div className="flex items-center text-4xl md:text-5xl font-black">
                                                <IndianRupee className="w-8 h-8 md:w-10 md:h-10 -ml-1" strokeWidth={3} />
                                                <span>{balance ?? 0}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                            <Wallet className="w-6 h-6 text-white/90" />
                                        </div>
                                    </div>
                                    {/* Add Money Button Removed as per request */}
                                </CardContent>
                            </Card>

                            {/* Refer & Earn Card */}
                            {referralCode && (
                                <Card className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-[2rem] shadow-sm overflow-hidden group">
                                    <CardContent className="p-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-indigo-50 p-2">
                                                <div className="text-3xl">🎁</div>
                                            </div>
                                            <div>
                                                <h3 className="text-md font-black text-indigo-950">Refer & Earn <IndianRupee className="inline w-4 h-4 mb-1" />50</h3>
                                                <p className="text-xs text-indigo-900/60 font-medium">For every friend who books their first service with us, you get</p>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl h-auto shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: 'Refer & Earn',
                                                        text: `Use my referral code ${referralCode} to get ₹50 off!`,
                                                        url: 'https://sevasetu.com'
                                                    })
                                                } else {
                                                    handleCopy(referralCode)
                                                }
                                            }}
                                        >
                                            Invite
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recent Transactions Section */}
                            <section>
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <h2 className="font-black text-lg text-[#1e1b4b]">Recent Transactions</h2>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="link" className="text-indigo-600 font-bold h-auto p-0 text-sm no-underline hover:text-indigo-700">See All</Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-3xl p-0 overflow-hidden">
                                            <div className="px-6 py-6 border-b flex justify-between items-center">
                                                <h2 className="text-xl font-black text-[#1e1b4b]">Transaction History</h2>
                                            </div>
                                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                                <TransactionHistorySheet />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <div className="space-y-3">
                                    {recentTransaction ? (
                                        <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:bg-gray-50/50 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center",
                                                        recentTransaction.type === 'credit' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                    )}>
                                                        {recentTransaction.type === 'credit' ? (
                                                            <ArrowDownLeft className="w-5 h-5" />
                                                        ) : (
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-[#1e1b4b] capitalize leading-none mb-1">{recentTransaction.source}</p>
                                                        <p className="text-[11px] text-[#1e1b4b]/40 font-bold uppercase tracking-wider">
                                                            {format(new Date(recentTransaction.created_at), 'dd MMM, hh:mm a')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={cn(
                                                            "font-black text-lg flex items-center justify-end",
                                                            recentTransaction.type === 'credit' ? "text-green-600" : "text-black"
                                                        )}>
                                                            {recentTransaction.type === 'credit' ? '+' : '-'}
                                                            <IndianRupee className="w-4 h-4" />
                                                            {recentTransaction.amount || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-3xl">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <History className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-bold">No transactions yet</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
