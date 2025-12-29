import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Smartphone, Laptop, AirVent, Refrigerator, Fan } from 'lucide-react';

export type Problem = {
  id: string;
  name: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  image: ImagePlaceholder;
  problems: Problem[];
};

const getImage = (id: string): ImagePlaceholder => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        throw new Error(`Placeholder image with id "${id}" not found.`);
    }
    return img;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'phone',
    name: 'Mobile Phone',
    icon: Smartphone,
    image: getImage('phone-repair'),
    problems: [
      { id: 'screen-broken', name: 'Screen Broken' },
      { id: 'battery-issue', name: 'Battery Issue' },
      { id: 'charging-problem', name: 'Charging Problem' },
      { id: 'mic-speaker-issue', name: 'Mic/Speaker Issue' },
      { id: 'not-switching-on', name: 'Not Switching On' },
      { id: 'other', name: 'Other Issue' },
    ],
  },
  {
    id: 'laptop',
    name: 'Laptop',
    icon: Laptop,
    image: getImage('laptop-repair'),
    problems: [
      { id: 'screen-issue', name: 'Screen Issue' },
      { id: 'battery-issue', name: 'Battery Issue' },
      { id: 'slow-performance', name: 'Slow Performance' },
      { id: 'keyboard-issue', name: 'Keyboard Issue' },
      { id: 'os-software-issue', name: 'OS/Software Issue' },
      { id: 'not-starting', name: 'Not Starting' },
      { id: 'other', name: 'Other Issue' },
    ],
  },
  {
    id: 'ac',
    name: 'AC',
    icon: AirVent,
    image: getImage('ac-repair'),
    problems: [
      { id: 'not-cooling', name: 'Not Cooling' },
      { id: 'gas-leakage', name: 'Gas Leakage' },
      { id: 'installation-uninstallation', name: 'Installation / Uninstallation' },
      { id: 'service-cleaning', name: 'Service / Cleaning' },
      { id: 'noise-issue', name: 'Noise Issue' },
      { id: 'other', name: 'Other Issue' },
    ],
  },
  {
    id: 'fridge',
    name: 'Fridge',
    icon: Refrigerator,
    image: getImage('fridge-repair'),
    problems: [
      { id: 'not-cooling', name: 'Not Cooling' },
      { id: 'water-leakage', name: 'Water Leakage' },
      { id: 'compressor-issue', name: 'Compressor Issue' },
      { id: 'noise-issue', name: 'Noise Issue' },
      { id: 'other', name: 'Other Issue' },
    ],
  },
  {
    id: 'cooler',
    name: 'Air Cooler',
    icon: Fan,
    image: getImage('cooler-repair'),
    problems: [
      { id: 'not-cooling', name: 'Not Cooling' },
      { id: 'motor-issue', name: 'Motor Issue' },
      { id: 'water-pump-issue', name: 'Water Pump Issue' },
      { id: 'power-issue', name: 'Power Issue' },
      { id: 'other', name: 'Other Issue' },
    ],
  },
];
