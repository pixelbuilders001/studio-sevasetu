'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/types';
import { getTranslations } from '@/lib/get-translation';
import { subDays, format } from 'date-fns';
import { CloudCog } from 'lucide-react';
import type { RepairQuote } from '@/lib/types/booking';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';


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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The is called from a Server Component.
          }
        },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Authentication Error:', sessionError?.message);
    return { message: "Error", error: "You must be logged in to create a booking." };
  }

  const accessToken = session.access_token;

  const payload = new FormData();

  for (const [key, value] of formData.entries()) {
    payload.append(key, value);
  }

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

  if (referralCode) {
    payload.set('referral_code', referralCode);
  } else {
    const formReferralCode = payload.get('referral_code');
    if (!formReferralCode || typeof formReferralCode !== 'string' || !formReferralCode.trim()) {
      payload.delete('referral_code');
    }
  }

  payload.set('total_estimated_price', total_estimated_price.toString());
  payload.set('net_inspection_fee', net_inspection_fee.toString());
  payload.set('final_amount_paid', '');
  payload.set('final_amount_to_be_paid', '');
  console.log(payload);
  try {
    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // 'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: payload,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('API Error:', result);
      // Enhanced error handling for row-level security violations
      if (result.code === 'PGRST116' || (result.error && result.error.includes('row-level security policy'))) {
        return { message: "Error", error: "We're unable to create your booking due to access restrictions. Please try again or contact support." };
      }
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

export async function getUserProfile() {
  try {

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error:', sessionError?.message);
      return { message: "Error", error: "You must be logged in to create a booking." };
    }

    const accessToken = session.access_token;
    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/rest/v1/profiles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store', // Ensure fresh data on every fetch
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Profile API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch user profile.');
    }

    const profileData = await response.json();
    return profileData[0]; // Return the first (and only) profile object

  } catch (error) {
    console.error('Profile fetch failed:', error);
    throw error;
  }
}

export async function updateUserProfile(data: { full_name: string; phone: string }) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { success: false, error: "You must be logged in to update your profile." };
    }

    const accessToken = session.access_token;
    const userId = session.user.id;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        full_name: data.full_name,
        phone: data.phone
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Profile Update API Error:', errorData);
      return { success: false, error: errorData.message || 'Failed to update profile.' };
    }

    // Refresh the path to show updated data
    // revalidatePath('/profile'); // Optimistic updates might be better, or client-side reload

    return { success: true };

  } catch (error) {
    console.error('Profile update failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}

export async function getWalletBalance() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error:', sessionError?.message);
      return 0;
    }

    const accessToken = session.access_token;
    const userId = session.user.id;

    // Direct REST API call as requested
    const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/wallets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If not found (404) or empty, checking return
      if (response.status === 404) return 0;
      console.error('Failed to fetch wallet balance', response.statusText);
      return 0;
    }

    const walletData = await response.json();
    if (walletData && walletData.length > 0) {
      return walletData[0].balance;
    }

    return 0;

  } catch (error) {
    console.error('Wallet fetch failed:', error);
    return 0;
  }
}

export async function getReferralCode() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error:', sessionError?.message);
      return null;
    }

    const accessToken = session.access_token;
    const userId = session.user.id;

    const response = await fetch(`https://upoafhtidiwsihwijwex.supabase.co/rest/v1/referral_codes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch referral code', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log("refCode", data, accessToken);

    if (data && data.length > 0) {
      return data[0].referral_code;
    }

    return null;

  } catch (error) {
    console.error('Referral code fetch failed:', error);
    return null;
  }
}

export async function verifyReferralCode(code: string) {
  try {

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error:', sessionError?.message);
      return null;
    }

    const accessToken = session.access_token;

    const commonHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/check-referral', {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ referral_code: code }),
    });

    const data = await response.json();
    console.log(data)
    return { valid: response.ok && data.valid, message: data.message, discount: data.discount };

  } catch (error) {
    console.error('Referral verification failed:', error);
    return { valid: false, message: "Verification failed", discount: 0 };
  }
}
