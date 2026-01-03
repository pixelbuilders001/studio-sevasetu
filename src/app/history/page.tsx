
'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Calendar, Clock, User, Download, IndianRupee, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const bookingHistory = [
  {
    id: 'SV-77102',
    service: 'AC Service',
    icon: AirVent,
    iconUrl: 'https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ac-icon.png',
    date: '15 Oct 2023',
    time: '02:00 PM',
    technician: 'Suresh Singh',
    bill: 499,
    status: 'Completed',
  },
  {
    id: 'SV-66504',
    service: 'Laptop Repair',
    icon: Laptop,
    iconUrl: 'https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/laptop-icon.png',
    date: '02 Sep 2023',
    time: '10:00 AM',
    technician: 'Amit Verma',
    bill: 0,
    status: 'Cancelled',
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isCompleted = status === 'Completed';
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-bold',
        isCompleted
          ? 'bg-green-100 text-green-700 border-green-300'
          : 'bg-red-100 text-red-700 border-red-300'
      )}
    >
      {isCompleted ? <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> : <XCircle className="mr-1.5 h-3.5 w-3.5" />}
      {status}
    </Badge>
  );
};


export default function BookingHistoryPage() {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline">Booking History</h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            YOUR PAST SERVICE RECORDS
          </p>
        </header>

        <div className="space-y-6">
          {bookingHistory.map((booking) => (
            <Card key={booking.id} className="rounded-2xl shadow-md border-0 overflow-hidden">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                     <div className="bg-primary/10 p-3 rounded-xl">
                        <booking.icon className="h-7 w-7 text-primary" />
                     </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">ID: {booking.id}</p>
                      <h2 className="text-lg font-bold">{booking.service}</h2>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">TECHNICIAN</p>
                            <p className="font-semibold">{booking.technician}</p>
                        </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-muted-foreground">FINAL BILL</p>
                       <p className="font-bold text-lg flex items-center justify-end"><IndianRupee className="w-4 h-4" />{booking.bill}</p>
                    </div>
                </div>

                {booking.status === 'Completed' && (
                  <Button variant="outline" className="w-full h-12 text-base font-bold text-primary border-primary/50 hover:bg-primary/5 hover:text-primary">
                    <Download className="mr-2 h-5 w-5" />
                    DOWNLOAD INVOICE
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
