export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  location_details: string | null;
  capacity: number;
  event_type: string | null;
  host_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  // Joined fields
  host?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  rsvp_count?: number;
  user_rsvp?: RSVP | null;
}

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'confirmed' | 'cancelled' | 'waitlist';
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface EventFilters {
  location?: string;
  event_type?: string;
  search?: string;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
  rsvp?: RSVP;
}