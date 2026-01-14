'use client';
import Link from 'next/link';
import { Home, LayoutGrid, Wallet, Briefcase, History } from 'lucide-react';
import BookingTrackerModal from './BookingTrackerModal';
import { useTranslation } from '@/hooks/useTranslation';
import AllServicesSheet from './AllServicesSheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import BookingHistorySheet from './BookingHistorySheet';
import WalletSheet from '@/components/wallet/WalletSheet';

export default function BottomNavBar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/',
      component: null
    },
    {
      href: '#',
      label: 'Services',
      icon: LayoutGrid,
      isActive: false,
      component: (
        <Sheet>
          <SheetTrigger className={cn("flex flex-col items-center justify-center text-center transition-all w-full h-full active:scale-95 duration-200", 'text-muted-foreground')}>
            <div className="relative">
              <LayoutGrid className="w-6 h-6 mb-1" />
            </div>
            <span className="text-[10px] font-medium leading-none">Services</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-3xl">
            <AllServicesSheet />
          </SheetContent>
        </Sheet>
      )
    },
    {
      href: '#',
      label: 'Bookings',
      icon: History,
      isActive: false,
      component: (
        <BookingHistorySheet>
          <button className={cn("flex flex-col items-center justify-center text-center transition-all w-full h-full active:scale-95 duration-200", 'text-muted-foreground')}>
            <div className="relative">
              <History className="w-6 h-6 mb-1" />
            </div>
            <span className="text-[10px] font-medium leading-none">Bookings</span>
          </button>
        </BookingHistorySheet>
      )
    },
    {
      href: '#',
      label: 'Wallet',
      icon: Wallet,
      isActive: false,
      component: (
        <WalletSheet>
          <button className={cn("flex flex-col items-center justify-center text-center transition-all w-full h-full active:scale-95 duration-200", 'text-muted-foreground')}>
            <div className="relative">
              <Wallet className="w-6 h-6 mb-1" />
            </div>
            <span className="text-[10px] font-medium leading-none">Wallet</span>
          </button>
        </WalletSheet>
      ),
      isExternal: false,
    },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none md:hidden pb-4">
      <div className="mx-4 mb-2 pointer-events-auto bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full">
        <nav className="h-16 relative">
          <ul className="flex justify-around items-center h-full px-2">
            {navItems.map((item) => (
              <li key={item.label} className="flex-1 h-full flex items-center justify-center group">
                {item.component ? item.component : (
                  item.isExternal ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors h-full w-full active:scale-95 duration-200">
                      <item.icon className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium leading-none">{item.label}</span>
                    </a>
                  ) : (
                    <Link href={item.href} className={cn("flex flex-col items-center justify-center text-center transition-all h-full w-full active:scale-95 duration-200 relative", item.isActive ? 'text-primary' : 'text-muted-foreground')}>
                      <div className={cn("relative transition-all duration-300", item.isActive && "-translate-y-1")}>
                        <item.icon className={cn("w-6 h-6 mb-1 transition-all", item.isActive && "transform scale-110")} />
                        {item.isActive && (
                          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full animate-fade-in" />
                        )}
                      </div>
                      <span className={cn("text-[10px] font-medium leading-none transition-all", item.isActive ? "font-bold" : "font-medium")}>{item.label}</span>
                    </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
