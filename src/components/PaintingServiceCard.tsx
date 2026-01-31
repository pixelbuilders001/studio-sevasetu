'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { IndianRupee } from 'lucide-react';

interface PaintingService {
    id: string;
    name: string;
    image: string;
    description: string;
    color: string;
    price: number;
    isRental?: boolean;
}

interface PaintingServiceCardProps {
    service: PaintingService;
    index: number;
    isMobile?: boolean;
}

export default function PaintingServiceCard({ service, index, isMobile = false }: PaintingServiceCardProps) {
    const isRental = service.isRental || false;

    if (isMobile) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group cursor-pointer active:scale-95 transition-transform"
            >
                <Card className={`bg-white transition-all duration-300 p-4 rounded-2xl h-full flex flex-col items-center justify-center relative ${isRental
                        ? 'border-2 border-transparent bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-lg hover:shadow-xl'
                        : 'border border-slate-100 shadow-sm hover:shadow-md'
                    }`}>
                    {isRental && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                    )}
                    <div
                        className="relative w-full h-32 rounded-xl mb-3 overflow-hidden transition-all duration-300 group-hover:scale-105"
                    >
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover"
                        />
                        {/* Price Chip */}
                        <div className={`absolute top-2 right-2 backdrop-blur-sm px-2 py-1 rounded-full shadow-md flex items-center gap-0.5 ${isRental
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                : 'bg-white/95'
                            }`}>
                            <IndianRupee className={`w-2.5 h-2.5 ${isRental ? 'text-white' : 'text-primary'}`} />
                            <span className={`text-[8px] font-black ${isRental ? 'text-white' : 'text-primary'}`}>
                                {service.price}{isRental && '/sq ft'}
                            </span>
                        </div>
                    </div>
                    {/* <h3 className="text-xs font-black text-center text-[#1e1b4b] leading-tight mb-1">
                        {service.name}
                    </h3> */}
                    <p className="text-[9px] text-slate-500 text-center font-medium leading-tight line-clamp-2">
                        {service.description}
                    </p>
                </Card>
            </motion.div>
        );
    }

    // Desktop version
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group cursor-pointer"
        >
            <Card className={`bg-white transition-all duration-300 p-6 rounded-3xl h-full flex flex-col items-center justify-center relative overflow-hidden ${isRental
                    ? 'border-2 border-transparent bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-xl hover:shadow-2xl'
                    : 'border border-slate-100 shadow-soft hover:shadow-xl'
                }`}>
                {/* Background Gradient on Hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                    style={{ background: isRental ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15))' : `linear-gradient(to bottom, ${service.color}08, transparent)` }}
                />
                {isRental && (
                    <div className="absolute -top-1 -right-1 -bottom-1 -left-1 rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity -z-10" />
                )}

                {/* Image Container with Glow */}
                <div className="relative mb-4 z-10 w-full">
                    <div
                        className="relative w-full h-40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg group-hover:scale-105"
                    >
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover"
                        />
                        {/* Price Chip */}
                        <div className={`absolute top-3 right-3 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 ${isRental
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                : 'bg-white/95'
                            }`}>
                            <IndianRupee className={`w-3.5 h-3.5 ${isRental ? 'text-white' : 'text-primary'}`} />
                            <span className={`text-sm font-black ${isRental ? 'text-white' : 'text-primary'}`}>
                                {service.price}{isRental && '/sq ft'}
                            </span>
                        </div>
                    </div>
                    {/* Glow Element */}
                    <div
                        className="absolute inset-0 blur-[20px] rounded-2xl scale-0 group-hover:scale-110 transition-transform duration-500 -z-10"
                        style={{ backgroundColor: isRental ? 'rgba(139, 92, 246, 0.3)' : `${service.color}30` }}
                    />
                </div>

                <div className="relative z-10 flex flex-col gap-2 text-center">
                    {/* <h3 className="text-base font-black text-[#1e1b4b] group-hover:text-primary transition-colors leading-tight">
                        {service.name}
                    </h3> */}
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Bottom Glow Bar */}
                <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"
                    style={{ backgroundColor: isRental ? 'rgba(139, 92, 246, 0.4)' : `${service.color}40` }}
                />
            </Card>
        </motion.div>
    );
}
