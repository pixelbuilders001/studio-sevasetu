
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Smartphone, Laptop, AirVent, Refrigerator, Fan, LucideIcon } from 'lucide-react';
import type { TranslationFunc } from '@/context/LanguageContext';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


const ICONS: Record<string, LucideIcon> = {
    "MOBILE PHONES": Smartphone,
    "LAPTOPS": Laptop,
    "AC": AirVent,
    "FRIDGE": Refrigerator,
    "AIR COOLER": Fan,
}

export type Problem = {
  id: string; 
  name: string;
  image: ImagePlaceholder;
  category_id: number;
};

export type ServiceCategory = {
  id: string; // The UUID
  slug: string; // The slug for URL
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  image: {
      imageUrl: string;
      imageHint: string;
  };
  problems: Problem[];
};


const getImage = (id: string): ImagePlaceholder => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        const defaultImg = PlaceHolderImages.find(p => p.id === 'other-issue');
        if(defaultImg) return defaultImg;
        throw new Error(`Placeholder image with id "${id}" not found and default image is also missing.`);
    }
    return img;
}

const mapCategory = (category: any): Omit<ServiceCategory, 'problems'> => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    icon: ICONS[category.name] || Fan,
    image: {
        imageUrl: category.icon_url,
        imageHint: category.name.toLowerCase(),
    }
});

const mapProblem = (problem: any): Problem => ({
    ...problem,
    id: String(problem.id),
    image: getImage(problem.image_id),
});


export async function getServiceCategories(): Promise<Omit<ServiceCategory, 'problems'>[]> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and Anon Key must be provided in environment variables. Please check your .env file.');
    }
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
        console.error('Failed to fetch categories:', await response.text());
        throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.map(mapCategory);
}


export async function getServiceCategory(slug: string): Promise<ServiceCategory | null> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and Anon Key must be provided in environment variables. Please check your .env file.');
    }
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?slug=eq.${slug}&select=*,problems(*)`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
        console.error(`Failed to fetch category with slug ${slug}:`, await response.text());
        throw new Error(`Failed to fetch category with slug ${slug}`);
    }
    const data = await response.json();
    
    if (data.length === 0) {
        return null;
    }
    
    const categoryData = data[0];

    const problems = (categoryData.problems || []).map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        category_id: p.category_id,
        image: getImage(p.image_id || 'other-issue'),
    }));
    
    return {
        id: categoryData.id,
        slug: categoryData.slug,
        name: categoryData.name,
        icon: ICONS[categoryData.name] || Fan,
        image: {
            imageUrl: categoryData.icon_url,
            imageHint: categoryData.name.toLowerCase()
        },
        problems: problems,
    };
}


export const getTranslatedCategory = (category: ServiceCategory, t: TranslationFunc): ServiceCategory => {
  const translatedName = t(`category_${category.slug}_name` as any, { defaultValue: category.name });
  const translatedProblems = category.problems.map(problem => ({
    ...problem,
    name: t(`problem_${category.slug}_${problem.id}_name` as any, { defaultValue: problem.name }),
  }));
  return { ...category, name: translatedName, problems: translatedProblems };
};

export const getTranslatedCategories = (categories: Omit<ServiceCategory, 'problems'>[], t: TranslationFunc): Omit<ServiceCategory, 'problems'>[] => {
    return categories.map(category => ({
        ...category,
        name: t(`category_${category.slug}_name` as any, { defaultValue: category.name })
    }));
};
