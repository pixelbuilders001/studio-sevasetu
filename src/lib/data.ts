import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Smartphone, Laptop, AirVent, Refrigerator, Fan } from 'lucide-react';

export type Problem = {
  id: string;
  name: string;
  image: ImagePlaceholder;
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
      { id: 'screen-broken', name: 'Screen Broken', image: getImage('phone-screen-broken') },
      { id: 'battery-issue', name: 'Battery Issue', image: getImage('phone-battery-issue') },
      { id: 'charging-problem', name: 'Charging Problem', image: getImage('phone-charging-problem') },
      { id: 'mic-speaker-issue', name: 'Mic/Speaker Issue', image: getImage('phone-mic-speaker-issue') },
      { id: 'not-switching-on', name: 'Not Switching On', image: getImage('phone-not-switching-on') },
      { id: 'other', name: 'Other Issue', image: getImage('other-issue') },
    ],
  },
  {
    id: 'laptop',
    name: 'Laptop',
    icon: Laptop,
    image: getImage('laptop-repair'),
    problems: [
      { id: 'screen-issue', name: 'Screen Issue', image: getImage('laptop-screen-issue') },
      { id: 'battery-issue', name: 'Battery Issue', image: getImage('laptop-battery-issue') },
      { id: 'slow-performance', name: 'Slow Performance', image: getImage('laptop-slow-performance') },
      { id: 'keyboard-issue', name: 'Keyboard Issue', image: getImage('laptop-keyboard-issue') },
      { id: 'os-software-issue', name: 'OS/Software Issue', image: getImage('laptop-os-software-issue') },
      { id: 'not-starting', name: 'Not Starting', image: getImage('laptop-not-starting') },
      { id: 'other', name: 'Other Issue', image: getImage('other-issue') },
    ],
  },
  {
    id: 'ac',
    name: 'AC',
    icon: AirVent,
    image: getImage('ac-repair'),
    problems: [
      { id: 'not-cooling', name: 'Not Cooling', image: getImage('ac-not-cooling') },
      { id: 'gas-leakage', name: 'Gas Leakage', image: getImage('ac-gas-leakage') },
      { id: 'installation-uninstallation', name: 'Installation / Uninstallation', image: getImage('ac-installation') },
      { id: 'service-cleaning', name: 'Service / Cleaning', image: getImage('ac-service-cleaning') },
      { id: 'noise-issue', name: 'Noise Issue', image: getImage('ac-noise-issue') },
      { id: 'other', name: 'Other Issue', image: getImage('other-issue') },
    ],
  },
  {
    id: 'fridge',
    name: 'Fridge',
    icon: Refrigerator,
    image: getImage('fridge-repair'),
    problems: [
      { id: 'not-cooling', name: 'Not Cooling', image: getImage('fridge-not-cooling') },
      { id: 'water-leakage', name: 'Water Leakage', image: getImage('fridge-water-leakage') },
      { id: 'compressor-issue', name: 'Compressor Issue', image: getImage('fridge-compressor-issue') },
      { id: 'noise-issue', name: 'Noise Issue', image: getImage('fridge-noise-issue') },
      { id: 'other', name: 'Other Issue', image: getImage('other-issue') },
    ],
  },
  {
    id: 'cooler',
    name: 'Air Cooler',
    icon: Fan,
    image: getImage('cooler-repair'),
    problems: [
      { id: 'not-cooling', name: 'Not Cooling', image: getImage('cooler-not-cooling') },
      { id: 'motor-issue', name: 'Motor Issue', image: getImage('cooler-motor-issue') },
      { id: 'water-pump-issue', name: 'Water Pump Issue', image: getImage('cooler-water-pump-issue') },
      { id: 'power-issue', name: 'Power Issue', image: getImage('cooler-power-issue') },
      { id: 'other', name: 'Other Issue', image: getImage('other-issue') },
    ],
  },
];
