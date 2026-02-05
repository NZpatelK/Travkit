import { get } from 'http';
import { supabase } from './client';
import { Category } from '@/app/data/travelData';
import { getCurrentUser } from './auth';

export async function createNewTravelChecklist(categories: Category[], travelTo: string, duration: number) {
  try {
    const userData = await getCurrentUser();

    const userId = userData?.id;
    if (!userId) throw new Error("No user logged in");

    const { data: travelData, error: travelError } = await supabase
      .from('travel')
      .insert({ travel_to: travelTo, duration: duration.toString(), user_id: userId })
      .select()
      .single();

    if (travelError || !travelData) throw new Error(travelError?.message);

    const travelId = travelData.id;

    const categoryInsertPayload = categories.map(c => ({
      title: c.title,
      order_by: c.orderBy,
      travel_id: travelId,
    }));

    const { data: insertedCategories, error: catError } = await supabase
      .from('categories')
      .insert(categoryInsertPayload)
      .select();

    if (catError) throw new Error(catError.message);

    const categoryMap = insertedCategories.reduce((acc, cat) => {
      acc[cat.title] = cat.id;
      return acc;
    }, {} as Record<string, number>);

    const listInsertPayload = categories.flatMap(category =>
      category.list.map(item => ({
        title: item.title,
        is_completed: item.is_completed ?? false,
        is_deletable: item.is_deletable ?? false,
        category_id: categoryMap[category.title],
        order_by: item.orderBy,
      }))
    );

    const { error: listError } = await supabase.from('list').insert(listInsertPayload);
    if (listError) throw new Error(listError.message);

    return travelId;

  } catch (err) {
    if (err instanceof Error) throw err;
    else throw new Error(JSON.stringify(err));
  }
}

export async function deleteTravelChecklistByTravelId(travelId: string) {
  const hasData = async (table: string, column: string) => {
    const { data, error } = await supabase.from(table).select('id').eq(column, travelId).limit(1);
    if (error) throw new Error(error.message);
    return !!data?.length;
  };

  const deleteAll = async (table: string, column: string) => {
    const { error } = await supabase.from(table).delete().eq(column, travelId);
    if (error) throw new Error(error.message);

    if (await hasData(table, column)) throw new Error(`Data still present in ${table} after delete`);
  };

  if (await hasData('categories', 'travel_id')) await deleteAll('categories', 'travel_id');
  if (await hasData('travel', 'id')) await deleteAll('travel', 'id');

  return { cleared: true };
}