'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Wallet, History, IndianRupee, Gift, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getWalletBalance, getWalletTransactions, getReferralCode } from '@/app/actions';
import TransactionHistorySheet from '@/components/TransactionHistorySheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export function WalletModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [bal, trans, code] = await Promise.all([
                getWalletBalance(),
                getWalletTransactions(),
                getReferralCode()
            ]);
            setBalance(bal);
            setTransactions(trans || []);
            setReferralCode(code);
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to load wallet data",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Referral code copied!' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-white/20 shadow-2xl rounded-[32px]">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-[#1e1b4b]">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-indigo-600" />
                        </div>
                        My Wallet
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-6">
                    {isLoading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-32 w-full rounded-[2rem]" />
                            <Skeleton className="h-24 w-full rounded-[2rem]" />
                            <div className="space-y-3">
                                <Skeleton className="h-16 w-full rounded-2xl" />
                                <Skeleton className="h-16 w-full rounded-2xl" />
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="h-[65vh] pr-4 pt-2">
                            <div className="space-y-6">
                                {/* Balance Card */}
                                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0 rounded-[2rem] shadow-xl overflow-hidden relative">
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium opacity-80 uppercase tracking-tight">Total Balance</p>
                                                <div className="flex items-center text-5xl font-black">
                                                    <IndianRupee className="w-8 h-8 -ml-1" strokeWidth={3} />
                                                    <span>{balance}</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                                <Wallet className="w-6 h-6 text-white/90" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Refer & Earn Card */}
                                {referralCode && (
                                    <Card className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-[2rem] shadow-sm overflow-hidden">
                                        <CardContent className="p-5 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-indigo-50">
                                                    <Gift className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-indigo-950">Refer & Earn ₹50</h3>
                                                    <p className="text-[10px] text-indigo-900/60 font-bold leading-tight">Your code: <span className="text-indigo-600 uppercase">{referralCode}</span></p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-xl hover:bg-white/80"
                                                onClick={() => handleCopy(referralCode)}
                                            >
                                                <Copy className="w-4 h-4 text-indigo-600" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Recent Transactions */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <h2 className="font-black text-base text-[#1e1b4b]">Recent Activity</h2>
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="link" className="text-indigo-600 font-bold h-auto p-0 text-xs no-underline hover:text-indigo-700">SEE ALL</Button>
                                            </SheetTrigger>
                                            <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-3xl p-0 overflow-hidden">
                                                <div className="px-6 py-6 border-b flex justify-between items-center bg-white">
                                                    <SheetHeader>
                                                        <SheetTitle className="text-xl font-black text-[#1e1b4b]">Transaction History</SheetTitle>
                                                    </SheetHeader>
                                                </div>
                                                <div className="flex-1 overflow-y-auto px-6 py-4">
                                                    <TransactionHistorySheet />
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    </div>

                                    <div className="space-y-3">
                                        {transactions.slice(0, 5).map((tx, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 transition-colors">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                                    tx.type === 'credit' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                )}>
                                                    <IndianRupee className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-[#1e1b4b] truncate capitalize">{tx.source || 'Service Booking'}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {format(new Date(tx.created_at), 'dd MMM, hh:mm a')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "font-black text-sm",
                                                        tx.type === 'credit' ? "text-green-600" : "text-slate-900"
                                                    )}>
                                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {transactions.length === 0 && (
                                            <div className="text-center py-10 text-muted-foreground bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-xs font-bold text-gray-400">No transactions yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
