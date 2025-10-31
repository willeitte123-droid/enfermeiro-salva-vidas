import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!session?.user?.id) return;

        const channel = supabase
            .channel('profile-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${session.user.id}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['profile', session.user.id] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session, queryClient]);

    return useQuery({
        queryKey: ['profile', session?.user?.id],
        queryFn: () => fetchProfile(session),
        enabled: !!session?.user,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};