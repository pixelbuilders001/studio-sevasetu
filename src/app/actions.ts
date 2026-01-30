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


import { getServiceCategories, getServiceCategory } from '@/lib/data';
import type { ServiceCategory } from '@/lib/data';

export async function getServiceCategoriesAction(): Promise<ServiceCategory[]> {
  return getServiceCategories();
}

export async function getServiceCategoryAction(slug: string): Promise<ServiceCategory | null> {
  return getServiceCategory(slug);
}

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking_status_history?order_id=eq.${orderId}&select=order_id,status,note,created_at`, {
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
  wallet_used_amount: number | null,
  booking_for: string,
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
      cookieOptions: {
        name: 'sb-session-auth',
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    const allCookies = cookieStore.getAll();
    console.error('SERVER ACTION Authentication Error (bookService):', sessionError?.message || 'No session found in cookies');
    console.log('SERVER ACTION Cookies present:', allCookies.length);
    console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
    return { message: "Error", error: "You must be logged in to create a booking." };
  }

  const accessToken = session.access_token;

  const payload = new FormData();

  console.log("dhddhjhd", payload)

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
  payload.set('wallet_used_amount', wallet_used_amount !== null ? wallet_used_amount.toString() : 'null');
  payload.set('booking_for', booking_for);
  payload.set('final_amount_paid', '');
  payload.set('final_amount_to_be_paid', '');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/bookings`, {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      const allCookies = cookieStore.getAll();
      console.error('SERVER ACTION Authentication Error (acceptQuote):', sessionError?.message || 'No session found in cookies');
      console.log('SERVER ACTION Cookies present:', allCookies.length);
      console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
      return { message: "Error", error: "You must be logged in to create a booking." };
    }

    const accessToken = session.access_token;

    const commonHeaders = {
      'Authorization': `Bearer ${accessToken}`,
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

    const jobStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-job-status`, {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      const allCookies = cookieStore.getAll();
      console.error('SERVER ACTION Authentication Error (rejectQuote):', sessionError?.message || 'No session found in cookies');
      console.log('SERVER ACTION Cookies present:', allCookies.length);
      console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
      return { message: "Error", error: "You must be logged in to create a booking." };
    }

    const accessToken = session.access_token;
    const commonHeaders = {
      'Authorization': `Bearer ${accessToken}`,
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

    const jobStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-job-status`, {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      const allCookies = cookieStore.getAll();
      console.error('SERVER ACTION Authentication Error (profile):', authError?.message || 'No user found in cookies');
      console.log('SERVER ACTION Cookies present:', allCookies.length);
      console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
      return { message: "Error", error: "You must be logged in to view your profile." };
    }

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return { message: "Error", error: "Session expired." };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Profile API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch user profile.');
    }

    const profileData = await response.json();

    if (!profileData || profileData.length === 0) {
      console.warn("No profile found for user ID:", user.id);
      return null;
    }

    return profileData[0];

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
        cookieOptions: {
          name: 'sb-session-auth',
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const allCookies = cookieStore.getAll();
      console.error('SERVER ACTION Authentication Error (wallet):', authError?.message || 'No user found in cookies');
      console.log('SERVER ACTION Cookies present:', allCookies.length);
      console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
      return 0;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) return 0;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallets?user_id=eq.${user.id}&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
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
              // The is called from a Server Component.
            }
          },
        },
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const allCookies = cookieStore.getAll();
      console.error('SERVER ACTION Authentication Error (referral):', authError?.message || 'No user found in cookies');
      console.log('SERVER ACTION Cookies present:', allCookies.length);
      console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) return null;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/referral_codes?user_id=eq.${user.id}&limit=1`, {
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

    if (data && data.length > 0) {
      return data[0].referral_code;
    }

    return null;

  } catch (error) {
    console.error('Referral code fetch failed:', error);
    return null;
  }
}

export async function getInitialProfileDataAction() {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      const allCookies = cookieStore.getAll();
      console.error('SERVER ACTION Authentication Error (initialData):', authError?.message || 'No user found in cookies');
      console.log('SERVER ACTION Cookies present:', allCookies.length);
      console.log('SERVER ACTION Cookie names:', allCookies.map(c => c.name).join(', '));
      return { success: false, error: "Not authenticated" };
    }

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) return { success: false, error: "Session expired" };

    const commonHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const [profileRes, walletRes, referralRes] = await Promise.all([
      fetch(`${baseUrl}/rest/v1/profiles?id=eq.${user.id}&limit=1`, { headers: commonHeaders, cache: 'no-store' }),
      fetch(`${baseUrl}/rest/v1/wallets?user_id=eq.${user.id}&limit=1`, { headers: commonHeaders, cache: 'no-store' }),
      fetch(`${baseUrl}/rest/v1/referral_codes?user_id=eq.${user.id}&limit=1`, { headers: commonHeaders, cache: 'no-store' })
    ]);

    const [profileData, walletData, referralData] = await Promise.all([
      profileRes.ok ? profileRes.json() : Promise.resolve([]),
      walletRes.ok ? walletRes.json() : Promise.resolve([]),
      referralRes.ok ? referralRes.json() : Promise.resolve([])
    ]);

    return {
      success: true,
      profile: profileData[0] || null,
      walletBalance: walletData[0]?.balance || 0,
      referralCode: referralData[0]?.referral_code || null,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        user_metadata: user.user_metadata,
        created_at: user.created_at
      }
    };

  } catch (error) {
    console.error('getInitialProfileDataAction failed:', error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getWalletTransactions() {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return [];
    }

    const accessToken = session.access_token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallet_transactions?user_id=eq.${session.user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Transactions fetch error:', await response.text());
      return [];
    }
    return await response.json();

  } catch (error) {
    console.error('Transactions fetch failed:', error);
    return [];
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error6:', sessionError?.message);
      return null;
    }

    const accessToken = session.access_token;

    const commonHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-referral`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ referral_code: code }),
    });

    const data = await response.json();
    return { valid: response.ok && data.valid, message: data.message, discount: data.discount };

  } catch (error) {
    console.error('Referral verification failed:', error);
    return { valid: false, message: "Verification failed", discount: 0 };
  }
}

