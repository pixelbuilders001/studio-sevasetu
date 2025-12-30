
'use client';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getServiceCategories, ServiceCategory } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';


function ServicesSheetSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0 flex flex-col items-center justify-center">
                        <div className="relative w-full aspect-square bg-muted/20">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="p-2 text-center w-full bg-card">
                            <Skeleton className="h-5 w-3/4 mx-auto" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function ServicesSheet() {
    const { t, language } = useTranslation();
    const [categories, setCategories] = useState<Omit<ServiceCategory, 'problems'>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
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
                <button className="w-full flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors">
                    <LayoutGrid className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">{t('ourServices')}</span>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col">
                <SheetHeader>
                    <SheetTitle>{t('ourServices')}</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto -mx-6 px-6">
                    {loading ? <ServicesSheetSkeleton /> : (
                        <div className="grid grid-cols-3 gap-4 py-4">
                            {categories.map((category) => (
                            <SheetClose asChild key={category.id}>
                                <Link href={`/book/${category.slug}`} className="group">
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                                        <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                                            <div className="relative w-full aspect-square bg-muted/20">
                                                <Image
                                                    src={category.image.imageUrl}
                                                    alt={category.name}
                                                    fill
                                                    sizes="33vw"
                                                    className="object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                                                    data-ai-hint={category.image.imageHint}
                                                />
                                            </div>
                                            <div className="p-2 text-center w-full bg-card">
                                                <h3 className="font-bold text-sm">{category.name}</h3>
                                            </div>
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
