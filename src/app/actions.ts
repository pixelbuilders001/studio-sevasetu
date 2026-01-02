
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/types';
import { getTranslations } from '@/lib/get-translation';
import { subDays, format } from 'date-fns';


export async function trackBooking(prevState: any, formData: FormData): Promise<{ history?: { status: string; date: string }[]; error?: string; } > {
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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
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
  prevState: any, 
  formData: FormData
): Promise<{ message: string, error?: string, bookingId?: string }> {
  
  // Append additional data to formData
  formData.append('category_id', categoryId);
  const issueIds = problemIds.split(',');
  if (issueIds.length > 0) {
      formData.append('issue_id', issueIds[0]);
  }
  if (pincode) {
      formData.append('pincode', pincode);
  }

  try {
    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('API Error:', result);
        return { message: "Error", error: result.error_message || result.message || "An unexpected error occurred." };
    }

    const bookingId = result.order_id || result.bookingId || `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Instead of redirecting here, we return the bookingId
    return { message: "Success", bookingId };
    
  } catch (error) {
      console.error('Booking failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      return { message: "Error", error: errorMessage };
  }
}

export async function registerPartner(prevState: any, formData: FormData): Promise<{ message: string, error?: string }> {
  try {
    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/create-technician', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2FmaHRpZGl3c2lod2lqd2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MjYyNjUsImV4cCI6MjAzNjEwMjI2NX0.0_2p5B0a3O-j1h-a2yA9Ier3a8LVi-Sg3O_2M6CqTOc',
        },
        body: formData,
    });

    if (!response.ok) {
        const result = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Partner Registration API Error:', result);
        return { message: "Error", error: result.error_message || result.message || `An unexpected error occurred. Status: ${response.status}` };
    }

  } catch (error) {
      console.error('Partner Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      return { message: "Error", error: errorMessage };
  }
  
  redirect('/partner/success');
}

    