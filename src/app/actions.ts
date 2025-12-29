'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { predictTechnicianAssignment } from './ai/flows/technician-assignment-prediction';
import type { FormState } from '@/lib/types';

const BookingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  mobile: z.string().regex(/^(\+91)?[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number.' }),
  address: z.string().min(10, { message: 'Please enter a complete address.' }),
  landmark: z.string().optional(),
  timeSlot: z.string({ required_error: 'Please select a time slot.' }),
  media: z.instanceof(File)
    .optional()
    .refine(file => !file || file.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
    .refine(
        file => !file || ['image/jpeg', 'image/png', 'video/mp4'].includes(file.type),
        "Only .jpg, .png, and .mp4 formats are supported."
    ),
});

export async function bookService(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    name: formData.get('name'),
    mobile: formData.get('mobile'),
    address: formData.get('address'),
    landmark: formData.get('landmark'),
    timeSlot: formData.get('timeSlot'),
    media: formData.get('media'),
    category: formData.get('category'),
    problem: formData.get('problem'),
  };
  
  const validatedFields = BookingSchema.safeParse({
    name: rawData.name,
    mobile: rawData.mobile,
    address: rawData.address,
    landmark: rawData.landmark,
    timeSlot: rawData.timeSlot,
    media: rawData.media,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors in the form.',
    };
  }

  const { name, mobile, address, landmark, timeSlot, media } = validatedFields.data;
  const { category, problem } = rawData;

  const problemDescription = `
    Customer: ${name}
    Device: ${category}
    Problem: ${problem}
    Address: ${address}, ${landmark || ''}
    Preferred Slot: ${timeSlot}
  `;

  try {
    // Predict technician in the background
    predictTechnicianAssignment({ problemDescription });
    
    // Simulate booking creation
    const bookingId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // In a real app, you would save the booking details, technician assignment, and media to a database.
    // The media file can be uploaded to a storage service like Firebase Storage.
    // For this example, we're just proceeding to confirmation.

  } catch (error) {
    console.error('Booking failed:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
  
  redirect(`/confirmation?bookingId=${`SS-${Math.floor(100000 + Math.random() * 900000)}`}`);
}
