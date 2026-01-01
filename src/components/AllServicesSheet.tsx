
'use client';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategories, ServiceCategory } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import React from 'react';


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

export default function AllServicesSheet({ children }: { children: React.ReactNode }) {
    const { t, language } = useTranslation();
    const [categories, setCategories] = useState<Omit<ServiceCategory, 'problems'>[]>([]);
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
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-full max-h-[85vh] flex flex-col rounded-t-2xl">
                <SheetHeader>
                    <SheetTitle>What's broken?</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto -mx-6 px-6">
                    {loading ? <ServicesSheetSkeleton /> : (
                        <div className="grid services-grid gap-4 py-4">
                            {categories.map((category) => (
                            <SheetClose asChild key={category.id}>
                                <Link href={`/book/${category.slug}`} className="group">
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
                                        </CardContent>
                                    </Card>
                                </Link>
                            </SheetClose>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
