import { Suspense } from 'react';
import ConfirmationPageContent from '@/components/ConfirmationPageContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ConfirmationSkeleton() {
  return (
    <Card className="max-w-md mx-auto animate-pulse">
        <CardHeader>
          <CardTitle className="text-center">
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-8 w-1/3 mx-auto" />
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
    </Card>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="flex-grow container mx-auto px-4 py-8 md:py-16">
      <Suspense fallback={<ConfirmationSkeleton />}>
        <ConfirmationPageContent />
      </Suspense>
    </div>
  );
}
