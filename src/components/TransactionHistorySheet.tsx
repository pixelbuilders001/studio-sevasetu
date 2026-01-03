
'use client';
import {
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, IndianRupee } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const transactions = [
    { type: 'credit', title: 'Welcome Bonus', date: 'Jul 20, 2024', amount: 250, status: 'Success' },
    { type: 'debit', title: 'AC Service', date: 'Jul 18, 2024', amount: 50, status: 'Success' },
    { type: 'credit', title: 'Referral: Rohan', date: 'Jul 15, 2024', amount: 100, status: 'Success' },
    { type: 'debit', title: 'Mobile Repair', date: 'Jul 12, 2024', amount: 50, status: 'Success' },
    { type: 'credit', title: 'Referral: Priya', date: 'Jul 10, 2024', amount: 100, status: 'Success' },
    { type: 'credit', title: 'Cashback Offer', date: 'Jul 5, 2024', amount: 25, status: 'Success' },
    { type: 'debit', title: 'Laptop Service', date: 'Jul 1, 2024', amount: 50, status: 'Success' },
];

export default function TransactionHistorySheet() {

    return (
        <>
            <SheetHeader>
                <SheetTitle>All Transactions</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-grow -mx-6 px-6">
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
                                        <p className="font-bold">{transaction.title}</p>
                                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold flex items-center justify-end ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            <span className="text-lg">{transaction.type === 'credit' ? '+' : '-'}</span>
                                            <IndianRupee className="w-4 h-4" />{transaction.amount}
                                        </p>
                                        <p className="text-xs font-semibold text-green-500/80 uppercase">{transaction.status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </>
    )
}
