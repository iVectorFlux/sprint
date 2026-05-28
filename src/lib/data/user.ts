import { createClient } from '@/lib/supabase/server'
import type { User, UserProfile, Sprint, UserSkillMastery } from '@/types'

/**
 * Get the current authenticated user's profile from the users table.
 * Returns null if not authenticated or user not found.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return data as User | null
}

/**
 * Get the current user's cognitive profile (Learning Genome).
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return data as UserProfile | null
}

/**
 * Get all sprints for a user.
 */
export async function getUserSprints(userId: string): Promise<Sprint[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sprints')
    .select('*, skill:skills(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (data || []) as Sprint[]
}

/**
 * Get skill mastery records for a user.
 */
export async function getUserSkillMastery(userId: string): Promise<UserSkillMastery[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_skill_mastery')
    .select('*, skill:skills(name, icon)')
    .eq('user_id', userId)
    .order('mastery_score', { ascending: false })

  return (data || []) as UserSkillMastery[]
}

/**
 * Get active sprint (most recent active sprint).
 */
export async function getActiveSprint(userId: string): Promise<Sprint | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sprints')
    .select('*, skill:skills(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data as Sprint | null
}
