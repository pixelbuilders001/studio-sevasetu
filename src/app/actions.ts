
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/types';
import { getTranslations } from '@/lib/get-translation';
import { subDays, format } from 'date-fns';

type BoundBookServiceParams = {
  lang: string;
  categoryId: string;
  problemIds: string;
  pincode: string;
};

export async function bookService(
  boundParams: BoundBookServiceParams,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { lang, categoryId, problemIds, pincode } = boundParams;
  const t = getTranslations(lang);

  const rawData = {
    name: formData.get('name'),
    mobile: formData.get('mobile'),
    address: formData.get('address'),
    landmark: formData.get('landmark'),
    timeSlot: formData.get('timeSlot'),
    media: formData.get('media'),
    problemDescription: formData.get('problemDescription'),
  };

  // Basic validation (you can add more comprehensive validation here)
  if (!rawData.name || !rawData.mobile || !rawData.address || !rawData.timeSlot) {
      return {
          success: false,
          message: t('validation.fixErrors'),
          errors: {
              name: !rawData.name ? [t('validation.name.min')] : undefined,
              mobile: !rawData.mobile ? [t('validation.mobile.regex')] : undefined,
              address: !rawData.address ? [t('validation.address.min')] : undefined,
              timeSlot: !rawData.timeSlot ? [t('validation.timeSlot.required')] : undefined,
          }
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
    apiFormData.append('category_id', categoryId);
    
    // The API seems to take a single issue_id, so we'll send the first one.
    const issueIds = problemIds.split(',');
    if (issueIds.length > 0) {
        apiFormData.append('issue_id', issueIds[0]);
    }

    apiFormData.append('preferred_time_slot', rawData.timeSlot as string);
    
    const mediaFile = rawData.media as File;
    if (mediaFile && mediaFile.size > 0) {
        apiFormData.append('media', mediaFile);
    }
    if(pincode) {
        apiFormData.append('pincode', pincode);
    }
    if (rawData.problemDescription) {
        apiFormData.append('problem_description', rawData.problemDescription as string);
    }

    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/bookings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
            'apikey': 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS',
        },
        body: apiFormData,
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('API Error:', result);
        return {
            success: false,
            message: result.message || t('validation.unexpectedError'),
        };
    }

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
