
import { getServiceCategory, getTranslatedCategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/lib/get-translation';
import ProblemSelectionClient from './ProblemSelectionClient';

export default function ProblemSelectionPage({ params, searchParams }: { params: { category: string }, searchParams: { lang?: string } }) {
  const categorySlug = params.category;
  const lang = searchParams?.lang || 'en';
  const t = getTranslations(lang);
  
  const originalCategory = getServiceCategory(categorySlug);
  
  if (!originalCategory) {
    notFound();
  }
  
  const category = getTranslatedCategory(originalCategory, t);

  // We can't pass the icon component to the client, so we remove it.
  const { icon, ...categoryWithoutIcon } = category;

  return <ProblemSelectionClient category={{ ...categoryWithoutIcon, iconName: category.icon }} />;
}
