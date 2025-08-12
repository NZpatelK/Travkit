import { supabase } from '@/app/utils/supabase/client';
import seedData from '@/app/data/travel.json'; // replace with your actual path

export async function seedDataIfEmpty() {
  try {
    // Dynamic import if you want based on templateName (optional)
    // const seedData = (await import(`@/data/templates/${templateName}.json`)).default;

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
      const categoryInsertPayload = seedData.categories.map(c => ({
        title: c.categoryName,
      }));

      console.log('Seeding categories:', categoryInsertPayload);

      // Insert categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .insert(categoryInsertPayload)
        .select();

      console.log('Categories inserted:', categories, 'Error:', catError);

      if (catError) throw new Error(`Category insert error: ${JSON.stringify(catError)}`);

      // Map categoryName -> id
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.title] = cat.id;
        return acc;
      }, {} as Record<string, string>);

      // Prepare list insert payload by flattening all nested lists
      const listInsertPayload = seedData.categories.flatMap(category =>
        category.list.map(item => ({
          title: item.name,
          iscompleted: false,
          category_id: categoryMap[category.categoryName],
        }))
      );

      console.log('Seeding list items:', listInsertPayload);

      // Insert list items
      const { error: listError } = await supabase
        .from('list')
        .insert(listInsertPayload);

      console.log('List insert error:', listError);

      if (listError) throw new Error(`List insert error: ${JSON.stringify(listError)}`);

      return { seeded: true };
    }

    return { seeded: false };
  } catch (err) {
    // Re-throw error for upper layers to catch/display
    if (err instanceof Error) throw err;
    else throw new Error(JSON.stringify(err));
  }
}



export async function clearAllData() {
  // Helper: check if table has data
  const hasData = async (table) => {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) throw new Error(`Error checking ${table}: ${JSON.stringify(error)}`);
    return data && data.length > 0;
  };

  // Helper: delete all rows from a table
  const deleteAll = async (table) => {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) throw new Error(`Error clearing ${table}: ${JSON.stringify(error)}`);

    // Verify it's empty
    const stillHasData = await hasData(table);
    if (stillHasData) {
      throw new Error(`Data still present in ${table} after delete`);
    }
  };

  // Clear list table first (FK to categories)
  if (await hasData('list')) {
    await deleteAll('list');
  }

  // Then clear categories
  if (await hasData('categories')) {
    await deleteAll('categories');
  }

  return { cleared: true };
}
