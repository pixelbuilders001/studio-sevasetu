
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Smartphone, Laptop, AirVent, Refrigerator, Fan, LucideIcon } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


const ICONS: Record<string, LucideIcon> = {
    Smartphone,
    Laptop,
    AirVent,
    Refrigerator,
    Fan,
}

export type Problem = {
  id: string; // Keep as string to match previous structure
  name: string;
  image_id: string;
  image: ImagePlaceholder;
  category_id: number;
};

export type ServiceCategory = {
  id: string; // Keep as string to match previous structure
  name: string;
  icon_name: string;
  icon: React.ComponentType<{ className?: string }>;
  image_id: string;
  image: ImagePlaceholder;
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

const mapCategory = (category: any): ServiceCategory => ({
    ...category,
    id: String(category.id),
    icon: ICONS[category.icon_name] || Fan,
    image: getImage(category.image_id),
    problems: [],
});

const mapProblem = (problem: any): Problem => ({
    ...problem,
    id: String(problem.id),
    image: getImage(problem.image_id),
});


export async function getServiceCategories(): Promise<ServiceCategory[]> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and Anon Key must be provided in environment variables. Please check your .env file.');
    }
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*,problems(*)`, { headers, cache: 'no-store' });
    if (!response.ok) {
        console.error('Failed to fetch categories:', await response.text());
        throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.map((category: any) => ({
        ...mapCategory(category),
        problems: category.problems.map(mapProblem)
    }));
}


export async function getServiceCategory(id: string): Promise<ServiceCategory | null> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and Anon Key must be provided in environment variables. Please check your .env file.');
    }
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${id}&select=*,problems(*)`, { headers, cache: 'no-store' });
    if (!response.ok) {
        console.error(`Failed to fetch category with id ${id}:`, await response.text());
        throw new Error(`Failed to fetch category with id ${id}`);
    }
    const data = await response.json();
    if (data.length === 0) {
        return null;
    }
    const category = data[0];
    return {
        ...mapCategory(category),
        problems: category.problems.map(mapProblem)
    };
}
