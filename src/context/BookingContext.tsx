'use client';

import React, { createContext, useContext, useState } from 'react';

interface BookingContextType {
    media: File | null;
    secondaryMedia: File | null;
    setMedia: (file: File | null) => void;
    setSecondaryMedia: (file: File | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [media, setMedia] = useState<File | null>(null);
    const [secondaryMedia, setSecondaryMedia] = useState<File | null>(null);

    return (
        <BookingContext.Provider
            value={{
                media,
                secondaryMedia,
                setMedia,
                setSecondaryMedia,
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
