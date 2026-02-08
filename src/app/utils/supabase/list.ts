import { supabase } from './client';
import toast from 'react-hot-toast';

type AddListItemInput = {
  title: string;
  category_id: string;
};

export async function addListItem(title: string, categoryId: string) {
  const { data, error } = await supabase
    .from('list')
    .insert([{ title, category_id: categoryId, is_completed: false }])
    .select();

  if (error) toast.error(error.message);
  return data;
}

export async function addNewItemToList({ title, category_id }: AddListItemInput) {
  // Get last order_by
  const { data: lastItem, error: fetchError } = await supabase
    .from('list')
    .select('order_by')
    .eq('category_id', category_id)
    .order('order_by', { ascending: false })
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') toast.error(fetchError.message);

  const nextOrder = lastItem?.order_by ? lastItem.order_by + 1 : 1;

  const { data, error: insertError } = await supabase
    .from('list')
    .insert({ title, category_id, is_deletable: true, order_by: nextOrder })
    .select()
    .single();

  if (insertError) toast.error(insertError.message);
  return data;
}

export async function updateIsCompleted(id: string | number, is_completed: boolean) {
  const { data, error } = await supabase
    .from('list')
    .update({ is_completed })
    .eq('id', id);

  if (error) toast.error(error.message);
  return data;
}

export async function resetIsCompleted() {
  const { error } = await supabase.from('list').update({ is_completed: false }).not("id", "is", null);
  if (error) toast.error(error.message);
}

export async function deleteListItem(id: string) {
  const { error } = await supabase.from('list').delete().eq("id", id).eq("is_deletable", true);
  if (error) throw new Error(error.message);
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

  if (error) {
    toast.error(error.message);
    return [];
  }

  return data;
}