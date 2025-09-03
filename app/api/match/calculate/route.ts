import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/api/auth';

interface MatchCalculationRequest {
  targetProfileId?: string;
  eventId?: string;
  limit?: number;
  minScore?: number;
  forceRecalculate?: boolean;
}

interface MatchScore {
  profileId: string;
  score: number;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    age?: number;
    location?: string;
    bio?: string;
    interests?: string[];
  };
  breakdown?: {
    bioSimilarity: number;
    interestOverlap: number;
    ageProximity: number;
    locationBonus: number;
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { user } = await requireAuth();
    const supabase = createClient();

    const {
      targetProfileId,
      eventId,
      limit = 10,
      minScore = 20,
      forceRecalculate = false
    }: MatchCalculationRequest = await request.json();

    let targetProfiles: string[] = [];

    if (eventId) {
      // Get profiles attending the specific event
      const { data: rsvps, error: rsvpError } = await supabase
        .from('rsvps')
        .select('profile_id')
        .eq('event_id', eventId)
        .neq('profile_id', user.id);

      if (rsvpError) {
        return NextResponse.json(
          { error: 'Failed to fetch event attendees' },
          { status: 500 }
        );
      }

      targetProfiles = rsvps.map(rsvp => rsvp.profile_id);
    } else if (targetProfileId) {
      targetProfiles = [targetProfileId];
    } else {
      // Get all profiles except the current user
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .neq('id', user.id);

      if (profileError) {
        return NextResponse.json(
          { error: 'Failed to fetch profiles' },
          { status: 500 }
        );
      }

      targetProfiles = profiles.map(p => p.id);
    }

    if (targetProfiles.length === 0) {
      return NextResponse.json({
        success: true,
        matches: [],
        computationTime: Date.now() - startTime
      });
    }

    const matches: MatchScore[] = [];

    // Check if we should use cached scores or recalculate
    if (!forceRecalculate) {
      // Try to get cached scores first
      const { data: cachedScores, error: cacheError } = await supabase
        .from('match_scores')
        .select(`
          score,
          profile1_id,
          profile2_id
        `)
        .or(`and(profile1_id.eq.${user.id},profile2_id.in.(${targetProfiles.join(',')})),and(profile2_id.eq.${user.id},profile1_id.in.(${targetProfiles.join(',')}))`)
        .gte('score', minScore)
        .order('score', { ascending: false })
        .limit(limit);

      if (!cacheError && cachedScores && cachedScores.length > 0) {
        // Get profile details for cached matches
        const matchedProfileIds = cachedScores.map(score => 
          score.profile1_id === user.id ? score.profile2_id : score.profile1_id
        );

        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, age, location, bio, interests')
          .in('id', matchedProfileIds);

        if (!profileError && profiles) {
          for (const score of cachedScores) {
            const matchedProfileId = score.profile1_id === user.id ? score.profile2_id : score.profile1_id;
            const profile = profiles.find(p => p.id === matchedProfileId);
            
            if (profile) {
              matches.push({
                profileId: profile.id,
                score: Number(score.score),
                profile: {
                  id: profile.id,
                  firstName: profile.first_name,
                  lastName: profile.last_name,
                  age: profile.age,
                  location: profile.location,
                  bio: profile.bio,
                  interests: profile.interests as string[] || []
                }
              });
            }
          }
        }
      }
    }

    // If we have cached results and don't need to force recalculate, return them
    if (matches.length > 0 && !forceRecalculate) {
      return NextResponse.json({
        success: true,
        matches: matches.slice(0, limit),
        cached: true,
        computationTime: Date.now() - startTime
      });
    }

    // Calculate fresh scores using the database function
    const freshMatches: MatchScore[] = [];
    
    for (const targetId of targetProfiles) {
      try {
        // Call the calculate_match_score function
        const { data: scoreResult, error: scoreError } = await supabase
          .rpc('calculate_match_score', {
            profile1_id: user.id,
            profile2_id: targetId
          });

        if (scoreError) {
          console.error('Error calculating match score:', scoreError);
          continue;
        }

        const score = Number(scoreResult);
        
        if (score >= minScore) {
          // Get profile details
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, age, location, bio, interests')
            .eq('id', targetId)
            .single();

          if (!profileError && profile) {
            freshMatches.push({
              profileId: profile.id,
              score,
              profile: {
                id: profile.id,
                firstName: profile.first_name,
                lastName: profile.last_name,
                age: profile.age,
                location: profile.location,
                bio: profile.bio,
                interests: profile.interests as string[] || []
              }
            });

            // Cache the score
            await supabase
              .from('match_scores')
              .upsert({
                profile1_id: user.id < targetId ? user.id : targetId,
                profile2_id: user.id < targetId ? targetId : user.id,
                score
              }, {
                onConflict: 'profile1_id,profile2_id'
              });
          }
        }
      } catch (error) {
        console.error(`Error processing match for profile ${targetId}:`, error);
        continue;
      }
    }

    // Sort by score and limit results
    freshMatches.sort((a, b) => b.score - a.score);
    const finalMatches = freshMatches.slice(0, limit);

    const computationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      matches: finalMatches,
      cached: false,
      computationTime,
      totalCalculated: targetProfiles.length
    });

  } catch (error) {
    console.error('Error in calculate matches API:', error);
    
    const computationTime = Date.now() - startTime;
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        computationTime
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve matches for the current user
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { user } = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const minScore = parseInt(searchParams.get('minScore') || '20');
    const eventId = searchParams.get('eventId');

    const supabase = createClient();

    // Build the query
    let query = supabase
      .from('match_scores')
      .select('score, profile1_id, profile2_id')
      .or(`profile1_id.eq.${user.id},profile2_id.eq.${user.id}`)
      .gte('score', minScore)
      .order('score', { ascending: false })
      .limit(limit);

    const { data: matchScores, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch matches' },
        { status: 500 }
      );
    }

    // Get profile details for all matches
    const profileIds = (matchScores || []).map(score => 
      score.profile1_id === user.id ? score.profile2_id : score.profile1_id
    );

    if (profileIds.length === 0) {
      return NextResponse.json({
        success: true,
        matches: [],
        computationTime: Date.now() - startTime
      });
    }

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, age, location, bio, interests')
      .in('id', profileIds);

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile details' },
        { status: 500 }
      );
    }

    const matches: MatchScore[] = [];
    
    for (const score of matchScores || []) {
      const matchProfileId = score.profile1_id === user.id ? score.profile2_id : score.profile1_id;
      const profile = profiles?.find(p => p.id === matchProfileId);
      
      if (profile) {
        matches.push({
          profileId: profile.id,
          score: Number(score.score),
          profile: {
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            age: profile.age,
            location: profile.location,
            bio: profile.bio,
            interests: profile.interests as string[] || []
          }
        });
      }
    }

    // If eventId is specified, filter matches to only include event attendees
    let finalMatches = matches;
    if (eventId) {
      const { data: rsvps } = await supabase
        .from('rsvps')
        .select('profile_id')
        .eq('event_id', eventId);

      if (rsvps) {
        const eventAttendeeIds = new Set(rsvps.map(rsvp => rsvp.profile_id));
        finalMatches = matches.filter(match => eventAttendeeIds.has(match.profileId));
      }
    }

    return NextResponse.json({
      success: true,
      matches: finalMatches,
      computationTime: Date.now() - startTime
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}