import { serviceCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProblemSelectionPage({ params }: { params: { category: string } }) {
  const { category: categoryId } = params;
  const category = serviceCategories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl font-headline">
            What's the problem with your {category.name}?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.problems.map((problem) => (
              <Link
                href={`/book/${categoryId}/${problem.id}`}
                key={problem.id}
                className="group"
              >
                <div className="p-4 border rounded-lg hover:bg-accent/10 hover:border-accent transition-colors flex justify-between items-center h-full">
                  <span className="font-medium">{problem.name}</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
