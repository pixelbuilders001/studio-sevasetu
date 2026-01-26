
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


function ServicesSheetSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 py-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="w-14 h-14 rounded-full" />
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
                <div className="w-[4.5rem] h-[4.5rem] rounded-[1.25rem] bg-indigo-50/80 flex items-center justify-center mb-2 overflow-hidden shadow-sm border border-indigo-100/50 transition-all active:scale-95 group-hover:bg-primary/5 group-hover:shadow-md">
                    <div className="relative w-10 h-10">
                        <Image
                            src={category.image.imageUrl}
                            alt={category.name}
                            fill
                            className="object-contain"
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
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const originalCategories = await getServiceCategoriesAction();
                setCategories(originalCategories);
            } catch (error) {
                console.error("Failed to fetch service categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [language]);


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
