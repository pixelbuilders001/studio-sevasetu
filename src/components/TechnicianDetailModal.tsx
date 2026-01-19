'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, Briefcase, MapPin, Award } from 'lucide-react';
import { getTechnicianById } from '@/app/actions';
import type { Technician } from '@/lib/types';

interface TechnicianDetailModalProps {
    technicianId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function maskMobile(mobile: string): string {
    if (mobile.length === 10) {
        return `${mobile.slice(0, 2)}XXX XXX${mobile.slice(-2)}`;
    }
    return mobile;
}

export default function TechnicianDetailModal({ technicianId, open, onOpenChange }: TechnicianDetailModalProps) {
    const [technician, setTechnician] = useState<Technician | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && technicianId) {
            setLoading(true);
            getTechnicianById(technicianId)
                .then(data => {
                    setTechnician(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch technician:', error);
                    setLoading(false);
                });
        }
    }, [technicianId, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-indigo-900">Technician Details</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : technician ? (
                    <div className="space-y-6">
                        {/* Avatar and Name */}
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 border-4 border-indigo-100 shadow-lg mb-4">
                                <AvatarImage src={technician.selfie_url || undefined} alt={technician.full_name} />
                                <AvatarFallback className="bg-indigo-600 text-white text-2xl font-black">
                                    {technician.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-black text-indigo-900">{technician.full_name}</h3>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Mobile</p>
                                    <p className="text-sm font-bold text-indigo-900">{maskMobile(technician.mobile)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Skill</p>
                                    <p className="text-sm font-bold text-indigo-900 capitalize">{technician.primary_skill}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Award className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Experience</p>
                                    <p className="text-sm font-bold text-indigo-900">{technician.total_experience} {technician.total_experience === 1 ? 'year' : 'years'}</p>
                                </div>
                            </div>

                            {technician.service_area && (
                                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Service Area</p>
                                        <p className="text-sm font-bold text-indigo-900">{technician.service_area}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500">Technician details not available</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
