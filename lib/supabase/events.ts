import { createClient } from './client'
import type {
  EventWithDetails,
  RSVP,
  EventFilters,
  RSVPResponse,
} from '@/types/event'

export async function getUpcomingEvents(
  filters: EventFilters = {}
): Promise<EventWithDetails[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('events')
    .select(
      `
      *,
      creator:profiles!events_created_by_fkey(user_id, display_name),
      rsvps!inner(count)
    `
    )
    .gte('start_time', today)
    .eq('is_active', true)
    .order('start_time', { ascending: true })

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters.event_type) {
    query = query.eq('event_type', filters.event_type)
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching upcoming events:', error)
    throw error
  }

  // Process the data to add rsvp_count
  return data.map(event => ({
    ...event,
    rsvp_count: event.rsvps?.[0]?.count || 0,
  }))
}

export async function getPastEvents(
  userId: string
): Promise<EventWithDetails[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      creator:profiles!events_created_by_fkey(user_id, display_name),
      rsvps!inner(count),
      user_rsvp:rsvps!inner(id, status)
    `
    )
    .lt('start_time', today)
    .eq('is_active', true)
    .eq('rsvps.user_id', userId)
    .eq('rsvps.status', 'going')
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching past events:', error)
    throw error
  }

  return data.map(event => ({
    ...event,
    rsvp_count: event.rsvps?.[0]?.count || 0,
    user_rsvp: event.user_rsvp?.[0] || null,
  }))
}

export async function getEventById(
  eventId: string,
  userId?: string
): Promise<EventWithDetails | null> {
  const supabase = createClient()
  let query = supabase
    .from('events')
    .select(
      `
      *,
      creator:profiles!events_created_by_fkey(user_id, display_name),
      rsvps(
        id,
        status,
        user_id,
        user:profiles!rsvps_user_id_fkey(user_id, display_name)
      )
    `
    )
    .eq('id', eventId)
    .single()

  const { data: event, error } = await query

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  if (!event) return null

  // Count going RSVPs
  const goingRsvps = event.rsvps?.filter(rsvp => rsvp.status === 'going') || []

  // Find user's RSVP if userId provided
  const userRsvp = userId
    ? event.rsvps?.find(rsvp => rsvp.user_id === userId)
    : null

  return {
    ...event,
    rsvp_count: goingRsvps.length,
    user_rsvp: userRsvp || null,
  }
}

export async function getEventAttendees(eventId: string): Promise<RSVP[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rsvps')
    .select(
      `
      *,
      user:profiles!rsvps_user_id_fkey(user_id, display_name)
    `
    )
    .eq('event_id', eventId)
    .eq('status', 'going')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching event attendees:', error)
    throw error
  }

  return data || []
}

export async function createRSVP(
  eventId: string,
  userId: string
): Promise<RSVPResponse> {
  const supabase = createClient()
  try {
    // First check if event exists and has capacity
    const event = await getEventById(eventId)
    if (!event) {
      return { success: false, message: 'Event not found' }
    }

    // Check if user already has an RSVP
    const { data: existingRsvp } = await supabase
      .from('rsvps')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (existingRsvp?.status === 'going') {
      return {
        success: false,
        message: 'You are already registered for this event',
      }
    }

    // Check capacity
    const goingCount = event.rsvp_count || 0
    const status =
      goingCount >= (event.max_attendees || event.capacity) ? 'maybe' : 'going'

    // Create or update RSVP
    const { data, error } = await supabase
      .from('rsvps')
      .upsert({
        event_id: eventId,
        user_id: userId,
        status,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating RSVP:', error)
      return { success: false, message: 'Failed to register for event' }
    }

    const message =
      status === 'maybe'
        ? "Added to waitlist - you'll be notified if a spot opens up"
        : 'Successfully registered for event'

    return { success: true, message, rsvp: data }
  } catch (error) {
    console.error('Error in createRSVP:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function cancelRSVP(
  eventId: string,
  userId: string
): Promise<RSVPResponse> {
  const supabase = createClient()
  try {
    const { error } = await supabase
      .from('rsvps')
      .update({
        status: 'not_going',
        updated_at: new Date().toISOString(),
      })
      .eq('event_id', eventId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error cancelling RSVP:', error)
      return { success: false, message: 'Failed to cancel registration' }
    }

    // TODO: Promote someone from waitlist if applicable

    return { success: true, message: 'Registration cancelled successfully' }
  } catch (error) {
    console.error('Error in cancelRSVP:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function getEventTypes(): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('event_type')
    .not('event_type', 'is', null)

  if (error) {
    console.error('Error fetching event types:', error)
    return []
  }

  const uniqueTypes = [
    ...new Set(data.map(item => item.event_type).filter(Boolean)),
  ]
  return uniqueTypes
}

export async function getEventLocations(): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('events').select('location')

  if (error) {
    console.error('Error fetching event locations:', error)
    return []
  }

  const uniqueLocations = [
    ...new Set(data.map(item => item.location).filter(Boolean)),
  ]
  return uniqueLocations
}
