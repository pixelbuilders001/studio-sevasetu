
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Smartphone, Laptop, AirVent, Refrigerator, Fan, LucideIcon, Tv, WashingMachine } from 'lucide-react';
import type { TranslationFunc } from '@/context/LanguageContext';
import { createClient } from '@supabase/supabase-js'

export const ICONS: Record<string, LucideIcon> = {
    "Smartphone": Smartphone,
    "Laptop": Laptop,
    "AirVent": AirVent,
    "Refrigerator": Refrigerator,
    "Fan": Fan,
    "Tv": Tv,
    "WashingMachine": WashingMachine
}

export type Problem = {
    id: string;
    name: string;
    description: string;
    image: {
        imageUrl: string;
        imageHint: string;
    };
    category_id: string;
    base_min_fee: number;
};

export type ServiceCategory = {
    id: string;
    slug: string;
    name: string;
    icon: string;
    description: string;
    image: {
        imageUrl: string;
        imageHint: string;
    };
    problems: Problem[];
    base_inspection_fee: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const mapCategoryIcon = (slug: string): string => {
    const iconMap: { [key: string]: string } = {
        'phone': 'Smartphone',
        'laptop': 'Laptop',
        'ac': 'AirVent',
        'fridge': 'Refrigerator',
        'cooler': 'Fan',
        'tv': 'Tv',
        'washing-machine': 'WashingMachine',
    };
    return iconMap[slug] || 'Smartphone';
}

export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
    console.log('🔥 FETCHING FROM DB');
    const { data, error } = await supabase
        .from("categories")
        .select("*, issues(*)")
        .order("sort_order", { ascending: true })
        .eq("issues.is_active", true);

    if (error) {
        console.error("Failed to fetch service categories:", error);
        return [];
    }

    return data.map((category: any) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: mapCategoryIcon(category.slug),
        base_inspection_fee: category.base_inspection_fee || 199,
        image: {
            imageUrl: category.icon_url,
            imageHint: category.name.toLowerCase(),
        },
        problems: category.issues
            .map((p: any) => ({
                id: p.id,
                name: p.title,
                category_id: p.category_id,
                base_min_fee: p.base_min_fee,
                sort_order: p.sort_order,
                image: {
                    imageUrl: p.icon_url,
                    imageHint: p.title.toLowerCase(),
                },
            }))
            .sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));
};

export const getServiceCategory = async (slug: string): Promise<ServiceCategory | null> => {
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (categoryError || !categoryData) {
        console.error(`Failed to fetch category with slug ${slug}:`, categoryError);
        return null;
    }

    const category = categoryData;

    const { data: problemsData, error: problemsError } = await supabase
        .from('issues')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (problemsError) {
        console.error(`Failed to fetch problems for category ${category.id}:`, problemsError);
        throw new Error(`Failed to fetch problems for category ${category.name}`);
    }

    const problems = problemsData.map((p: any) => ({
        id: p.id,
        name: p.title,
        category_id: p.category_id,
        base_min_fee: p.base_min_fee,
        description: p.description,
        image: {
            imageUrl: p.icon_url,
            imageHint: p.title.toLowerCase()
        }
    }));

    return {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: mapCategoryIcon(category.slug),
        base_inspection_fee: category.base_inspection_fee || 199,
        image: {
            imageUrl: category.icon_url,
            imageHint: category.name.toLowerCase(),
        },
        problems: problems as Problem[],
    };
};


export const getTranslatedCategory = (category: ServiceCategory, t: TranslationFunc): ServiceCategory => {
    const translatedName = t(`category_${category.slug}_name` as any, { defaultValue: category.name });
    const translatedProblems = category.problems.map(problem => ({
        ...problem,
        name: t(`problem_${category.slug}_${problem.id}_name` as any, { defaultValue: problem.name }),
    }));
    return { ...category, name: translatedName, problems: translatedProblems };
};

export const getTranslatedCategories = (categories: Omit<ServiceCategory, 'problems' | 'base_inspection_fee'>[], t: TranslationFunc): Omit<ServiceCategory, 'problems' | 'base_inspection_fee'>[] => {
    return categories.map(category => ({
        ...category,
        name: t(`category_${category.slug}_name` as any, { defaultValue: category.name })
    }));
};
