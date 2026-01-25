'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { HellofixoLogo } from '@/components/HellofixoLogo';
import LocationSelector from '@/components/LocationSelector';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { ProfileSheet } from '@/components/profile/ProfileSheet';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import UserAuthSheet from '@/components/UserAuthSheet';
import { User, ChevronDown } from 'lucide-react';
import { getServiceCategoriesAction } from '@/app/actions';
import { ServiceCategory } from '@/lib/data';
import ServicesMegaMenu from './ServicesMegaMenu';

export function DesktopNavbar() {
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);
    const [authOpen, setAuthOpen] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();

        const fetchCategories = async () => {
            const cats = await getServiceCategoriesAction();
            setCategories(cats);
        };
        fetchCategories();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session && authOpen) {
                setAuthOpen(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth, authOpen]);

    const toggleServices = (e: React.MouseEvent) => {
        e.preventDefault();
        setMegaMenuOpen(!megaMenuOpen);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '#services', label: 'Services' },
        { href: '#how-it-works', label: 'How it Works' },
        { href: '#why-choose-us', label: 'Why Us' },
    ];

    return (
        <header className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center">
            <div className="relative z-[60] flex items-center gap-10 px-8 py-3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-full transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:bg-white/80">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo-image.png"
                        alt="hellofixo"
                        width={90}
                        height={28}
                        className="object-contain h-8 w-auto"
                        priority
                    />
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isServices = link.label === 'Services';
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={isServices ? toggleServices : undefined}
                                className={cn(
                                    "text-xs font-black uppercase tracking-widest transition-all hover:text-primary active:scale-95 py-2 flex items-center gap-1.5",
                                    pathname === link.href || (pathname === '/' && link.href === '/') || (isServices && megaMenuOpen)
                                        ? "text-primary"
                                        : "text-[#1e1b4b]/60"
                                )}
                            >
                                {link.label}
                                {isServices && (
                                    <ChevronDown
                                        className={cn(
                                            "w-3.5 h-3.5 transition-transform duration-300",
                                            megaMenuOpen ? "rotate-180 text-primary" : "opacity-40"
                                        )}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="w-px h-6 bg-[#1e1b4b]/10" />

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    <div className="scale-90 origin-right">
                        <LocationSelector isHero={false} />
                    </div>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <ProfileSheet isHero={false} />
                        </div>
                    ) : (

                        <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-full px-8 py-6 font-black tracking-widest bg-[#1e1b4b] hover:bg-primary text-white shadow-xl shadow-indigo-100 transition-all uppercase text-xs">
                                    Login
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none">
                                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <UserAuthSheet setSheetOpen={setAuthOpen} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <ServicesMegaMenu
                isOpen={megaMenuOpen}
                categories={categories}
                onClose={() => setMegaMenuOpen(false)}
            />
        </header>
    );
}
