import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createServerClient()
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/login')
    }

    // Check if profile exists and is complete
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_profile_complete')
      .eq('id', user.id)
      .single()

    // Redirect based on profile completion status
    if (!profile || !profile.is_profile_complete) {
      redirect('/profile/setup')
    } else {
      redirect('/profile/edit')
    }
  } catch (error) {
    console.error('Profile page error:', error)
    redirect('/profile/setup')
  }
}