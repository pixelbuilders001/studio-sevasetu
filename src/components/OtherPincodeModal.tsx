'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getPincodeDataAction } from '@/app/actions';
import { useLocation } from '@/context/LocationContext';

interface OtherPincodeModalProps {
    isOpen: boolean;
    onClose: (pincode?: string) => void;
}

export function OtherPincodeModal({ isOpen, onClose }: OtherPincodeModalProps) {
    const [pincode, setPincode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { checkServiceability } = useLocation();

    const handleVerify = async () => {
        if (pincode.length !== 6) {
            setError('Please enter a valid 6-digit pincode');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await getPincodeDataAction(pincode);

            if (result.success && result.data) {
                const postOffices = result.data;
                const district = postOffices[0]?.District;

                if (!district) {
                    throw new Error("Could not determine district from pincode.");
                }

                const serviceableCityData = await checkServiceability(district);

                if (serviceableCityData) {
                    setSuccess(true);
                    setTimeout(() => {
                        onClose(pincode);
                        // Reset state for next time
                        setSuccess(false);
                        setPincode('');
                    }, 1500);
                } else {
                    setError(`Sorry, we do not currently service ${district}.`);
                }
            } else {
                setError(result.error || 'Invalid pincode. Please check and try again.');
            }
        } catch (err) {
            setError('Failed to verify pincode. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[400px] rounded-3xl p-6 border-none shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-black text-center text-slate-900 tracking-tight">Verify Pincode</DialogTitle>
                    <DialogDescription className="text-center text-slate-500 text-xs font-semibold leading-relaxed">
                        Please enter the 6-digit pincode where the service is required.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="relative">
                        <Input
                            id="other-pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit Pincode"
                            className="h-12 rounded-xl border-2 border-slate-100 focus:border-primary/50 focus:ring-0 text-base font-bold text-center tracking-[0.4em] placeholder:tracking-normal placeholder:font-bold transition-all bg-slate-50/50"
                            maxLength={6}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-destructive bg-destructive/5 p-3 rounded-lg border border-destructive/10 animate-shake">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-wider leading-none">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100 animate-in fade-in zoom-in">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-wider leading-none">Serviceable Pincode Verified!</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button
                        onClick={handleVerify}
                        disabled={isLoading || success || pincode.length !== 6}
                        className="w-full h-11 rounded-xl bg-[#1e1b4b] hover:bg-primary text-white font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Proceed'}
                    </Button>

                    <DialogClose asChild>
                        <Button variant="ghost" className="w-full text-slate-400 font-bold uppercase text-[9px] tracking-widest hover:bg-slate-50 hover:text-slate-900 rounded-lg h-9">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
