
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxypjyfyzhhevufzmfpd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXBqeWZ5emhoZXZ1ZnptZnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTA4OTksImV4cCI6MjA2Njc2Njg5OX0.vpTqudlPWaFbgz454LmqGBGDcHNgZlrCowJH9NYfLcI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Employee {
  id?: string
  name: string
  code: string
  email: string
  city: string
  zone: string
  created_at?: string
}

export interface GameSession {
  id?: string
  employee_id: string
  game_id: string
  start_time: string
  end_time?: string
  total_score: number
  created_at?: string
}

export interface ScenarioResponse {
  id?: string
  game_session_id: string
  scenario_id: number
  hypothesis: string
  tools_used: string[]
  time_spent: number
  score: number
  created_at?: string
}
