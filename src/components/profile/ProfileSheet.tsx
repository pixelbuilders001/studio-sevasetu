'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  phone: string;
  created_at: string;
}

// --- Reusable Child Components ---

const ProfileInfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null | undefined }) => (
    <div className="flex items-center text-sm text-gray-700">
      <Icon className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
      <span className="text-gray-500 mr-1">{label}:</span>
      <span className="font-medium truncate">{value || 'Not provided'}</span>
    </div>
);

const NavLink = ({ icon: Icon, label, href, onClick }: { icon: React.ElementType, label: string, href: string, onClick: () => void }) => (
    <button 
      onClick={() => onClick()} 
      className="flex items-center justify-between w-full p-3.5 rounded-xl bg-gray-100/60 hover:bg-gray-200/50 transition-colors">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-primary mr-3" />
        <span className="font-semibold text-sm text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
);

const ProfileSkeleton = () => (
    <div className="space-y-6 p-6">
        <div className="flex flex-col items-center space-y-4 pt-8">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white p-6 rounded-2xl space-y-4">
            <Skeleton className="h-5 w-1/3"/>
            <Skeleton className="h-5 w-full"/>
            <Skeleton className="h-5 w-full"/>
            <Skeleton className="h-5 w-full"/>
            <Skeleton className="h-5 w-full"/>
        </div>
    </div>
);

// --- Main Profile Content Component ---

function ProfileContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setLoading(false);
            return;
        }
        setSession(session);

        const profileData = await getUserProfile();
        setProfile(profileData);

      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if(!currentSession) {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out successfully' });
    router.push('/');
  };
  
  const handleNav = (path: string) => {
    router.push(path)
    // Here you would also include the logic to close the sheet, e.g. `setOpen(false)`
    // This would be managed by the parent component that controls the Sheet's state.
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!session || !profile) {
    return (
        <div className="p-8 text-center">
            <h3 className="text-lg font-semibold">Not Logged In</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">Please sign in to view your profile and manage your account.</p>
            <Button onClick={() => handleNav('/')}>Sign In</Button>
        </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
        {/* User Info Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-6">
           <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarFallback className="text-4xl font-bold bg-blue-100 text-blue-600">
                  {getInitials(profile.full_name || profile.email)}
              </AvatarFallback>
          </Avatar>
          <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  {profile.full_name || 'New User'}
                  <Badge variant="outline" className="text-xs font-medium bg-gray-100 text-gray-600">{profile.role}</Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
          </div>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white text-sm">
              <Edit className="w-3 h-3 mr-2" />
              Edit Profile
          </Button>
        </div>

        {/* Account Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/60 space-y-4">
            <h3 className="text-base font-bold text-blue-700">Account Details</h3>
            <ProfileInfoItem icon={Mail} label="Email" value={profile.email} />
            <ProfileInfoItem icon={Phone} label="Phone" value={profile?.phone} />
            <ProfileInfoItem icon={User} label="User ID" value={`...${profile.id.slice(-6)}`} />
            <ProfileInfoItem icon={Calendar} label="Joined" value={formatDate(profile.created_at)} />
        </div>

        {/* Manage Account */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/60 space-y-3">
            <h3 className="text-base font-bold text-blue-700 mb-2">Manage Your Account</h3>
            <NavLink icon={History} label="Booking History" href="/history" onClick={() => handleNav('/history')} />
            <NavLink icon={Wallet} label="My Wallet" href="/wallet" onClick={() => handleNav('/wallet')} />
            <NavLink icon={MapPin} label="Saved Addresses" href="/addresses" onClick={() => handleNav('/addresses')} />
        </div>

        <div className="pt-4">
            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2"/>
                Logout
            </Button>
        </div>
    </div>
  );
}

// --- Exportable Sheet Component ---

export function ProfileSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white p-0 w-full max-w-sm">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="sr-only">Profile</SheetTitle>
        </SheetHeader>
        <ProfileContent />
      </SheetContent>
    </Sheet>
  );
}
