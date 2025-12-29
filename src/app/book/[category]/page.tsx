'use client';
import { serviceCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProblemSelectionPage({ params }: { params: { category: string } }) {
  const { category: categoryId } = params;
  const { t, getTranslatedCategory } = useTranslation();

  const originalCategory = serviceCategories.find((c) => c.id === categoryId);

  if (!originalCategory) {
    notFound();
  }

  const category = getTranslatedCategory(originalCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl font-headline">
            {t('whatsTheProblemWithYour')} {category.name}?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {category.problems.map((problem) => (
              <Link
                href={`/book/${categoryId}/${problem.id}`}
                key={problem.id}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                    <div className="relative w-full aspect-square">
                       <Image
                        src={problem.image.imageUrl}
                        alt={problem.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                        data-ai-hint={problem.image.imageHint}
                      />
                    </div>
                    <div className="p-3 text-center w-full bg-card">
                      <h3 className="font-medium text-sm md:text-base">{problem.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
