'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { getUserProfile } from '@/app/actions';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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

const StatCard = ({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: any;
  label: string;
  value: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1 bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition"
  >
    <Icon className="w-6 h-6 text-primary" />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </button>
);

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
    className="flex items-center justify-between w-full px-4 py-4 bg-white rounded-xl shadow-sm border hover:bg-gray-50"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);

/* ---------------- REFER & EARN CARD ---------------- */
/* ---------------- REFER & EARN CARD (BLUE THEME) ---------------- */

const ReferEarnCard = ({ code }: { code: string }) => {
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Referral code copied' });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 text-white 
      bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 
      shadow-md">

      {/* subtle glow */}
      <div className="absolute inset-0 bg-white/10 opacity-30 animate-soft-glow" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-base">Refer & Earn ₹50</h3>
          <p className="text-sm opacity-90">
            You & your friend both get ₹50 off
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between 
        bg-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
        <span className="font-mono tracking-wider text-sm">{code}</span>
        <Button size="icon" variant="ghost" onClick={copyCode}>
          <Copy className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

/* ---------------- USER DETAILS CARD ---------------- */

const UserDetailsCard = ({ profile }: { profile: UserProfile }) => {
  const details = [
    profile.full_name && {
      label: 'Name',
      value: profile.full_name,
      icon: User,
    },
    profile.phone && {
      label: 'Phone',
      value: profile.phone,
      icon: Phone,
    },
    {
      label: 'User ID',
      value: `UID-${profile.id.slice(0, 8)}`,
      icon: Calendar,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    icon: any;
  }[];

  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="px-5 py-4 border-b">
        <h3 className="text-sm font-semibold text-blue-700">
          User Details
        </h3>
      </div>

      <div className="divide-y">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-5 py-4"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-blue-700" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                {item.label}
              </p>
              <p className="text-sm font-medium truncate">
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

function ProfileContent() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setLoading(false);
        return;
      }
      setSession(data.session);
      const p = await getUserProfile();
      setProfile({
        ...p,
        referral_code: p.referral_code || `REF${p.id.slice(0, 5).toUpperCase()}`,
      });
      setLoading(false);
    };
    init();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out successfully' });
    router.push('/');
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  if (loading) return <ProfileSkeleton />;

  if (!session || !profile)
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
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 h-40 rounded-b-[32px]">
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 rounded-full"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center -mt-14">
          <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
            <AvatarFallback className="text-3xl font-bold bg-blue-100 text-blue-700">
              {initials(profile.full_name || profile.email)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* NAME */}
        <div className="text-center mt-3">
          {/* <h1 className="text-xl font-bold">
            {profile.full_name || 'New User'}
          </h1> */}
          <p className="text-sm text-muted-foreground">{profile.email}</p>
      
        </div>

        {/* REFER & EARN */}
        <div className="px-4 mt-6">
          <ReferEarnCard code={profile.referral_code!} />
        </div>

        <div className="px-4 mt-4">
  <UserDetailsCard profile={profile} />
</div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 px-4 mt-6">
          <StatCard
            icon={Wallet}
            label="Wallet"
            value="₹50"
            onClick={() => router.push('/wallet')}
          />
          <StatCard
            icon={History}
            label="Bookings"
            value="12"
            onClick={() => router.push('/history')}
          />
        </div>

        {/* MENU */}
        <div className="px-4 mt-8 space-y-3 pb-8">
          <MenuItem
            icon={History}
            label="Booking History"
            onClick={() => router.push('/history')}
          />
          <MenuItem
            icon={Wallet}
            label="My Wallet"
            onClick={() => router.push('/wallet')}
          />
          <MenuItem
            icon={MapPin}
            label="Saved Addresses"
            onClick={() => router.push('/addresses')}
          />
        </div>
      </div>

   {/* LOGOUT – subtle style */}
<div className="sticky bottom-0 bg-white px-4 py-3 border-t">
  <button
    onClick={logout}
    className="w-full flex items-center justify-center gap-2 
      text-sm text-red-500 hover:text-red-600 
      hover:bg-red-50 rounded-lg py-2 transition"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </button>
</div>

    </div>
  );
}

/* ---------------- SHEET ---------------- */

export function ProfileSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <User className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-full max-w-sm">
        <SheetHeader className="sr-only">
          <SheetTitle>Profile</SheetTitle>
        </SheetHeader>
        <ProfileContent />
      </SheetContent>
    </Sheet>
  );
}
