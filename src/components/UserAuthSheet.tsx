'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

const AuthHeaderLogo = ({ title, subtitle }: { title: React.ReactNode; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center text-center mb-6">
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-100 shadow-sm relative mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage 
            src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png" 
            alt="Auth Logo"
            className="object-contain" 
          />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
    </div>
    <h2 className="text-3xl font-extrabold text-primary leading-tight font-sans">{title}</h2>
    <span className="text-xs font-semibold text-gray-500 leading-tight tracking-wide uppercase mt-1 font-sans">{subtitle}</span>
  </div>
);

type AuthView = 'signIn' | 'createAccount' | 'forgotPassword';

export default function UserAuthSheet({ setSheetOpen }: { setSheetOpen: (open: boolean) => void; }) {
  const [currentView, setCurrentView] = useState<AuthView>('signIn');
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setSheetOpen(false);
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the password reset link!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSheetOpen(false);
  };

  const UserAccountView = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
        <Avatar className="w-24 h-24 mb-6">
          <AvatarImage src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png" alt="User Avatar" />
          <AvatarFallback>{session?.user?.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-primary mb-2 font-sans">Welcome!</h2>
        <p className="text-gray-600 mb-6 font-sans">{session?.user?.email}</p>
        <Button
          className="w-full max-w-xs h-12 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary/90 font-sans"
          onClick={handleLogout}
        >
          Logout
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
            {message && <p className="text-center text-red-500 text-sm mb-4 font-sans">{message}</p>}
            <form className="w-full space-y-6" onSubmit={handleSignIn}>
              <div>
                <Label htmlFor="email-signin" className="sr-only">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password-signin" className="sr-only">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-lg bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 font-sans"
                disabled={loading}
              >
                {loading ? 'Signing In...' : <>SIGN IN <ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4 font-sans">
                <button
                  type="button"
                  onClick={() => setCurrentView('forgotPassword')}
                  className="text-primary font-semibold hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </p>
              <p className="text-center text-sm text-gray-500 mt-4 font-sans">
                NEW HERE?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentView('createAccount')}
                  className="text-primary font-semibold hover:underline focus:outline-none"
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
              title={<>Create a <span className="font-extrabold text-[#cec16c] italic">Free</span> Account</>} 
              subtitle="VERIFIED HOME SERVICES" 
            />
            {message && <p className="text-center text-green-500 text-sm mb-4 font-sans">{message}</p>}
            <form className="w-full space-y-6" onSubmit={handleSignUp}>
              <div>
                <Label htmlFor="email-signup" className="sr-only">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password-signup" className="sr-only">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-lg bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 font-sans"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : <>CREATE ACCOUNT <ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4 font-sans">
                ALREADY A MEMBER?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentView('signIn')}
                  className="text-primary font-semibold hover:underline focus:outline-none"
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
            {message && <p className="text-center text-green-500 text-sm mb-4 font-sans">{message}</p>}
            <form className="w-full space-y-6" onSubmit={handlePasswordReset}>
              <div>
                <Label htmlFor="email-forgot" className="sr-only">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email-forgot"
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-lg bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 font-sans"
                disabled={loading}
              >
                {loading ? 'Sending...' : <>SEND RESET LINK <ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4 font-sans">
                <button
                  type="button"
                  onClick={() => setCurrentView('signIn')}
                  className="text-primary font-semibold hover:underline focus:outline-none"
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
