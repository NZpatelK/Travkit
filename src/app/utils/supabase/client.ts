import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCategoriesWithLists() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, title, order_by, list(id, title, is_completed, order_by)')
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

export async function allLists() {
  const { data, error } = await supabase
    .from('list')
    .select();

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
