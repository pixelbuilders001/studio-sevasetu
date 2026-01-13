'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/app/actions';

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: {
        full_name: string | null;
        phone: string;
    } | null;
    onProfileUpdated: () => void;
}

export function EditProfileModal({
    isOpen,
    onClose,
    currentProfile,
    onProfileUpdated,
}: EditProfileModalProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (isOpen && currentProfile) {
            reset({
                full_name: currentProfile.full_name || '',
                phone: currentProfile.phone || '',
            });
        }
    }, [isOpen, currentProfile, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        setLoading(true);
        try {
            const result = await updateUserProfile(data);

            if (result.success) {
                toast({
                    title: 'Profile Updated',
                    description: 'Your profile has been successfully updated.',
                });
                onProfileUpdated();
                onClose();
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'Failed to update profile',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            {...register('full_name')}
                            placeholder="Enter your full name"
                        />
                        {errors.full_name && (
                            <p className="text-sm text-red-500">{errors.full_name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            {...register('phone')}
                            placeholder="Enter your phone number"
                            type="tel"
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
