import { supabase } from './client';
import toast from 'react-hot-toast';

export async function getCategoriesWithLists(travelId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, title, order_by, list(id, title, is_completed, is_deletable, order_by)')
    .eq('travel_id', travelId)
    .order('order_by', { ascending: true })
    .order('order_by', { foreignTable: 'list', ascending: true });

  if (error) toast.error(error.message);
  return data;
}

export async function addCategory(title: string, travelId?: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ title, travel_id: travelId }])
    .select();

  if (error) toast.error(error.message);
  else toast.success('Category added successfully');

  return data;
}
