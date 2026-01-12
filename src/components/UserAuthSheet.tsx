'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AuthHeaderLogo = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center text-center mb-6">
    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-2 border-gray-100 shadow-sm relative mb-4">
        <Avatar className="w-20 h-20">
          <AvatarImage 
            src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png" 
            alt="Auth Logo"
            className="object-contain" 
          />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
    </div>
    <span className="text-3xl font-extrabold text-primary leading-tight font-sans">{title}</span>
    <span className="text-xs font-semibold text-gray-500 leading-tight tracking-wide uppercase mt-1 font-sans">{subtitle}</span>
  </div>
);

type AuthView = 'signIn' | 'createAccount';

export default function UserAuthSheet({ setSheetOpen }: { setSheetOpen: (open: boolean) => void; }) {
  const [currentView, setCurrentView] = useState<AuthView>('signIn');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const UserAccountView = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
        <Avatar className="w-24 h-24 mb-6">
          <AvatarImage src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_24%20PM.png" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-primary mb-2 font-sans">Welcome, User!</h2>
        <p className="text-gray-600 mb-6 font-sans">user.email@example.com</p>
        <Button
          className="w-full max-w-xs h-12 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary/90 font-sans"
          onClick={() => {
            setIsLoggedIn(false);
            setSheetOpen(false);
          }}
        >
          Logout
        </Button>
      </div>
    );
  };

  const renderAuthForm = () => {
    if (currentView === 'signIn') {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
          <AuthHeaderLogo title="Welcome Back" subtitle="SECURE ACCESS TO REPAIRS" />
          <form className="w-full space-y-6">
            <div>
              <Label htmlFor="email-signin" className="sr-only">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email-signin"
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
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
                />
              </div>
            </div>
            <Button
              type="button"
              className="w-full h-12 rounded-lg bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 font-sans"
              onClick={() => {
                setIsLoggedIn(true);
              }}
            >
              SIGN IN <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4 font-sans">
              NEW HERE?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('createAccount')}
                className="text-primary font-semibold hover:underline focus:outline-none"
              >
                JOIN THE CREW
              </button>
            </p>
          </form>
        </div>
      );
    } else { 
      return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-sm">
          <AuthHeaderLogo title="Join SevaSetu" subtitle="VERIFIED HOME SERVICES" />
          <form className="w-full space-y-6">
            <div>
              <Label htmlFor="email-signup" className="sr-only">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 h-12 text-base rounded-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 font-sans"
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
                />
              </div>
            </div>
            <Button
              type="button"
              className="w-full h-12 rounded-lg bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 font-sans"
              onClick={() => {
                setIsLoggedIn(true);
              }}
            >
              CREATE ACCOUNT <ArrowRight className="h-5 w-5" />
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
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-8 pt-10 md:pt-8">
      {isLoggedIn ? <UserAccountView /> : renderAuthForm()}
    </div>
  );
}
