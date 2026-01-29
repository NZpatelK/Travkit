import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getTravelDetail(travelId: string) {
  // First get the user ID
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    toast.error(userError.message);
    return null;
  }

  if (!user) {
    toast.error("No user logged in");
    return null;
  }

  // Now query using the actual user ID (not a Promise)
  const { data, error } = await supabase
    .from("travel")
    .select("id, travel_to, duration")
    .eq("user_id", user.id)
    .eq("id", travelId);

  if (error) toast.error(error.message);

  return data?.[0] ?? null;
}


export async function getAllTravelData() {
  // Get the user first
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    toast.error(userError.message);
    return null;
  }

  if (!user) {
    toast.error("No user logged in");
    return null;
  }

  // Now fetch travel data
  const { data, error } = await supabase
    .from("travel")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    toast.error(error.message);
    return null;
  }

  console.log("All travel data:", data);
  return data ?? [];
}

export async function getCategoriesWithLists(travelId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, title, order_by, list(id, title, is_completed, is_deletable, order_by)')
    .eq('travel_id', travelId)
    .order('order_by', { ascending: true }) // Sort categories by order
    .order('order_by', { foreignTable: 'list', ascending: true }); // Sort list items by order

  if (error) toast.error(error.message);
  return data;
}

export async function addCategory(title: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ title }])
    .select();

  if (error) toast.error(error.message);
  toast.success('Category added successfully');
  return data;
}

export async function addListItem(title: string, categoryId: string) {
  const { data, error } = await supabase
    .from('list')
    .insert([{ title, category_id: categoryId, is_completed: false }])
    .select();

  if (error) toast.error(error.message);
  return data;
}


export async function getAllListsByTravelId(travelId: string) {
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
    .order('order_by');

  if (error) toast.error(error.message);
  return data;
}

export async function resetIsCompleted() {
  const { error } = await supabase
    .from("list")
    .update({ is_completed: false })
    .not("id", "is", null); // matches all rows

  if (error) {
    toast.error(error.message);
  }
}


export async function updateIsCompleted(id: string | number, is_completed: boolean) {
  const { data, error } = await supabase
    .from('list')
    .update({ is_completed })
    .eq('id', id)

  if (error) toast.error(error.message);
  return data;
}

type AddListItemInput = {
  title: string
  category_id: string
}


export async function addNewItemToList({
  title,
  category_id,
}: AddListItemInput) {

  // 1️⃣ Get last order_by for this category
  const { data: lastItem, error: fetchError } = await supabase
    .from('list')
    .select('order_by')
    .eq('category_id', category_id)
    .order('order_by', { ascending: false })
    .limit(1)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    toast.error(fetchError.message)
  }

  const nextOrder =
    lastItem?.order_by !== null && lastItem?.order_by !== undefined
      ? lastItem.order_by + 1
      : 1

  // 2️⃣ Insert new item
  const { data, error: insertError } = await supabase
    .from('list')
    .insert({
      title,
      category_id,
      is_deletable: true,
      order_by: nextOrder,
    })
    .select()
    .single()

  if (insertError) {
    toast.error(insertError.message)
  }

  return data
}

export async function deleteListItem(id: string) {
  const { error } = await supabase
    .from("list")
    .delete()
    .eq("id", id)
    .eq("is_deletable", true); // extra safety

  if (error) {
    throw new Error(error.message);
  }
}
