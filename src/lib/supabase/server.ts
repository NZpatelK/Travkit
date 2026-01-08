import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
      },
    }
  )
}
