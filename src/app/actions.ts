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

  const BookingSchema = z.object({
    name: z.string().min(2, { message: t('validation.name.min') }),
    mobile: z.string().regex(/^(\+91)?[6-9]\d{9}$/, { message: t('validation.mobile.regex') }),
    address: z.string().min(10, { message: t('validation.address.min') }),
    landmark: z.string().optional(),
    timeSlot: z.string({ required_error: t('validation.timeSlot.required') }),
    media: z.instanceof(File)
      .optional()
      .refine(file => !file || file.size <= 5 * 1024 * 1024, t('validation.media.maxSize'))
      .refine(
          file => !file || ['image/jpeg', 'image/png', 'video/mp4'].includes(file.type),
          t('validation.media.format')
      ),
    problemDescription: z.string().optional(),
  });

  const rawData = {
    name: formData.get('name'),
    mobile: formData.get('mobile'),
    address: formData.get('address'),
    landmark: formData.get('landmark'),
    timeSlot: formData.get('timeSlot'),
    media: formData.get('media'),
    category: formData.get('category'),
    problem: formData.get('problem'),
    problemDescription: formData.get('problemDescription'),
  };
  
  const validatedFields = BookingSchema.safeParse({
    name: rawData.name,
    mobile: rawData.mobile,
    address: rawData.address,
    landmark: rawData.landmark,
    timeSlot: rawData.timeSlot,
    media: rawData.media,
    problemDescription: rawData.problemDescription,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: t('validation.fixErrors'),
    };
  }

  const { name, mobile, address, landmark, timeSlot, media } = validatedFields.data;
  const { category, problem, problemDescription: customProblem } = rawData;
  const otherIssueStrings = ['other issue', 'अन्य समस्या'];


  if (otherIssueStrings.includes((problem as string).toLowerCase()) && !customProblem) {
    return {
        success: false,
        errors: {
            problemDescription: [t('validation.problemDescription.required')],
        },
        message: t('validation.problemDescription.required'),
    }
  }

  const problemText = otherIssueStrings.includes((problem as string).toLowerCase()) ? customProblem : problem;

  const fullProblemDescription = `
    Customer: ${name}
    Device: ${category}
    Problem: ${problemText}
    Address: ${address}, ${landmark || ''}
    Preferred Slot: ${timeSlot}
  `;

  try {
    // Simulate booking creation
    const bookingId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // In a real app, you would save the booking details and media to a database.
    // The media file can be uploaded to a storage service like Firebase Storage.
    // For this example, we're just proceeding to confirmation.

  } catch (error) {
    console.error('Booking failed:', error);
    return {
      success: false,
      message: t('validation.unexpectedError'),
    };
  }
  
  redirect(`/confirmation?bookingId=${`SS-${Math.floor(100000 + Math.random() * 900000)}`}`);
}


export async function trackBooking(prevState: any, formData: FormData): Promise<{ history?: { status: string; date: string }[]; error?: string; reset?: boolean } > {
  if (prevState.reset) {
    return { reset: true };
  }
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
