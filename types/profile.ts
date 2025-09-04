export interface Profile {
  id: string
  user_id: string
  display_name: string
  first_name?: string | null
  last_name?: string | null
  age: number | null
  location?: string | null
  interests:
    | string[]
    | {
        music_genres: string[]
        food_preferences: string[]
        activities: string[]
      }
  bio?: string | null
  photo_url?: string | null
  avatar_url?: string | null
  is_profile_complete: boolean
  is_admin?: boolean
  is_suspended?: boolean
  is_favorite?: boolean
  visible_fields: {
    age_visible: boolean
    interests_visible: boolean
    bio_visible: boolean
  }
  created_at: string
  updated_at: string
}

export interface MatchScore {
  id: string
  user_id_1: string
  user_id_2: string
  total_score: number
  interest_score: number
  bio_similarity: number
  age_compatibility: number
  location_score: number
  common_interests: string[] | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface InterestCategory {
  name: string
  options: readonly string[]
  maxSelections: number
}
