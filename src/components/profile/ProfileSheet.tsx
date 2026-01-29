'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  History,
  Wallet,
  MapPin,
  ChevronRight,
  LogOut,
  Gift,
  Copy,
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { getInitialProfileDataAction } from '@/app/actions';
import { EditProfileModal } from './EditProfileModal';
import { AddressManagementModal } from './AddressManagementModal';
import { BookingHistoryModal } from './BookingHistoryModal';
import { WalletModal } from './WalletModal';
import ShareAppButton from '@/components/ShareAppButton';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import FullScreenLoader from '@/components/FullScreenLoader';
import { cn } from '@/lib/utils';

/* ---------------- TYPES ---------------- */

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  phone: string;
  created_at: string;
  referral_code?: string;
}

/* ---------------- UI COMPONENTS ---------------- */

const MenuItem = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full px-3 py-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-indigo-50">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <span className="font-bold text-xs text-[#1e1b4b]">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
  </button>
);

/* ---------------- REFER & EARN CARD ---------------- */
const ReferEarnCard = ({ code }: { code: string }) => {
  const { toast } = useToast();

  const shareReferral = async () => {
    const referralUrl = `https://hellofixo.in?ref=${code}`;
    const text = `Hey! 🎁 Get ₹50 OFF on your first doorstep repair with helloFixo!\n\nUse my referral code: ${code}\n\n✅ Certified technicians\n✅ 60-min doorstep service\n✅ 30-day warranty\n\nBook now:`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Get ₹50 OFF with helloFixo! 🛠️',
          text: text,
          url: referralUrl,
        });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + referralUrl)}`, '_blank');
      }
    } catch { }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Referral code copied' });
  };


  return (
    <div className="bg-indigo-50/50 border border-dashed border-indigo-200 rounded-2xl p-4 relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-indigo-50">
          <Gift className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-indigo-950">Refer & Earn ₹50</h3>
            <button onClick={shareReferral} className="p-1.5 bg-white rounded-md border border-indigo-50 text-indigo-600 active:scale-90 transition-transform">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-indigo-900/60 font-medium leading-tight">
            Invite friends and you both get ₹50 off
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-lg p-1.5 border border-indigo-50">
        <span className="font-bold tracking-[0.1em] text-indigo-900 font-mono text-xs ml-2">{code}</span>
        <Button
          size="sm"
          onClick={copyCode}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] px-4 h-8 rounded-lg shadow-lg shadow-primary/20"
        >
          COPY
        </Button>
      </div>
    </div>
  );
};

/* ---------------- USER DETAILS CARD ---------------- */

const UserDetailsCard = ({ profile, onEdit }: { profile: UserProfile, onEdit: () => void }) => {
  const details = [
    profile.full_name && {
      label: 'Full Name',
      value: profile.full_name,
      icon: User,
    },
    profile.phone && {
      label: 'Phone Number',
      value: profile.phone,
      icon: Phone,
    },
    {
      label: 'Email ID',
      value: profile.email,
      icon: Mail,
    },
    {
      label: 'Account Created',
      value: format(new Date(profile.created_at), 'dd MMM yyyy'),
      icon: Calendar,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    icon: any;
  }[];


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">
          Personal Details
        </h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md px-2"
          onClick={onEdit}
        >
          <Edit className="w-3 h-3 mr-1" />
          EDIT
        </Button>
      </div>

      <div className="divide-y divide-gray-50">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-3.5 h-3.5 text-indigo-600" />
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="text-xs font-bold text-[#1e1b4b] truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


/* ---------------- SKELETON ---------------- */

const ProfileSkeleton = () => (
  <div className="p-6 space-y-6">
    <Skeleton className="h-40 rounded-2xl" />
    <div className="flex justify-center -mt-14">
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>
    <Skeleton className="h-6 w-40 mx-auto" />
    <Skeleton className="h-4 w-56 mx-auto" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  </div>
);

/* ---------------- MAIN CONTENT ---------------- */

function ProfileContent({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const { loading: authLoading, session: authSession, signOut } = useAuth();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const editProfileData = useMemo(() => profile ? { full_name: profile.full_name, phone: profile.phone } : null, [profile?.full_name, profile?.phone]);

  useEffect(() => {
    const init = async () => {
      if (!isOpen || authLoading) return;
      try {
        setLoading(true);
        console.log('ProfileSheet/Content: Initializing profile data, authLoading is false');
        const result = await getInitialProfileDataAction();

        if (result.success) {
          const { profile: p, walletBalance: balance, referralCode: refCode, user: authUser } = result;

          if (p) {
            setProfile({
              ...p,
              referral_code: refCode || p.referral_code || '',
            });
          } else if (authUser) {
            // Fallback to auth user info
            setProfile({
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || '',
              role: 'user',
              phone: authUser.phone || '',
              created_at: authUser.created_at || new Date().toISOString(),
              referral_code: refCode || '',
            } as UserProfile);

            toast({
              title: "Profile Not Found",
              description: "Showing basic account info.",
            });
          }
          setWalletBalance(balance);
        } else {
          console.error("Profile data error:", result.error);
          if (result.error === "Not authenticated") {
            // One-time retry after a short delay (PWA hydration catch-up)
            console.log('ProfileSheet/Content: Not authenticated, retrying in 1.5s...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            const retryResult = await getInitialProfileDataAction();
            if (retryResult.success) {
              console.log('ProfileSheet/Content: Retry successful!');
              const { profile: p, walletBalance: balance, referralCode: refCode, user: authUser } = retryResult;
              if (p) {
                setProfile({ ...p, referral_code: refCode || p.referral_code || '' });
              } else if (authUser) {
                setProfile({
                  id: authUser.id,
                  email: authUser.email || '',
                  full_name: authUser.user_metadata?.full_name || '',
                  role: 'user',
                  phone: authUser.phone || '',
                  created_at: authUser.created_at || new Date().toISOString(),
                  referral_code: refCode || '',
                } as UserProfile);
              }
              setWalletBalance(balance);
              return;
            }
          }

          if (result.error !== "Not authenticated") {
            toast({
              title: "Error",
              description: "Failed to load profile data.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize profile:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isOpen, toast]);

  const refreshProfile = async () => {
    const result = await getInitialProfileDataAction();
    if (result.success && result.profile) {
      setProfile({
        ...result.profile,
        referral_code: result.referralCode || result.profile.referral_code || '',
      });
      setWalletBalance(result.walletBalance);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    // Add small delay to show loader 
    await new Promise(resolve => setTimeout(resolve, 800));

    await signOut();

    toast({ title: 'Logged out successfully' });
    router.push('/');
    setLoggingOut(false);
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  if (loggingOut) return <FullScreenLoader message="Logging out..." />;
  if (loading) return <ProfileSkeleton />;

  if (!profile)
    return (
      <div className="p-8 text-center">
        <h3 className="font-semibold text-lg">Not Logged In</h3>
        <Button className="mt-4" onClick={() => router.push('/')}>
          Sign In
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <div
          className="relative bg-primary h-28 rounded-b-[2rem] shadow-lg"
          style={{
            backgroundImage: `
              linear-gradient(
                to bottom right,
                rgba(79, 70, 229, 0.9),
                rgba(30, 27, 75, 0.95)
              ),
              url('https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10 h-7 px-3"
              onClick={() => {
                // Open modal on desktop, navigate on mobile for consistency
                if (window.innerWidth >= 768) {
                  setIsWalletModalOpen(true);
                } else {
                  router.push('/wallet');
                }
              }}
            >
              <Wallet className="w-3.5 h-3.5 mr-2" />
              <span className="font-bold text-xs">₹{walletBalance}</span>
            </Button>
          </div>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center -mt-10">
          <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
            <AvatarFallback className="text-xl font-bold bg-indigo-50 text-indigo-600">
              {initials(profile.full_name || profile.email)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* NAME */}
        <div className="text-center mt-2">
          <h2 className="text-lg font-bold text-[#1e1b4b]">{profile.full_name || 'Guest User'}</h2>
          <p className="text-[10px] font-medium text-gray-500 mt-0.5 uppercase tracking-widest">{profile.email}</p>
        </div>

        {/* REFER & EARN */}
        <div className="px-4 mt-4">
          <ReferEarnCard code={profile.referral_code!} />
        </div>

        <div className="px-4 mt-4">
          <UserDetailsCard profile={profile} onEdit={() => setIsEditModalOpen(true)} />
        </div>

        {/* MENU */}
        <div className="px-4 mt-4 space-y-2">
          <MenuItem
            icon={History}
            label="Booking History"
            onClick={() => setIsBookingModalOpen(true)}
          />
          <MenuItem
            icon={Wallet}
            label="My Wallet"
            onClick={() => setIsWalletModalOpen(true)}
          />
          <MenuItem
            icon={MapPin}
            label="Saved Addresses"
            onClick={() => setIsAddressModalOpen(true)}
          />
          <div className="pt-2">
            <ShareAppButton
              variant="default"
              className="w-full h-12 rounded-xl text-xs uppercase font-bold"
              label="Share helloFixo App"
            />
          </div>
        </div>

        {/* LOGOUT */}
        <div className="px-4 mt-6 pb-8">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 
        text-xs font-bold text-red-500 hover:text-red-600 
        hover:bg-red-50 rounded-xl py-2.5 border border-red-100 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={editProfileData}
        onProfileUpdated={refreshProfile}
      />
      <AddressManagementModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
      <BookingHistoryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}

/* ---------------- SHEET ---------------- */

export function ProfileSheet({ isHero }: { isHero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isHero ? (
          <div className="w-10 h-10 bg-primary/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 cursor-pointer active:scale-90 transition-transform shadow-lg group">
            <User className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </div>
        ) : (
          <Button size="icon" variant="outline" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "left" : "right"}
        className={cn(
          "p-0 flex flex-col overflow-hidden bg-white dark:bg-card",
          isMobile ? "w-[85vw] h-full animate-in slide-in-from-left duration-500" : "w-full md:max-w-md h-full duration-300 animate-in slide-in-from-right"
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Profile</SheetTitle>
        </SheetHeader>
        {open && <ProfileContent isOpen={open} />}
      </SheetContent>
    </Sheet>
  );
}
