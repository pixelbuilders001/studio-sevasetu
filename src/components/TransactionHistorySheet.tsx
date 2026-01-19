
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
                            <Card key={index} className="rounded-2xl shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-xl mr-4 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {transaction.type === 'credit' ? (
                                                <ArrowUpRight className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <ArrowDownLeft className="w-6 h-6 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold capitalize">{transaction.source}</p>
                                            <p className="text-sm text-muted-foreground">{transaction.note}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold flex items-center justify-end ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className="text-lg">{transaction.type === 'credit' ? '+' : '-'}</span>
                                                <IndianRupee className="w-4 h-4" />{transaction.amount || 0}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(transaction.created_at), 'MMM d, yyyy')}</p>
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
