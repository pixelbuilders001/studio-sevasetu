'use client';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();
    const socialLinks = [
        { icon: Facebook, href: '#', 'aria-label': 'Facebook' },
        { icon: Twitter, href: '#', 'aria-label': 'Twitter' },
        { icon: Instagram, href: '#', 'aria-label': 'Instagram' },
        { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn' },
    ];
    return (
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h3 className="text-xl font-bold font-headline text-primary mb-2">{t('appName')}</h3>
                    <p className="text-muted-foreground text-sm">{t('footerTagline')}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">{t('footerQuickLinks')}</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#services" className="text-muted-foreground hover:text-primary">{t('ourServices')}</a></li>
                        <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary">{t('howItWorksTitle')}</a></li>
                        <li><a href="#why-choose-us" className="text-muted-foreground hover:text-primary">{t('whyChooseUs')}</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">{t('footerContactUs')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="mailto:support@sevasetu.com" className="hover:text-primary">support@sevasetu.com</a></li>
                        <li><a href="tel:+911234567890" className="hover:text-primary">+91 12345 67890</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">{t('footerFollowUs')}</h4>
                    <div className="flex space-x-4">
                        {socialLinks.map((social) => (
                            <a key={social['aria-label']} href={social.href} aria-label={social['aria-label']} className="text-muted-foreground hover:text-primary">
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                <p className="text-muted-foreground">&copy; {new Date().getFullYear()} {t('appName')}. {t('footerAllRightsReserved')}</p>
                <div className="flex gap-4 mt-4 sm:mt-0">
                    <Link href="#" className="text-muted-foreground hover:text-primary">{t('footerPrivacyPolicy')}</Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary">{t('footerTermsOfService')}</Link>
                </div>
            </div>
        </div>
      </footer>
    );
  }