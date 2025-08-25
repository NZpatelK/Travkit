import { supabase } from '@/app/utils/supabase/client';
import { Category } from '../data/travelData';

export async function seedDataIfEmpty(categories: Category[]) {
  try {
    // Check if tables are empty
    const { count: catCount, error: catCountError } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true });

    const { count: listCount, error: listCountError } = await supabase
      .from('list')
      .select('id', { count: 'exact', head: true });

    if (catCountError) throw new Error(`Error counting categories: ${JSON.stringify(catCountError)}`);
    if (listCountError) throw new Error(`Error counting list items: ${JSON.stringify(listCountError)}`);

    if ((catCount ?? 0) === 0 && (listCount ?? 0) === 0) {
      // Prepare categories insert payload
      const categoryInsertPayload = categories.map((c) => ({
        title: c.title,
        order_by: c.orderBy,
      }));

      console.log('Seeding categories:', categoryInsertPayload);

      // Insert categories
      const { data: insertedCategories, error: catError } = await supabase
        .from('categories')
        .insert(categoryInsertPayload)
        .select();

      console.log('Categories inserted:', insertedCategories, 'Error:', catError);

      if (catError) throw new Error(`Category insert error: ${JSON.stringify(catError)}`);

      // Map category title -> id
      const categoryMap = insertedCategories.reduce((acc, cat) => {
        acc[cat.title] = cat.id;
        return acc;
      }, {} as Record<string, number>);

      // Prepare list insert payload
      const listInsertPayload = categories.flatMap((category) =>
        category.list.map((item) => ({
          title: item.title,
          is_completed: item.is_completed ?? false,
          category_id: categoryMap[category.title],
          order_by: item.orderBy,
        }))
      );

      console.log('Seeding list items:', listInsertPayload);

      // Insert list items
      const { error: listError } = await supabase.from('list').insert(listInsertPayload);

      console.log('List insert error:', listError);

      if (listError) throw new Error(`List insert error: ${JSON.stringify(listError)}`);

      return { seeded: true };
    }

    return { seeded: false };
  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(JSON.stringify(err));
  }
}

export async function clearAllData() {
  const hasData = async (table: string) => {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) throw new Error(`Error checking ${table}: ${JSON.stringify(error)}`);
    return data && data.length > 0;
  };

  const deleteAll = async (table: string) => {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) throw new Error(`Error clearing ${table}: ${JSON.stringify(error)}`);

    const stillHasData = await hasData(table);
    if (stillHasData) {
      throw new Error(`Data still present in ${table} after delete`);
    }
  };

  if (await hasData('list')) {
    await deleteAll('list');
  }

  if (await hasData('categories')) {
    await deleteAll('categories');
  }

  return { cleared: true };
}
