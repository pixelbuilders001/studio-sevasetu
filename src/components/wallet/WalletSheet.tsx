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
import { useAuth } from '@/context/AuthContext';
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
    const { session } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);
    const [mobileNumber, setMobileNumber] = useState<string>(''); // Needed for distinct TransactionHistorySheet if it requires it
    const [isMobile, setIsMobile] = useState(false);

    const { toast } = useToast();

    // Check Mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


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
                side={isMobile ? "bottom" : "right"}
                className={cn(
                    "flex flex-col p-0 overflow-hidden bg-white dark:bg-card",
                    isMobile ? "h-[90vh] rounded-t-[2.5rem] animate-in slide-in-from-bottom duration-500" : "w-full md:max-w-md h-full animate-in slide-in-from-right duration-300"
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle className="text-left font-black text-xl text-[#1e1b4b]">
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
                            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0 rounded-3xl shadow-xl overflow-hidden relative">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium opacity-80 uppercase tracking-tight">Total Balance</p>
                                            <div className="flex items-center text-3xl md:text-4xl font-black">
                                                <IndianRupee className="w-6 h-6 md:w-8 md:h-8 -ml-1" strokeWidth={3} />
                                                <span>{balance ?? 0}</span>
                                            </div>
                                        </div>
                                        <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                            <Wallet className="w-5 h-5 text-white/90" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Refer & Earn Card */}
                            {referralCode && (
                                <Card className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl shadow-sm overflow-hidden group">
                                    <CardContent className="p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-indigo-50 p-1.5">
                                                <div className="text-xl">🎁</div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-indigo-950">Refer & Earn <IndianRupee className="inline w-3 h-3 mb-0.5" />50</h3>
                                                <p className="text-[10px] text-indigo-900/60 font-medium">For every friend who books their first service.</p>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] px-3 py-2 rounded-lg h-auto shadow-md active:scale-95 transition-all uppercase tracking-wide"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: 'Refer & Earn',
                                                        text: `Use my referral code ${referralCode} to get ₹50 off!`,
                                                        url: 'https://hellofixo.com'
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
                                    <h2 className="font-black text-base text-[#1e1b4b]">Recent Transactions</h2>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="link" className="text-indigo-600 font-bold h-auto p-0 text-sm no-underline hover:text-indigo-700">See All</Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-3xl p-0 overflow-hidden">
                                            <div className="px-6 py-6 border-b flex justify-between items-center">
                                                <h2 className="text-lg font-black text-[#1e1b4b]">Transaction History</h2>
                                            </div>
                                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                                <TransactionHistorySheet />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <div className="space-y-3">
                                    {recentTransaction ? (
                                        <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:bg-gray-50/50 transition-colors">
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        recentTransaction.type === 'credit' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                    )}>
                                                        {recentTransaction.type === 'credit' ? (
                                                            <ArrowDownLeft className="w-4 h-4" />
                                                        ) : (
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-[#1e1b4b] capitalize leading-none mb-1 text-sm">{recentTransaction.source}</p>
                                                        <p className="text-[10px] text-[#1e1b4b]/40 font-bold uppercase tracking-wider">
                                                            {format(new Date(recentTransaction.created_at), 'dd MMM, hh:mm a')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={cn(
                                                            "font-black text-base flex items-center justify-end",
                                                            recentTransaction.type === 'credit' ? "text-green-600" : "text-black"
                                                        )}>
                                                            {recentTransaction.type === 'credit' ? '+' : '-'}
                                                            <IndianRupee className="w-3 h-3" />
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
