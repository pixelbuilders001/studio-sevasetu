
'use client';
import {
    SheetHeader,
    SheetTitle,
    SheetClose
} from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategories, ServiceCategory } from '@/lib/data';
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
        <div className="grid grid-cols-3 gap-4 py-4">
            {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden aspect-square">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-2">
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
            <div onClick={handleClick} className="group cursor-pointer">
                <Card className="bg-card border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center overflow-hidden h-full aspect-square justify-center items-center bg-white">
                    <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image
                                src={category.image.imageUrl}
                                alt={category.name}
                                fill
                                sizes="(max-width: 768px) 20vw, 10vw"
                                className="object-contain"
                                data-ai-hint={category.image.imageHint}
                            />
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-foreground">{category.name}</h3>
                        {isServiceable && (
                            <div className="text-xs font-bold text-primary flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {inspectionFee}
                                <span className="text-muted-foreground ml-1">onwards</span>
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
                const originalCategories = await getServiceCategories();
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
