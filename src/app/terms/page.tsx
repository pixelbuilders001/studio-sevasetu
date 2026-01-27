import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ScrollText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-card relative">
            <div className="container mx-auto px-4 py-8 max-w-3xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#1e1b4b]">Terms & Conditions</h1>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Updated: January 2026</p>
                    </div>
                </div>

                <div className="space-y-8 text-sm md:text-base text-slate-700 leading-relaxed">
                    <section>
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                            <ScrollText className="w-6 h-6" />
                        </div>
                        <p className="font-medium text-slate-900 mb-4">
                            These terms and conditions outline the rules and regulations for the use of <span className="font-bold text-indigo-600">helloFixo's</span> Website and Services. By accessing this website we assume you accept these terms and conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">1. Services</h2>
                        <p>helloFixo provides a platform to connect users with verified technicians for various home services. We accept liability for the quality of work as per our warranty terms ("30 Days Warranty"), but please refer to our service-specific contracts for detailed exclusions.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">2. Booking & Cancellation</h2>
                        <ul className="list-disc pl-5 space-y-1 marker:text-indigo-400">
                            <li>You agree to provide accurate location and contact information when booking.</li>
                            <li>Cancellations made less than 1 hour before the scheduled time may incur a convenience fee.</li>
                            <li>Technicians have the right to refuse service if safety conditions are not met.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">3. Payments</h2>
                        <p>We do not store your credit card information. Payments are processed via secure third-party gateways. You may also pay via cash or UPI to the technician upon job completion ("Pay Post Repair").</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">4. Limitation of Liability</h2>
                        <p>In no event shall helloFixo, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">5. Intellectual Property</h2>
                        <p>
                            All content included on this site, such as text, graphics, logos, images, is the property of helloFixo or its content suppliers and protected by copyright laws.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">&copy; 2026 helloFixo. All rights reserved.</p>
                </div>

            </div>
        </div>
    );
}
