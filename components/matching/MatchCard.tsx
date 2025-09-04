'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, User } from 'lucide-react'
import { Profile } from '@/types'
import FavoriteButton from '@/components/profile/FavoriteButton'

interface MatchCardProps {
  profile: Profile
  matchScore: number
  sharedInterests: string[]
  className?: string
}

export default function MatchCard({
  profile,
  matchScore,
  sharedInterests,
  className = '',
}: MatchCardProps) {
  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement message functionality or navigate to chat
    console.log('Message clicked for user:', profile.user_id)
  }

  const getAvatarSrc = () => {
    if (profile.avatar_url) {
      return profile.avatar_url.startsWith('http')
        ? profile.avatar_url
        : `/avatars/${profile.avatar_url}`
    }
    return `/api/placeholder/100/100?text=${encodeURIComponent(profile.first_name?.charAt(0) || 'U')}`
  }

  return (
    <Link
      href={`/matches/${profile.user_id}`}
      className={`block rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-purple-300 hover:shadow-md ${className}`}
    >
      <div className="p-4">
        {/* Header with Avatar and Score */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
              {profile.avatar_url ? (
                <Image
                  src={getAvatarSrc()}
                  alt={`${profile.first_name || 'User'}'s avatar`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-xl font-bold text-white">
                  {profile.first_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile.first_name} {profile.last_name?.charAt(0)}.
              </h3>
              {profile.age && (
                <p className="text-sm text-gray-500">{profile.age} years old</p>
              )}
            </div>
          </div>

          {/* Match Score */}
          <div className="flex flex-col items-end">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-medium text-white">
              {Math.round(matchScore)}% match
            </div>
          </div>
        </div>

        {/* Bio Snippet */}
        {profile.bio && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {profile.bio}
          </p>
        )}

        {/* Shared Interests */}
        {sharedInterests.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-500">
              {sharedInterests.length} shared interest
              {sharedInterests.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {sharedInterests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
                >
                  {interest}
                </span>
              ))}
              {sharedInterests.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{sharedInterests.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <button
            onClick={handleMessage}
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 sm:px-4"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Message</span>
            <span className="sm:hidden">Chat</span>
          </button>

          <div
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <FavoriteButton profileId={profile.user_id || profile.id} />
          </div>
        </div>
      </div>
    </Link>
  )
}
