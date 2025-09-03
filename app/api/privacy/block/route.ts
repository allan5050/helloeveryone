import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { blockedUserId } = await request.json();

    if (!blockedUserId) {
      return NextResponse.json(
        { error: 'Blocked user ID is required' },
        { status: 400 }
      );
    }

    if (currentUser.id === blockedUserId) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      );
    }

    // Create bidirectional block relationship
    const { error } = await supabase
      .from('blocks')
      .insert([
        { blocker_id: currentUser.id, blocked_id: blockedUserId },
        { blocker_id: blockedUserId, blocked_id: currentUser.id }
      ]);

    if (error) {
      console.error('Error creating block:', error);
      return NextResponse.json(
        { error: 'Failed to block user' },
        { status: 500 }
      );
    }

    // Remove existing matches between users
    await supabase
      .from('match_scores')
      .delete()
      .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${blockedUserId}),and(user1_id.eq.${blockedUserId},user2_id.eq.${currentUser.id})`);

    // Remove from favorites
    await supabase
      .from('favorites')
      .delete()
      .or(`and(user_id.eq.${currentUser.id},target_user_id.eq.${blockedUserId}),and(user_id.eq.${blockedUserId},target_user_id.eq.${currentUser.id})`);

    // Hide existing messages (soft delete by setting is_deleted = true)
    await supabase
      .from('messages')
      .update({ is_deleted: true })
      .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${blockedUserId}),and(sender_id.eq.${blockedUserId},recipient_id.eq.${currentUser.id})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Block API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { searchParams } = new URL(request.url);
    const blockedUserId = searchParams.get('userId');

    if (!blockedUserId) {
      return NextResponse.json(
        { error: 'Blocked user ID is required' },
        { status: 400 }
      );
    }

    // Remove bidirectional block relationship
    const { error } = await supabase
      .from('blocks')
      .delete()
      .or(`and(blocker_id.eq.${currentUser.id},blocked_id.eq.${blockedUserId}),and(blocker_id.eq.${blockedUserId},blocked_id.eq.${currentUser.id})`);

    if (error) {
      console.error('Error removing block:', error);
      return NextResponse.json(
        { error: 'Failed to unblock user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unblock API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();

    const { data: blockedUsers, error } = await supabase
      .from('blocks')
      .select(`
        blocked_id,
        profiles!blocks_blocked_id_fkey (
          id,
          display_name,
          profile_image_url
        )
      `)
      .eq('blocker_id', currentUser.id);

    if (error) {
      console.error('Error fetching blocked users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blocked users' },
        { status: 500 }
      );
    }

    return NextResponse.json({ blockedUsers });
  } catch (error) {
    console.error('Get blocked users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}