
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Smartphone, Laptop, AirVent, Refrigerator, Fan, LucideIcon } from 'lucide-react';
import type { TranslationFunc } from '@/context/LanguageContext';

export const ICONS: Record<string, LucideIcon> = {
    "Smartphone": Smartphone,
    "Laptop": Laptop,
    "AirVent": AirVent,
    "Refrigerator": Refrigerator,
    "Fan": Fan,
}

export type Problem = {
  id: string; 
  name: string;
  image: ImagePlaceholder;
  category_id: number;
};

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  icon: string; // Changed from React.ComponentType to string
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

const serviceCategories: Omit<ServiceCategory, 'problems' | 'icon'> & { icon: string }[] = [
    { id: '1', slug: 'mobile-phones', name: 'Mobile Phone', icon: 'Smartphone', image: { imageUrl: getImage('phone-repair').imageUrl, imageHint: 'phone repair' } },
    { id: '2', slug: 'laptop-repair', name: 'Laptop', icon: 'Laptop', image: { imageUrl: getImage('laptop-repair').imageUrl, imageHint: 'laptop repair' } },
    { id: '3', slug: 'ac-repair', name: 'AC', icon: 'AirVent', image: { imageUrl: getImage('ac-repair').imageUrl, imageHint: 'ac repair' } },
    { id: '4', slug: 'fridge-repair', name: 'Fridge', icon: 'Refrigerator', image: { imageUrl: getImage('fridge-repair').imageUrl, imageHint: 'fridge repair' } },
    { id: '5', slug: 'cooler-repair', name: 'Air Cooler', icon: 'Fan', image: { imageUrl: getImage('cooler-repair').imageUrl, imageHint: 'cooler repair' } },
];


const problems: Omit<Problem, 'image'>[] = [
    { id: 'screen-broken', name: 'Screen Broken', category_id: 1, image_id: 'phone-screen-broken' },
    { id: 'battery-issue', name: 'Battery Issue', category_id: 1, image_id: 'phone-battery-issue' },
    { id: 'charging-problem', name: 'Charging Problem', category_id: 1, image_id: 'phone-charging-problem' },
    { id: 'mic-speaker-issue', name: 'Mic/Speaker Issue', category_id: 1, image_id: 'phone-mic-speaker-issue' },
    { id: 'not-switching-on', name: 'Not Switching On', category_id: 1, image_id: 'phone-not-switching-on' },
    { id: 'other', name: 'Other Issue', category_id: 1, image_id: 'other-issue' },

    { id: 'screen-issue', name: 'Screen Issue', category_id: 2, image_id: 'laptop-screen-issue' },
    { id: 'battery-issue', name: 'Battery Issue', category_id: 2, image_id: 'laptop-battery-issue' },
    { id: 'slow-performance', name: 'Slow Performance', category_id: 2, image_id: 'laptop-slow-performance' },
    { id: 'keyboard-issue', name: 'Keyboard Issue', category_id: 2, image_id: 'laptop-keyboard-issue' },
    { id: 'os-software-issue', name: 'OS/Software Issue', category_id: 2, image_id: 'laptop-os-software-issue' },
    { id: 'not-starting', name: 'Not Starting', category_id: 2, image_id: 'laptop-not-starting' },
    { id: 'other', name: 'Other Issue', category_id: 2, image_id: 'other-issue' },

    { id: 'not-cooling', name: 'Not Cooling', category_id: 3, image_id: 'ac-not-cooling' },
    { id: 'gas-leakage', name: 'Gas Leakage', category_id: 3, image_id: 'ac-gas-leakage' },
    { id: 'installation-uninstallation', name: 'Installation / Uninstallation', category_id: 3, image_id: 'ac-installation' },
    { id: 'service-cleaning', name: 'Service / Cleaning', category_id: 3, image_id: 'ac-service-cleaning' },
    { id: 'noise-issue', name: 'Noise Issue', category_id: 3, image_id: 'ac-noise-issue' },
    { id: 'other', name: 'Other Issue', category_id: 3, image_id: 'other-issue' },

    { id: 'not-cooling', name: 'Not Cooling', category_id: 4, image_id: 'fridge-not-cooling' },
    { id: 'water-leakage', name: 'Water Leakage', category_id: 4, image_id: 'fridge-water-leakage' },
    { id: 'compressor-issue', name: 'Compressor Issue', category_id: 4, image_id: 'fridge-compressor-issue' },
    { id: 'noise-issue', name: 'Noise Issue', category_id: 4, image_id: 'fridge-noise-issue' },
    { id: 'other', name: 'Other Issue', category_id: 4, image_id: 'other-issue' },

    { id: 'not-cooling', name: 'Not Cooling', category_id: 5, image_id: 'cooler-not-cooling' },
    { id: 'motor-issue', name: 'Motor Issue', category_id: 5, image_id: 'cooler-motor-issue' },
    { id: 'water-pump-issue', name: 'Water Pump Issue', category_id: 5, image_id: 'cooler-water-pump-issue' },
    { id: 'power-issue', name: 'Power Issue', category_id: 5, image_id: 'cooler-power-issue' },
    { id: 'other', name: 'Other Issue', category_id: 5, image_id: 'other-issue' },
].map(p => ({ ...p, image: getImage(p.image_id) }));


export function getServiceCategories(): Omit<ServiceCategory, 'problems'>[] {
    return serviceCategories;
}

export function getServiceCategory(slug: string): ServiceCategory | null {
    const categoryInfo = serviceCategories.find(c => c.slug === slug);
    if (!categoryInfo) {
        return null;
    }
    
    const categoryProblems = problems
        .filter(p => p.category_id === parseInt(categoryInfo.id))
        .map(p => ({
            ...p,
            image: getImage(p.image.id)
        }));

    return {
        ...categoryInfo,
        problems: categoryProblems as Problem[],
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
