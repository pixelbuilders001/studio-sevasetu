import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
                        <h1 className="text-2xl font-black text-[#1e1b4b]">Privacy Policy</h1>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Updated: January 2026</p>
                    </div>
                </div>

                <div className="space-y-8 text-sm md:text-base text-slate-700 leading-relaxed">
                    <section>
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <p className="font-medium text-slate-900 mb-4">
                            Welcome to <span className="font-bold text-indigo-600">helloFixo</span>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">1. Information We Collect</h2>
                        <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-indigo-400">
                            <li><span className="font-bold text-slate-900">Identity Data:</span> includes first name, last name, username or similar identifier.</li>
                            <li><span className="font-bold text-slate-900">Contact Data:</span> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><span className="font-bold text-slate-900">Technical Data:</span> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">2. How We Use Your Personal Data</h2>
                        <p className="mb-2">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-indigo-400">
                            <li>To register you as a new customer.</li>
                            <li>To process and deliver your order/service request.</li>
                            <li>To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">3. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#1e1b4b] mb-3">4. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy, please contact us at: <a href="mailto:[EMAIL_ADDRESS]" className="text-indigo-600 font-bold hover:underline">hellofixo.support@gmail.com</a>
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
