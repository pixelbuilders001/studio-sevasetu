'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BookingContextType {
    media: File | null;
    secondaryMedia: File | null;
    setMedia: (file: File | null) => void;
    setSecondaryMedia: (file: File | null) => void;
    clearMedia: () => void;
}

const DB_NAME = 'BookingMediaDB';
const STORE_NAME = 'media';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const saveToIDB = async (key: string, file: File | null) => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        if (file) {
            store.put(file, key);
        } else {
            store.delete(key);
        }
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    } catch (error) {
        console.error('Error saving to IDB:', error);
    }
};

const getFromIDB = async (key: string): Promise<File | null> => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error getting from IDB:', error);
        return null;
    }
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [media, _setMedia] = useState<File | null>(null);
    const [secondaryMedia, _setSecondaryMedia] = useState<File | null>(null);

    useEffect(() => {
        const loadMedia = async () => {
            const m = await getFromIDB('media');
            const sm = await getFromIDB('secondaryMedia');
            if (m) _setMedia(m);
            if (sm) _setSecondaryMedia(sm);
        };
        loadMedia();
    }, []);

    const setMedia = async (file: File | null) => {
        _setMedia(file);
        await saveToIDB('media', file);
    };

    const setSecondaryMedia = async (file: File | null) => {
        _setSecondaryMedia(file);
        await saveToIDB('secondaryMedia', file);
    };

    const clearMedia = async () => {
        _setMedia(null);
        _setSecondaryMedia(null);
        await saveToIDB('media', null);
        await saveToIDB('secondaryMedia', null);
    };

    return (
        <BookingContext.Provider
            value={{
                media,
                secondaryMedia,
                setMedia,
                setSecondaryMedia,
                clearMedia,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
