'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSetupSchema, ProfileSetupData } from '@/lib/validations/profile'
import { InterestSelector } from '@/components/profile/InterestSelector'
import { PhotoUpload } from '@/components/profile/PhotoUpload'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'

const STEPS = [
  { title: 'Basic Info', description: 'Tell us about yourself' },
  { title: 'Interests', description: 'What do you enjoy?' },
  { title: 'Bio & Photo', description: 'Complete your profile' }
]

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const form = useForm<ProfileSetupData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      display_name: '',
      age: 25,
      location: '',
      interests: {
        music_genres: [],
        food_preferences: [],
        activities: []
      },
      bio: ''
    }
  })

  const nextStep = async () => {
    const isValid = await form.trigger(getFieldsForStep(currentStep))
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0:
        return ['display_name', 'age', 'location'] as const
      case 1:
        return ['interests'] as const
      case 2:
        return ['bio'] as const
      default:
        return []
    }
  }

  const onSubmit = async (data: ProfileSetupData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      // Prepare profile data
      const profileData = {
        id: user.id,
        display_name: data.display_name,
        age: data.age,
        location: data.location || null,
        interests: data.interests,
        bio: data.bio || null,
        photo_url: photoUrl,
        is_profile_complete: true,
        visible_fields: {
          age_visible: true,
          interests_visible: true,
          bio_visible: true
        }
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })

      if (error) throw error

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                id="display_name"
                type="text"
                {...form.register('display_name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How should others see your name?"
              />
              {form.formState.errors.display_name && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.display_name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                id="age"
                type="number"
                min="25"
                max="50"
                {...form.register('age', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {form.formState.errors.age && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.age.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                {...form.register('location')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State (optional)"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-8">
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
        )

      case 2:
        return (
          <div className="space-y-6">
            <PhotoUpload
              currentPhotoUrl={photoUrl}
              onPhotoChange={setPhotoUrl}
            />
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                {...form.register('bio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Help others get to know you better
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
              >
                Previous
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}