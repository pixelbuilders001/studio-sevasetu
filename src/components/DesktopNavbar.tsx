'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
import { User } from 'lucide-react';

export function DesktopNavbar() {
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);
    const [authOpen, setAuthOpen] = useState(false);
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();

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

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '#services', label: 'Services' },
        { href: '#how-it-works', label: 'How it Works' },
        { href: '#why-choose-us', label: 'Why Us' },
    ];

    return (
        <header className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center">
            <div className="flex items-center gap-10 px-8 py-3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-full transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:bg-white/80">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter text-[#1e1b4b]">
                        HELLO<span className="text-primary">FIXO</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-xs font-black uppercase tracking-widest transition-all hover:text-primary active:scale-95",
                                pathname === link.href || (pathname === '/' && link.href === '/')
                                    ? "text-primary"
                                    : "text-[#1e1b4b]/60"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
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
        </header>
    );
}
