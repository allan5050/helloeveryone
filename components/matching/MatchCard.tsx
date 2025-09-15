'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Sparkles, Loader } from 'lucide-react'
import { Profile } from '@/types'
import FavoriteButton from '@/components/profile/FavoriteButton'

interface MatchCardProps {
  profile: Profile
  matchScore: number
  sharedInterests: string[]
  className?: string
  showAIButton?: boolean
  currentUserBio?: string
  currentUserInterests?: string[]
}

interface AIInsight {
  compatibilityReason: string
  conversationStarters: string[]
  meetingSuggestions: string[]
}

export default function MatchCard({
  profile,
  matchScore,
  sharedInterests,
  className = '',
  showAIButton = false,
  currentUserBio = '',
  currentUserInterests = [],
}: MatchCardProps) {
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [showInsight, setShowInsight] = useState(false)
  const [isFromCache, setIsFromCache] = useState(false)

  // Load existing AI insights on component mount
  useEffect(() => {
    const loadExistingInsight = async () => {
      try {
        const response = await fetch('/api/matches/explain-simple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchIds: [profile.user_id],
            currentUser: {
              bio: currentUserBio,
              interests: currentUserInterests,
            },
            sharedInterests: sharedInterests,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.explanations && data.explanations[0] && data.explanations[0].fromCache) {
            setAiInsight({
              compatibilityReason: data.explanations[0].compatibilityReason,
              conversationStarters: data.explanations[0].conversationStarters,
              meetingSuggestions: data.explanations[0].meetingSuggestions,
            })
            setIsFromCache(true)
          }
        }
      } catch (error) {
        console.error('Error loading existing AI insight:', error)
      }
    }

    if (showAIButton && (getMatchQuality(matchScore) === 'high' || getMatchQuality(matchScore) === 'medium')) {
      loadExistingInsight()
    }
  }, [profile.user_id, matchScore, showAIButton, currentUserBio, currentUserInterests, sharedInterests])
  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement message functionality or navigate to chat
    console.log('Message clicked for user:', profile.user_id)
  }

  const handleAIInsight = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (aiInsight) {
      setShowInsight(!showInsight)
      return
    }

    setLoadingInsight(true)
    try {
      const response = await fetch('/api/matches/explain-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchIds: [profile.user_id],
          currentUser: {
            bio: currentUserBio,
            interests: currentUserInterests,
          },
          sharedInterests: sharedInterests,
        }),
      })

      if (!response.ok) throw new Error('Failed to get AI insight')

      const data = await response.json()
      if (data.explanations && data.explanations[0]) {
        setAiInsight({
          compatibilityReason: data.explanations[0].compatibilityReason,
          conversationStarters: data.explanations[0].conversationStarters,
          meetingSuggestions: data.explanations[0].meetingSuggestions,
        })
        setIsFromCache(data.explanations[0].fromCache || false)
        setShowInsight(true)
      }
    } catch (error) {
      console.error('Error fetching AI insight:', error)
    } finally {
      setLoadingInsight(false)
    }
  }

  const getMatchQuality = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    return 'low'
  }

  const getMatchQualityColor = (quality: 'high' | 'medium' | 'low') => {
    switch (quality) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
    }
  }

  const matchQuality = getMatchQuality(matchScore)

  const getAvatarSrc = () => {
    if (profile.avatar_url) {
      return profile.avatar_url.startsWith('http')
        ? profile.avatar_url
        : `/avatars/${profile.avatar_url}`
    }
    return `/api/placeholder/100/100?text=${encodeURIComponent(profile.display_name?.charAt(0) || 'U')}`
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
                  alt={`${profile.display_name || 'User'}'s avatar`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-xl font-bold text-white">
                  {profile.display_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile.display_name}
              </h3>
              {profile.age && (
                <p className="text-sm text-gray-500">{profile.age} years old</p>
              )}
            </div>
          </div>

          {/* Match Score */}
          <div className="flex flex-col items-end space-y-2">
            <div className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getMatchQualityColor(matchQuality)}`}>
              {matchQuality} match
            </div>
            {showAIButton && (matchQuality === 'high' || matchQuality === 'medium') && (
              <button
                onClick={handleAIInsight}
                disabled={loadingInsight}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-lg disabled:opacity-50"
              >
                {loadingInsight ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {aiInsight ? (showInsight ? 'Hide AI' : 'Show AI') : 'AI Insight'}
                      {aiInsight && isFromCache && (
                        <span className="ml-1 text-xs opacity-75">📋</span>
                      )}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bio Snippet */}
        {profile.bio && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {profile.bio}
          </p>
        )}

        {/* AI Insight Display - Prominent and obvious */}
        {showInsight && aiInsight && (
          <div className="mb-4 rounded-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h4 className="text-base font-bold text-purple-900">🤖 AI says: Why this is a great match</h4>
              </div>
              {isFromCache && (
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  📋 Saved
                </span>
              )}
            </div>

            <div className="mb-4 rounded-md bg-white/70 p-3">
              <p className="text-sm font-medium text-purple-800">{aiInsight.compatibilityReason}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {aiInsight.conversationStarters.length > 0 && (
                <div className="rounded-md bg-white/50 p-3">
                  <h5 className="mb-2 flex items-center gap-1 text-sm font-bold text-purple-700">
                    💬 Start the conversation:
                  </h5>
                  <div className="space-y-2">
                    {aiInsight.conversationStarters.slice(0, 2).map((starter, idx) => (
                      <div key={idx} className="rounded bg-white p-2">
                        <p className="text-xs font-medium text-purple-700">"{starter}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiInsight.meetingSuggestions.length > 0 && (
                <div className="rounded-md bg-white/50 p-3">
                  <h5 className="mb-2 flex items-center gap-1 text-sm font-bold text-purple-700">
                    ☕ Perfect places to meet:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {aiInsight.meetingSuggestions.map((suggestion, idx) => (
                      <span key={idx} className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
