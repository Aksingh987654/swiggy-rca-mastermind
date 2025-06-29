
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, GameSession, ScenarioResponse } from '../lib/supabase'

export const useDatabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveEmployee = async (employee: Employee) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createGameSession = async (employeeId: string, gameId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert([{
          employee_id: employeeId,
          game_id: gameId,
          start_time: new Date().toISOString(),
          total_score: 0
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const saveScenarioResponse = async (response: Omit<ScenarioResponse, 'id' | 'created_at'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('scenario_responses')
        .insert([response])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateGameSession = async (sessionId: string, totalScore: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .update({
          total_score: totalScore,
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getLeaderboard = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          employees (name, city)
        `)
        .order('total_score', { ascending: false })
        .limit(20)
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    saveEmployee,
    createGameSession,
    saveScenarioResponse,
    updateGameSession,
    getLeaderboard
  }
}
