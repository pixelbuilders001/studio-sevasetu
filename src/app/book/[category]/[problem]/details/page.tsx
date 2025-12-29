import { serviceCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/BookingForm';

export default function BookingDetailsPage({ params }: { params: { category: string; problem: string } }) {
  const { category: categoryId, problem: problemId } = params;
  const category = serviceCategories.find((c) => c.id === categoryId);
  const problem = category?.problems.find((p) => p.id === problemId);

  if (!category || !problem) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Your Details</CardTitle>
          <CardDescription>
            Almost there! Please provide your details to book a technician for your {category.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingForm category={category.name} problem={problem.name} />
        </CardContent>
      </Card>
    </div>
  );
}
