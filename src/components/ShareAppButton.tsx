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
    showIcon = true,
    shareData
}: ShareAppButtonProps & {
    shareData?: {
        title: string;
        text: string;
        url: string;
    }
}) {
    const { toast } = useToast();

    const handleShare = async () => {
        const data = shareData || {
            title: 'helloFixo - Most Trusted Doorstep Repair Service 🛠️',
            text: '🔧 Get your phone, laptop & appliances fixed at your doorstep!\n\n✅ Certified technicians\n✅ 60-min service\n✅ 30-day warranty\n\nBook now:',
            url: 'https://hellofixo.in',
        };

        try {
            if (navigator.share) {
                await navigator.share(data);
            } else {
                // Fallback to WhatsApp
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}`;
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
