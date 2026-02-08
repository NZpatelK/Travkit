import { supabase } from '@/app/utils/supabase/client';
import { Category } from '../data/travelData';

export async function createNewTravelChecklist(categories: Category[], travelTo: string, duration: number) {
  try {
    // Check if tables are empty
    const { error: catCountError } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true });

    const { error: listCountError } = await supabase
      .from('list')
      .select('id', { count: 'exact', head: true });

    const { error: travelCountError } = await supabase
      .from('travel')
      .select('id', { count: 'exact', head: true });

    if (catCountError) throw new Error(`Error counting categories: ${JSON.stringify(catCountError)}`);
    if (listCountError) throw new Error(`Error counting list items: ${JSON.stringify(listCountError)}`);
    if (travelCountError) throw new Error(`Error counting travel items: ${JSON.stringify(travelCountError)}`);


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
        is_deletable: item.is_deletable ?? false,
        category_id: categoryMap[category.title],
        order_by: item.orderBy,
      }))
    );

    // Insert list items
    const { error: listError } = await supabase.from('list').insert(listInsertPayload);
    if (listError) throw new Error(`List insert error: ${JSON.stringify(listError)}`);

    return travelId;

  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(JSON.stringify(err));
  }
}

export async function deteleTravelChecklistByTravelId(travelId: string) {
  // Check if a table has data for this travelId
  const hasData = async (table: string, column: string) => {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq(column, travelId)
      .limit(1);
    if (error) throw new Error(`Error checking ${table}: ${JSON.stringify(error)}`);
    return data && data.length > 0;
  };

  // Delete all rows in a table for a specific travelId
  const deleteAll = async (table: string, column: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(column, travelId); // <-- only rows that match travelId
    if (error) throw new Error(`Error clearing ${table}: ${JSON.stringify(error)}`);

    const stillHasData = await hasData(table, column);
    if (stillHasData) {
      throw new Error(`Data still present in ${table} after delete`);
    }
  };

  // Delete in order to handle dependencies
  if (await hasData('categories', 'travel_id')) await deleteAll('categories', 'travel_id');
  if (await hasData('travel', 'id')) await deleteAll('travel', 'id');

  return { cleared: true };
}

