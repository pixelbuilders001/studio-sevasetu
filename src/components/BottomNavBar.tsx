
'use client';
import Link from 'next/link';
import { Home, LayoutGrid, MessageSquare, Briefcase } from 'lucide-react';
import BookingTrackerModal from './BookingTrackerModal';
import { useTranslation } from '@/hooks/useTranslation';
import AllServicesSheet from './AllServicesSheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
        <AllServicesSheet>
          <button className={cn("flex flex-col items-center justify-center text-center transition-colors w-full h-full", 'text-muted-foreground')}>
            <LayoutGrid className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Services</span>
          </button>
        </AllServicesSheet>
      )
    },
    {
      href: '#',
      label: 'Booking',
      icon: Briefcase,
      isActive: false,
      component: (
        <BookingTrackerModal isMobile={true} asChild={true}>
          <button className={cn("flex flex-col items-center justify-center text-center transition-colors w-full h-full", 'text-muted-foreground')}>
            <Briefcase className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Booking</span>
          </button>
        </BookingTrackerModal>
      )
    },
    {
      href: 'https://wa.me/910000000000',
      label: 'Help',
      icon: MessageSquare,
      isActive: false,
      component: null,
      isExternal: true,
    },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t shadow-t-lg md:hidden z-50">
      <nav className="h-full">
        <ul className="flex justify-around items-center h-full">
           {navItems.map((item) => (
             <li key={item.label} className="flex-1 h-full">
                {item.component ? item.component : (
                  item.isExternal ? (
                     <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors h-full">
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                     </a>
                  ) : (
                     <Link href={item.href} className={cn("flex flex-col items-center justify-center text-center transition-colors h-full", item.isActive ? 'text-primary' : 'text-muted-foreground')}>
                        <div className={cn('flex items-center justify-center w-12 h-8 rounded-lg mb-1', item.isActive ? 'bg-primary text-primary-foreground' : '')}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                     </Link>
                  )
                )}
             </li>
           ))}
        </ul>
      </nav>
    </footer>
  );
}
