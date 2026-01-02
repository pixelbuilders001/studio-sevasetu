'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PartnerSuccessPage() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-md flex items-center justify-center min-h-[70vh]">
      <Card className="w-full text-center">
        <CardHeader className="items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-bold">Application Submitted!</CardTitle>
          <CardDescription>
            Thank you for registering. We will verify your details and our team will contact you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
