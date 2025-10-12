import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const fetchProfile = async (session: Session | null) => {
    if (!session?.user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(error.message);
    }
    return data;
};

export const useProfile = (session: Session | null) => {
    return useQuery({
        queryKey: ['profile', session?.user?.id],
        queryFn: () => fetchProfile(session),
        enabled: !!session?.user,
        staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    });
};