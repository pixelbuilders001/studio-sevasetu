
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/types';
import { getTranslations } from '@/lib/get-translation';
import { subDays, format } from 'date-fns';


export async function trackBooking(prevState: any, formData: FormData): Promise<{ history?: { status: string; date: string }[]; error?: string; } > {
  const phone = formData.get('phone');
  const lang = (formData.get('lang') as string) || 'en';
  const t = getTranslations(lang);

  const PhoneSchema = z.string().regex(/^(\+91)?[6-9]\d{9}$/, { message: t('validation.mobile.regex') });
  const validation = PhoneSchema.safeParse(phone);

  if (!validation.success) {
    return { error: validation.error.flatten().formErrors[0] };
  }

  // This is a simulation. In a real app, you'd query your database.
  const now = new Date();
  const dateFormat = "MMM d, yyyy 'at' h:mm a";
  const statuses = [
    { status: t('statusBooked'), date: format(subDays(now, 2), dateFormat)},
    { status: t('statusTechnicianAssigned'), date: format(subDays(now, 1), dateFormat)},
    { status: t('statusInProgress'), date: format(now, dateFormat)},
    { status: t('statusCompleted'), date: format(now, dateFormat)},
  ];
  const lastDigit = parseInt((phone as string).slice(-1));

  if (lastDigit < 8) { // Simulate found booking
    const statusIndex = lastDigit % statuses.length;
    const history = statuses.slice(0, statusIndex + 1);
    return { history };
  } else { // Simulate not found
    return { error: t('bookingNotFound') };
  }
}

export async function bookService(prevState: any, formData: FormData): Promise<{ message: string, error?: string, bookingId?: string }> {
  try {
    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
            'apikey': 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('API Error:', result);
        return { message: "Error", error: result.message || "An unexpected error occurred." };
    }

    const bookingId = result.bookingId || `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    redirect(`/confirmation?bookingId=${bookingId}`);
    
  } catch (error) {
      console.error('Booking failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      return { message: "Error", error: errorMessage };
  }
}
