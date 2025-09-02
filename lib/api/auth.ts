import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export async function requireAuth(): Promise<User> {
  const supabase = createServerComponentClient({ cookies })
  
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
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user ?? null
}

export async function requireAuthAPI(): Promise<User> {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session?.user) {
    throw new Error('Unauthorized')
  }

  return session.user
}