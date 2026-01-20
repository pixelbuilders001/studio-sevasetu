'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { checkRestricted } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import FullScreenLoader from '@/components/FullScreenLoader';

const AuthHeaderLogo = ({ title, subtitle }: { title: React.ReactNode; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center text-center mb-8">
    <div className="w-24 h-24  flex items-center justify-center  relative mb-6">
      <Avatar className="w-20 h-20">
        <AvatarImage
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png"
          alt="Auth Logo"
          className="object-contain p-2"
        />
        <AvatarFallback className="text-3xl font-black text-white">H</AvatarFallback>
      </Avatar>
    </div>
    <h2 className="text-3xl font-black text-[#1e1b4b] leading-tight tracking-tight mb-1">{title}</h2>
    <span className="text-[10px] font-black text-indigo-600 tracking-[0.3em] uppercase">{subtitle}</span>
  </div>
);

type AuthView = 'signIn' | 'createAccount' | 'forgotPassword';

export default function UserAuthSheet({ setSheetOpen }: { setSheetOpen: (open: boolean) => void; }) {
  const [currentView, setCurrentView] = useState<AuthView>('signIn');
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createSupabaseBrowserClient();
  const { toast } = useToast();

  useEffect(() => {
    const initSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        const isRestricted = await checkRestricted(supabase, currentSession.user.id);
        if (isRestricted) {
          await supabase.auth.signOut();
          setSession(null);
          setMessage('Invalid credentials');
          return;
        }
      }
      setSession(currentSession);
    };
    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isRestricted = await checkRestricted(supabase, session.user.id);
        if (isRestricted) {
          await supabase.auth.signOut();
          setSession(null);
          setMessage('Invalid credentials');
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Invalid credentials.",
          });
          return;
        }
      }
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, toast]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const redirectPath = window.location.pathname + window.location.search;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the verification link!');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Attempt Sign In
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (user) {
      // 2. Check Role
      const isRestricted = await checkRestricted(supabase, user.id);

      if (isRestricted) {
        await supabase.auth.signOut();
        setSession(null);
        setMessage('Invalid credentials');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid credentials.",
        });
        setLoading(false);
        return;
      }

      // 4. Success - Only close if role is valid
      setSheetOpen(false);
    }

    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const redirectPath = window.location.pathname + window.location.search;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password?next=${encodeURIComponent(redirectPath)}`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the password reset link!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    await supabase.auth.signOut();
    setSheetOpen(false);
    setLoggingOut(false);
  };

  const UserAccountView = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
        {loggingOut && <FullScreenLoader message="Logging out..." />}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full blur-xl opacity-30" />
          <Avatar className="w-28 h-28 border-4 border-indigo-100 shadow-2xl relative z-10">
            <AvatarImage src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png" alt="User Avatar" />
            <AvatarFallback className="text-3xl font-black bg-indigo-50 text-indigo-600">{session?.user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-3xl font-black text-[#1e1b4b] mb-2">Welcome Back!</h2>
        <p className="text-indigo-600 font-bold mb-8 text-sm">{session?.user?.email}</p>
        <Button
          className="w-full max-w-xs h-14 rounded-2xl bg-red-500 text-white text-base font-black hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'LOGGING OUT...' : 'LOGOUT'}
        </Button>
      </div>
    );
  };

  const renderAuthForm = () => {
    switch (currentView) {
      case 'signIn':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
            <AuthHeaderLogo title="Welcome Back" subtitle="SECURE ACCESS TO REPAIRS" />
            {message && <p className="text-center text-red-500 text-sm mb-4 font-bold">{message}</p>}
            <form className="w-full space-y-5" onSubmit={handleSignIn}>
              <div>
                <Label htmlFor="email-signin" className="sr-only">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-50 rounded-2xl" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 z-10" />
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="Email Address"
                    className="relative z-10 pl-12 pr-4 h-14 text-base rounded-2xl border-indigo-200 bg-transparent focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-0 font-medium placeholder:text-indigo-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password-signin" className="sr-only">Password</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-50 rounded-2xl" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 z-10" />
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="Password"
                    className="relative z-10 pl-12 pr-4 h-14 text-base rounded-2xl border-indigo-200 bg-transparent focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-0 font-medium placeholder:text-indigo-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary text-white text-base font-black flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                disabled={loading}
              >
                {loading ? 'SIGNING IN...' : <>SIGN IN <ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-600 mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('forgotPassword')}
                  className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline focus:outline-none transition-colors"
                >
                  Forgot password?
                </button>
              </p>
              <p className="text-center text-sm text-gray-600 mt-4">
                NEW HERE?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentView('createAccount')}
                  className="text-indigo-600 font-black hover:text-indigo-700 hover:underline focus:outline-none transition-colors"
                >
                  CREATE AN ACCOUNT
                </button>
              </p>
            </form>
          </div>
        );
      case 'createAccount':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
            <AuthHeaderLogo
              title={<>Create a <span className="font-black text-primary italic">Free</span> Account</>}
              subtitle="VERIFIED HOME SERVICES"
            />
            {message && <p className="text-center text-green-600 text-sm mb-4 font-bold">{message}</p>}
            <form className="w-full space-y-5" onSubmit={handleSignUp}>
              <div>
                <Label htmlFor="email-signup" className="sr-only">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-50 rounded-2xl" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 z-10" />
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Email Address"
                    className="relative z-10 pl-12 pr-4 h-14 text-base rounded-2xl border-indigo-200 bg-transparent focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-0 font-medium placeholder:text-indigo-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password-signup" className="sr-only">Password</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-50 rounded-2xl" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 z-10" />
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Password"
                    className="relative z-10 pl-12 pr-4 h-14 text-base rounded-2xl border-indigo-200 bg-transparent focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-0 font-medium placeholder:text-indigo-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary text-white text-base font-black flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                disabled={loading}
              >
                {loading ? 'CREATING ACCOUNT...' : <>CREATE ACCOUNT <ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-600 mt-4">
                ALREADY A MEMBER?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentView('signIn')}
                  className="text-indigo-600 font-black hover:text-indigo-700 hover:underline focus:outline-none transition-colors"
                >
                  SIGN IN
                </button>
              </p>
            </form>
          </div>
        );
      case 'forgotPassword':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
            <AuthHeaderLogo title="Forgot Password" subtitle="ENTER YOUR EMAIL TO RESET" />
            {message && <p className="text-center text-green-600 text-sm mb-4 font-bold">{message}</p>}
            <form className="w-full space-y-5" onSubmit={handlePasswordReset}>
              <div>
                <Label htmlFor="email-forgot" className="sr-only">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-50 rounded-2xl" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 z-10" />
                  <Input
                    id="email-forgot"
                    type="email"
                    placeholder="Email Address"
                    className="relative z-10 pl-12 pr-4 h-14 text-base rounded-2xl border-indigo-200 bg-transparent focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-0 font-medium placeholder:text-indigo-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary text-white text-base font-black flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                disabled={loading}
              >
                {loading ? 'SENDING...' : <>SEND RESET LINK <ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-600 mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('signIn')}
                  className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline focus:outline-none transition-colors"
                >
                  Back to Sign In
                </button>
              </p>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-8 pt-16 md:pt-8">
      {session ? <UserAccountView /> : renderAuthForm()}
    </div>
  );
}
