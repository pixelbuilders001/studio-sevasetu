
'use client';
import {
    SheetHeader,
    SheetTitle,
    SheetClose
} from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategoriesAction } from '@/app/actions';
import { ServiceCategory } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { useRouter } from 'next/navigation';
import { IndianRupee } from 'lucide-react';


function ServicesSheetSkeleton() {
    return (
        <div className="grid services-grid gap-4 py-4">
            {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <Skeleton className="h-5 w-3/4" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

import FullScreenLoader from './FullScreenLoader';

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
            const closeButton = document.querySelector('#radix-4-content-sheet-bottom > button');
            if (closeButton instanceof HTMLElement) {
                closeButton.click();
            }

            setIsNavigating(true);
            setTimeout(() => {
                router.push(`/book/${category.slug}`);
            }, 100);
        }
    };

    const inspectionFee = category.base_inspection_fee * location.inspection_multiplier;

    return (
        <>
            {isNavigating && <FullScreenLoader />}
            <div onClick={handleClick} className="group cursor-pointer h-full">
                <Card className="bg-white border-2 border-indigo-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col text-center overflow-hidden h-full min-h-[130px] justify-center items-center active:scale-95">
                    <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center gap-2 h-full">
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-indigo-50 rounded-2xl p-3 group-hover:bg-indigo-100 transition-colors">
                            <Image
                                src={category.image.imageUrl}
                                alt={category.name}
                                fill
                                sizes="(max-width: 768px) 20vw, 10vw"
                                className="object-contain p-1"
                                data-ai-hint={category.image.imageHint}
                            />
                        </div>
                        <h3
                            className="font-black text-xs sm:text-sm md:text-base text-primary leading-tight px-1 uppercase tracking-tight line-clamp-2"
                            style={{
                                textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
                            }}
                        >
                            {category.name}
                        </h3>
                        {isServiceable && (
                            <div className="text-[10px] sm:text-xs font-bold text-primary flex items-center mt-auto">
                                <IndianRupee className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {inspectionFee}
                                <span className="text-muted-foreground ml-0.5 font-medium lowercase">onwards</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
                <SheetTitle>What's broken?</SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                {loading ? <ServicesSheetSkeleton /> : (
                    <div className="grid services-grid gap-4 py-4">
                        {categories.map((category) => (
                            <ServiceCard key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
