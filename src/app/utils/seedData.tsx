import { supabase } from '@/app/utils/supabase/client';

// Dynamic import based on template name
export async function seedDataIfEmpty(templateName: string) {
  // Import JSON file dynamically
  let seedData;
  try {
    seedData = (await import(`@/data/templates/${templateName}.json`)).default;
  } catch {
    throw new Error(`Template "${templateName}" not found.`);
  }

  // Check if both tables are empty
  const { count: catCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true });

  const { count: listCount } = await supabase
    .from('list')
    .select('id', { count: 'exact', head: true });

  if ((catCount ?? 0) === 0 && (listCount ?? 0) === 0) {
    // Insert categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .insert(seedData.categories)
      .select();

    if (catError) throw catError;

    // Map category title to ID
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.title] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Insert list items with category_id
    const listWithIds = seedData.list.map(item => ({
      title: item.title,
      isCompleted: item.isCompleted,
      category_id: categoryMap[item.category]
    }));

    const { error: listError } = await supabase
      .from('list')
      .insert(listWithIds);

    if (listError) throw listError;

    return { seeded: true, template: templateName };
  }

  return { seeded: false, template: templateName };
}
