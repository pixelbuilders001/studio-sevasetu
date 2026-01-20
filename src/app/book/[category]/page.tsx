
import { getServiceCategory, getTranslatedCategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/lib/get-translation';
import ProblemSelectionClient from './ProblemSelectionClient';

export default async function ProblemSelectionPage({
  params,
  searchParams
}: {
  params: Promise<{ category: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const { category: categorySlug } = await params;
  const { lang = 'en' } = await searchParams;

  const originalCategory = await getServiceCategory(categorySlug);

  if (!originalCategory) {
    notFound();
  }

  // We can't pass the icon component to the client, so we remove it.
  const { icon, ...categoryWithoutIcon } = originalCategory;

  return <ProblemSelectionClient category={{ ...categoryWithoutIcon, iconName: originalCategory.icon }} />;
}
