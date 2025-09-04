'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileEditSchema, ProfileEditData } from '@/lib/validations/profile'
import { InterestSelector } from '@/components/profile/InterestSelector'
import { PhotoUpload } from '@/components/profile/PhotoUpload'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'

export default function ProfileEdit() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const form = useForm<ProfileEditData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      display_name: '',
      age: 25,
      location: '',
      interests: {
        music_genres: [],
        food_preferences: [],
        activities: [],
      },
      bio: '',
      visible_fields: {
        age_visible: true,
        interests_visible: true,
        bio_visible: true,
      },
    },
  })

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (profile) {
          form.reset({
            display_name: profile.display_name || '',
            age: profile.age || 25,
            location: profile.location || '',
            interests: profile.interests || {
              music_genres: [],
              food_preferences: [],
              activities: [],
            },
            bio: profile.bio || '',
            visible_fields: profile.visible_fields || {
              age_visible: true,
              interests_visible: true,
              bio_visible: true,
            },
          })
          setPhotoUrl(profile.photo_url)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user, supabase, form])

  const onSubmit = async (data: ProfileEditData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const profileData = {
        id: user.id,
        display_name: data.display_name,
        age: data.age,
        location: data.location || null,
        interests: data.interests,
        bio: data.bio || null,
        photo_url: photoUrl,
        visible_fields: data.visible_fields,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="mt-1 text-gray-600">
                Update your information and preferences
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white shadow-sm">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-6"
          >
            {/* Photo Upload */}
            <PhotoUpload
              currentPhotoUrl={photoUrl}
              onPhotoChange={setPhotoUrl}
            />

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              <div>
                <label
                  htmlFor="display_name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Display Name *
                </label>
                <input
                  id="display_name"
                  type="text"
                  {...form.register('display_name')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.display_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.display_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Age *
                </label>
                <input
                  id="age"
                  type="number"
                  min="25"
                  max="50"
                  {...form.register('age', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.age && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.age.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  {...form.register('location')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, State (optional)"
                />
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-6">
              <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                Interests
              </h2>

              <InterestSelector
                form={form}
                category="music_genres"
                label="Music Genres"
                maxSelections={5}
              />
              <InterestSelector
                form={form}
                category="food_preferences"
                label="Food Preferences"
                maxSelections={5}
              />
              <InterestSelector
                form={form}
                category="activities"
                label="Activities"
                maxSelections={8}
              />
              {form.formState.errors.interests && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.interests.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                Bio
              </h2>

              <div>
                <textarea
                  id="bio"
                  rows={4}
                  {...form.register('bio')}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell others about yourself, your interests, what you're looking for in connections..."
                />
                <div className="mt-1 flex justify-between">
                  {form.formState.errors.bio && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                  <span className="text-sm text-gray-500">
                    {form.watch('bio')?.length || 0}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                Privacy Settings
              </h2>
              <p className="text-sm text-gray-600">
                Control what information is visible to potential matches
              </p>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...form.register('visible_fields.age_visible')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show my age</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...form.register('visible_fields.interests_visible')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Show my interests
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...form.register('visible_fields.bio_visible')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show my bio</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[44px] rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
