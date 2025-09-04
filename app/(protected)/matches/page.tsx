'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'
import MatchCard from '@/components/matching/MatchCard'

interface Match {
  id: string
  total_score: number
  common_interests: string[]
  created_at: string
  profiles: {
    user_id: string
    first_name: string
    last_name: string
    avatar_url: string
    bio: string
    age: number
    interests: string[]
    is_favorite?: boolean
  }
}

type ViewMode = 'grid' | 'list'
type SortOption = 'score' | 'date' | 'interests'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [minScore, setMinScore] = useState(70)
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const itemsPerPage = 12

  useEffect(() => {
    if (user) {
      fetchMatches()
    }
  }, [user, minScore, sortBy, currentPage])

  const fetchMatches = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('match_scores')
        .select(
          `
          id,
          total_score,
          common_interests,
          created_at,
          profiles!match_scores_user_id_2_fkey(
            user_id,
            first_name,
            last_name,
            avatar_url,
            bio,
            age,
            interests
          )
        `,
          { count: 'exact' }
        )
        .eq('user_id_1', user.id)
        .gte('total_score', minScore)

      // Apply sorting
      switch (sortBy) {
        case 'score':
          query = query.order('total_score', { ascending: false })
          break
        case 'date':
          query = query.order('created_at', { ascending: false })
          break
        case 'interests':
          // Sort by number of common interests (handled in client-side filtering)
          query = query.order('total_score', { ascending: false })
          break
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching matches:', error)
        setError('Failed to load matches. Please try again.')
        return
      }

      // Check for favorites
      if (data && data.length > 0) {
        const userIds = data.map(match => match.profiles.user_id)
        const { data: favorites } = await supabase
          .from('favorites')
          .select('favorite_user_id')
          .eq('user_id', user.id)
          .in('favorite_user_id', userIds)

        const favoriteIds = new Set(
          favorites?.map(f => f.favorite_user_id) || []
        )

        const matchesWithFavorites = data.map(match => ({
          ...match,
          profiles: {
            ...match.profiles,
            is_favorite: favoriteIds.has(match.profiles.user_id),
          },
        }))

        setMatches(matchesWithFavorites)
      } else {
        setMatches([])
      }

      setHasNextPage(count ? count > currentPage * itemsPerPage : false)
    } catch (error) {
      console.error('Error fetching matches:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredMatches = useMemo(() => {
    let filtered = matches

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        match =>
          match.profiles.first_name?.toLowerCase().includes(searchLower) ||
          match.profiles.bio?.toLowerCase().includes(searchLower) ||
          match.common_interests.some(interest =>
            interest.toLowerCase().includes(searchLower)
          )
      )
    }

    // Sort by interests if selected
    if (sortBy === 'interests') {
      filtered = [...filtered].sort(
        (a, b) => b.common_interests.length - a.common_interests.length
      )
    }

    return filtered
  }, [matches, searchTerm, sortBy])

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Please log in to view your matches.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Your Matches
          </h1>
          <p className="text-gray-600">
            {filteredMatches.length} compatible{' '}
            {filteredMatches.length === 1 ? 'person' : 'people'} found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search matches..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Minimum Match Score
                  </label>
                  <select
                    value={minScore}
                    onChange={e => {
                      setMinScore(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={50}>50% and above</option>
                    <option value={60}>60% and above</option>
                    <option value={70}>70% and above</option>
                    <option value={80}>80% and above</option>
                    <option value={90}>90% and above</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="score">Match Score</option>
                    <option value="date">Recently Added</option>
                    <option value="interests">Shared Interests</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setMinScore(70)
                      setSortBy('score')
                      setCurrentPage(1)
                    }}
                    className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-center">
              <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Matches
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => fetchMatches()}
                  className="mt-2 rounded bg-red-100 px-3 py-1 text-sm text-red-800 transition-colors hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Matches Grid/List */}
        {loading && currentPage === 1 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center space-x-3">
                  <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                    <div className="h-3 w-16 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200"></div>
                  <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                </div>
                <div className="mb-4 flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-gray-200"></div>
                  <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-8 w-20 rounded bg-gray-200"></div>
                  <div className="h-8 w-20 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMatches.length > 0 ? (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'mx-auto max-w-4xl grid-cols-1'
              }`}
            >
              {filteredMatches.map(match => (
                <MatchCard
                  key={match.id}
                  profile={match.profiles}
                  matchScore={match.total_score}
                  sharedInterests={match.common_interests}
                  className={viewMode === 'list' ? 'w-full' : ''}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-purple-400"
                >
                  {loading ? 'Loading...' : 'Load More Matches'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {searchTerm || minScore > 70
                ? 'No matches found'
                : 'No matches yet'}
            </h3>
            <p className="mb-4 text-gray-600">
              {searchTerm || minScore > 70
                ? 'Try adjusting your search or filters'
                : 'Complete your profile and attend events to find matches'}
            </p>
            {!searchTerm && minScore <= 70 && (
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/profile"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-center text-white transition-colors hover:bg-purple-700"
                >
                  Update Profile
                </Link>
                <Link
                  href="/events"
                  className="rounded-lg bg-gray-100 px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Find Events
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
