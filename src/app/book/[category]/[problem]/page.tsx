import { serviceCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Wrench } from 'lucide-react';


function EstimationSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-primary">AI-Powered Diagnosis</h3>
        <Skeleton className="h-4 w-full mt-1" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
      <div>
        <h3 className="font-semibold text-primary">Estimated Repair Price</h3>
        <Skeleton className="h-8 w-1/2 mt-1" />
      </div>
    </div>
  );
}

export default function PriceEstimationPage({ params }: { params: { category: string; problem: string } }) {
  const { category: categoryId, problem: problemId } = params;
  const category = serviceCategories.find((c) => c.id === categoryId);
  const problem = category?.problems.find((p) => p.id === problemId);

  if (!category || !problem) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Price Estimate</CardTitle>
          <CardDescription>For your {category.name} with a "{problem.name}" issue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Wrench className="w-6 h-6 text-primary" />
              <span className="font-semibold">Fixed Inspection Charge</span>
            </div>
            <span className="text-lg font-bold">₹199</span>
          </div>

          <div className="flex items-start gap-3 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>The final price will be confirmed by the technician after a physical inspection of the device.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Link href={`/book/${categoryId}/${problemId}/details`}>Proceed to Book</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
