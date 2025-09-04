import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/api/auth'
import MatchExplanation from '@/components/matching/MatchExplanation'
import FavoriteButton from '@/components/profile/FavoriteButton'
import MessageButton from '@/components/profile/MessageButton'

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

async function getMatchDetails(currentUserId: string, matchUserId: string) {
  const supabase = await createClient()

  // Get match score and profile data
  const [matchResult, profileResult, commonEventsResult, favoriteResult] =
    await Promise.all([
      supabase
        .from('match_scores')
        .select('*')
        .eq('user_id_1', currentUserId)
        .eq('user_id_2', matchUserId)
        .single(),

      supabase.from('profiles').select('*').eq('user_id', matchUserId).single(),

      // Get common events both users have RSVPed to
      supabase
        .from('events')
        .select(
          `
        title,
        date,
        location,
        rsvps!inner(user_id)
      `
        )
        .in('rsvps.user_id', [currentUserId, matchUserId]),

      // Check if user is favorited
      supabase
        .from('favorites')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('favorite_user_id', matchUserId)
        .single(),
    ])

  if (matchResult.error || profileResult.error) {
    return null
  }

  // Process common events (events where both users have RSVPs)
  const eventRsvps = commonEventsResult.data || []
  const eventUserCounts = eventRsvps.reduce(
    (acc: Record<string, number>, event: any) => {
      const key = event.title
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {}
  )

  const commonEvents = Object.entries(eventUserCounts)
    .filter(([_, count]) => count >= 2)
    .map(([title]) => title)

  return {
    match: matchResult.data,
    profile: profileResult.data,
    commonEvents,
    isFavorite: !favoriteResult.error,
  }
}

function MatchDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Header */}
          <div className="mb-8 flex items-center space-x-4">
            <div className="h-8 w-8 rounded bg-gray-200"></div>
            <div className="h-8 w-48 rounded bg-gray-200"></div>
          </div>

          {/* Profile Card */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
              <div className="mx-auto h-32 w-32 rounded-full bg-gray-200 md:mx-0"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 w-48 rounded bg-gray-200"></div>
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-10 w-24 rounded bg-gray-200"></div>
                  <div className="h-10 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Explanation */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 h-8 w-48 rounded bg-gray-200"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                    <div className="h-6 w-16 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-2 w-full rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function MatchDetailContent({ params }: PageProps) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return <div>Please log in to view match details.</div>
  }

  const { userId } = await params
  const matchDetails = await getMatchDetails(currentUser.id, userId)

  if (!matchDetails) {
    notFound()
  }

  const { match, profile, commonEvents, isFavorite } = matchDetails

  const getAvatarSrc = () => {
    if (profile.avatar_url) {
      return profile.avatar_url.startsWith('http')
        ? profile.avatar_url
        : `/avatars/${profile.avatar_url}`
    }
    return `/api/placeholder/200/200?text=${encodeURIComponent(profile.first_name?.charAt(0) || 'U')}`
  }

  const calculateAgeCompatibility = () => {
    const ageDiff = Math.abs((profile.age || 30) - 30) // Assume current user is 30 for demo
    return Math.max(0, 100 - ageDiff * 5) // Decrease 5% per year difference
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Link
            href="/matches"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Match Details</h1>
        </div>

        {/* Profile Card */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-col space-y-6 md:flex-row md:items-start md:space-x-8 md:space-y-0">
            {/* Avatar */}
            <div className="relative mx-auto h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 md:mx-0">
              {profile.avatar_url ? (
                <Image
                  src={getAvatarSrc()}
                  alt={`${profile.first_name}'s avatar`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-3xl font-bold text-white">
                  {profile.first_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-1 text-2xl font-bold text-gray-900">
                    {profile.first_name} {profile.last_name?.charAt(0)}.
                  </h2>
                  <div className="flex items-center justify-center space-x-4 text-gray-600 md:justify-start">
                    {profile.age && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{profile.age} years old</span>
                      </span>
                    )}
                    {profile.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="mt-4 md:mt-0">
                  <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-lg font-bold text-white">
                    {Math.round(match.total_score)}% Match
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mb-6 leading-relaxed text-gray-700">
                  {profile.bio}
                </p>
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Interests
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {profile.interests.map((interest, index) => {
                      const isShared =
                        match.common_interests?.includes(interest)
                      return (
                        <span
                          key={index}
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            isShared
                              ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {interest}
                          {isShared && ' ✨'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <MessageButton
                  targetUserId={profile.user_id}
                  className="px-6 py-3"
                  showText={true}
                />
                <FavoriteButton
                  targetUserId={profile.user_id}
                  initialIsFavorite={isFavorite}
                  className="px-6 py-3"
                  showText={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Common Events */}
        {commonEvents.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
              <Calendar className="mr-2 h-5 w-5 text-purple-600" />
              Events You've Both Attended ({commonEvents.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {commonEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 rounded-lg bg-purple-50 p-3"
                >
                  <div className="h-3 w-3 flex-shrink-0 rounded-full bg-purple-400" />
                  <span className="font-medium text-gray-700">{event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match Explanation */}
        <MatchExplanation
          matchScore={match.total_score}
          sharedInterests={match.common_interests || []}
          ageCompatibility={calculateAgeCompatibility()}
          bioSimilarity={match.bio_similarity || 75}
          locationScore={match.location_score || 85}
          commonEvents={commonEvents}
        />
      </div>
    </div>
  )
}

export default function MatchDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<MatchDetailSkeleton />}>
      <MatchDetailContent params={params} />
    </Suspense>
  )
}
