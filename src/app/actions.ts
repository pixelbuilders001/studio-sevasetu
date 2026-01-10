
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/types';
import { getTranslations } from '@/lib/get-translation';
import { subDays, format } from 'date-fns';
import { CloudCog } from 'lucide-react';
import type { RepairQuote } from '@/lib/types/booking';


export async function trackBooking(prevState: any, formData: FormData): Promise<{ history?: { status: string; date: string }[]; error?: string; }> {
  const orderId = formData.get('order_id');
  const lang = (formData.get('lang') as string) || 'en';
  const t = getTranslations(lang);

  const OrderIdSchema = z.string().min(1, { message: 'Order ID cannot be empty.' });
  const validation = OrderIdSchema.safeParse(orderId);

  if (!validation.success) {
    return { error: validation.error.flatten().formErrors[0] };
  }

  try {
    const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/booking_status_history?order_id=eq.${orderId}&select=order_id,status,note,created_at`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return { error: errorData.message || 'Failed to fetch booking status.' };
    }

    const historyData = await response.json();

    if (!historyData || historyData.length === 0) {
      return { error: t('bookingNotFound') };
    }

    const dateFormat = "MMM d, yyyy 'at' h:mm a";
    const history = historyData.map((item: any) => ({
      status: item.status,
      date: format(new Date(item.created_at), dateFormat),
      note: item.note,
    }));

    return { history };

  } catch (error) {
    console.error('Tracking failed:', error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { error: errorMessage };
  }
}

export async function bookService(
  categoryId: string,
  problemIds: string,
  pincode: string | undefined,
  referralCode: string | undefined,
  total_estimated_price: number,
  net_inspection_fee: number,
  prevState: any,
  formData: FormData
): Promise<{ message: string, error?: string, bookingId?: string, referralCode?: string }> {

  const payload = new FormData();

  // Extract all fields from the original form data
  for (const [key, value] of formData.entries()) {
    payload.append(key, value);
  }

  // Append/overwrite data from function arguments for security and consistency
  payload.set('category_id', categoryId);

  const issueIds = problemIds.split(',');
  if (issueIds.length > 0) {
    payload.set('issue_id', issueIds[0]);
  } else if (payload.has('issue_id')) {
    payload.delete('issue_id');
  }

  if (pincode) {
    payload.set('pincode', pincode);
  }

    // The `referralCode` argument is the verified code from the `bind` call.
    // It should be prioritized.
    if (referralCode) {
        payload.set('referral_code', referralCode);
    } else {
        // If no verified code, check for a code typed in the form.
        const formReferralCode = payload.get('referral_code');
        if (!formReferralCode || typeof formReferralCode !== 'string' || !formReferralCode.trim()) {
            // If the form field is empty or missing, ensure it's not in the payload.
            payload.delete('referral_code');
        }
        // If a code was typed but not verified, it will be sent as is.
    }


  // Add new pricing fields
  payload.set('total_estimated_price', total_estimated_price.toString());
  payload.set('net_inspection_fee', net_inspection_fee.toString());
  payload.set('final_amount_paid', '');
  payload.set('final_amount_to_be_paid', '');


  try {
    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
      },
      body: payload,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('API Error:', result);
      return { message: "Error", error: result.error_message || result.message || "An unexpected error occurred." };
    }

    const bookingId = result.order_id || result.bookingId || `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    const myReferralCode = result.my_referral_code;
    return { message: "Success", bookingId, referralCode: myReferralCode };


  } catch (error) {
    console.error('Booking failed:', error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { message: "Error", error: errorMessage };
  }
}


export async function acceptQuote(quote: RepairQuote & { booking_id: string }) {
  try {
    const commonHeaders = {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    // 1. Update the repair_quotes table
    const quoteUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/repair_quotes?id=eq.${quote.id}`, {
      method: 'PATCH',
      headers: {
        ...commonHeaders,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        status: 'quotation_approved',
        final_amount_to_be_paid: quote.total_amount
      }),
    });

    if (!quoteUpdateResponse.ok) {
      const errorData = await quoteUpdateResponse.json();
      throw new Error(errorData.message || 'Failed to update quote status.');
    }

    // 2. Update the booking table with final amount and accepted_at
    const bookingUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking?id=eq.${quote.booking_id}`, {
      method: 'PATCH',
      headers: {
        ...commonHeaders,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        final_amount_to_be_paid: quote.total_amount,
        accepted_at: new Date().toISOString()
      }),
    });

    if (!bookingUpdateResponse.ok) {
      const errorData = await bookingUpdateResponse.json();
      throw new Error(errorData.message || 'Failed to update booking with final amount.');
    }


    // 2. Update the job status
    const jobStatusResponse = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/update-job-status', {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        booking_id: quote.booking_id,
        status: 'quotation_approved',
        note: 'Customer has approved the quotation.',
        order_id: "",
        final_amount_to_be_paid: quote.total_amount
      }),
    });

    if (!jobStatusResponse.ok) {
      const errorData = await jobStatusResponse.json();
      throw new Error(errorData.message || 'Failed to update job status.');
    }

    return { success: true, final_amount_to_be_paid: quote.total_amount };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}

export async function rejectQuote(quote: RepairQuote & { booking_id: string }) {
  try {
    const commonHeaders = {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    // 1. Update the repair_quotes table
    const quoteUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/repair_quotes?id=eq.${quote.id}`, {
      method: 'PATCH',
      headers: {
        ...commonHeaders,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ status: 'quotation_rejected' }),
    });

    if (!quoteUpdateResponse.ok) {
      const errorData = await quoteUpdateResponse.json();
      throw new Error(errorData.message || 'Failed to update quote status.');
    }

    // 2. Update the job status
    const jobStatusResponse = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/update-job-status', {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        booking_id: quote.booking_id,
        status: 'quotation_rejected',
        note: 'Customer has rejected the quotation.'
      }),
    });

    if (!jobStatusResponse.ok) {
      const errorData = await jobStatusResponse.json();
      throw new Error(errorData.message || 'Failed to update job status.');
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}
