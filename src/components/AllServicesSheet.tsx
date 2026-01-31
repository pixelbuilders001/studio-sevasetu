
'use client';
import {
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategoriesAction } from '@/app/actions';
import { ServiceCategory } from '@/lib/data';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { useRouter } from 'next/navigation';
import FullScreenLoader from './FullScreenLoader';
import { useQuery } from '@tanstack/react-query';


function ServicesSheetSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 py-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="h-3 w-10" />
                </div>
            ))}
        </div>
    );
}

function ServiceCard({ category }: { category: ServiceCategory }) {
    const { location, isServiceable, setDialogOpen } = useLocation();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (!isServiceable) {
            e.preventDefault();
            setDialogOpen(true);
        } else {
            // Need to close the sheet manually if we prevent default
            // A bit of a hack, but works for now.
            const closeButton = document.querySelector('[data-state="open"] > button[type="button"].absolute.right-4.top-4');
            // Try different selector if the first one doesn't match standard sheet close button
            const sheetClose = document.querySelector('button[data-radix-collection-item]');

            if (closeButton instanceof HTMLElement) {
                closeButton.click();
            } else if (sheetClose instanceof HTMLElement) {
                sheetClose.click();
            } else {
                // Fallback: try to find any close button within the sheet content or trigger a click on the backdrop
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            }

            setIsNavigating(true);
            setTimeout(() => {
                router.push(`/book/${category.slug}`);
            }, 100);
        }
    };

    return (
        <>
            {isNavigating && <FullScreenLoader />}
            <div onClick={handleClick} className="group flex flex-col items-center cursor-pointer w-full p-1">
                <div className="w-[5rem] h-[5rem] rounded-full bg-indigo-50/80 flex items-center justify-center mb-2 overflow-hidden shadow-sm border border-indigo-100/50 transition-all duration-300 active:scale-95 group-hover:bg-primary/10 group-hover:shadow-lg group-hover:border-primary/30 group-hover:scale-105">
                    <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <Image
                            src={category.image.imageUrl}
                            alt={category.name}
                            fill
                            className="object-contain transition-all duration-300"
                            data-ai-hint={category.image.imageHint}
                        />
                    </div>
                </div>
                <h3 className="text-[11px] font-bold text-center text-foreground leading-tight px-1 line-clamp-2">
                    {category.name}
                </h3>
            </div>
        </>
    );
}


export default function AllServicesSheet() {
    const { t, language } = useTranslation();

    const { data: categories = [], isLoading: loading } = useQuery({
        queryKey: ['service-categories'],
        queryFn: getServiceCategoriesAction,
    });


    return (
        <>
            <SheetHeader>
                <SheetTitle>All Services</SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                {loading ? <ServicesSheetSkeleton /> : (
                    <div className="grid grid-cols-4 gap-y-6 gap-x-2 py-4">
                        {categories.map((category) => (
                            <ServiceCard key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
