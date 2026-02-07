import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = 'https://mnuhdqxktpducsngraay.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udWhkcXhrdHBkdWNzbmdyYWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTY5MzEsImV4cCI6MjA4NTY5MjkzMX0.I79Zf8iiRdDdOWPYCrxLiTjIKLvRosUgD50Pf3-Gwzo'

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
