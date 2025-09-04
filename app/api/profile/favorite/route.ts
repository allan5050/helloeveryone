import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/auth'
import { z } from 'zod'

// Validation schemas
const favoriteRequestSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID format'),
})

const favoriteQuerySchema = z.object({
  profileId: z.string().uuid('Invalid profile ID format'),
})

// Type definitions
interface FavoriteRequest {
  profileId: string
}

interface FavoriteResponse {
  success?: boolean
  isFavorited?: boolean
  error?: string
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<FavoriteResponse>> {
  try {
    const user = await requireAuth(request)

    // Parse and validate request body
    const body = await request.json()
    const validationResult = favoriteRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { profileId } = validationResult.data
    const supabase = await createClient()

    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('favorited_user_id', profileId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Profile already favorited' },
        { status: 409 }
      )
    }

    // Add favorite
    const { error: insertError } = await supabase.from('favorites').insert({
      user_id: user.id,
      favorited_user_id: profileId,
    })

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<FavoriteResponse>> {
  try {
    const user = await requireAuth(request)

    // Parse and validate request body
    const body = await request.json()
    const validationResult = favoriteRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { profileId } = validationResult.data
    const supabase = await createClient()

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('favorited_user_id', profileId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<FavoriteResponse>> {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    // Validate query parameter
    const validationResult = favoriteQuerySchema.safeParse({ profileId })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('favorited_user_id', profileId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json({ isFavorited: !!data })
  } catch (error) {
    console.error('Error checking favorite status:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
