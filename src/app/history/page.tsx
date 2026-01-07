
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AirVent, Laptop, Calendar, Clock, Download, Tag, Phone, ArrowRight, Loader2, XCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import QuotationModal from '@/components/QuotationModal';

const iconMap: { [key: string]: React.ElementType } = {
  'MOBILE PHONES': Laptop, // Assuming smartphone, but Laptop icon is there
  'AC': AirVent,
  'LAPTOP': Laptop,
  // Add other mappings as needed
};

export type RepairQuote = {
  id: string;
  labor_cost: number;
  parts_cost: number;
  total_amount: number;
  notes: string;
  status: string;
};

export type Booking = {
  id: string;
  order_id: string;
  status: string;
  created_at: string;
  media_url: string | null;
  categories: {
    id: string;
    name: string;
  };
  issues: {
    id: string;
    title: string;
  };
  repair_quotes: RepairQuote[];
};

const StatusBadge = ({ status }: { status: string }) => {
  const isCompleted = status.toLowerCase() === 'completed';
  const isCancelled = status.toLowerCase() === 'cancelled';
  const isQuotationShared = status.toLowerCase() === 'quotation_shared';
  
  let variantClass = 'bg-yellow-100 text-yellow-700 border-yellow-300'; // Default for in-progress
  let Icon = Clock;

  if (isCompleted) {
    variantClass = 'bg-green-100 text-green-700 border-green-300';
    Icon = CheckCircle;
  } else if (isCancelled) {
     variantClass = 'bg-red-100 text-red-700 border-red-300';
     Icon = XCircle;
  } else if (isQuotationShared) {
    variantClass = 'bg-blue-100 text-blue-700 border-blue-300';
    Icon = Clock; // Or another icon
  }

  return (
    <Badge
      variant="outline"
      className={cn('font-bold capitalize', variantClass)}
    >
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};


export default function BookingHistoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<RepairQuote | null>(null);

  const handleContinue = async () => {
    if (!mobileNumber.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
        const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/booking?mobile_number=eq.${mobileNumber}&select=id,order_id,status,created_at,media_url,categories(id,name),issues(id,title),repair_quotes(*)&order=created_at.desc`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch booking history.');
        }
        
        const data = await response.json();
        setBookingHistory(data);
        setIsAuthenticated(true);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleQuoteStatusChange = (bookingId: string, newStatus: 'in-progress' | 'cancelled') => {
    setBookingHistory(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    setSelectedQuote(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-muted/30 flex items-center justify-center" style={{ height: 'calc(100vh - 5rem)' }}>
        <div className="container mx-auto px-4 max-w-sm">
          <Card className="rounded-2xl shadow-lg border-0">
            <CardContent className="px-6 pt-6 pb-6">
              <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold">View History</h1>
                  <p className="text-muted-foreground">Enter your mobile number to see past bookings.</p>
              </div>
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
    <>
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold font-headline">Booking History</h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            YOUR PAST SERVICE RECORDS
          </p>
        </header>

        {bookingHistory.length > 0 ? (
          <div className="space-y-6">
            {bookingHistory.map((booking) => {
              const ServiceIcon = iconMap[booking.categories.name] || Laptop;
              const isQuotationShared = booking.status.toLowerCase() === 'quotation_shared';
              const quote = booking.repair_quotes?.[0];

              return (
                <Card key={booking.id} className="rounded-2xl shadow-md border-0 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                          <ServiceIcon className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">ID: {booking.order_id}</p>
                          <h2 className="text-lg font-bold capitalize">{booking.categories.name.toLowerCase()}</h2>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(booking.created_at), 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{format(new Date(booking.created_at), 'hh:mm a')}</span>
                        </div>
                    </div>

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                          <Tag className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <div>
                              <p className="text-xs text-muted-foreground">ISSUE</p>
                              <p className="font-semibold">{booking.issues.title}</p>
                          </div>
                      </div>
                      {booking.media_url && (
                          <Dialog>
                            <DialogTrigger asChild>
                               <div className="flex-shrink-0 w-16 h-16 cursor-pointer">
                                  <Image
                                      src={booking.media_url}
                                      alt="Issue photo"
                                      width={64}
                                      height={64}
                                      className="rounded-lg object-cover w-full h-full border"
                                  />
                                </div>
                            </DialogTrigger>
                             <DialogContent className="p-0 border-0 max-w-lg">
                                <Image
                                    src={booking.media_url}
                                    alt="Issue photo"
                                    width={800}
                                    height={800}
                                    className="rounded-lg object-contain w-full h-full"
                                />
                            </DialogContent>
                          </Dialog>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {isQuotationShared && quote ? (
                       <Button onClick={() => setSelectedQuote({ ...quote, booking_id: booking.id })} className="w-full font-semibold">
                          Open Quotation
                       </Button>
                    ) : (
                       <Button variant="ghost" size="sm" className="w-full font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No booking history found for this mobile number.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    
    {selectedQuote && (
        <QuotationModal
          quote={{...selectedQuote, booking_id: (selectedQuote as any).booking_id}}
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onStatusChange={handleQuoteStatusChange}
        />
      )}
    </>
  );
}
