export interface Profile {
  id: string
  display_name: string
  age: number
  location?: string
  interests: {
    music_genres: string[]
    food_preferences: string[]
    activities: string[]
  }
  bio?: string
  photo_url?: string
  is_profile_complete: boolean
  visible_fields: {
    age_visible: boolean
    interests_visible: boolean
    bio_visible: boolean
  }
  created_at: string
  updated_at: string
}

export interface InterestCategory {
  name: string
  options: readonly string[]
  maxSelections: number
}