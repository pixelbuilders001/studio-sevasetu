
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Zap, Clock, Award, Heart, ArrowRight } from 'lucide-react';

export default function BecomePartner() {
  const benefits = [
    { icon: Zap, text: 'Earn up to ₹40k / month' },
    { icon: Clock, text: 'Flexible working hours' },
    { icon: Award, text: 'Get trained & certified' },
    { icon: Heart, text: 'Weekly timely payouts' },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Briefcase className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Become a Partner</CardTitle>
                <CardDescription className="text-blue-300 uppercase font-semibold tracking-wider">Join our technician network</CardDescription>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Unlock higher earnings and flexible hours by joining the #1 service network in Bihar.
            </p>
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                  <benefit.icon className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-gray-200">{benefit.text}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg h-14 rounded-full">
              <Link href="/partner/register">
                REGISTER NOW
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
