import { supabase } from '@/app/utils/supabase/client';
import { Category } from '../data/travelData';

export async function seedDataIfEmpty(categories: Category[], travelTo: string, duration: number) {
  try {
    // Check if tables are empty
    const { count: catCount, error: catCountError } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true });

    const { count: listCount, error: listCountError } = await supabase
      .from('list')
      .select('id', { count: 'exact', head: true });

    const { count: travelCount, error: travelCountError } = await supabase
      .from('travel')
      .select('id', { count: 'exact', head: true });

    if (catCountError) throw new Error(`Error counting categories: ${JSON.stringify(catCountError)}`);
    if (listCountError) throw new Error(`Error counting list items: ${JSON.stringify(listCountError)}`);
    if (travelCountError) throw new Error(`Error counting travel items: ${JSON.stringify(travelCountError)}`);

    if ((catCount ?? 0) === 0 && (listCount ?? 0) === 0 && (travelCount ?? 0) === 0) {
      // Insert travel record
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(`Error fetching user: ${JSON.stringify(userError)}`);
      const userId = userData?.user?.id ?? null;

      const { data: travelData, error: travelError } = await supabase
        .from('travel')
        .insert({ travel_to: travelTo, duration: duration.toString(), user_id: userId })
        .select()
        .single();

      if (travelError || !travelData) throw new Error(`Travel insert error: ${JSON.stringify(travelError)}`);

      const travelId = travelData.id;

      // Prepare categories insert payload with travel_id
      const categoryInsertPayload = categories.map((c) => ({
        title: c.title,
        order_by: c.orderBy,
        travel_id: travelId,
      }));

      console.log('Seeding categories:', categoryInsertPayload);

      // Insert categories
      const { data: insertedCategories, error: catError } = await supabase
        .from('categories')
        .insert(categoryInsertPayload)
        .select();

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
      if (listError) throw new Error(`List insert error: ${JSON.stringify(listError)}`);

      return { seeded: true, travelId };
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

  // Delete in order to handle dependencies
  if (await hasData('list')) await deleteAll('list');
  if (await hasData('categories')) await deleteAll('categories');
  if (await hasData('travel')) await deleteAll('travel');

  return { cleared: true };
}
