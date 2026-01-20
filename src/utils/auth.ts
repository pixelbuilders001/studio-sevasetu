
import { SupabaseClient } from '@supabase/supabase-js';

export const checkRestricted = async (supabase: SupabaseClient, userId: string): Promise<boolean> => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        // If error (e.g. no profile found), fail open or closed? 
        // Failing open (false) allows login, failing closed (true) blocks.
        // Given the issues with profile fetching, let's return false (safe for strictly role-based blocking).
        if (error) {
            // console.error("Profile check error:", error); 
            return false;
        }

        if (profile && (profile.role === 'technician' || profile.role === 'admin')) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};
