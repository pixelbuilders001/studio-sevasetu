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
                                <Card className="bg-primary text-primary-foreground border-0 rounded-3xl shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2 mb-1 opacity-90">
                                                    <Wallet className="w-4 h-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Available Balance</span>
                                                </div>
                                                <div className="flex items-center text-3xl font-black tracking-tight">
                                                    <IndianRupee className="w-6 h-6 -ml-0.5" strokeWidth={3} />
                                                    <span>{balance}</span>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm">
                                                <IndianRupee className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Refer & Earn Card */}
                                {/* {referralCode && (
                                    <Card className="bg-indigo-50 border border-indigo-100 rounded-3xl overflow-hidden relative">
                                        <CardContent className="p-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-indigo-100 flex-shrink-0">
                                                    <Gift className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-xs font-black text-indigo-950 truncate">Refer & Earn ₹50</h3>
                                                    <p className="text-[9px] text-indigo-600/80 font-bold truncate">Code: <span className="text-indigo-700 bg-indigo-100 px-1 py-0.5 rounded ml-0.5">{referralCode}</span></p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-lg bg-white border border-indigo-100 shadow-sm hover:bg-indigo-50"
                                                onClick={() => handleCopy(referralCode)}
                                            >
                                                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )} */}

                                {/* Recent Transactions */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <h2 className="font-black text-sm text-[#1e1b4b]">Recent Activity</h2>
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="link" className="text-primary font-bold h-auto p-0 text-[10px] no-underline hover:opacity-80">View All</Button>
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
