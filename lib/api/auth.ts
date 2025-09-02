import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function requireAuth(): Promise<User> {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session?.user) {
    redirect('/login')
  }

  return session.user
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user ?? null
}

export async function requireAuthAPI(): Promise<User> {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session?.user) {
    throw new Error('Unauthorized')
  }

  return session.user
}