'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, CheckCircle2, Loader2, Home, Map, Plus, X, LocateFixed } from 'lucide-react';
import { getSavedAddresses, setDefaultAddress, deleteAddress, saveAddress } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from '@/context/LocationContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Address {
    id: string;
    full_address: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

export function AddressManagementModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newFullAddress, setNewFullAddress] = useState('');
    const { location } = useLocation();
    const { toast } = useToast();

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const data = await getSavedAddresses();
            setAddresses(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch addresses',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAddresses();
            setIsAdding(false);
            setNewFullAddress('');
        }
    }, [isOpen]);

    const handleSetDefault = async (id: string) => {
        setIsActionLoading(id);
        try {
            const result = await setDefaultAddress(id);
            if (result.success) {
                toast({ title: 'Default address updated' });
                fetchAddresses();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to set default address',
                variant: 'destructive',
            });
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleAddAddress = async () => {
        if (!newFullAddress.trim()) return;
        setIsActionLoading('adding');
        try {
            const result = await saveAddress({
                full_address: newFullAddress,
                city: location.city,
                state: location.area?.State || '',
                pincode: location.pincode
            });
            if (result.success) {
                toast({ title: 'Address added successfully' });
                setNewFullAddress('');
                setIsAdding(false);
                fetchAddresses();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add address',
                variant: 'destructive',
            });
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        const addr = addresses.find(a => a.id === id);
        if (addr?.is_default) {
            toast({
                title: "Action Restricted",
                description: "Default address cannot be deleted. Set another address as default first.",
                variant: "destructive"
            });
            return;
        }

        if (!confirm('Are you sure you want to delete this address?')) return;
        setIsActionLoading(id);
        try {
            const result = await deleteAddress(id);
            if (result.success) {
                toast({ title: 'Address deleted' });
                fetchAddresses();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete address',
                variant: 'destructive',
            });
        } finally {
            setIsActionLoading(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-white/20 shadow-2xl rounded-[32px]">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <div className="flex items-center justify-between gap-2">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            Saved Addresses
                        </DialogTitle>
                        <Button
                            size="sm"
                            variant={isAdding ? "ghost" : "outline"}
                            onClick={() => setIsAdding(!isAdding)}
                            className="rounded-full h-9 px-4 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            {isAdding ? (
                                <><X className="w-3.5 h-3.5 mr-1.5" /> Cancel</>
                            ) : (
                                <><Plus className="w-3.5 h-3.5 mr-1.5" /> Add New</>
                            )}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="px-6 pb-6">
                    {isAdding && (
                        <div className="mb-6 p-4 rounded-2xl bg-primary/[0.03] border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Add New Address</h3>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Enter full address details..."
                                        value={newFullAddress}
                                        onChange={(e) => setNewFullAddress(e.target.value)}
                                        className="min-h-[100px] rounded-xl border-gray-200 focus:border-primary/50 focus:ring-primary/20 bg-white text-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                                        <LocateFixed className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Current Service Area</p>
                                        <p className="text-[11px] font-bold text-gray-700 truncate">{location.city}, {location.area?.State} - {location.pincode}</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddAddress}
                                    disabled={!newFullAddress.trim() || isActionLoading === 'adding'}
                                    className="w-full h-11 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                                >
                                    {isActionLoading === 'adding' ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <MapPin className="w-4 h-4 mr-2" />
                                    )}
                                    Save New Address
                                </Button>
                            </div>
                            <div className="my-4 h-px bg-gray-200/50" />
                        </div>
                    )}

                    <ScrollArea className={cn("pr-4", isAdding ? "h-[300px]" : "h-[400px]")}>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-sm font-medium text-muted-foreground">Loading addresses...</p>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Map className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">No saved addresses</h3>
                                    <p className="text-sm text-gray-500">Add an address during your next booking.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={cn(
                                            "group relative p-3 rounded-2xl border bg-white transition-all duration-300",
                                            addr.is_default
                                                ? "border-primary/30 bg-primary/[0.04] shadow-sm ring-1 ring-primary/10"
                                                : "border-gray-100 hover:border-primary/20 hover:shadow-md"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3 w-full">
                                                <div className={cn(
                                                    "mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                    addr.is_default ? "bg-primary text-primary-foreground" : "bg-gray-50 text-gray-400"
                                                )}>
                                                    {addr.is_default ? <Home className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-bold text-xs text-[#1e1b4b] tracking-tight capitalize truncate">
                                                            {addr.city}, {addr.state}
                                                        </span>
                                                        {addr.is_default && (
                                                            <Badge className="bg-primary text-primary-foreground border-0 text-[9px] font-black tracking-widest uppercase py-0 px-1.5 h-4">
                                                                DEFAULT
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-snug font-medium line-clamp-2">
                                                        {addr.full_address}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-gray-300 mt-1 tracking-widest uppercase">
                                                        PIN: {addr.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-end gap-2 border-t border-dashed border-gray-100 pt-2">
                                            {!addr.is_default && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    disabled={isActionLoading !== null}
                                                    className="h-7 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg"
                                                >
                                                    {isActionLoading === addr.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                                                    ) : (
                                                        <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                                    )}
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(addr.id)}
                                                disabled={isActionLoading !== null || addr.is_default}
                                                className={cn(
                                                    "h-7 text-[9px] font-black uppercase tracking-widest rounded-lg",
                                                    addr.is_default ? "hidden" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                )}
                                            >
                                                {isActionLoading === addr.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                                                ) : (
                                                    <Trash2 className="w-3 h-3 mr-1.5" />
                                                )}
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
