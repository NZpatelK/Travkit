'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function addListItem(title: string, categoryId: string) {
  const supabase = createSupabaseServerClient()

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not logged in')
  }

  // Insert list item
  const { data, error } = await supabase
    .from('list')
    .insert([
      {
        title,
        category_id: categoryId,
        is_completed: false,
      },
    ])
    .select()
    .single() // return a single object

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getAllListsByTravelId(travelId: string) {
  const supabase = createSupabaseServerClient()

  // Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    // User not logged in
    return []
  }

  // Fetch all list items for categories under this travel
  const { data, error } = await supabase
    .from('list')
    .select(`
      id,
      title,
      is_completed,
      order_by,
      category:categories!inner (
        id,
        title,
        travel_id
      )
    `)
    .eq('categories.travel_id', travelId)
    .order('order_by')

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function resetIsCompleted() {
  const supabase = createSupabaseServerClient()

  // Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not logged in')
  }

  // Reset is_completed for all lists belonging to this user
  const { error } = await supabase
    .from('list')
    .update({ is_completed: false })
    .in(
      'category_id',
      // get all category IDs belonging to this user
      (await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
      ).data?.map(c => c.id) || []
    )

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function updateIsCompleted(
  id: string | number,
  is_completed: boolean
) {
  const supabase = createSupabaseServerClient()

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not logged in')
  }

  // Update only if the list belongs to a category owned by this user
  const { data, error } = await supabase
    .from('list')
    .update({ is_completed })
    .eq('id', id)
    .in(
      'category_id',
      (await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
      ).data?.map(c => c.id) || []
    )

  if (error) {
    throw new Error(error.message)
  }

  return data
}