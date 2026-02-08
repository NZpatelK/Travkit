import { supabase } from './client';
import toast from 'react-hot-toast';
import { getCurrentUser } from './auth';

export async function getTravelDetail(travelId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("travel")
    .select("id, travel_to, duration")
    .eq("user_id", user.id)
    .eq("id", travelId)
    .single();

  if (error) toast.error(error.message);
  return data ?? null;
}

export async function getAllTravelData() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("travel")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    toast.error(error.message);
    return [];
  }

  return data;
}
