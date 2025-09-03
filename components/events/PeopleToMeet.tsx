'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Users, MapPin, Calendar, Sparkles } from 'lucide-react';

interface MatchExplanation {
  interestOverlap: string[];
  ageCompatibility: 'excellent' | 'good' | 'fair';
  locationMatch: 'same_city' | 'different_location';
  bioSimilarity: string;
  summary: string;
}

interface EventMatch {
  userId: string;
  profileId: string;
  fullName: string;
  bio: string;
  interests: string[];
  age: number;
  location: string;
  profilePictureUrl?: string;
  matchScore: number;
  sharedInterests: string[];
  matchExplanation: MatchExplanation;
}

interface PeopleToMeetProps {
  eventId: string;
  className?: string;
}

export default function PeopleToMeet({ eventId, className = '' }: PeopleToMeetProps) {
  const [matches, setMatches] = useState<EventMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMatches();
  }, [eventId]);

  const fetchMatches = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/match/event/${eventId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (userId: string) => {
    setFavorites(prev => new Set(prev).add(userId));
    // API call would go here
  };

  const handleMessage = (userId: string) => {
    window.location.href = `/chat?with=${userId}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Great Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Potential Match';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          People You'll Meet
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchMatches}
          className="mt-2 text-blue-600 hover:text-blue-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No matches yet</h3>
        <p className="text-gray-500">More people might join this event soon!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" />
        People You'll Meet ({matches.length})
      </h3>
      
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.userId} className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-semibold">
                  {match.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                
                <div className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(match.matchScore)}`}>
                  {Math.round(match.matchScore)}%
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">{match.fullName || 'Anonymous'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(match.matchScore)}`}>
                    {getScoreLabel(match.matchScore)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>{match.matchExplanation.summary}</span>
                </div>

                {match.bio && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{match.bio}</p>
                )}

                {match.sharedInterests && match.sharedInterests.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {match.sharedInterests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {match.sharedInterests.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{match.sharedInterests.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  {match.age && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{match.age} years old</span>
                    </div>
                  )}
                  {match.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{match.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleFavorite(match.userId)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      favorites.has(match.userId)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(match.userId) ? 'fill-current' : ''}`} />
                    {favorites.has(match.userId) ? 'Liked' : 'Like'}
                  </button>
                  
                  <button
                    onClick={() => handleMessage(match.userId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}