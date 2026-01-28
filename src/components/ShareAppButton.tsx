'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareAppButtonProps {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'indigo';
    className?: string;
    label?: string;
    showIcon?: boolean;
}

export default function ShareAppButton({
    variant = 'default',
    className,
    label = 'Share App',
    showIcon = true
}: ShareAppButtonProps) {
    const { toast } = useToast();

    const handleShare = async () => {
        const shareData = {
            title: 'helloFixo - Doorstep Repair Service',
            text: 'Check out helloFixo for doorstep repairs in Your City! 🛠️📱 Fast, reliable, and verified technicians. Install the app now:',
            url: 'https://hellofixo.in',
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback to WhatsApp
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
                window.open(whatsappUrl, '_blank');
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Error sharing:', error);
                toast({
                    title: 'Sharing failed',
                    description: 'Could not open share menu.',
                    variant: 'destructive',
                });
            }
        }
    };

    if (variant === 'indigo') {
        return (
            <Button
                onClick={handleShare}
                className={cn(
                    "bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-10 shadow-lg shadow-indigo-200 px-6",
                    className
                )}
            >
                {showIcon && <Share2 className="w-3.5 h-3.5 mr-2" />}
                {label}
            </Button>
        );
    }

    return (
        <Button
            variant={variant as any}
            onClick={handleShare}
            className={cn("flex items-center gap-2", className)}
        >
            {showIcon && <Share2 className="w-4 h-4" />}
            {label}
        </Button>
    );
}