export async function saveAddress(data: { full_address: string; city?: string; state?: string; pincode?: string }) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { success: false, error: "You must be logged in to save an address." };
    }

    const accessToken = session.access_token;
    const userId = session.user.id;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/addresses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        full_address: data.full_address,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        is_default: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Address Save API Error:', errorData);
      return { success: false, error: errorData.message || 'Failed to save address.' };
    }

    return { success: true };

  } catch (error) {
    console.error('Address save failed:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}

export async function getSavedAddresses() {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return [];
    }

    const accessToken = session.access_token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/addresses?user_id=eq.${session.user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch addresses', response.statusText);
      return [];
    }

    return await response.json();

  } catch (error) {
    console.error('Fetch addresses failed:', error);
    return [];
  }
}

export async function setDefaultAddress(addressId: string) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return { error: 'Unauthorized' };

    const accessToken = session.access_token;
    const userId = session.user.id;

    // 1. Reset all addresses for this user to is_default = false
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/addresses?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ is_default: false })
    });

    // 2. Set the selected address as default
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/addresses?id=eq.${addressId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_default: true })
    });

    if (!response.ok) throw new Error('Failed to set default address');
    return { success: true };

  } catch (error) {
    console.error('Set default address failed:', error);
    return { error: 'Failed to update address' };
  }
}

export async function deleteAddress(addressId: string) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return { error: 'Unauthorized' };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/addresses?id=eq.${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to delete address');
    return { success: true };

  } catch (error) {
    console.error('Delete address failed:', error);
    return { error: 'Failed to delete address' };
  }
}

export async function getBookingHistory() {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return [];

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking?select=id,order_id,status,net_inspection_fee,technician_id,user_rating,preferred_service_date,preferred_time_slot,booking_for,created_at,media_url,completion_code,final_amount_to_be_paid,user_name,mobile_number,full_address,final_amount_paid,payment_method,categories(id,name),issues(id,title),repair_quotes(*)&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Booking history fetch error:', await response.text());
      return [];
    }
    return await response.json();

  } catch (error) {
    console.error('Booking history fetch failed:', error);
    return [];
  }
}

