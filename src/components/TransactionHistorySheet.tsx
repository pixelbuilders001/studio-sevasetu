
'use client';
import { useState, useEffect } from 'react';
import {
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, IndianRupee, Loader2, Info } from 'lucide-react';
import WalletLoader from './wallet/WalletLoader';
import { ScrollArea } from './ui/scroll-area';
import { format } from 'date-fns';

import { getWalletTransactions } from '@/app/actions';

type Transaction = {
    type: 'credit' | 'debit';
    source: string;
    note: string;
    created_at: string;
    amount: number;
}

const TransactionHistorySheet = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getWalletTransactions();
                setTransactions(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <>

            <ScrollArea className="flex-grow -mx-6 px-6">
                {loading && <WalletLoader message="Loading History" />}
                {!loading && error && (
                    <div className="flex justify-center items-center h-40">
                        <Card className="p-4 m-4 bg-destructive/10 text-destructive border-destructive/20">
                            <CardContent className="p-0 flex items-center gap-3">
                                <Info className="w-5 h-5" />
                                <div>
                                    <h3 className="font-bold">Error</h3>
                                    <p>{error}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {!loading && !error && transactions.length === 0 && (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-muted-foreground">No transactions found.</p>
                    </div>
                )}
                {!loading && !error && transactions.length > 0 && (
                    <div className="space-y-3 py-4">
                        {transactions.map((transaction, index) => (
                            <Card key={index} className="rounded-2xl shadow-sm border border-gray-100">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {transaction.type === 'credit' ? (
                                                <ArrowUpRight className="w-4 h-4" />
                                            ) : (
                                                <ArrowDownLeft className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold capitalize text-sm text-[#1e1b4b] leading-none mb-1">{transaction.source}</p>
                                            <p className="text-[10px] text-[#1e1b4b]/40 font-bold uppercase tracking-wider">{transaction.note || 'Transaction'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black text-base flex items-center justify-end ${transaction.type === 'credit' ? 'text-green-600' : 'text-black'}`}>
                                                <span>{transaction.type === 'credit' ? '+' : '-'}</span>
                                                <IndianRupee className="w-3 h-3" />{transaction.amount || 0}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(transaction.created_at), 'dd MMM, yy')}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </>
    )
}
export default TransactionHistorySheet;
