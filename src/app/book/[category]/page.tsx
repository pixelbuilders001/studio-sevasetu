
import { getServiceCategory, getTranslatedCategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/lib/get-translation';
import ProblemSelectionClient from './ProblemSelectionClient';
import { Metadata } from 'next';

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ category: string }>, searchParams: Promise<{ lang?: string }> }
): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getServiceCategory(categorySlug);

  if (!category) {
    return {
      title: 'Service Not Found - Hellofixo',
    };
  }

  const title = `${category.name} Repair Service in Bihar | Hellofixo`;
  const description = `Professional ${category.name.toLowerCase()} repair services at your doorstep in Bihar. Certified technicians, fast visit, and guaranteed quality. Book your ${category.name.toLowerCase()} service today!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [category.image.imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category.image.imageUrl],
    },
  };
}

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