export async function getTechnicianById(technicianId: string) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error7:', sessionError?.message);
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/technicians?id=eq.${technicianId}&select=id,full_name,mobile,selfie_url,primary_skill,total_experience,service_area&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Technician fetch error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;

  } catch (error) {
    console.error('Technician fetch failed:', error);
    return null;
  }
}

export async function submitRating(technicianId: string, rating: number, bookingId: string) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Authentication Error (submitRating):', sessionError?.message);
      return { success: false, error: "You must be logged in to submit a rating." };
    }

    const accessToken = session.access_token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-ratings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        technician_id: technicianId,
        rating: rating,
        booking_id: bookingId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Rating submission API error:', errorData);
      return { success: false, error: errorData.message || 'Failed to submit rating' };
    }

    return { success: true };
  } catch (error) {
    console.error('Rating submission failed:', error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}

export async function getPincodeDataAction(pincode: string) {
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 8000;

  const fetchWithTimeout = async (url: string, timeout: number) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  let lastError: any = null;

  for (let i = 0; i <= MAX_RETRIES; i++) {
    try {
      const response = await fetchWithTimeout(`https://api.postalpincode.in/pincode/${pincode}`, TIMEOUT_MS);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      if (data && data[0].Status === 'Success') {
        return { success: true, data: data[0].PostOffice };
      } else if (data && data[0].Status === 'Error') {
        return { success: false, error: data[0].Message || 'Invalid Pincode' };
      }
      throw new Error('Unexpected API response format');
    } catch (error) {
      lastError = error;
      console.warn(`Pincode lookup attempt ${i + 1} failed:`, error);
      if (i < MAX_RETRIES) {
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : 'Pincode service is currently unavailable. Please try again later.'
  };
}

export async function getTechniciansByPincodeAction(pincode: string) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/technicians?pincode=eq.${pincode}&is_active=eq.true&is_verified=eq.true&select=id,full_name,primary_skill,selfie_url,total_experience,service_area,other_skills,slug`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    });
    // console.log(await response.json());
    if (!response.ok) {
      console.error('Technicians by pincode fetch error:', await response.text());
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Technicians by pincode fetch failed:', error);
    return [];
  }
}

export async function getTechniciansByCategoryAction(categoryId: string) {
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
        cookieOptions: {
          name: 'sb-session-auth',
        },
      }
    );

    const { data, error } = await supabase
      .from('technician_categories')
      .select(`
        technicians (
          id,
          full_name,
          total_experience,
          is_active,
          verification_status,
          service_area,
          pincode,
          selfie_url
        )
      `)
      .eq('category_id', categoryId)
      .eq('technicians.is_active', true)
      .eq('technicians.verification_status', 'approved')
      .limit(2);

    if (error) {
      console.error('Error fetching technicians by category:', error);
      return [];
    }

    return data?.map((item: any) => (item as any).technicians).filter(Boolean) || [];
  } catch (err) {
    console.error('Failed to fetch technicians by category:', err);
    return [];
  }
}

export async function getBookingTimeline(orderId: string) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
          },
        },
        cookieOptions: { name: 'sb-session-auth' },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return { success: false, error: 'Unauthenticated' };
    }

    const accessToken = session.access_token;

    // Fetch directly from booking_status_history
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking_status_history?order_id=eq.${orderId}&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {

      console.error('Timeline fetch error:', await response.text());
      return { success: false, error: 'Failed to fetch timeline' };
    }

    const data = await response.json();
    console.error('Timeline fetch error:', data);
    // transform to frontend expected format
    const dateFormat = "MMM d, yyyy 'at' h:mm a";
    const history = data.map((item: any) => ({
      status: item.status,
      date: format(new Date(item.created_at), dateFormat),
      note: item.note,
    }));

    return { success: true, history };

  } catch (error) {
    console.error('getBookingTimeline failed:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getLatestBookingId() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
          },
        },
        cookieOptions: { name: 'sb-session-auth' },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return null;
    }

    const { data, error } = await supabase
      .from('booking')
      .select('order_id')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return data.order_id;

  } catch (error) {
    console.error('getLatestBookingId failed:', error);
    return null;
  }
}
