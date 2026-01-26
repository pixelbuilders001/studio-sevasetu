'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function SessionDebugger() {
    const { session, loading, user } = useAuth();
    const [cookieCount, setCookieCount] = useState(0);
    const [localStorageSession, setLocalStorageSession] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCookieCount(document.cookie ? document.cookie.split(';').length : 0);
            const lsCtx = localStorage.getItem('sb-session-auth');
            setLocalStorageSession(lsCtx ? 'Found' : 'Missing');
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-20 right-4 bg-black/80 text-white p-4 rounded-xl text-xs z-[100] font-mono max-w-[250px] pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
            <div className="mb-2 font-bold text-green-400">DEBUG SESSION</div>
            <div>Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{String(loading)}</span></div>
            <div>Auth User: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'Acc present' : 'None'}</span></div>
            <div>Cookies: {cookieCount}</div>
            <div>LocalStore: {localStorageSession}</div>
            <div className="mt-2 text-[10px] text-gray-400 break-all">
                {session?.access_token ? 'Token: ' + session.access_token.substring(0, 10) + '...' : 'No Token'}
            </div>
        </div>
    );
}
