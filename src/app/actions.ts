
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/types';
import { getTranslations } from '@/lib/get-translation';
import { subDays, format } from 'date-fns';

export async function bookService(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lang = (formData.get('lang') as string) || 'en';
  const t = getTranslations(lang);

  const rawData = {
    name: formData.get('name'),
    mobile: formData.get('mobile'),
    address: formData.get('address'),
    landmark: formData.get('landmark'),
    timeSlot: formData.get('timeSlot'),
    media: formData.get('media'),
    categoryId: formData.get('categoryId'),
    problemIds: formData.get('problemIds'),
    problemDescription: formData.get('problemDescription'),
    pincode: formData.get('pincode'),
  };

  const otherIssueStrings = ['other issue', 'अन्य समस्या'];

  if (otherIssueStrings.includes((rawData.problemDescription as string).toLowerCase()) && !rawData.problemDescription) {
    return {
        success: false,
        errors: {
            problemDescription: [t('validation.problemDescription.required')],
        },
        message: t('validation.problemDescription.required'),
    }
  }
  
  try {
    const apiFormData = new FormData();
    apiFormData.append('user_name', rawData.name as string);
    apiFormData.append('mobile_number', rawData.mobile as string);
    apiFormData.append('full_address', rawData.address as string);
    if (rawData.landmark) {
        apiFormData.append('landmark', rawData.landmark as string);
    }
    apiFormData.append('category_id', rawData.categoryId as string);
    
    const issueIds = (rawData.problemIds as string).split(',');
    apiFormData.append('issue_id', issueIds[0]); // Assuming single issue for now based on curl

    apiFormData.append('preferred_time_slot', rawData.timeSlot as string);
    if (rawData.media && (rawData.media as File).size > 0) {
        apiFormData.append('media', rawData.media as File);
    }
    if(rawData.pincode) {
        apiFormData.append('pincode', rawData.pincode as string);
    }

    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
            'apikey': 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
        },
        body: apiFormData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return {
            success: false,
            message: errorData.message || t('validation.unexpectedError'),
        };
    }

    const result = await response.json();
    const bookingId = result.bookingId || `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    redirect(`/confirmation?bookingId=${bookingId}`);

  } catch (error) {
    console.error('Booking failed:', error);
    return {
      success: false,
      message: t('validation.unexpectedError'),
    };
  }
}


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
