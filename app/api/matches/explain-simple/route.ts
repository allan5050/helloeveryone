import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ANTHROPIC_MODEL = process.env.ANTHROPIC_LLM_MODEL || 'claude-sonnet-4-20250514'

interface ProfileData {
  user_id: string
  display_name: string
  bio?: string
  interests: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { matchIds, currentUser, sharedInterests } = await request.json()

    if (!matchIds || !Array.isArray(matchIds) || matchIds.length === 0) {
      return NextResponse.json(
        { error: 'matchIds array is required' },
        { status: 400 }
      )
    }

    // Get the current user from session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const currentUserId = user.id
    const targetUserId = matchIds[0] // We're processing one match at a time

    // Check if we already have AI insights for this match
    const { data: existingInsight } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('target_user_id', targetUserId)
      .single()

    // If we have existing insights, return them
    if (existingInsight) {
      const explanations = [{
        user_id: targetUserId,
        display_name: "Match",
        compatibilityReason: existingInsight.compatibility_reason,
        conversationStarters: existingInsight.conversation_starters,
        meetingSuggestions: existingInsight.meeting_suggestions,
        sharedInterests: existingInsight.shared_interests,
        isHighPriority: true,
        fromCache: true
      }]

      return NextResponse.json({
        explanations,
        overallInsight: "AI-powered insights to help you make meaningful connections.",
        topRecommendations: ["Reach out with a personal message", "Suggest meeting for coffee", "Find shared activities"]
      })
    }

    // If no AI key, return mock data
    if (!ANTHROPIC_API_KEY) {
      const mockExplanations = matchIds.map((userId: string) => ({
        user_id: userId,
        display_name: "Demo User",
        compatibilityReason: "You both share several interests in coffee, cooking, and travel, which suggests great potential for meaningful conversations and shared activities. Your personalities seem complementary for both friendship and professional networking.",
        sharedInterests: sharedInterests || ["coffee", "cooking", "travel"],
        conversationStarters: [
          "I noticed you're into cooking - have you tried any good Thai recipes lately?",
          "Would love to hear about your travel experiences sometime!"
        ],
        meetingSuggestions: ["Coffee chat", "Local food event"],
        isHighPriority: true
      }))

      return NextResponse.json({
        explanations: mockExplanations,
        overallInsight: "These connections show great potential for meaningful relationships based on shared interests and compatible lifestyles.",
        topRecommendations: [
          "Start with a message about shared interests",
          "Suggest meeting for coffee",
          "Ask about travel experiences"
        ]
      })
    }

    // Call Claude API for real insights
    const systemPrompt = `You are a helpful AI that explains why people might connect well.
    Focus on shared interests, complementary personalities, and networking potential.
    NEVER comment on appearance, race, religion, or make romantic suggestions.
    Keep suggestions appropriate for platonic connections and professional networking.
    Respond in JSON format only.`

    const userPrompt = `Current user bio: "${currentUser?.bio || 'No bio provided'}"
Current user interests: ${currentUser?.interests?.join(', ') || 'None specified'}

Match profile bio: "Demo user interested in technology and creativity"
Match interests: ${sharedInterests?.join(', ') || 'coffee, cooking, travel'}
Shared interests: ${sharedInterests?.join(', ') || 'coffee, cooking, travel'}

Provide a brief explanation (2-3 sentences) of why they might connect well, 2 conversation starters, and 2 meeting suggestions.

Respond in this JSON format:
{
  "compatibilityReason": "string",
  "conversationStarters": ["string", "string"],
  "meetingSuggestions": ["string", "string"]
}`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 500,
          temperature: 0.7,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      })

      if (!response.ok) {
        throw new Error('Claude API error')
      }

      const data = await response.json()
      const content = data.content[0]?.text

      let aiInsight
      try {
        aiInsight = JSON.parse(content)
      } catch {
        // Fallback if JSON parsing fails
        aiInsight = {
          compatibilityReason: "Great potential for connection based on shared interests and complementary backgrounds.",
          conversationStarters: ["Hi! I noticed we have some interests in common.", "Would love to chat about shared hobbies sometime."],
          meetingSuggestions: ["Coffee chat", "Local networking event"]
        }
      }

      // Save the AI insight to database
      const { error: saveError } = await supabase
        .from('ai_insights')
        .upsert({
          user_id: currentUserId,
          target_user_id: targetUserId,
          compatibility_reason: aiInsight.compatibilityReason,
          conversation_starters: aiInsight.conversationStarters,
          meeting_suggestions: aiInsight.meetingSuggestions,
          shared_interests: sharedInterests || []
        })

      if (saveError) {
        console.error('Error saving AI insight:', saveError)
      }

      const explanations = matchIds.map((userId: string) => ({
        user_id: userId,
        display_name: "Match",
        ...aiInsight,
        sharedInterests: sharedInterests || [],
        isHighPriority: true,
        fromCache: false
      }))

      return NextResponse.json({
        explanations,
        overallInsight: "AI-powered insights to help you make meaningful connections.",
        topRecommendations: ["Reach out with a personal message", "Suggest meeting for coffee", "Find shared activities"]
      })

    } catch (aiError) {
      console.error('AI API error:', aiError)
      // Return fallback response
      const fallbackExplanations = matchIds.map((userId: string) => ({
        user_id: userId,
        display_name: "Demo User",
        compatibilityReason: "You both have interesting profiles that suggest potential for good conversation and shared activities.",
        sharedInterests: sharedInterests || [],
        conversationStarters: ["Hi! Nice to meet you.", "Would love to chat sometime."],
        meetingSuggestions: ["Coffee", "Local event"],
        isHighPriority: true
      }))

      return NextResponse.json({
        explanations: fallbackExplanations,
        overallInsight: "These connections offer great potential for meaningful relationships.",
        topRecommendations: ["Start with a friendly message", "Suggest meeting for coffee"]
      })
    }

  } catch (error) {
    console.error('Error in simple explain matches API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}