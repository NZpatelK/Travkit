'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getTravelDetail(travelId: string) {
    const supabase = createSupabaseServerClient()

    // Get the current logged-in user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('User not logged in')
    }

    // Query the travel record for this user
    const { data, error } = await supabase
        .from('travel')
        .select('id, travel_to, duration')
        .eq('user_id', user.id)
        .eq('id', travelId)
        .single() // returns one object instead of array

    if (error) {
         throw new Error(error.message);
    }

    return { data: data ?? null }
}

export async function getAllTravelData() {
    const supabase = createSupabaseServerClient()

    // Get the current logged-in user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        // User not logged in or error getting user
        return []
    }

    // Fetch all travel data for this user
    const { data, error } = await supabase
        .from('travel')
        .select('*')
        .eq('user_id', user.id)

    if (error) {
       throw new Error(error.message);
    }

    return { data: data ?? null }
}
