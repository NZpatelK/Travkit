import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCategoriesWithLists() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, title, list(id, title, iscompleted)');

  if (error) throw error;
  return data;
}

export async function addCategory(title: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ title }])
    .select();

  if (error) throw error;
  return data;
}

export async function addListItem(title: string, categoryId: string) {
  const { data, error } = await supabase
    .from('list')
    .insert([{ title, category_id: categoryId, isCompleted: false }])
    .select();

  if (error) throw error;
  return data;
}


export async function updateIsCompleted(id: string | number, iscompleted: boolean) {
  const { data, error } = await supabase
    .from('list')
    .update({ iscompleted }) 
    .eq('id', id)

  if (error) throw error;
  return data;
}
