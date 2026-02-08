import { supabase } from './client';
import toast from 'react-hot-toast';


export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (!user) {
    toast.error("No user logged in");
    return null;
  }

  return user;
}
