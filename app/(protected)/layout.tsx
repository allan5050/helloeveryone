import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

interface ProtectedLayoutProps {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}