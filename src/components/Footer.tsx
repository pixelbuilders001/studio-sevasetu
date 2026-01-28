
'use client';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();
    const socialLinks = [
        { icon: Facebook, href: '#', 'aria-label': 'Facebook' },
        { icon: Twitter, href: '#', 'aria-label': 'Twitter' },
        { icon: Instagram, href: 'https://www.instagram.com/hellofixo.in', 'aria-label': 'Instagram' },
        { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn' },
    ];
    return (
        <footer className="bg-muted/50 border-t hidden md:block">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="/logo-image.png"
                                alt="Hellofixo"
                                width={120}
                                height={38}
                                className="object-contain h-10 w-auto"
                            />
                        </Link>
                        <p className="text-muted-foreground text-sm">{t('footerTagline')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">{t('footerQuickLinks')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#services" className="text-muted-foreground hover:text-primary">{t('ourServices')}</a></li>
                            <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary">{t('howItWorksTitle')}</a></li>
                            <li><a href="#why-choose-us" className="text-muted-foreground hover:text-primary">{t('whyChooseUs')}</a></li>
                            <li><Link href="https://technician.hellofixo.in/signup" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">Become a Partner</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">{t('footerContactUs')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="mailto:hellofixo.services@gmail.com" className="hover:text-primary">hellofixo.support@gmail.com</a></li>
                            <li><a href="tel:+9661313766" className="hover:text-primary">+91 9661313766</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">{t('footerFollowUs')}</h4>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social['aria-label']}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social['aria-label']}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p className="text-muted-foreground">&copy; {new Date().getFullYear()} {t('appName')}. {t('footerAllRightsReserved')}</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <Link href="/privacy" className="text-muted-foreground hover:text-primary">{t('footerPrivacyPolicy')}</Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-primary">{t('footerTermsOfService')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
