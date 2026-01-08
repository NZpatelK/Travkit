'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getCategoriesWithLists(travelId: string) {
    const supabase = createSupabaseServerClient()
    
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('User not logged in')
    }

    // Fetch categories and their lists for this travel
    const { data, error } = await supabase
        .from('categories')
        .select(`
            id,
            title,
            order_by,
            list (
              id,
              title,
              is_completed,
              order_by
            )
        `)
        .eq('travel_id', travelId)
        .order('order_by', { ascending: true }) // categories order
        .order('order_by', { foreignTable: 'list', ascending: true }) // list items order

    if (error) {
        throw new Error(error.message)
    }

    return { data: data ?? [] }
}

export async function addCategory(title: string, travelId: string) {
  const supabase = createSupabaseServerClient()

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not logged in')
  }

  // Insert category with travelId
  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        title,
        travel_id: travelId, // associate category with travel
      },
    ])
    .select()
    .single() // return a single object

  if (error) {
    throw new Error(error.message)
  }

  return data
}