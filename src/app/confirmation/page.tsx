import { Suspense } from 'react';
import ConfirmationPageContent from '@/components/ConfirmationPageContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ConfirmationSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Mobile Skeleton */}
      <div className="md:hidden max-w-md mx-auto space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full mx-auto" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block max-w-5xl mx-auto space-y-12 pt-12">
        <div className="flex flex-col items-center space-y-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-1/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <Skeleton className="h-64 w-full rounded-[2rem]" />
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-48 rounded-[2rem]" />
          <Skeleton className="h-48 rounded-[2rem]" />
        </div>
      </div>
    </div>
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
