
import { getServiceCategory, getTranslatedCategory, ServiceCategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/lib/get-translation';
import ProblemSelectionClient from './ProblemSelectionClient';

export default async function ProblemSelectionPage({ params, searchParams }: { params: { category: string }, searchParams: { lang?: string } }) {
  const categorySlug = params.category;
  const lang = searchParams?.lang || 'en';
  const t = getTranslations(lang);
  
  const originalCategory = await getServiceCategory(categorySlug);
  
  if (!originalCategory) {
    notFound();
  }
  
  const category = getTranslatedCategory(originalCategory, t);

  return <ProblemSelectionClient category={category} />;
}
